/**
 * 7色電子ペーパー用カラーパレット
 * ACeP (Advanced Color ePaper) 方式の7色パレット定義
 */

export type PaletteColor = {
  id: string;
  rgb: [number, number, number];
};

export const PALETTE: PaletteColor[] = [
  { id: "black", rgb: [0, 0, 0] }, // 黒
  { id: "white", rgb: [255, 255, 255] }, // 白
  { id: "green", rgb: [0, 255, 0] }, // 緑
  { id: "blue", rgb: [0, 0, 255] }, // 青
  { id: "red", rgb: [255, 0, 0] }, // 赤
  { id: "yellow", rgb: [255, 255, 0] }, // 黄
  { id: "orange", rgb: [255, 128, 0] }, // オレンジ
];

/**
 * RGB値から最近傍のパレット色を見つける
 * @param r Red値 (0-255)
 * @param g Green値 (0-255)
 * @param b Blue値 (0-255)
 * @returns 最近傍のパレット色のインデックス
 */
export function findNearestPaletteColor(
  r: number,
  g: number,
  b: number,
): number {
  let minDistance = Infinity;
  let nearestIndex = 0;

  for (let i = 0; i < PALETTE.length; i++) {
    const [pr, pg, pb] = PALETTE[i].rgb;
    // ユークリッド距離を計算
    const distance = Math.sqrt(
      Math.pow(r - pr, 2) + Math.pow(g - pg, 2) + Math.pow(b - pb, 2),
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = i;
    }
  }

  return nearestIndex;
}

/**
 * パレット色のRGB値を取得
 * @param index パレットのインデックス
 * @returns RGB値 [r, g, b]
 */
export function getPaletteColor(index: number): [number, number, number] {
  return PALETTE[index].rgb;
}