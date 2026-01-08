import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            7色電子ペーパー用 画像生成API
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ヒーローセクション */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            800×480ピクセルの7色電子ペーパー用画像を
            <br className="hidden sm:block" />
            動的に生成・配信
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Next.jsとsharpを使用した、ACeP方式の電子ペーパー向け画像生成システムです。
            <br />
            フロイド-スタインバーグ・ディザリングによる高品質な減色処理を実装しています。
          </p>
        </div>

        {/* 特徴セクション */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 text-3xl">🎨</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              7色パレット対応
            </h3>
            <p className="text-gray-600">
              黒・白・緑・青・赤・黄・オレンジの7色パレットへの減色処理を実装。
              実機の色特性に合わせて調整可能です。
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 text-3xl">⚡</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              ディザリング処理
            </h3>
            <p className="text-gray-600">
              フロイド-スタインバーグ・ディザリングアルゴリズムにより、
              グラデーションや中間色も自然に表現できます。
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 text-3xl">🚀</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Vercel対応
            </h3>
            <p className="text-gray-600">
              Vercelにデプロイ可能。設定不要でNode.js環境が使え、
              sharpなどのライブラリもそのまま動作します。
            </p>
          </div>
        </div>

        {/* クイックスタート */}
        <div className="mb-16 rounded-2xl bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-2xl font-bold text-gray-900">
            クイックスタート
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-lg font-semibold text-gray-800">
                1. インストール
              </h4>
              <div className="rounded-lg bg-gray-900 p-4">
                <code className="text-sm text-green-400">pnpm install</code>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-lg font-semibold text-gray-800">
                2. 開発サーバー起動
              </h4>
              <div className="rounded-lg bg-gray-900 p-4">
                <code className="text-sm text-green-400">pnpm dev</code>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-lg font-semibold text-gray-800">
                3. APIエンドポイントにアクセス
              </h4>
              <div className="rounded-lg bg-gray-900 p-4">
                <code className="text-sm text-green-400">GET /api/epaper</code>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                ブラウザで{" "}
                <Link
                  href="/api/epaper"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  http://localhost:3000/api/epaper
                </Link>{" "}
                にアクセスすると、PNG画像が生成されます。
              </p>
              <p className="mt-2 text-sm text-gray-600">
                テスト用コンテンツは{" "}
                <Link
                  href="/api/epaper/test"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  /api/epaper/test
                </Link>{" "}
                で確認できます。
              </p>
            </div>
          </div>
        </div>

        {/* API ドキュメント */}
        <div className="mb-16 rounded-2xl bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-2xl font-bold text-gray-900">
            API ドキュメント
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="mb-2 text-lg font-semibold text-gray-800">
                基本エンドポイント
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <code className="text-sm text-gray-900">GET /api/epaper</code>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    減色処理済みの800×480ピクセルのPNG画像を返します。
                  </p>
                </div>
                <div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <code className="text-sm text-gray-900">GET /api/epaper/test</code>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    テスト用コンテンツ（7色テストパターンなど）を表示する画像を返します。
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-lg font-semibold text-gray-800">
                クエリパラメータ
              </h4>
              <div className="space-y-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <code className="text-sm font-semibold text-gray-900">
                    ?original=true
                  </code>
                  <p className="mt-1 text-sm text-gray-600">
                    減色処理前の元画像を返します。
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <code className="text-sm font-semibold text-gray-900">
                    ?debugInfoOnly=true
                  </code>
                  <p className="mt-1 text-sm text-gray-600">
                    処理時間などのデバッグ情報をJSON形式で返します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* リンクセクション */}
        <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/preview"
            className="group rounded-xl bg-green-600 p-6 text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
          >
            <div className="mb-2 text-lg font-semibold">スタイリング確認 →</div>
            <p className="text-sm text-green-100">
              HTML・元PNG・加工済みPNGを並べて確認
            </p>
            <p className="mt-1 text-xs text-green-200">
              ⚠️ HTMLとPNGでスタイリングの差が出る場合があります
            </p>
          </Link>

          <Link
            href="/api/epaper"
            className="group rounded-xl bg-blue-600 p-6 text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
          >
            <div className="mb-2 text-lg font-semibold">画像を生成 →</div>
            <p className="text-sm text-blue-100">
              APIエンドポイントにアクセスして画像を確認
            </p>
          </Link>

          <Link
            href="/api/epaper/test"
            className="group rounded-xl bg-purple-600 p-6 text-white shadow-sm transition-all hover:bg-purple-700 hover:shadow-md"
          >
            <div className="mb-2 text-lg font-semibold">テスト画像を生成 →</div>
            <p className="text-sm text-purple-100">
              テスト用コンテンツ（7色テストパターン）を確認
            </p>
          </Link>

          <Link
            href="/debug"
            className="group rounded-xl bg-gray-900 p-6 text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md"
          >
            <div className="mb-2 text-lg font-semibold">デバッグページ →</div>
            <p className="text-sm text-gray-300">
              減色前後の比較と処理時間を確認
            </p>
          </Link>
        </div>

        {/* 技術スタック */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-2xl font-bold text-gray-900">
            技術スタック
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="font-semibold text-gray-900">Next.js</div>
              <div className="text-sm text-gray-600">App Router</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="font-semibold text-gray-900">next/og</div>
              <div className="text-sm text-gray-600">画像生成</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="font-semibold text-gray-900">sharp</div>
              <div className="text-sm text-gray-600">画像処理</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="font-semibold text-gray-900">TypeScript</div>
              <div className="text-sm text-gray-600">型安全性</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="font-semibold text-gray-900">Tailwind CSS</div>
              <div className="text-sm text-gray-600">スタイリング</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="font-semibold text-gray-900">Vercel</div>
              <div className="text-sm text-gray-600">デプロイ</div>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 sm:px-6 lg:px-8">
          <p>MIT License - 自由にご利用ください</p>
          <p className="mt-2">
            詳細なドキュメントは{" "}
            <Link
              href="https://github.com"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              README.md
            </Link>{" "}
            を参照してください
          </p>
        </div>
      </footer>
    </div>
  );
}
