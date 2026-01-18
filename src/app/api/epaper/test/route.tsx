import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { EpaperTestContent } from "@/components/EpaperTestContent";
import { applyFloydSteinbergDithering } from "@/utils/dithering";
import { getImageData, encodeToPng, encodeToBinary } from "@/utils/image";
import { loadFonts } from "@/utils/fonts";
import type { DebugInfo } from "@/utils/debug";
import { getDisplayDimensions, type Orientation } from "@/config/display";

export const runtime = "nodejs";

/**
 * GET /api/epaper/test
 * テスト用コンテンツ（EpaperTestContent）を表示するAPI
 */
export async function GET(request: NextRequest) {
  const startTime = performance.now();
  const debugInfo: DebugInfo = {
    processingTimes: {
      render: 0,
      rawData: 0,
      dithering: 0,
      encode: 0,
      total: 0,
    },
    originalImage: Buffer.alloc(0),
    ditheredImage: Buffer.alloc(0),
  };

  try {
    const searchParams = request.nextUrl.searchParams;
    const original = searchParams.get("original") === "true";
    const debugInfoOnly = searchParams.get("debugInfoOnly") === "true";
    // 画像形式を返すかどうか（format=png または image=true で画像形式を返す）
    const format = searchParams.get("format");
    const imageFormat =
      format === "png" || searchParams.get("image") === "true";

    // 向きを取得（デフォルトはlandscape）
    const orientationParam = searchParams.get("orientation");
    const orientation: Orientation =
      orientationParam === "portrait" ? "portrait" : "landscape";

    // 解像度を取得
    const { width: WIDTH, height: HEIGHT } = getDisplayDimensions(orientation);

    // フォントを読み込む
    const fonts = await loadFonts();

    // Step 1: next/ogで初期画像を生成
    const renderStart = performance.now();
    const imageResponseOptions: {
      width: number;
      height: number;
      fonts?: typeof fonts;
    } = {
      width: WIDTH,
      height: HEIGHT,
    };

    // フォントが読み込めた場合のみ追加
    if (fonts.length > 0) {
      imageResponseOptions.fonts = fonts;
    }

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
            display: "flex",
            margin: 0,
            padding: 0,
          }}
        >
          <EpaperTestContent />
        </div>
      ),
      imageResponseOptions
    );

    // ImageResponseからバッファを取得
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    debugInfo.processingTimes.render = performance.now() - renderStart;
    debugInfo.originalImage = buffer;

    // Step 2: Rawデータを取得
    const rawDataStart = performance.now();
    const imageData = await getImageData(buffer, WIDTH, HEIGHT);
    debugInfo.processingTimes.rawData = performance.now() - rawDataStart;

    // Step 3: 減色処理（フロイド-スタインバーグ・ディザリング）
    const ditheringStart = performance.now();
    const ditheredData = applyFloydSteinbergDithering(imageData, WIDTH, HEIGHT);
    debugInfo.processingTimes.dithering = performance.now() - ditheringStart;

    // Step 4: PNGにエンコード
    const encodeStart = performance.now();
    const outputBuffer = await encodeToPng(ditheredData, WIDTH, HEIGHT);
    debugInfo.processingTimes.encode = performance.now() - encodeStart;
    debugInfo.ditheredImage = outputBuffer;

    debugInfo.processingTimes.total = performance.now() - startTime;

    // デバッグ情報のみを返す場合
    if (debugInfoOnly) {
      return NextResponse.json({
        processingTimes: debugInfo.processingTimes,
      });
    }

    // 元画像を返す場合
    if (original) {
      return new Response(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-cache",
        },
      });
    }

    // 画像形式を返す場合（クエリパラメータで指定）
    if (imageFormat) {
      return new Response(new Uint8Array(outputBuffer), {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-cache",
        },
      });
    }

    // Step 5: デフォルトはバイナリ形式（application/octet-stream）を返却
    const binaryData = encodeToBinary(ditheredData, WIDTH, HEIGHT);
    return new Response(Uint8Array.from(binaryData), {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": binaryData.length.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error generating epaper test image:", error);

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
