import {
  findNearestPaletteColor,
  getPaletteColor,
} from "@/config/palette";

/**
 * フロイド-スタインバーグ・ディザリングによる減色処理
 * 
 * @param imageData RGBA配列 (width * height * 4)
 * @param width 画像の幅
 * @param height 画像の高さ
 * @returns 減色後のRGBA配列
 */
export function applyFloydSteinbergDithering(
  imageData: Uint8Array,
  width: number,
  height: number,
): Uint8Array {
  // 元のデータをコピー（誤差拡散のため）
  const output = new Uint8Array(imageData);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // 現在のピクセルのRGB値を取得
      const oldR = output[idx];
      const oldG = output[idx + 1];
      const oldB = output[idx + 2];
      // Alphaは保持（透明度がある場合）

      // 最近傍のパレット色を見つける
      const paletteIndex = findNearestPaletteColor(oldR, oldG, oldB);
      const [newR, newG, newB] = getPaletteColor(paletteIndex);

      // 新しい色を設定
      output[idx] = newR;
      output[idx + 1] = newG;
      output[idx + 2] = newB;

      // 量子化誤差を計算
      const errorR = oldR - newR;
      const errorG = oldG - newG;
      const errorB = oldB - newB;

      // 誤差を周辺ピクセルに拡散（フロイド-スタインバーグ係数）
      // 右隣 (x+1, y): 7/16
      if (x + 1 < width) {
        addError(output, (y * width + (x + 1)) * 4, errorR, errorG, errorB, 7 / 16);
      }

      // 左下 (x-1, y+1): 3/16
      if (x - 1 >= 0 && y + 1 < height) {
        addError(output, ((y + 1) * width + (x - 1)) * 4, errorR, errorG, errorB, 3 / 16);
      }

      // 下 (x, y+1): 5/16
      if (y + 1 < height) {
        addError(output, ((y + 1) * width + x) * 4, errorR, errorG, errorB, 5 / 16);
      }

      // 右下 (x+1, y+1): 1/16
      if (x + 1 < width && y + 1 < height) {
        addError(output, ((y + 1) * width + (x + 1)) * 4, errorR, errorG, errorB, 1 / 16);
      }
    }
  }

  return output;
}

/**
 * 誤差をピクセルに加算する
 */
function addError(
  data: Uint8Array,
  index: number,
  errorR: number,
  errorG: number,
  errorB: number,
  factor: number,
): void {
  data[index] = clamp(data[index] + errorR * factor, 0, 255);
  data[index + 1] = clamp(data[index + 1] + errorG * factor, 0, 255);
  data[index + 2] = clamp(data[index + 2] + errorB * factor, 0, 255);
}

/**
 * 値を指定範囲にクランプする
 */
function clamp(value: number, min: number, max: number): number {
  return Math.round(Math.max(min, Math.min(max, value)));
}