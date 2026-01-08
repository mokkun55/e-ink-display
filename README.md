# 7 色電子ペーパー用 画像生成 API

800×480 ピクセルの 7 色電子ペーパー（ACeP 方式）に表示するための画像を、Web API 経由で動的に生成・配信するシステムです。

## 📋 プロジェクト概要

- **目的**: 7 色電子ペーパー用の画像を動的に生成・配信
- **技術スタック**: Next.js (App Router), Vercel, sharp, next/og
- **優先事項**: 開発の容易さと保守性

## 🚀 セットアップ

### 必要な環境

- Node.js 18 以上
- pnpm（推奨）または npm/yarn

### インストール

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

開発サーバーは `http://localhost:3000` で起動します。

## 📖 使用方法

### API エンドポイント

#### `/api/epaper` - 画像生成 API

電子ペーパー用の減色処理済み画像を生成します。

**基本的な使い方:**

```bash
GET /api/epaper
```

**クエリパラメータ:**

- `original=true`: 減色処理前の元画像を返す
- `debugInfoOnly=true`: デバッグ情報（処理時間）を JSON 形式で返す

**レスポンス:**

- 通常: `image/png` 形式の画像データ
- `debugInfoOnly=true` の場合: JSON 形式のデバッグ情報

**例:**

```bash
# 減色処理済み画像を取得
curl http://localhost:3000/api/epaper -o output.png

# 元画像を取得
curl http://localhost:3000/api/epaper?original=true -o original.png

# デバッグ情報を取得（処理時間など）
curl http://localhost:3000/api/epaper?debugInfoOnly=true
```

### デバッグページ

`/debug` にアクセスすると、元画像と加工後画像を比較表示できるデバッグページが開きます。

```
http://localhost:3000/debug
```

デバッグページでは以下が確認できます：

- 元画像（減色処理前）
- 加工後画像（減色処理後）
- 処理時間の詳細情報

## 🎨 色パレット

電子ペーパーで使用する 7 色パレットは `src/config/palette.ts` で定義されています：

- **黒** (black): `[0, 0, 0]`
- **白** (white): `[255, 255, 255]`
- **緑** (green): `[0, 255, 0]`
- **青** (blue): `[0, 0, 255]`
- **赤** (red): `[255, 0, 0]`
- **黄** (yellow): `[255, 255, 0]`
- **オレンジ** (orange): `[255, 128, 0]`

実機の色特性に合わせて後から調整可能です。

## 🔤 フォント設定

### デフォルトフォント

デフォルトでは以下のフォントが使用されます：

- **日本語**: Noto Sans JP（Google Fonts）
- **英語**: Inter（Google Fonts）

フォントの読み込み処理は `src/utils/fonts.ts` で実装されています。

### フォントの変更方法

1. **`src/utils/fonts.ts` を編集**

   - `loadNotoSansJP()` 関数で日本語フォントの URL を変更
   - `loadInter()` 関数で英語フォントの URL を変更

2. **Google Fonts 以外のフォントを使用する場合**
   - フォントファイルを `public/fonts/` に配置
   - `loadFont()` 関数でローカルパスを指定

**例: ローカルフォントを使用**

```typescript
export async function loadNotoSansJP(): Promise<ArrayBuffer | null> {
  try {
    // ローカルフォントファイルを読み込む
    const fontPath = path.join(
      process.cwd(),
      "public/fonts/NotoSansJP-Regular.ttf"
    );
    const fontData = await fs.promises.readFile(fontPath);
    return fontData.buffer;
  } catch (error) {
    console.warn("Failed to load Noto Sans JP:", error);
    return null;
  }
}
```

### フォント読み込みエラー時の動作

フォントの読み込みに失敗した場合、システムフォント（sans-serif）が使用されます。エラーは警告としてコンソールに出力されますが、画像生成は継続されます。

## 🖼️ 画像生成の処理フロー

1. **レンダリング**: JSX（HTML/CSS）を `next/og` の `ImageResponse` で SVG→PNG に変換
2. **Raw データ化**: `sharp` を使用して PNG から RGBA 配列を取得
3. **減色処理**: フロイド-スタインバーグ・ディザリングアルゴリズムで 7 色パレットに変換
4. **エンコード**: 処理後のデータを PNG 形式にエンコード

## 🧪 開発

### ビルド

```bash
pnpm build
```

### リンター

```bash
pnpm lint
```

### コードフォーマット

```bash
pnpm format
```

## 📁 プロジェクト構成

```
src/
├── app/
│   ├── api/
│   │   └── epaper/
│   │       └── route.tsx       # API エンドポイント
│   ├── debug/
│   │   └── page.tsx            # デバッグページ
│   └── ...
├── components/
│   └── EpaperContent.tsx       # 電子ペーパー表示コンテンツ
├── config/
│   └── palette.ts              # 色パレット定義
└── utils/
    ├── dithering.ts            # 減色・ディザリング処理
    ├── fonts.ts                # フォント読み込み
    ├── image.ts                # 画像処理ユーティリティ
    └── debug.tsx               # デバッグ機能
```

## 🚀 デプロイ

このプロジェクトは Vercel にデプロイすることを想定しています。

### Vercel へのデプロイ

1. GitHub リポジトリにプッシュ
2. Vercel でプロジェクトをインポート
3. 自動的にデプロイが開始されます

**注意事項:**

- `sharp` は Vercel の Node.js ランタイムで動作します
- 実行時間制限: Hobby プランは 10 秒、Pro プランは 60 秒

## 📝 ライセンス

MIT License
自由にご利用ください。
