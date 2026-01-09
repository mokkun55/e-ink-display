import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET /api/auth/google
 * Google OAuth 2.0認証を開始するエンドポイント
 * このエンドポイントにアクセスすると、Googleの認証ページにリダイレクトされます
 */
export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        {
          error: "OAuth 2.0認証情報が設定されていません",
          code: "MISSING_OAUTH_CREDENTIALS",
          required: {
            GOOGLE_CLIENT_ID: clientId ? "設定済み" : "未設定",
            GOOGLE_CLIENT_SECRET: clientSecret ? "設定済み" : "未設定",
            GOOGLE_REDIRECT_URI: redirectUri ? "設定済み" : "未設定",
          },
        },
        { status: 500 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // 認証URLを生成
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline", // リフレッシュトークンを取得するために必要
      scope: ["https://www.googleapis.com/auth/calendar.readonly"],
      prompt: "consent", // リフレッシュトークンを確実に取得するために必要
    });

    // Googleの認証ページにリダイレクト
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("OAuth認証開始エラー:", error);
    return NextResponse.json(
      {
        error: "認証の開始に失敗しました",
        code: "AUTH_START_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
