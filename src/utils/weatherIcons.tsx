/** biome-ignore-all lint/a11y/noSvgWithoutTitle: SVGのtitle要素はアクセシビリティのために必要 */
import type { ReactElement } from "react";
import type { WeatherCode } from "@/types/weather";

/**
 * 天気コードから色を取得
 */
function getWeatherColor(weatherCode: WeatherCode): string {
  // 800: 晴天 → オレンジ
  if (weatherCode === 800) {
    return "#FF8C00";
  }
  // 801-804: 曇り → 黒
  if (weatherCode >= 801 && weatherCode <= 804) {
    return "#000000";
  }
  // 300-321, 500-531: 雨 → 青
  if (
    (weatherCode >= 300 && weatherCode <= 321) ||
    (weatherCode >= 500 && weatherCode <= 531)
  ) {
    return "#0066CC";
  }
  // 600-622: 雪 → グレー
  if (weatherCode >= 600 && weatherCode <= 622) {
    return "#808080";
  }
  // 200-232: 雷 → 黄色
  if (weatherCode >= 200 && weatherCode <= 232) {
    return "#FFD700";
  }
  // その他 → 黒
  return "#000000";
}

/**
 * 天気コードからSVGアイコンを取得する関数
 * @param weatherCode OpenWeather APIの天気コード
 * @param size アイコンのサイズ（デフォルト: 32）
 * @returns SVGアイコン要素
 */
export function getWeatherIcon(
  weatherCode: WeatherCode,
  size: number = 32
): ReactElement {
  const color = getWeatherColor(weatherCode);

  // 800: 晴天
  if (weatherCode === 800) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
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
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    );
  }
  // 300-321, 500-531: 雨
  if (
    (weatherCode >= 300 && weatherCode <= 321) ||
    (weatherCode >= 500 && weatherCode <= 531)
  ) {
    return (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-cloud-drizzle-icon lucide-cloud-drizzle"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19v1"/><path d="M8 14v1"/><path d="M16 19v1"/><path d="M16 14v1"/><path d="M12 21v1"/><path d="M12 16v1"/></svg>
    );
  }
  // 600-622: 雪
  if (weatherCode >= 600 && weatherCode <= 622) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v6m0 6v6" />
        <path d="m8 8-4 4 4 4" />
        <path d="m16 8 4 4-4 4" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }
  // 200-232: 雷
  if (weatherCode >= 200 && weatherCode <= 232) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }
  // その他（デフォルト）
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
