/**
 * Google Calendar API関連のユーティリティ
 */

/**
 * Google Calendar APIのイベント型
 */
export interface GoogleCalendarEvent {
  /** 予定のタイトル */
  summary: string;
  /** 開始日時 */
  start: {
    dateTime?: string; // 時間指定: "2024-04-15T10:00:00+09:00"
    date?: string; // 終日: "2024-04-15"
  };
  /** 終了日時 */
  end: {
    dateTime?: string;
    date?: string;
  };
  /** 色ID（"1"～"11"） */
  colorId?: string;
  /** 場所 */
  location?: string;
  /** 説明・メモ */
  description?: string;
  /** 予定の有無（"opaque" = 予定あり, "transparent" = 空き） */
  transparency?: string;
}

/**
 * colorIdからGoogle Calendar公式の色コードに変換
 * Google CalendarのcolorId（"1"～"11"）を公式カラーパレットにマッピング
 * 参考: https://developers.google.com/calendar/api/v3/reference/colors
 */
export function getColorByColorId(colorId?: string): string {
  const colorMap: Record<string, string> = {
    "1": "#7986CB", // ラベンダー (Lavender)
    "2": "#33B679", // セージ (Sage)
    "3": "#8E24AA", // ブドウ (Grape)
    "4": "#E67C73", // フラミンゴ (Flamingo)
    "5": "#F6BF26", // バナナ (Banana)
    "6": "#F4511E", // ミカン (Mikan/Tangerine)
    "7": "#039BE5", // ピーコック (Peacock)
    "8": "#616161", // グラファイト (Graphite)
    "9": "#3F51B5", // ブルーベリー (Blueberry)
    "10": "#0B8043", // バジル (Basil)
    "11": "#D50000", // トマト (Tomato)
  };
  return colorMap[colorId ?? ""] || "#000000"; // デフォルトは黒
}

/**
 * 日付文字列から日付を抽出（dateTimeまたはdateから）
 */
export function extractDateFromEvent(
  event: GoogleCalendarEvent
): number | null {
  const dateStr = event.start.dateTime ?? event.start.date;
  if (!dateStr) return null;

  // "2024-04-15T10:00:00+09:00" または "2024-04-15" から日付を抽出
  const dateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!dateMatch) return null;

  return Number.parseInt(dateMatch[3], 10);
}

/**
 * イベントリストを日付ごとにグループ化
 */
export function groupEventsByDate(
  events: GoogleCalendarEvent[]
): Record<number, GoogleCalendarEvent[]> {
  const grouped: Record<number, GoogleCalendarEvent[]> = {};

  events.forEach((event) => {
    const day = extractDateFromEvent(event);
    if (day !== null) {
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(event);
    }
  });

  return grouped;
}

/**
 * 日付ごとの色IDリストを取得（カレンダー用）
 */
export function getColorIdsByDate(
  events: GoogleCalendarEvent[]
): Record<number, string[]> {
  const grouped = groupEventsByDate(events);
  const result: Record<number, string[]> = {};

  Object.entries(grouped).forEach(([dayStr, dayEvents]) => {
    const day = Number.parseInt(dayStr, 10);
    result[day] = dayEvents
      .map((event) => getColorByColorId(event.colorId))
      .filter((color) => color !== "#000000"); // デフォルト色は除外
  });

  return result;
}
