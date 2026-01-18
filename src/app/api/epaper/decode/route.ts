import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decodeFromBinary, encodeToPng } from "@/utils/image";
import { getDisplayDimensions, type Orientation } from "@/config/display";

export const runtime = "nodejs";

/**
 * POST /api/epaper/decode
 * バイナリデータを画像に変換するAPI
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orientationParam = searchParams.get("orientation");
    const orientation: Orientation =
      orientationParam === "portrait" ? "portrait" : "landscape";

    // 解像度を取得
    const { width, height } = getDisplayDimensions(orientation);

    // リクエストボディからバイナリデータを取得
    const binaryData = await request.arrayBuffer();
    const binaryBuffer = Buffer.from(binaryData);

    // バイナリデータをRGBA配列に変換
    const rgbaData = decodeFromBinary(binaryBuffer, width, height);

    // RGBA配列をPNGにエンコード
    const pngBuffer = await encodeToPng(rgbaData, width, height);

    // PNG画像を返却
    return new Response(Uint8Array.from(pngBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error decoding binary data:", error);

    return NextResponse.json(
      {
        error: "バイナリデータの変換に失敗しました",
        code: "DECODE_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
