/**
 * OpenWeather API One Call API 3.0 の型定義
 */

/**
 * 天気コード（OpenWeather APIのweather.id）
 */
export type WeatherCode = number;

/**
 * 時間帯
 */
export type TimeOfDay = "morning" | "afternoon" | "evening";

/**
 * 各時間帯の天気情報
 */
export interface TimeWeather {
  /** 天気コード */
  weatherCode: WeatherCode;
  /** 気温（摂氏） */
  temperature: number;
  /** 降水確率(%) */
  precipitationProbability: number;
}

/**
 * 今日の天気情報
 */
export interface TodayWeather {
  /** 最高気温（摂氏） */
  maxTemperature: number;
  /** 最低気温（摂氏） */
  minTemperature: number;
  /** 朝の天気情報 */
  morning: TimeWeather;
  /** 昼の天気情報 */
  afternoon: TimeWeather;
  /** 夜の天気情報 */
  evening: TimeWeather;
}