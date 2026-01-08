/**
 * 電子ペーパー表示用コンテンツ
 * next/ogのImageResponseで使用するReactコンポーネント
 */

export function EpaperTestContent() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateString = now.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

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
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "bold",
            color: "#000000",
            margin: 0,
            marginBottom: "8px",
          }}
        >
          Hello World
        </h1>
        <div
          style={{
            fontSize: "20px",
            color: "#666666",
          }}
        >
          {dateString}
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#000000",
            fontWeight: "bold",
            marginTop: "8px",
          }}
        >
          {timeString}
        </div>
      </div>

      {/* 7色テストパターン */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "15px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#000000",
            marginBottom: "8px",
          }}
        >
          7色テストパターン
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          {/* 黒 */}
          <ColorBox color="#000000" label="黒" />
          {/* 白 */}
          <ColorBox color="#FFFFFF" label="白" border />
          {/* 緑 */}
          <ColorBox color="#00FF00" label="緑" />
          {/* 青 */}
          <ColorBox color="#0000FF" label="青" />
          {/* 赤 */}
          <ColorBox color="#FF0000" label="赤" />
          {/* 黄 */}
          <ColorBox color="#FFFF00" label="黄" />
          {/* オレンジ */}
          <ColorBox color="#FF8000" label="オレンジ" />
        </div>
      </div>

      {/* 図形サンプル */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "20px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            backgroundColor: "#0000FF",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            width: "70px",
            height: "70px",
            backgroundColor: "#FF0000",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            width: "0",
            height: "0",
            borderLeft: "35px solid transparent",
            borderRight: "35px solid transparent",
            borderBottom: "60px solid #00FF00",
          }}
        />
      </div>
    </div>
  );
}

function ColorBox({
  color,
  label,
  border = false,
}: {
  color: string;
  label: string;
  border?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          backgroundColor: color,
          border: border ? "2px solid #000000" : "none",
          borderRadius: "4px",
        }}
      />
      <div
        style={{
          fontSize: "16px",
          color: "#000000",
        }}
      >
        {label}
      </div>
    </div>
  );
}
