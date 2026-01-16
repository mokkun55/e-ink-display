/** biome-ignore-all lint/a11y/noSvgWithoutTitle: SVGのtitle要素はアクセシビリティのために必要 */
import type { TodayWeather, WeatherCode } from "@/types/weather";

export function Weather({ weatherData }: { weatherData: TodayWeather }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        fontSize: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "0 4px",
        }}
      >
        <WeatherItem
          label="朝"
          code={weatherData.morning.weatherCode}
          temperature={weatherData.morning.temperature}
          precipitationProbability={
            weatherData.morning.precipitationProbability
          }
        />
        <div style={{ borderLeft: "1px solid #000000" }} />
        <WeatherItem
          label="昼"
          code={weatherData.afternoon.weatherCode}
          temperature={weatherData.afternoon.temperature}
          precipitationProbability={
            weatherData.afternoon.precipitationProbability
          }
        />
        <div style={{ borderLeft: "1px solid #000000" }} />
        <WeatherItem
          label="夜"
          code={weatherData.evening.weatherCode}
          temperature={weatherData.evening.temperature}
          precipitationProbability={
            weatherData.evening.precipitationProbability
          }
        />
      </div>
    </div>
  );
}

function WeatherItem({
  label,
  code,
  temperature,
  precipitationProbability,
}: {
  label: string;
  code: WeatherCode;
  temperature: number;
  precipitationProbability: number;
}) {
  const weatherCodeToIcon = (weatherCode: WeatherCode) => {
    // OpenWeather APIの天気コードに基づいてアイコンを返す（仮実装）
    // 800: 晴天
    if (weatherCode === 800) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      );
    }
    // 801-804: 曇り
    if (weatherCode >= 801 && weatherCode <= 804) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      );
    }
    // 300-321, 500-531: 雨
    if (
      (weatherCode >= 300 && weatherCode <= 321) ||
      (weatherCode >= 500 && weatherCode <= 531)
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M16 14v2" />
          <path d="M8 14v2" />
          <path d="M16 20h.01" />
          <path d="M8 20h.01" />
          <path d="M12 16v2" />
          <path d="M12 22h.01" />
        </svg>
      );
    }
    // 600-622: 雪
    if (weatherCode >= 600 && weatherCode <= 622) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M8 15h.01" />
          <path d="M8 19h.01" />
          <path d="M12 17h.01" />
          <path d="M12 21h.01" />
          <path d="M16 15h.01" />
          <path d="M16 19h.01" />
        </svg>
      );
    }
    // 200-232: 雷
    if (weatherCode >= 200 && weatherCode <= 232) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
          <path d="m13 12-3 5h4l-3 5" />
        </svg>
      );
    }
    // その他（?)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    );
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <p style={{ margin: 0 }}>{label}</p>
      <p style={{ margin: 0 }}>{weatherCodeToIcon(code)}</p>
      <p style={{ margin: 0 }}>{temperature}°C</p>
      <p style={{ margin: 0 }}>{precipitationProbability}%</p>
    </div>
  );
}
