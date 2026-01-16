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
  const weatherCodeToIcon = (code: WeatherCode) => {
    // TODO utilsに切り出す
    //TODO 今は固定値だが、実際のデータに変更する
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
