/**
 * 天気情報コンポーネント
 * 電子ペーパー表示用の天気情報
 */

import type { WeatherData } from "@/app/api/weather/route";

interface WeatherProps {
  /** 天気データ（省略時はモックデータを使用） */
  weatherData?: WeatherData;
}

/**
 * モック天気データ
 */
const mockWeatherData: WeatherData = {
  tempMin: 12,
  tempMax: 22,
  morning: {
    weather: "晴れ",
    precipitation: 0,
  },
  afternoon: {
    weather: "曇り",
    precipitation: 30,
  },
  evening: {
    weather: "雨",
    precipitation: 70,
  },
};

export function Weather({ weatherData }: WeatherProps) {
  const data = weatherData ?? mockWeatherData;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        fontSize: "12px",
        gap: "6px",
      }}
    >
      {/* タイトル */}
      <div
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#000000",
          marginBottom: "2px",
          borderBottom: "1px solid #000000",
          paddingBottom: "2px",
        }}
      >
        天気
      </div>

      {/* 気温情報 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div style={{ color: "#000000" }}>最低</div>
        <div
          style={{
            color: "#000000",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {data.tempMin}°C
        </div>
        <div style={{ color: "#000000" }}>/</div>
        <div style={{ color: "#000000" }}>最高</div>
        <div
          style={{
            color: "#000000",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {data.tempMax}°C
        </div>
      </div>

      {/* 天気情報（朝・昼・夜） */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          marginTop: "4px",
        }}
      >
        {/* 朝 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div style={{ color: "#000000", minWidth: "24px" }}>朝</div>
          <div style={{ color: "#000000", flex: 1 }}>{data.morning.weather}</div>
          <div style={{ color: "#000000", minWidth: "40px", textAlign: "right" }}>
            {data.morning.precipitation}%
          </div>
        </div>

        {/* 昼 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div style={{ color: "#000000", minWidth: "24px" }}>昼</div>
          <div style={{ color: "#000000", flex: 1 }}>
            {data.afternoon.weather}
          </div>
          <div style={{ color: "#000000", minWidth: "40px", textAlign: "right" }}>
            {data.afternoon.precipitation}%
          </div>
        </div>

        {/* 夜 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div style={{ color: "#000000", minWidth: "24px" }}>夜</div>
          <div style={{ color: "#000000", flex: 1 }}>{data.evening.weather}</div>
          <div style={{ color: "#000000", minWidth: "40px", textAlign: "right" }}>
            {data.evening.precipitation}%
          </div>
        </div>
      </div>
    </div>
  );
}
