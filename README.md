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

### 環境変数の設定

Google Calendar API から予定を取得する場合は、`.env.local` ファイルを作成して以下の環境変数を設定してください。

```bash
# 認証方法を選択（oauth2 または service_account）
GOOGLE_AUTH_TYPE=oauth2

# OAuth 2.0 認証の場合
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
GOOGLE_REFRESH_TOKEN=your-refresh-token

# サービスアカウント認証の場合
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# カレンダーID（通常は "primary" または特定のカレンダーID）
GOOGLE_CALENDAR_ID=primary

# 予定取得期間（日数、デフォルト: 30日）
GOOGLE_CALENDAR_DAYS=30
```

**注意**: 環境変数が設定されていない場合、モックデータが使用されます。

### リフレッシュトークンの取得方法

OAuth 2.0 認証を使用する場合、リフレッシュトークンが必要です。以下の方法で取得できます。

#### 方法 1: 自動取得（推奨）

1. 必要な環境変数を設定（`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`）
2. 開発サーバーを起動
3. ブラウザで `/api/auth/google` にアクセス
4. Google の認証ページでアカウントを選択し、権限を許可
5. 認証成功ページに表示されたリフレッシュトークンをコピー
6. `.env.local` ファイルに `GOOGLE_REFRESH_TOKEN` として設定

```bash
# 1. 開発サーバーを起動
pnpm dev

# 2. ブラウザで以下にアクセス
# http://localhost:3000/api/auth/google
```

#### 方法 2: Google OAuth 2.0 Playground（手動取得）

1. [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) にアクセス
2. 右上の歯車アイコンをクリックして「Use your own OAuth credentials」にチェック
3. `OAuth Client ID` と `OAuth Client secret` を入力
4. 左側の「Calendar API v3」を展開し、`https://www.googleapis.com/auth/calendar.readonly` を選択
5. 「Authorize APIs」をクリックして認証
6. 「Exchange authorization code for tokens」をクリック
7. 表示された `refresh_token` をコピーして `.env.local` に設定

#### リフレッシュトークンとは？

- **アクセストークン**: 短命（通常 1 時間）で、API 呼び出しに使用
- **リフレッシュトークン**: 長期間有効で、アクセストークンの期限が切れた際に新しいアクセストークンを取得するために使用
- サーバーサイドアプリケーションでは、リフレッシュトークンを保存しておくことで、ユーザーに再認証を求めずに API を継続的に使用できます

## 📖 使用方法

### API エンドポイント

#### `/api/epaper` - 画像生成 API

電子ペーパー用の減色処理済み画像を生成します。ESP32 などのデバイスから直接使用する場合は、デフォルトでバイナリ形式（`application/octet-stream`）を返します。

**基本的な使い方:**

```bash
GET /api/epaper
```

**クエリパラメータ:**

- `format=png` または `image=true`: PNG 画像形式で返す（ブラウザ確認用）
- `original=true`: 減色処理前の元画像を返す（PNG 形式）
- `debugInfoOnly=true`: デバッグ情報（処理時間）を JSON 形式で返す
- `orientation=landscape` または `orientation=portrait`: 画像の向きを指定（デフォルト: `landscape`）

**レスポンス:**

- **デフォルト**: `application/octet-stream` 形式のバイナリデータ（ESP32 用）
  - データサイズ: `width × height ÷ 2` バイト
  - 1 バイトに 2 ピクセル分のデータをパック（上位 4 ビット + 下位 4 ビット）
- `format=png` または `image=true`: `image/png` 形式の画像データ
- `original=true`: `image/png` 形式の元画像データ
- `debugInfoOnly=true`: JSON 形式のデバッグ情報

**例:**

```bash
# ESP32用バイナリデータを取得（デフォルト）
curl http://localhost:3000/api/epaper -o output.bin

# PNG画像形式で取得（ブラウザ確認用）
curl http://localhost:3000/api/epaper?format=png -o output.png

# 元画像を取得
curl http://localhost:3000/api/epaper?original=true -o original.png

# 縦方向の画像を取得
curl http://localhost:3000/api/epaper?orientation=portrait -o output-portrait.bin

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

- `format=png` または `image=true`: PNG 画像形式で返す（ブラウザ確認用）
- `original=true`: 減色処理前の元画像を返す（PNG 形式）
- `debugInfoOnly=true`: デバッグ情報（処理時間）を JSON 形式で返す
- `orientation=landscape` または `orientation=portrait`: 画像の向きを指定（デフォルト: `landscape`）

**レスポンス:**

- **デフォルト**: `application/octet-stream` 形式のバイナリデータ（ESP32 用）
- `format=png` または `image=true`: `image/png` 形式の画像データ
- `original=true`: `image/png` 形式の元画像データ
- `debugInfoOnly=true`: JSON 形式のデバッグ情報

**例:**

```bash
# ESP32用バイナリデータを取得（デフォルト）
curl http://localhost:3000/api/epaper/test -o test-output.bin

# PNG画像形式で取得（ブラウザ確認用）
curl http://localhost:3000/api/epaper/test?format=png -o test-output.png

# テスト用元画像を取得
curl http://localhost:3000/api/epaper/test?original=true -o test-original.png
```

#### `/api/epaper/decode` - バイナリデータを画像に変換する API

ESP32 用バイナリ形式のデータを PNG 画像に変換する API です。バイナリデータを可視化する際に使用します。

**基本的な使い方:**

```bash
POST /api/epaper/decode
```

**リクエスト:**

- **Content-Type**: `application/octet-stream`
- **Body**: バイナリデータ（`width × height ÷ 2` バイト）

**クエリパラメータ:**

- `orientation=landscape` または `orientation=portrait`: 画像の向きを指定（デフォルト: `landscape`）

**レスポンス:**

- `image/png` 形式の画像データ

**例:**

```bash
# バイナリデータを画像に変換
curl -X POST \
  -H "Content-Type: application/octet-stream" \
  --data-binary @output.bin \
  "http://localhost:3000/api/epaper/decode?orientation=landscape" \
  -o decoded.png
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

`/debug` にアクセスすると、元画像、加工後画像、バイナリデータから変換した画像を比較表示できるデバッグページが開きます。

```
http://localhost:3000/debug
```

デバッグページでは以下が確認できます：

- **元画像**: 減色処理前の画像
- **加工後画像**: 減色処理後の PNG 画像
- **バイナリ → 画像**: ESP32 が受け取るバイナリデータを画像に変換したもの（変換の正確性を確認）
- **処理時間**: 各処理ステップの詳細な処理時間情報

バイナリデータから変換した画像と加工後画像を比較することで、バイナリ変換が正しく行われているかを確認できます。

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
4. **エンコード**:
   - **PNG 形式**: 処理後のデータを PNG 形式にエンコード（`format=png` または `image=true` の場合）
   - **バイナリ形式（デフォルト）**: ESP32 用バイナリ形式にエンコード
     - 1 バイトに 2 ピクセル分のデータをパック（上位 4 ビット + 下位 4 ビット）
     - データサイズ: `width × height ÷ 2` バイト
     - Content-Type: `application/octet-stream`

### バイナリデータ形式

ESP32 用バイナリデータは以下の形式です：

- **データ順序**: 行優先（左 → 右、上 → 下）
- **ピクセルフォーマット**: 1 バイトに 2 ピクセル分のデータ
  - 上位 4 ビット: 1 ピクセル目の色情報（パレットインデックス 0-7）
  - 下位 4 ビット: 2 ピクセル目の色情報（パレットインデックス 0-7）
- **データサイズ**: `width × height ÷ 2` バイト
  - 横方向（landscape）: 800 × 480 ÷ 2 = 192,000 バイト
  - 縦方向（portrait）: 480 × 800 ÷ 2 = 192,000 バイト

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
│   │       ├── route.tsx       # メインAPI エンドポイント
│   │       ├── decode/
│   │       │   └── route.ts    # バイナリデータを画像に変換するAPI
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
    ├── image.ts                # 画像処理ユーティリティ（PNG変換、バイナリ変換）
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
