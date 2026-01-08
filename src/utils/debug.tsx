import sharp from "sharp";
import { applyFloydSteinbergDithering } from "./dithering";
import { getImageData, encodeToPng } from "./image";

const WIDTH = 800;
const HEIGHT = 480;

/**
 * デバッグ情報を格納する型
 */
export interface DebugInfo {
  processingTimes: {
    render: number;
    rawData: number;
    dithering: number;
    encode: number;
    total: number;
  };
  originalImage: Buffer;
  ditheredImage: Buffer;
}

/**
 * デバッグ用の比較画像を生成
 * @param originalBuffer 元画像のバッファ
 * @param ditheredBuffer 減色後の画像のバッファ
 * @param debugInfo デバッグ情報
 * @returns 比較画像のバッファ
 */
export async function createDebugComparisonImage(
  originalBuffer: Buffer,
  ditheredBuffer: Buffer,
  debugInfo: DebugInfo,
): Promise<Buffer> {
  // 2つの画像を横並びで配置した比較画像を生成
  // 幅: 800 * 2 + パディング = 1620px
  // 高さ: 480 + 情報表示エリア = 600px

  const comparisonWidth = WIDTH * 2 + 40;
  const comparisonHeight = HEIGHT + 120;

  // 元画像と減色後画像をリサイズして横並びに配置
  const originalResized = await sharp(originalBuffer)
    .resize(WIDTH, HEIGHT)
    .toBuffer();
  const ditheredResized = await sharp(ditheredBuffer)
    .resize(WIDTH, HEIGHT)
    .toBuffer();

  // 比較画像を作成
  const comparisonImage = await sharp({
    create: {
      width: comparisonWidth,
      height: comparisonHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: originalResized,
        left: 0,
        top: 0,
      },
      {
        input: ditheredResized,
        left: WIDTH + 20,
        top: 0,
      },
    ])
    .png()
    .toBuffer();

  // 処理時間などの情報をテキストとして画像に追加
  // 注意: sharpでは直接テキストを描画できないため、
  // ここでは画像のみを返し、情報は別の方法で表示する
  return comparisonImage;
}

/**
 * デバッグ情報をテキストとして生成
 * @param debugInfo デバッグ情報
 * @returns デバッグ情報のテキスト
 */
export function formatDebugInfo(debugInfo: DebugInfo): string {
  const { processingTimes } = debugInfo;
  return `
処理時間:
  - レンダリング: ${processingTimes.render.toFixed(2)}ms
  - Rawデータ取得: ${processingTimes.rawData.toFixed(2)}ms
  - ディザリング: ${processingTimes.dithering.toFixed(2)}ms
  - エンコード: ${processingTimes.encode.toFixed(2)}ms
  - 合計: ${processingTimes.total.toFixed(2)}ms
`.trim();
}

/**
 * 減色前後の比較画像を生成（sharpを使用）
 * @param originalData 元画像のRGBAデータ
 * @param ditheredData 減色後のRGBAデータ
 * @param debugInfo デバッグ情報
 * @returns 比較画像のバッファ
 */
export async function createComparisonImage(
  originalData: Uint8Array,
  ditheredData: Uint8Array,
  debugInfo: DebugInfo,
): Promise<Buffer> {
  // デバッグ情報をコンソールに出力
  console.log("\n=== デバッグ情報 ===");
  console.log(formatDebugInfo(debugInfo));
  console.log("==================\n");

  // 画像間のスペース（40px）
  const gap = 40;
  const comparisonWidth = WIDTH * 2 + gap;

  // 元画像と減色後画像をPNGバッファに変換
  const originalPng = await encodeToPng(originalData, WIDTH, HEIGHT);
  const ditheredPng = await encodeToPng(ditheredData, WIDTH, HEIGHT);

  // sharpで2つの画像を横並びに配置（画像間にスペースを追加）
  const comparisonImage = await sharp({
    create: {
      width: comparisonWidth,
      height: HEIGHT,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: originalPng,
        left: 0,
        top: 0,
      },
      {
        input: ditheredPng,
        left: WIDTH + gap,
        top: 0,
      },
    ])
    .png()
    .toBuffer();

  return comparisonImage;
}
