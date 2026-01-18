import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Proxy (旧Middleware)
 * /api/* エンドポイントへのアクセスを制限する
 * /api/auth/* は認証フローのためスキップ
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /api/auth/* は認証フローのためスキップ
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // /api/* エンドポイントに対して認証を要求
  if (pathname.startsWith("/api/")) {
    // 環境変数からAPIキーを取得
    const storedApiKey = process.env.API_KEY;

    if (!storedApiKey) {
      console.error("API_KEY が環境変数に設定されていません");
      return NextResponse.json(
        { error: "サーバー設定エラー: APIキーが設定されていません" },
        { status: 500 }
      );
    }

    // リクエストヘッダーからAPIキーを取得
    const apiKey = request.headers.get("X-API-Key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "認証が必要です: X-API-Key ヘッダーを設定してください" },
        { status: 401 }
      );
    }

    // APIキーを検証（単純な文字列比較）
    if (apiKey !== storedApiKey) {
      return NextResponse.json(
        { error: "認証に失敗しました: 無効なAPIキーです" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

/**
 * ミドルウェアを適用するパスを指定
 */
export const config = {
  matcher: "/api/:path*",
};
