/**
 * 電子ペーパー表示用コンテンツ
 * next/ogのImageResponseで使用するReactコンポーネント
 */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: SVGのtitle要素はアクセシビリティのために必要 */
/** biome-ignore-all lint/performance/noImgElement: ogにするので許可する */

import { MiniCalendar } from "./MiniCalendar";
import { EventList } from "./EventList";
import type { GoogleCalendarEvent } from "@/utils/calendar";
import { getColorIdsByDate } from "@/utils/calendar";

interface EpaperContentProps {
  baseUrl?: string;
  events?: GoogleCalendarEvent[];
}

export function EpaperContent({
  baseUrl: _baseUrl = "http://localhost:3000", // TODO 環境変数で持つようにしたほうがいいかな
  events: propEvents,
}: EpaperContentProps) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
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
        <img src={`https://picsum.photos/600/480`} alt="pixel-image" />
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
        {/* 日付 */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              padding: 0,
              // fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            {formattedDate}
          </p>
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
        </div>

        {/* 枠線 */}
        <div style={{ borderBottom: "2px solid #000000" }} />

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
        </div>
      </div>
    </div>
  );
}
