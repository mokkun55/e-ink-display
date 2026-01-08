/**
 * 電子ペーパー表示設定
 * 解像度と向きの設定を管理
 */

export type Orientation = "landscape" | "portrait";

/**
 * 解像度プリセット
 */
export const RESOLUTION_PRESETS = {
  landscape: {
    width: 800,
    height: 480,
  },
  portrait: {
    width: 480,
    height: 800,
  },
} as const;

/**
 * 現在の表示向き設定
 * デフォルトは横方向（landscape）
 */
export const DISPLAY_ORIENTATION: Orientation = "landscape";

/**
 * 現在の向きに基づいて幅と高さを取得
 * @param orientation 向き（省略時はDISPLAY_ORIENTATIONを使用）
 * @returns 幅と高さのオブジェクト
 */
export function getDisplayDimensions(
  orientation: Orientation = DISPLAY_ORIENTATION
): { width: number; height: number } {
  return RESOLUTION_PRESETS[orientation];
}

/**
 * 現在の表示幅を取得
 */
export function getDisplayWidth(
  orientation: Orientation = DISPLAY_ORIENTATION
): number {
  return getDisplayDimensions(orientation).width;
}

/**
 * 現在の表示高さを取得
 */
export function getDisplayHeight(
  orientation: Orientation = DISPLAY_ORIENTATION
): number {
  return getDisplayDimensions(orientation).height;
}
