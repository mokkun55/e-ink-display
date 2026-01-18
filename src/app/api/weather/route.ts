import { NextResponse } from "next/server";
import type { TodayWeather } from "@/types/weather";

/**
 * OpenWeather API One Call 3.0 のレスポンス型定義
 */
interface OpenWeatherResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  daily: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
      morn: number;
      day: number;
      eve: number;
      night: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    pop: number; // 降水確率 (0-1)
  }>;
  hourly: Array<{
    dt: number;
    temp: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    pop: number; // 降水確率 (0-1)
  }>;
}

/**
 * 時間帯ごとの代表的な時間を取得する
 */
function getRepresentativeHour(
  timeOfDay: "morning" | "afternoon" | "evening"
): number {
  switch (timeOfDay) {
    case "morning":
      return 9; // 朝9時
    case "afternoon":
      return 15; // 昼15時
    case "evening":
      return 21; // 夜21時
  }
}

/**
 * GET /api/weather
 * OpenWeather API One Call 3.0から天気情報を取得するAPI
 * 環境変数: OPEN_WEATHER_APIKEY, WEATHER_LAT, WEATHER_LON
 */
export async function GET() {
  const apiKey = process.env.OPEN_WEATHER_APIKEY;
  const lat = process.env.WEATHER_LAT;
  const lon = process.env.WEATHER_LON;

  // 環境変数のチェック
  if (!apiKey || !lat || !lon) {
    return NextResponse.json(
      { error: "環境変数が設定されていません" },
      { status: 500 }
    );
  }

  try {
    // OpenWeather API One Call 3.0 を呼び出す
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenWeather API error:", response.status, errorText);
      return NextResponse.json(
        { error: `OpenWeather API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data: OpenWeatherResponse = await response.json();

    // 今日のデータを取得（daily[0]が今日）
    const today = data.daily[0];
    if (!today) {
      return NextResponse.json(
        { error: "今日の天気データが取得できませんでした" },
        { status: 500 }
      );
    }

    // 現在時刻を取得（UTC）
    const now = new Date();

    // 時間帯ごとのデータを取得
    // hourly配列から各時間帯の代表的な時間のデータを探す
    const morningHour = getRepresentativeHour("morning");
    const afternoonHour = getRepresentativeHour("afternoon");
    const eveningHour = getRepresentativeHour("evening");

    // 今日の0時（UTC）を基準に、各時間帯のタイムスタンプを計算
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayStartTimestamp = Math.floor(todayStart.getTime() / 1000);

    const morningTimestamp = todayStartTimestamp + morningHour * 3600;
    const afternoonTimestamp = todayStartTimestamp + afternoonHour * 3600;
    const eveningTimestamp = todayStartTimestamp + eveningHour * 3600;

    // hourly配列から各時間帯に最も近いデータを取得
    const findHourlyData = (targetTimestamp: number) => {
      return (
        data.hourly.find((h) => Math.abs(h.dt - targetTimestamp) < 3600) ||
        data.hourly[0]
      );
    };

    const morningData = findHourlyData(morningTimestamp);
    const afternoonData = findHourlyData(afternoonTimestamp);
    const eveningData = findHourlyData(eveningTimestamp);

    // TodayWeather形式に変換
    const weatherData: TodayWeather = {
      minTemperature: Math.round(today.temp.min),
      maxTemperature: Math.round(today.temp.max),
      morning: {
        weatherCode: morningData.weather[0]?.id ?? 800,
        temperature: Math.round(today.temp.morn),
        precipitationProbability: Math.round(morningData.pop * 100),
      },
      afternoon: {
        weatherCode: afternoonData.weather[0]?.id ?? 800,
        temperature: Math.round(today.temp.day),
        precipitationProbability: Math.round(afternoonData.pop * 100),
      },
      evening: {
        weatherCode: eveningData.weather[0]?.id ?? 800,
        temperature: Math.round(today.temp.eve),
        precipitationProbability: Math.round(eveningData.pop * 100),
      },
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("=== 天気APIの取得に失敗 ===");
    if (error instanceof Error) {
      console.error("エラーメッセージ:", error.message);
      console.error("エラースタック:", error.stack);
      return NextResponse.json(
        { error: `天気データの取得に失敗しました: ${error.message}` },
        { status: 500 }
      );
    } else {
      console.error("エラー:", error);
      return NextResponse.json(
        { error: "天気データの取得に失敗しました" },
        { status: 500 }
      );
    }
  }
}
