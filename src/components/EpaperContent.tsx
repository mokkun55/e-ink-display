/**
 * 電子ペーパー表示用コンテンツ
 * next/ogのImageResponseで使用するReactコンポーネント
 */

export function EpaperContent() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        padding: "30px",
        fontFamily: "Noto Sans JP, Inter, sans-serif",
        overflow: "hidden",
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ margin: 0, marginBottom: "8px" }}>ほげほげ</h1>
      <p style={{ margin: 0, marginBottom: "8px" }}>ふがふが</p>
    </div>
  );
}
