/**
 * 電子ペーパー表示用コンテンツ
 * next/ogのImageResponseで使用するReactコンポーネント
 */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: SVGのtitle要素はアクセシビリティのために必要 */
/** biome-ignore-all lint/performance/noImgElement: ogにするので許可する */

import { MiniCalendar } from "./MiniCalendar";
import { EventList } from "./EventList";
import { Weather } from "./Weather";
import type { GoogleCalendarEvent } from "@/utils/calendar";
import { getColorIdsByDate } from "@/utils/calendar";
import type { TodayWeather } from "@/types/weather";
import { getWeatherIcon } from "@/utils/weatherIcons";

interface EpaperContentProps {
  baseUrl?: string;
  events?: GoogleCalendarEvent[];
  weatherData?: TodayWeather;
}

export function EpaperContent({
  baseUrl: _baseUrl = "http://localhost:3000", // TODO 環境変数で持つようにしたほうがいいかな
  events: propEvents,
  weatherData: propWeatherData,
}: EpaperContentProps) {
  const currentDate = new Date();
  const month = currentDate.toLocaleDateString("ja-JP", {
    month: "long",
  });
  const day = currentDate.toLocaleDateString("ja-JP", {
    day: "numeric",
  });
  const weekday_ja = currentDate.toLocaleDateString("ja-JP", {
    weekday: "short",
  });
  const weekday_en = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Google Calendar API形式のモック予定データ（フォールバック用）
  const mockCalendarEvents: GoogleCalendarEvent[] = [
    {
      summary: "A社定例MTG",
      start: { dateTime: "2024-01-01T10:00:00+09:00" },
      end: { dateTime: "2024-01-01T11:00:00+09:00" },
      colorId: "2", // セージ → 青
      location: "会議室A",
      description: "四半期レビュー",
    },
    {
      summary: "緊急対応",
      start: { dateTime: "2024-01-01T14:00:00+09:00" },
      end: { dateTime: "2024-01-01T15:00:00+09:00" },
      colorId: "11", // トマト → 赤
      description: "システム障害対応",
    },
    {
      summary: "イベント準備",
      start: { date: "2024-01-01" },
      end: { date: "2024-01-02" },
      colorId: "1", // ラベンダー → 紫
      location: "本社",
    },
    {
      summary: "B社打ち合わせ",
      start: { dateTime: "2024-01-02T09:00:00+09:00" },
      end: { dateTime: "2024-01-02T10:00:00+09:00" },
      colorId: "2", // セージ → 青
      location: "Zoom",
    },
    {
      summary: "重要会議",
      start: { dateTime: "2024-01-02T15:00:00+09:00" },
      end: { dateTime: "2024-01-02T16:00:00+09:00" },
      colorId: "11", // トマト → 赤
    },
    {
      summary: "C社定例",
      start: { dateTime: "2024-01-03T10:00:00+09:00" },
      end: { dateTime: "2024-01-03T11:00:00+09:00" },
      colorId: "2", // セージ → 青
    },
    {
      summary: "重要タスク",
      start: { dateTime: "2024-01-03T14:00:00+09:00" },
      end: { dateTime: "2024-01-03T15:00:00+09:00" },
      colorId: "11", // トマト → 赤
    },
    {
      summary: "D社MTG",
      start: { dateTime: "2024-01-04T10:00:00+09:00" },
      end: { dateTime: "2024-01-04T11:00:00+09:00" },
      colorId: "2", // セージ → 青
    },
    {
      summary: "緊急対応",
      start: { dateTime: "2024-01-04T14:00:00+09:00" },
      end: { dateTime: "2024-01-04T15:00:00+09:00" },
      colorId: "11", // トマト → 赤
    },
    {
      summary: "E社打ち合わせ",
      start: { dateTime: "2024-01-05T10:00:00+09:00" },
      end: { dateTime: "2024-01-05T11:00:00+09:00" },
      colorId: "2", // セージ → 青
    },
    {
      summary: "重要会議",
      start: { dateTime: "2024-01-05T15:00:00+09:00" },
      end: { dateTime: "2024-01-05T16:00:00+09:00" },
      colorId: "11", // トマト → 赤
    },
    {
      summary: "F社定例",
      start: { dateTime: "2024-01-06T10:00:00+09:00" },
      end: { dateTime: "2024-01-06T11:00:00+09:00" },
      colorId: "2", // セージ → 青
    },
    {
      summary: "重要タスク",
      start: { dateTime: "2024-01-06T14:00:00+09:00" },
      end: { dateTime: "2024-01-06T15:00:00+09:00" },
      colorId: "11", // トマト → 赤
    },
    {
      summary: "予定",
      start: { dateTime: "2024-01-06T16:00:00+09:00" },
      end: { dateTime: "2024-01-06T17:00:00+09:00" },
      colorId: "5", // バナナ → オレンジ
    },
    {
      summary: "G社MTG",
      start: { dateTime: "2024-01-09T10:00:00+09:00" },
      end: { dateTime: "2024-01-09T11:00:00+09:00" },
      colorId: "2", // セージ → 青
    },
    {
      summary: "緊急対応",
      start: { dateTime: "2024-01-09T14:00:00+09:00" },
      end: { dateTime: "2024-01-09T15:00:00+09:00" },
      colorId: "11", // トマト → 赤
    },
    {
      summary: "重要会議",
      start: { dateTime: "2024-01-08T10:00:00+09:00" },
      end: { dateTime: "2024-01-08T11:00:00+09:00" },
      colorId: "11", // トマト → 赤
    },
    {
      summary: "緑の予定1",
      start: { dateTime: "2024-01-10T10:00:00+09:00" },
      end: { dateTime: "2024-01-10T11:00:00+09:00" },
      colorId: "3", // グレープ → 緑
    },
    {
      summary: "緑の予定2",
      start: { dateTime: "2024-01-11T10:00:00+09:00" },
      end: { dateTime: "2024-01-11T11:00:00+09:00" },
      colorId: "3", // グレープ → 緑
    },
    {
      summary: "イベント",
      start: { date: "2024-01-12" },
      end: { date: "2024-01-13" },
      colorId: "1", // ラベンダー → 紫
    },
    {
      summary: "重要タスク",
      start: { dateTime: "2024-01-13T10:00:00+09:00" },
      end: { dateTime: "2024-01-13T11:00:00+09:00" },
      colorId: "11", // トマト → 赤
    },
    {
      summary: "緊急対応",
      start: { dateTime: "2024-01-14T10:00:00+09:00" },
      end: { dateTime: "2024-01-14T11:00:00+09:00" },
      colorId: "11", // トマト → 赤
    },
    {
      summary: "黄色の予定",
      start: { dateTime: "2024-01-15T10:00:00+09:00" },
      end: { dateTime: "2024-01-15T11:00:00+09:00" },
      colorId: "4", // フラミンゴ → 黄色
    },
    {
      summary: "H社MTG",
      start: { dateTime: "2024-01-18T10:00:00+09:00" },
      end: { dateTime: "2024-01-18T11:00:00+09:00" },
      colorId: "2", // セージ → 青
    },
    {
      summary: "重要会議",
      start: { dateTime: "2024-01-21T10:00:00+09:00" },
      end: { dateTime: "2024-01-21T11:00:00+09:00" },
      colorId: "11", // トマト → 赤
    },
  ];

  // 予定データ（propsで渡された場合はそれを使用、なければモックデータ）
  const calendarEvents = propEvents ?? mockCalendarEvents;

  // カレンダー表示用の色データ（日付: 色の配列）
  const calendarColorData = getColorIdsByDate(calendarEvents);

  // 天気データ（propsで渡された場合のみ使用）
  const weatherData = propWeatherData;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        padding: "0px",
        fontFamily: "M PLUS 1",
        overflow: "hidden",
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      {/* 画像セクション */}
      <div
        style={{
          display: "flex",
          width: "70%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <img src={`https://picsum.photos/540/480`} alt="pixel-image" />
      </div>

      {/* 下側セクション */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          padding: "16px",
          gap: "10px",
          width: "30%",
          height: "100%",
          flexDirection: "column",
          color: "#000000",
          borderLeft: "4px solid #000000",
        }}
      >
        {/* 日付セクション(日付、今日の天気) */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* 日付 */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p
              style={{
                margin: 0,
                padding: 0,
                fontSize: "24px",
              }}
            >
              {month}
              {day}
            </p>
            <p
              style={{
                margin: 0,
                padding: 0,
                fontSize: "12px",
              }}
            >
              {weekday_en} ({weekday_ja})
            </p>
          </div>

          {/* 天気 */}
          {weatherData && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* 天気アイコン（午後の天気コードを使用） */}
              {getWeatherIcon(weatherData.afternoon.weatherCode, 32)}

              {/* 最高最低気温 */}
              <div
                style={{ display: "flex", flexDirection: "row", gap: "4px" }}
              >
                <p
                  style={{
                    margin: 0,
                    padding: 0,
                    fontSize: "12px",
                    color: "#f00",
                  }}
                >
                  {weatherData.maxTemperature}°C
                </p>
                <p style={{ margin: 0, padding: 0, fontSize: "12px" }}>/</p>
                <p
                  style={{
                    margin: 0,
                    padding: 0,
                    fontSize: "12px",
                    color: "#00f",
                  }}
                >
                  {weatherData.minTemperature}°C
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 枠線 */}
        <div style={{ borderBottom: "2px solid #000000" }} />

        {/* 天気 */}
        {weatherData && <Weather weatherData={weatherData} />}

        {/* カレンダー・予定 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ミニカレンダー */}
          <div
            style={{
              display: "flex",
              width: "100%",
            }}
          >
            <MiniCalendar events={calendarColorData} />
          </div>

          <div
            style={{ borderBottom: "2px dashed #000000", margin: "8px 0" }}
          />

          {/* 予定リスト */}
          <div
            style={{
              display: "flex",
              width: "100%",
            }}
          >
            <EventList events={calendarEvents} />
          </div>
          {/* 天気情報 */}
          {propWeatherData && (
            <div
              style={{
                display: "flex",
                border: "1px solid #000000",
                width: "100%",
                padding: "5px",
                borderRadius: "4px",
                marginTop: "8px",
              }}
            >
              <Weather weatherData={propWeatherData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
