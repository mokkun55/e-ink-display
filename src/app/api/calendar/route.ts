import { google } from "googleapis";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { GoogleCalendarEvent } from "@/utils/calendar";

export const runtime = "nodejs";

/**
 * GET /api/calendar
 * Google Calendar APIから予定を取得するAPI
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = Number.parseInt(
    searchParams.get("days") || process.env.GOOGLE_CALENDAR_DAYS || "30",
    10
  );
  const calendarId =
    searchParams.get("calendarId") ||
    process.env.GOOGLE_CALENDAR_ID ||
    "primary";

  try {
    // biome-ignore lint/suspicious/noExplicitAny: googleapisの型定義が複雑なため
    let auth: any;

    // 認証方法を決定
    const authType = process.env.GOOGLE_AUTH_TYPE || "oauth2";

    if (authType === "service_account") {
      // サービスアカウント認証
      if (
        !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
        !process.env.GOOGLE_PRIVATE_KEY
      ) {
        console.error("サービスアカウント認証情報が不足しています");
        console.error(
          "GOOGLE_SERVICE_ACCOUNT_EMAIL:",
          process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? "設定済み" : "未設定"
        );
        console.error(
          "GOOGLE_PRIVATE_KEY:",
          process.env.GOOGLE_PRIVATE_KEY ? "設定済み" : "未設定"
        );
        return NextResponse.json(
          {
            error: "サービスアカウント認証情報が設定されていません",
            code: "MISSING_SERVICE_ACCOUNT_CREDENTIALS",
          },
          { status: 500 }
        );
      }

      auth = new google.auth.JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
      });
    } else {
      // OAuth 2.0認証
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.error("OAuth 2.0認証情報が不足しています");
        console.error(
          "GOOGLE_CLIENT_ID:",
          process.env.GOOGLE_CLIENT_ID ? "設定済み" : "未設定"
        );
        console.error(
          "GOOGLE_CLIENT_SECRET:",
          process.env.GOOGLE_CLIENT_SECRET ? "設定済み" : "未設定"
        );
        return NextResponse.json(
          {
            error: "OAuth 2.0認証情報が設定されていません",
            code: "MISSING_OAUTH_CREDENTIALS",
          },
          { status: 500 }
        );
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      // リフレッシュトークンが設定されている場合
      if (process.env.GOOGLE_REFRESH_TOKEN) {
        oauth2Client.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        });
      } else {
        console.error("リフレッシュトークンが設定されていません");
        console.error(
          "GOOGLE_REFRESH_TOKEN:",
          process.env.GOOGLE_REFRESH_TOKEN ? "設定済み" : "未設定"
        );
        return NextResponse.json(
          {
            error: "リフレッシュトークンが設定されていません",
            code: "MISSING_REFRESH_TOKEN",
            message:
              "OAuth 2.0認証を使用する場合は、GOOGLE_REFRESH_TOKENを設定してください",
          },
          { status: 500 }
        );
      }

      auth = oauth2Client;
    }

    const calendar = google.calendar({ version: "v3", auth });

    // 取得期間を設定
    const timeMin = new Date().toISOString();
    const timeMax = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toISOString();

    // カレンダーイベントを取得
    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      maxResults: 2500, // Google Calendar APIの最大値
      singleEvents: true,
      orderBy: "startTime",
    });

    // Google Calendar APIのレスポンスをGoogleCalendarEvent型に変換
    const events: GoogleCalendarEvent[] = (response.data.items || []).map(
      (item) => ({
        summary: item.summary || "",
        start: {
          dateTime: item.start?.dateTime || undefined,
          date: item.start?.date || undefined,
        },
        end: {
          dateTime: item.end?.dateTime || undefined,
          date: item.end?.date || undefined,
        },
        colorId: item.colorId || undefined,
        location: item.location || undefined,
        description: item.description || undefined,
        transparency: item.transparency || undefined,
      })
    );

    return NextResponse.json({ events });
  } catch (error) {
    // 詳細なエラーログを出力
    console.error("=== Google Calendar API エラー ===");
    console.error("エラー発生時刻:", new Date().toISOString());
    console.error("認証タイプ:", process.env.GOOGLE_AUTH_TYPE || "oauth2");
    console.error("カレンダーID:", calendarId);
    console.error("取得期間:", days, "日");

    if (error instanceof Error) {
      console.error("エラーメッセージ:", error.message);
      console.error("エラースタック:", error.stack);
      console.error("エラー名:", error.name);

      // Google APIのエラーレスポンスを確認
      // biome-ignore lint/suspicious/noExplicitAny: Google APIのエラーオブジェクトの型定義が複雑
      const googleError = error as any;
      if (googleError.response) {
        console.error(
          "Google API レスポンス:",
          JSON.stringify(googleError.response, null, 2)
        );
      }

      if (googleError.code) {
        console.error("エラーコード:", googleError.code);
      }

      return NextResponse.json(
        {
          error: "カレンダー予定の取得に失敗しました",
          code: "CALENDAR_FETCH_ERROR",
          details: error.message,
          stack:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
          googleApiError: googleError.response
            ? {
                status: googleError.response.status,
                statusText: googleError.response.statusText,
                data: googleError.response.data,
              }
            : undefined,
        },
        { status: 500 }
      );
    }

    console.error("不明なエラー:", error);
    console.error("エラー型:", typeof error);
    console.error(
      "エラー内容:",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );

    return NextResponse.json(
      {
        error: "カレンダー予定の取得に失敗しました",
        code: "CALENDAR_FETCH_ERROR",
        details: "不明なエラーが発生しました",
        rawError:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
