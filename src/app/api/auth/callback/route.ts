import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET /api/auth/callback
 * Google OAuth 2.0認証のコールバックエンドポイント
 * Googleから認証コードを受け取り、アクセストークンとリフレッシュトークンを取得します
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // エラーがある場合
    if (error) {
      return NextResponse.json(
        {
          error: "認証が拒否されました",
          code: "AUTH_DENIED",
          details: error,
        },
        { status: 400 }
      );
    }

    // 認証コードがない場合
    if (!code) {
      return NextResponse.json(
        {
          error: "認証コードが取得できませんでした",
          code: "MISSING_AUTH_CODE",
        },
        { status: 400 }
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        {
          error: "OAuth 2.0認証情報が設定されていません",
          code: "MISSING_OAUTH_CREDENTIALS",
        },
        { status: 500 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // 認証コードをトークンに交換
    const { tokens } = await oauth2Client.getToken(code);

    // リフレッシュトークンを取得
    const refreshToken = tokens.refresh_token;

    if (!refreshToken) {
      return NextResponse.json(
        {
          error: "リフレッシュトークンが取得できませんでした",
          code: "MISSING_REFRESH_TOKEN",
          message:
            "リフレッシュトークンを取得するには、認証時に 'prompt=consent' が必要です。",
          tokens: {
            access_token: tokens.access_token ? "取得済み" : "未取得",
            refresh_token: "未取得",
            expiry_date: tokens.expiry_date,
          },
        },
        { status: 500 }
      );
    }

    // 成功ページを表示（リフレッシュトークンを表示）
    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>認証成功</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #34a853;
      margin-bottom: 20px;
    }
    .success {
      background-color: #e8f5e9;
      border: 1px solid #4caf50;
      border-radius: 4px;
      padding: 15px;
      margin: 20px 0;
    }
    .token-box {
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      margin: 20px 0;
      word-break: break-all;
      font-family: monospace;
      font-size: 14px;
    }
    .warning {
      background-color: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 4px;
      padding: 15px;
      margin: 20px 0;
    }
    .button {
      background-color: #4285f4;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 10px;
    }
    .button:hover {
      background-color: #357ae8;
    }
    code {
      background-color: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>✅ 認証成功</h1>
    
    <div class="success">
      <strong>Google Calendar APIへの認証が完了しました。</strong>
    </div>

    <h2>リフレッシュトークン</h2>
    <p>以下のリフレッシュトークンを <code>.env.local</code> ファイルに設定してください：</p>
    
    <div class="token-box" id="refreshToken">
      ${refreshToken}
    </div>

    <button class="button" onclick="copyToken()">トークンをコピー</button>

    <div class="warning">
      <strong>⚠️ 重要:</strong>
      <ul>
        <li>このトークンは機密情報です。他人に共有しないでください。</li>
        <li><code>.env.local</code> ファイルは <code>.gitignore</code> に含まれていることを確認してください。</li>
        <li>このページを閉じる前に、トークンを必ずコピーしてください。</li>
      </ul>
    </div>

    <h2>設定方法</h2>
    <p><code>.env.local</code> ファイルに以下を追加してください：</p>
    <div class="token-box">
GOOGLE_REFRESH_TOKEN=${refreshToken}
    </div>

    <h2>次のステップ</h2>
    <ol>
      <li>リフレッシュトークンを <code>.env.local</code> に設定</li>
      <li>開発サーバーを再起動</li>
      <li><code>/api/calendar</code> または <code>/api/epaper</code> にアクセスして動作確認</li>
    </ol>
  </div>

  <script>
    function copyToken() {
      const tokenElement = document.getElementById('refreshToken');
      const text = tokenElement.textContent;
      navigator.clipboard.writeText(text).then(() => {
        alert('リフレッシュトークンをコピーしました！');
      }).catch(err => {
        console.error('コピーに失敗しました:', err);
        alert('コピーに失敗しました。手動でコピーしてください。');
      });
    }
  </script>
</body>
</html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("OAuth認証コールバックエラー:", error);

    const errorHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>認証エラー</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #ea4335;
      margin-bottom: 20px;
    }
    .error {
      background-color: #ffebee;
      border: 1px solid #f44336;
      border-radius: 4px;
      padding: 15px;
      margin: 20px 0;
    }
    code {
      background-color: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>❌ 認証エラー</h1>
    <div class="error">
      <strong>認証に失敗しました。</strong>
      <p>${error instanceof Error ? error.message : "Unknown error"}</p>
    </div>
    <p><a href="/api/auth/google">再度認証を試す</a></p>
  </div>
</body>
</html>
    `;

    return new NextResponse(errorHtml, {
      status: 500,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }
}
