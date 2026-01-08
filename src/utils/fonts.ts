/**
 * next/og (Satori) 用フォント読み込みユーティリティ
 */

/**
 * フォントデータを読み込む
 * @param url フォントファイルのURL（相対パスまたはCDN URL）
 * @returns ArrayBuffer または null（失敗時）
 */
async function loadFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Next.js ImageResponse)",
      },
    });
    if (!response.ok) {
      return null;
    }
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}

/**
 * Google Fonts APIからNoto Sans JPを読み込む
 * @returns フォントデータ（ArrayBuffer）またはnull（失敗時）
 */
export async function loadNotoSansJP(): Promise<ArrayBuffer | null> {
  // Google Fonts APIからNoto Sans JPを取得（Regular）
  const url =
    "https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf";
  const result = await loadFont(url);
  if (!result) {
    console.warn("Failed to load Noto Sans JP, using system fonts");
  }
  return result;
}

/**
 * Google Fonts APIからInterを読み込む
 * @returns フォントデータ（ArrayBuffer）またはnull（失敗時）
 */
export async function loadInter(): Promise<ArrayBuffer | null> {
  // Interフォントはオプションなので、失敗しても静かに処理
  // Google Fonts APIからInterを取得（Regular）
  // 複数のURLを試す
  const urls = [
    "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
    "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA-Ek-_EeA.ttf",
  ];

  for (const url of urls) {
    const result = await loadFont(url);
    if (result) {
      return result;
    }
  }
  // すべてのURLが失敗した場合（エラーメッセージは表示しない）
  return null;
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
