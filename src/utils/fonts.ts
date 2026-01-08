/**
 * next/og (Satori) 用フォント読み込みユーティリティ
 */

import fs from "node:fs";
import path from "node:path";

/**
 * ローカルフォントファイルからM PLUS 1 Mediumを読み込む
 * @returns フォントデータ（Buffer）またはnull（失敗時）
 */
export async function loadMPLUS1Medium(): Promise<Buffer | null> {
  try {
    const fontPath = path.join(process.cwd(), "public/fonts/MPLUS1-Medium.ttf");
    const fontData = fs.readFileSync(fontPath);
    return fontData;
  } catch (error) {
    console.warn("Failed to load M PLUS 1 Medium font:", error);
    return null;
  }
}

/**
 * ローカルフォントファイルからM PLUS 1 Boldを読み込む
 * @returns フォントデータ（Buffer）またはnull（失敗時）
 */
export async function loadMPLUS1Bold(): Promise<Buffer | null> {
  try {
    const fontPath = path.join(process.cwd(), "public/fonts/MPLUS1-Bold.ttf");
    const fontData = fs.readFileSync(fontPath);
    return fontData;
  } catch (error) {
    console.warn("Failed to load M PLUS 1 Bold font:", error);
    return null;
  }
}

/**
 * すべてのフォントを読み込む
 * @returns フォントデータの配列（Satoriのfontsオプション用）
 * フォント読み込みに失敗した場合は空配列を返す（システムフォントを使用）
 */
export async function loadFonts() {
  const [mplus1Medium, mplus1Bold] = await Promise.all([
    loadMPLUS1Medium(),
    loadMPLUS1Bold(),
  ]);

  const fonts = [];

  // M PLUS 1 Mediumが読み込めた場合
  if (mplus1Medium) {
    fonts.push({
      name: "M PLUS 1",
      data: mplus1Medium,
      weight: 400 as const,
      style: "normal" as const,
    });
  }

  // M PLUS 1 Boldが読み込めた場合
  if (mplus1Bold) {
    fonts.push({
      name: "M PLUS 1",
      data: mplus1Bold,
      weight: 700 as const,
      style: "normal" as const,
    });
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
