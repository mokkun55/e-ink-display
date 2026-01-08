/**
 * 電子ペーパー表示用コンテンツ
 * next/ogのImageResponseで使用するReactコンポーネント
 */
/** biome-ignore-all lint/performance/noImgElement: ogにするので許可する */

interface EpaperContentProps {
  baseUrl?: string;
}

export function EpaperContent({
  baseUrl = "http://localhost:3000",
}: EpaperContentProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        padding: "30px",
        fontFamily: "M PLUS 1",
        overflow: "hidden",
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      <img
        src={`${baseUrl}/images/minecraft-animals.jpg`}
        alt="minecraft-animals"
      />
    </div>
  );
}
