/** biome-ignore-all lint/a11y/noSvgWithoutTitle: SVGのtitle要素はアクセシビリティのために必要 */
import type { TodayWeather, WeatherCode } from "@/types/weather";
import { getWeatherIcon } from "@/utils/weatherIcons";

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
      <p style={{ margin: 0 }}>{getWeatherIcon(code, 24)}</p>
      <p style={{ margin: 0 }}>{temperature}°C</p>
      <p style={{ margin: 0 }}>{precipitationProbability}%</p>
    </div>
  );
}
