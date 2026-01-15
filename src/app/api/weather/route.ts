import { NextResponse } from "next/server";

/**
 * 天気データの型定義
 */
export interface WeatherData {
  /** 最低気温 */
  tempMin: number;
  /** 最高気温 */
  tempMax: number;
  /** 朝の天気情報 */
  morning: {
    /** 天気（例: "晴れ", "曇り", "雨"） */
    weather: string;
    /** 降水確率（%） */
    precipitation: number;
  };
  /** 昼の天気情報 */
  afternoon: {
    /** 天気（例: "晴れ", "曇り", "雨"） */
    weather: string;
    /** 降水確率（%） */
    precipitation: number;
  };
  /** 夜の天気情報 */
  evening: {
    /** 天気（例: "晴れ", "曇り", "雨"） */
    weather: string;
    /** 降水確率（%） */
    precipitation: number;
  };
}

/**
 * GET /api/weather
 * OpenWeatherMap APIから天気情報を取得するAPI
 * 環境変数: OPEN_WEATHER_APIKEY, WEATHER_LAT, WEATHER_LON
 */
export async function GET() {
  try {
    const apiKey = process.env.OPEN_WEATHER_APIKEY;
    const lat = process.env.WEATHER_LAT;
    const lon = process.env.WEATHER_LON;

    // 環境変数のチェック
    if (!apiKey || !lat || !lon) {
      console.warn("=== 天気APIの環境変数が設定されていません ===");
      console.warn("OPEN_WEATHER_APIKEY:", apiKey ? "設定済み" : "未設定");
      console.warn("WEATHER_LAT:", lat ? "設定済み" : "未設定");
      console.warn("WEATHER_LON:", lon ? "設定済み" : "未設定");
      console.warn("モックデータを返します");

      // モックデータを返す
      const mockData: WeatherData = {
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

      return NextResponse.json(mockData);
    }

    // TODO: OpenWeatherMap APIを実装
    // 現在は準備中のため、モックデータを返す
    const mockData: WeatherData = {
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

    return NextResponse.json(mockData);

    // 実装時は以下のようなコードになる想定:
    // const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
    // const response = await fetch(url);
    // if (!response.ok) {
    //   throw new Error(`OpenWeatherMap API error: ${response.statusText}`);
    // }
    // const data = await response.json();
    // // データを整形してWeatherData形式に変換
    // return NextResponse.json(weatherData);
  } catch (error) {
    console.error("=== 天気APIの取得に失敗 ===");
    if (error instanceof Error) {
      console.error("エラーメッセージ:", error.message);
      console.error("エラースタック:", error.stack);
    } else {
      console.error("エラー:", error);
    }

    // エラー時もモックデータを返す
    const mockData: WeatherData = {
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

    return NextResponse.json(mockData);
  }
}
