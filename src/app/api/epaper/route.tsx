import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { EpaperContent } from "@/components/EpaperContent";
import { applyFloydSteinbergDithering } from "@/utils/dithering";
import { getImageData, encodeToPng } from "@/utils/image";

export const runtime = "nodejs";

const WIDTH = 800;
const HEIGHT = 480;

/**
 * GET /api/epaper
 * 7色電子ペーパー用画像を生成するAPI
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const debug = searchParams.get("debug") === "true";

    // Step 1: next/ogで初期画像を生成
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
            display: "flex",
          }}
        >
          <EpaperContent />
        </div>
      ),
      {
        width: WIDTH,
        height: HEIGHT,
      }
    );

    // ImageResponseからバッファを取得
    const buffer = Buffer.from(await imageResponse.arrayBuffer());

    // Step 2: Rawデータを取得
    const imageData = await getImageData(buffer, WIDTH, HEIGHT);

    // Step 3: 減色処理（フロイド-スタインバーグ・ディザリング）
    const ditheredData = applyFloydSteinbergDithering(imageData, WIDTH, HEIGHT);

    // Step 4: PNGにエンコード
    const outputBuffer = await encodeToPng(ditheredData, WIDTH, HEIGHT);

    // デバッグモードの処理（後で実装）
    if (debug) {
      // TODO: デバッグ機能の実装
    }

    // Step 5: PNG画像を返却
    return new Response(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error generating epaper image:", error);

    // エラーレスポンス
    return NextResponse.json(
      {
        error: "画像生成に失敗しました",
        code: "IMAGE_GENERATION_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
