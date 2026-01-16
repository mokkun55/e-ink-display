import sharp from "sharp";
import { findNearestPaletteColor, getPaletteColor } from "@/config/palette";

/**
 * PNGバッファからRGBA配列を取得
 * @param buffer PNGバッファ
 * @param width 画像の幅
 * @param height 画像の高さ
 * @returns RGBA配列 (width * height * 4)
 */
export async function getImageData(
  buffer: Buffer,
  width: number,
  height: number
): Promise<Uint8Array> {
  // sharpでRGBA形式のrawデータを取得
  const { data } = await sharp(buffer)
    .resize(width, height, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return new Uint8Array(data);
}

/**
 * RGBA配列からPNGバッファを生成
 * @param imageData RGBA配列 (width * height * 4)
 * @param width 画像の幅
 * @param height 画像の高さ
 * @returns PNGバッファ
 */
export async function encodeToPng(
  imageData: Uint8Array,
  width: number,
  height: number
): Promise<Buffer> {
  return await sharp(imageData, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
}

/**
 * RGBA配列をESP32用バイナリ形式に変換
 * 1バイトに2ピクセル分のデータをパック（上位4ビット + 下位4ビット）
 * @param imageData RGBA配列 (width * height * 4)
 * @param width 画像の幅
 * @param height 画像の高さ
 * @returns バイナリデータ (width * height / 2 バイト)
 */
export function encodeToBinary(
  imageData: Uint8Array,
  width: number,
  height: number
): Buffer {
  const outputSize = (width * height) / 2;
  const output = Buffer.alloc(outputSize);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x += 2) {
      // 2ピクセル分のデータを取得
      const idx1 = (y * width + x) * 4;
      const idx2 = (y * width + (x + 1)) * 4;

      // 各ピクセルのRGB値を取得
      const r1 = imageData[idx1];
      const g1 = imageData[idx1 + 1];
      const b1 = imageData[idx1 + 2];
      const r2 = imageData[idx2];
      const g2 = imageData[idx2 + 1];
      const b2 = imageData[idx2 + 2];

      // パレットインデックスを取得（0-7の値）
      const paletteIndex1 = findNearestPaletteColor(r1, g1, b1);
      const paletteIndex2 = findNearestPaletteColor(r2, g2, b2);

      // 1バイトに2ピクセル分をパック
      // 上位4ビット: 1ピクセル目、下位4ビット: 2ピクセル目
      const packedByte = (paletteIndex1 << 4) | paletteIndex2;

      // 出力位置を計算（行優先順序）
      const outputIdx = y * (width / 2) + x / 2;
      output[outputIdx] = packedByte;
    }
  }

  return output;
}

/**
 * ESP32用バイナリ形式をRGBA配列に変換
 * 1バイトから2ピクセル分のデータを展開（上位4ビット + 下位4ビット）
 * @param binaryData バイナリデータ (width * height / 2 バイト)
 * @param width 画像の幅
 * @param height 画像の高さ
 * @returns RGBA配列 (width * height * 4)
 */
export function decodeFromBinary(
  binaryData: Buffer | Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const output = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x += 2) {
      // バイナリデータから1バイトを取得
      const inputIdx = y * (width / 2) + x / 2;
      const packedByte = binaryData[inputIdx];

      // 2つのピクセルのパレットインデックスを抽出
      const paletteIndex1 = (packedByte >> 4) & 0x0f; // 上位4ビット
      const paletteIndex2 = packedByte & 0x0f; // 下位4ビット

      // パレットインデックスからRGB値を取得
      const [r1, g1, b1] = getPaletteColor(paletteIndex1);
      const [r2, g2, b2] = getPaletteColor(paletteIndex2);

      // RGBA配列に書き込む
      const idx1 = (y * width + x) * 4;
      output[idx1] = r1;
      output[idx1 + 1] = g1;
      output[idx1 + 2] = b1;
      output[idx1 + 3] = 255; // Alpha

      const idx2 = (y * width + (x + 1)) * 4;
      output[idx2] = r2;
      output[idx2 + 1] = g2;
      output[idx2 + 2] = b2;
      output[idx2 + 3] = 255; // Alpha
    }
  }

  return output;
}
