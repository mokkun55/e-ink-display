/**
 * next/og (Satori) 用フォント読み込みユーティリティ
 */

/**
 * フォントデータを読み込む
 * @param url フォントファイルのURL（相対パスまたはCDN URL）
 * @returns ArrayBuffer
 */
async function loadFont(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load font: ${url}`);
  }
  return await response.arrayBuffer();
}

/**
 * Google Fonts APIからNoto Sans JPを読み込む
 * @returns フォントデータ（ArrayBuffer）またはnull（失敗時）
 */
export async function loadNotoSansJP(): Promise<ArrayBuffer | null> {
  try {
    // Google Fonts APIからNoto Sans JPを取得（Regular）
    const url =
      "https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf";
    return await loadFont(url);
  } catch (error) {
    console.warn("Failed to load Noto Sans JP:", error);
    return null;
  }
}

/**
 * Google Fonts APIからInterを読み込む
 * @returns フォントデータ（ArrayBuffer）またはnull（失敗時）
 */
export async function loadInter(): Promise<ArrayBuffer | null> {
  try {
    // Google Fonts APIからInterを取得（Regular）
    // TTF形式を使用（より互換性が高い）
    const url =
      "https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUwo.woff2";
    return await loadFont(url);
  } catch (error) {
    console.warn("Failed to load Inter, using system fonts:", error);
    return null;
  }
}

/**
 * すべてのフォントを読み込む
 * @returns フォントデータの配列（Satoriのfontsオプション用）
 * フォント読み込みに失敗した場合は空配列を返す（システムフォントを使用）
 */
export async function loadFonts() {
  const [notoSansJP, inter] = await Promise.all([
    loadNotoSansJP(),
    loadInter(),
  ]);

  const fonts = [];

  // Noto Sans JPが読み込めた場合
  if (notoSansJP) {
    fonts.push(
      {
        name: "Noto Sans JP",
        data: notoSansJP,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "Noto Sans JP",
        data: notoSansJP,
        weight: 700 as const,
        style: "normal" as const,
      }
    );
  }

  // Interが読み込めた場合
  if (inter) {
    fonts.push(
      {
        name: "Inter",
        data: inter,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "Inter",
        data: inter,
        weight: 700 as const,
        style: "normal" as const,
      }
    );
  }

  // フォントが1つも読み込めなかった場合は警告を出すが、空配列を返す
  // next/ogはフォントが空の場合、システムフォントを使用する
  if (fonts.length === 0) {
    console.warn(
      "No fonts loaded. Using system fonts. This may cause layout issues."
    );
  }

  return fonts;
}
