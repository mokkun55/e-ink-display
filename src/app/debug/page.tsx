"use client";

import { useEffect, useState, useCallback } from "react";
import type { Orientation } from "@/config/display";

interface DebugInfo {
  processingTimes: {
    render: number;
    rawData: number;
    dithering: number;
    encode: number;
    total: number;
  };
}

export default function DebugPage() {
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(
    null,
  );
  const [binaryImageUrl, setBinaryImageUrl] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<Orientation>("landscape");

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // デバッグ情報を取得
      const debugResponse = await fetch(
        `/api/epaper?debugInfoOnly=true&orientation=${orientation}`,
      );
      if (!debugResponse.ok) {
        throw new Error("デバッグ情報の取得に失敗しました");
      }
      const debugData: DebugInfo = await debugResponse.json();
      setDebugInfo(debugData);

      // 元画像を取得
      const originalResponse = await fetch(
        `/api/epaper?original=true&orientation=${orientation}`,
      );
      if (!originalResponse.ok) {
        throw new Error("元画像の取得に失敗しました");
      }
      const originalBlob = await originalResponse.blob();
      setOriginalImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(originalBlob);
      });

      // 加工後画像を取得
      const processedResponse = await fetch(
        `/api/epaper?format=png&orientation=${orientation}`,
      );
      if (!processedResponse.ok) {
        throw new Error("加工後画像の取得に失敗しました");
      }
      const processedBlob = await processedResponse.blob();
      setProcessedImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(processedBlob);
      });

      // バイナリデータを取得
      const binaryResponse = await fetch(
        `/api/epaper?orientation=${orientation}`,
      );
      if (!binaryResponse.ok) {
        throw new Error("バイナリデータの取得に失敗しました");
      }
      const binaryData = await binaryResponse.arrayBuffer();

      // バイナリデータを画像に変換
      const decodeResponse = await fetch(
        `/api/epaper/decode?orientation=${orientation}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
          },
          body: binaryData,
        }
      );
      if (!decodeResponse.ok) {
        throw new Error("バイナリデータの変換に失敗しました");
      }
      const decodedBlob = await decodeResponse.blob();
      setBinaryImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(decodedBlob);
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "画像の読み込みに失敗しました",
      );
    } finally {
      setLoading(false);
    }
  }, [orientation]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
      }
      if (processedImageUrl) {
        URL.revokeObjectURL(processedImageUrl);
      }
      if (binaryImageUrl) {
        URL.revokeObjectURL(binaryImageUrl);
      }
    };
  }, [originalImageUrl, processedImageUrl, binaryImageUrl]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">デバッグページ</h1>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="orientation-select" className="text-sm font-medium">
            向き:
          </label>
          <select
            id="orientation-select"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
            className="px-3 py-1 border border-gray-300 rounded"
          >
            <option value="landscape">横方向 (800×480)</option>
            <option value="portrait">縦方向 (480×800)</option>
          </select>
        </div>
        <button
          type="button"
          onClick={loadImages}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "読み込み中..." : "再読み込み"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {debugInfo && (
        <div className="mb-8 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-4">処理時間</h2>
          <div className="space-y-2 font-mono">
            <div>
              レンダリング:{" "}
              <span className="font-bold">
                {debugInfo.processingTimes.render.toFixed(2)}ms
              </span>
            </div>
            <div>
              Rawデータ取得:{" "}
              <span className="font-bold">
                {debugInfo.processingTimes.rawData.toFixed(2)}ms
              </span>
            </div>
            <div>
              ディザリング:{" "}
              <span className="font-bold">
                {debugInfo.processingTimes.dithering.toFixed(2)}ms
              </span>
            </div>
            <div>
              エンコード:{" "}
              <span className="font-bold">
                {debugInfo.processingTimes.encode.toFixed(2)}ms
              </span>
            </div>
            <div className="pt-2 border-t border-gray-400">
              合計:{" "}
              <span className="font-bold text-lg">
                {debugInfo.processingTimes.total.toFixed(2)}ms
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">元画像</h2>
          {loading && <p>読み込み中...</p>}
          {originalImageUrl && (
            <img
              src={originalImageUrl}
              alt="元画像"
              className="border-2 border-gray-300 rounded"
            />
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">加工後画像</h2>
          {loading && <p>読み込み中...</p>}
          {processedImageUrl && (
            <img
              src={processedImageUrl}
              alt="加工後画像"
              className="border-2 border-gray-300 rounded"
            />
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">バイナリ→画像</h2>
          {loading && <p>読み込み中...</p>}
          {binaryImageUrl && (
            <img
              src={binaryImageUrl}
              alt="バイナリデータから変換した画像"
              className="border-2 border-gray-300 rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
}
