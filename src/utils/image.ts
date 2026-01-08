import sharp from "sharp";

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
