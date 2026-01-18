/**
 * 予定リストコンポーネント
 * 電子ペーパー表示用の予定一覧
 */

import type { GoogleCalendarEvent } from "@/utils/calendar";
import { extractDateFromEvent, getColorByColorId } from "@/utils/calendar";

interface EventListProps {
  /** 表示する年（省略時は現在の年） */
  year?: number;
  /** 表示する月（0-11、省略時は現在の月） */
  month?: number;
  /** 今日の日付（省略時は現在の日付） */
  today?: number;
  /** Google Calendar API形式の予定データ */
  events?: GoogleCalendarEvent[];
  /** 最大表示件数（省略時は10件） */
  maxItems?: number;
}

export function EventList({
  year: propYear,
  month: propMonth,
  today: propToday,
  events = [],
  maxItems = 10,
}: EventListProps) {
  const currentDate = new Date();
  const year = propYear ?? currentDate.getFullYear();
  const month = propMonth ?? currentDate.getMonth();
  const today = propToday ?? currentDate.getDate();

  // 今日の予定のみを取得
  const todayEvents = events.filter((event) => {
    const eventDay = extractDateFromEvent(event);
    return eventDay === today;
  });

  // 開始時間順にソート（終日予定は最後）
  todayEvents.sort((a, b) => {
    const aTime = a.start.dateTime ?? "";
    const bTime = b.start.dateTime ?? "";
    if (!aTime && !bTime) return 0;
    if (!aTime) return 1; // 終日予定は後
    if (!bTime) return -1; // 終日予定は後
    return aTime.localeCompare(bTime);
  });

  // 最大表示件数まで制限
  const displayEvents = todayEvents.slice(0, maxItems);

  if (displayEvents.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          fontSize: "14px",
          padding: "8px",
        }}
      >
        <div style={{ color: "#000" }}>予定はありません</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        fontSize: "14px",
      }}
    >
      {displayEvents.map((event, index) => {
        const eventColor = getColorByColorId(event.colorId);
        // const hasLocation = !!event.location;
        // const hasDescription = !!event.description;
        const isAllDay = !event.start.dateTime && !!event.start.date;
        const startTime = event.start.dateTime
          ? new Date(event.start.dateTime).toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : null;

        return (
          <div
            key={`event-${year}-${month}-${event.summary}-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              // paddingBottom: "2px",
            }}
          >
            {/* 色ドット */}
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: eventColor,
                flexShrink: 0,
              }}
            />
            {/* 時間（あれば） */}
            {startTime && (
              <div
                style={{
                  fontSize: "10px",
                  color: "#000",
                  minWidth: "32px",
                }}
              >
                {startTime}
              </div>
            )}
            {isAllDay && (
              <div
                style={{
                  fontSize: "10px",
                  color: "#000",
                  minWidth: "32px",
                }}
              >
                終日
              </div>
            )}
            {/* 予定タイトル */}
            <div
              style={{
                flex: 1,
                color: "#000000",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {event.summary}
            </div>
            {/* アイコン（場所・メモ）※不要だったためコメントアウト */}
            {/* <div
              style={{
                display: "flex",
                gap: "2px",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {/* {hasLocation && <span style={{ fontSize: "10px" }}>📍</span>}
              {hasDescription && <span style={{ fontSize: "10px" }}>📝</span>} */}
          </div>
        );
      })}
    </div>
  );
}
