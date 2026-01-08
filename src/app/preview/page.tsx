"use client";

import { useEffect, useState, useRef } from "react";
import { EpaperContent } from "@/components/EpaperContent";
import type { Orientation } from "@/config/display";
import { getDisplayDimensions } from "@/config/display";

export default function PreviewPage() {
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoReload, setAutoReload] = useState(false);
  const [reloadInterval, setReloadInterval] = useState(2000); // 2秒
  const [previewScale, setPreviewScale] = useState(1);
  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [isUsageOpen, setIsUsageOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const loadImages = async () => {
    setLoading(true);
    setError(null);

    try {
      // 元画像を取得
      const originalResponse = await fetch(
        `/api/epaper?original=true&orientation=${orientation}&t=${Date.now()}`,
      );
      if (!originalResponse.ok) {
        throw new Error("元画像の取得に失敗しました");
      }
      const originalBlob = await originalResponse.blob();
      const originalUrl = URL.createObjectURL(originalBlob);
      setOriginalImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return originalUrl;
      });

      // 加工後画像を取得
      const processedResponse = await fetch(
        `/api/epaper?orientation=${orientation}&t=${Date.now()}`,
      );
      if (!processedResponse.ok) {
        throw new Error("加工後画像の取得に失敗しました");
      }
      const processedBlob = await processedResponse.blob();
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return processedUrl;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "画像の読み込みに失敗しました",
      );
    } finally {
      setLoading(false);
    }
  };

  // プレビューコンテナのサイズに合わせてスケールを計算
  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.offsetWidth;
        const { width } = getDisplayDimensions(orientation);
        const scale = containerWidth / width;
        setPreviewScale(scale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [orientation]);

  useEffect(() => {
    loadImages();

    // 自動リロード設定
    let intervalId: NodeJS.Timeout | null = null;
    if (autoReload) {
      intervalId = setInterval(() => {
        loadImages();
      }, reloadInterval);
    }

    // クリーンアップ
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
      }
      if (processedImageUrl) {
        URL.revokeObjectURL(processedImageUrl);
      }
    };
  }, [autoReload, reloadInterval, orientation]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            スタイリング確認ページ
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">向き:</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as Orientation)}
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value="landscape">横方向 (800×480)</option>
                <option value="portrait">縦方向 (480×800)</option>
              </select>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoReload}
                onChange={(e) => setAutoReload(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-700">自動リロード</span>
            </label>
            {autoReload && (
              <select
                value={reloadInterval}
                onChange={(e) => setReloadInterval(Number(e.target.value))}
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value={1000}>1秒</option>
                <option value={2000}>2秒</option>
                <option value={3000}>3秒</option>
                <option value={5000}>5秒</option>
              </select>
            )}
            <button
              onClick={loadImages}
              disabled={loading}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "読み込み中..." : "手動更新"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* 情報パネル（折り畳み可能） */}
        <div className="mb-6 space-y-4">
          {/* 使い方 */}
          <div className="rounded-lg border border-blue-200 bg-blue-50">
            <button
              onClick={() => setIsUsageOpen(!isUsageOpen)}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-semibold text-blue-900">使い方</h3>
              <svg
                className={`w-5 h-5 text-blue-700 transition-transform ${
                  isUsageOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isUsageOpen && (
              <div className="px-4 pb-4">
                <ul className="list-disc space-y-1 pl-5 text-sm text-blue-800">
                  <li>
                    <code className="rounded bg-blue-100 px-1">EpaperContent.tsx</code>
                    を編集すると、ホットリロードで自動的に反映されます
                  </li>
                  <li>
                    自動リロードを有効にすると、定期的に画像を再生成して表示します
                  </li>
                  <li>
                    3つのビューを比較して、スタイリングの効果を確認できます
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* スタイリングの差について */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50">
            <button
              onClick={() => setIsWarningOpen(!isWarningOpen)}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-yellow-100 transition-colors"
            >
              <h3 className="font-semibold text-yellow-900">
                ⚠️ スタイリングの差について
              </h3>
              <svg
                className={`w-5 h-5 text-yellow-700 transition-transform ${
                  isWarningOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isWarningOpen && (
              <div className="px-4 pb-4">
                <p className="text-sm text-yellow-800 mb-2">
                  CSSの都合上、HTMLプレビューとPNGプレビューでスタイリングの差が出る場合があります。
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-yellow-800 mb-2">
                  <li>
                    <code className="rounded bg-yellow-100 px-1">next/og</code>の<code className="rounded bg-yellow-100 px-1">ImageResponse</code>は、ブラウザのレンダリングエンジンとは異なるレンダリングエンジンを使用します
                  </li>
                  <li>
                    フォントのレンダリング方法が異なる場合があります
                  </li>
                  <li>
                    CSSの一部のプロパティが完全にサポートされていない場合があります
                  </li>
                  <li>
                    ブラウザで表示されるHTMLと、実際に生成されるPNG画像で見た目が異なる可能性があります
                  </li>
                </ul>
                <p className="text-sm font-semibold text-yellow-900">
                  最終的な見た目を確認する際は、PNG画像（特に加工済みPNG画像）を参考にしてください。
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3カラムレイアウト */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* HTMLプレビュー */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              HTMLプレビュー
            </h2>
            <div
              ref={previewContainerRef}
              className="relative w-full overflow-hidden rounded border-2 border-gray-300 bg-white"
              style={{
                aspectRatio: `${getDisplayDimensions(orientation).width}/${getDisplayDimensions(orientation).height}`,
              }}
            >
              <div
                style={{
                  width: `${getDisplayDimensions(orientation).width}px`,
                  height: `${getDisplayDimensions(orientation).height}px`,
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                }}
              >
                <EpaperContent />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              実際のコンポーネント表示（スケール調整済み）
            </p>
          </div>

          {/* 元PNG画像 */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">元PNG画像</h2>
            {loading && !originalImageUrl && (
              <div className="flex h-[240px] items-center justify-center border-2 border-gray-300">
                <p className="text-gray-500">読み込み中...</p>
              </div>
            )}
            {originalImageUrl && (
              <div className="relative overflow-hidden rounded border-2 border-gray-300">
                <img
                  src={originalImageUrl}
                  alt="元画像"
                  className="w-full"
                  style={{ imageRendering: "auto" }}
                />
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">
              next/ogで生成された元画像
            </p>
          </div>

          {/* 加工済みPNG画像 */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              加工済みPNG画像
            </h2>
            {loading && !processedImageUrl && (
              <div className="flex h-[240px] items-center justify-center border-2 border-gray-300">
                <p className="text-gray-500">読み込み中...</p>
              </div>
            )}
            {processedImageUrl && (
              <div className="relative overflow-hidden rounded border-2 border-gray-300">
                <img
                  src={processedImageUrl}
                  alt="加工後画像"
                  className="w-full"
                  style={{ imageRendering: "auto" }}
                />
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">
              ディザリング処理後の画像
            </p>
          </div>
        </div>

        {/* フルサイズ比較 */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              元画像（フルサイズ）
            </h2>
            {originalImageUrl && (
              <div className="relative overflow-auto rounded border-2 border-gray-300">
                <img
                  src={originalImageUrl}
                  alt="元画像（フルサイズ）"
                  className="block"
                  style={{ imageRendering: "auto" }}
                />
              </div>
            )}
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              加工済み画像（フルサイズ）
            </h2>
            {processedImageUrl && (
              <div className="relative overflow-auto rounded border-2 border-gray-300">
                <img
                  src={processedImageUrl}
                  alt="加工後画像（フルサイズ）"
                  className="block"
                  style={{ imageRendering: "auto" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
