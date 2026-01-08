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

#### `/api/epaper/test` - テスト用画像生成 API

テスト用コンテンツ（`EpaperTestContent`）を表示する画像生成 API です。7 色テストパターンや図形サンプルを含むテストコンテンツを生成します。

**基本的な使い方:**

```bash
GET /api/epaper/test
```

**クエリパラメータ:**

- `original=true`: 減色処理前の元画像を返す
- `debugInfoOnly=true`: デバッグ情報（処理時間）を JSON 形式で返す

**例:**

```bash
# テスト用減色処理済み画像を取得
curl http://localhost:3000/api/epaper/test -o test-output.png

# テスト用元画像を取得
curl http://localhost:3000/api/epaper/test?original=true -o test-original.png
```

### プレビューページ

`/preview` にアクセスすると、HTML プレビューと PNG 画像を並べて比較表示できるプレビューページが開きます。

```
http://localhost:3000/preview
```

プレビューページでは以下が確認できます：

- HTML プレビュー（実際の React コンポーネント表示）
- 元 PNG 画像（next/og で生成された画像）
- 加工済み PNG 画像（ディザリング処理後）

**⚠️ 注意事項:**

CSS の都合上、HTML プレビューと PNG プレビューでスタイリングの差が出る場合があります。これは、`next/og`の`ImageResponse`がブラウザのレンダリングエンジンとは異なるレンダリングエンジンを使用するためです。特に以下の点に注意してください：

- フォントのレンダリング方法が異なる場合がある
- CSS の一部のプロパティが完全にサポートされていない場合がある
- ブラウザで表示される HTML と、実際に生成される PNG 画像で見た目が異なる可能性がある

最終的な見た目を確認する際は、PNG 画像（特に加工済み PNG 画像）を参考にしてください。

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

現在は以下のフォントが使用されています：

- **M PLUS 1**: `public/fonts/MPLUS1-Medium.ttf`

フォントの読み込み処理は `src/utils/fonts.ts` で実装されています。

### フォントの変更方法

OG 画像のフォントを変更する場合は、以下の手順に従ってください。

#### 手順

1. **フォントファイルを配置**

   使用したいフォントファイル（`.ttf` 形式）を `public/fonts/` ディレクトリに配置します。

   ```bash
   # 例: フォントファイルを public/fonts/ に配置
   cp /path/to/your-font.ttf public/fonts/YourFont-Regular.ttf
   ```

2. **`src/utils/fonts.ts` を編集**

   `loadMPLUS1Medium()` 関数を新しいフォントを読み込む関数に変更し、フォント名も更新します。

   ```typescript
   export async function loadYourFont(): Promise<Buffer | null> {
     try {
       // フォントファイルのパスを指定
       const fontPath = path.join(
         process.cwd(),
         "public/fonts/YourFont-Regular.ttf"
       );
       const fontData = fs.readFileSync(fontPath);
       return fontData;
     } catch (error) {
       console.warn("Failed to load Your Font:", error);
       return null;
     }
   }

   export async function loadFonts() {
     const yourFont = await loadYourFont();
     const fonts = [];

     if (yourFont) {
       fonts.push({
         name: "Your Font Name", // フォント名を指定（実際のフォント名に合わせる）
         data: yourFont,
         weight: 400 as const,
         style: "normal" as const,
       });
     }

     if (fonts.length === 0) {
       console.warn("No fonts loaded. Using system fonts.");
     }

     return fonts;
   }
   ```

3. **コンポーネントのフォント名を更新**

   使用しているコンポーネント（`EpaperContent.tsx`、`EpaperTestContent.tsx` など）の `fontFamily` プロパティを新しいフォント名に変更します。

   ```typescript
   // src/components/EpaperContent.tsx など
   style={{
     fontFamily: "Your Font Name",  // 手順2で指定したフォント名と一致させる
     // ...
   }}
   ```

#### 注意事項

- フォント名は、`loadFonts()` で指定した `name` と、コンポーネント内の `fontFamily` が完全に一致している必要があります
- フォントファイルが大きい場合、Edge ランタイムでは動作しない可能性があります（Node.js ランタイムを使用している場合は問題ありません）
- フォントファイルの内部メタデータに基づく実際のフォント名が異なる場合は、そのフォント名を使用してください

#### 参考記事

この実装は以下の記事を参考にしています：

- [【Next.js / App Router】 opengraph-image.tsx の OG 画像内フォントの変更方法](https://zenn.dev/ryota_09/articles/cdef1901df899b)

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
│   │       ├── route.tsx       # API エンドポイント
│   │       └── test/
│   │           └── route.tsx   # テスト用API エンドポイント
│   ├── debug/
│   │   └── page.tsx            # デバッグページ
│   ├── preview/
│   │   └── page.tsx            # プレビューページ
│   └── ...
├── components/
│   ├── EpaperContent.tsx       # 電子ペーパー表示コンテンツ
│   └── EpaperTestContent.tsx   # テスト用コンテンツ
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
