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
 * colorIdから電子ペーパー用7色パレットの色コードに変換
 * Google CalendarのcolorId（"1"～"11"）を電子ペーパーの7色パレットにマッピング
 * 参考: https://developers.google.com/calendar/api/v3/reference/colors
 *
 * 電子ペーパーの7色パレット:
 * - 黒: #000000
 * - 白: #FFFFFF
 * - 緑: #00FF00
 * - 青: #0000FF
 * - 赤: #FF0000
 * - 黄: #FFFF00
 * - オレンジ: #FF8000
 */
export function getColorByColorId(colorId?: string): string {
  const colorMap: Record<string, string> = {
    "1": "#0000FF", // ラベンダー (Lavender) → 青
    "2": "#00FF00", // セージ (Sage) → 緑
    "3": "#0000FF", // ブドウ (Grape) → 青
    "4": "#FF0000", // フラミンゴ (Flamingo) → 赤
    "5": "#FFFF00", // バナナ (Banana) → 黄
    "6": "#FF8000", // ミカン (Mikan/Tangerine) → オレンジ
    "7": "#0000FF", // ピーコック (Peacock) → 青
    "8": "#000000", // グラファイト (Graphite) → 黒
    "9": "#0000FF", // ブルーベリー (Blueberry) → 青
    "10": "#00FF00", // バジル (Basil) → 緑
    "11": "#FF0000", // トマト (Tomato) → 赤
  };
  return colorMap[colorId ?? ""] || "#0000FF"; // デフォルトは水色（青）
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
      .filter((color) => color !== "#000000"); // 黒色は除外（デフォルトは水色なので表示される）
  });

  return result;
}
