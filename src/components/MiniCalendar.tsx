/**
 * ミニカレンダーコンポーネント
 * 電子ペーパー表示用の小さなカレンダー
 */

interface MiniCalendarProps {
  /** 表示する年（省略時は現在の年） */
  year?: number;
  /** 表示する月（0-11、省略時は現在の月） */
  month?: number;
  /** 今日の日付（省略時は現在の日付） */
  today?: number;
  /** 予定データ（日付: 色の配列） */
  events?: Record<number, string[]>;
}

export function MiniCalendar({
  year: propYear,
  month: propMonth,
  today: propToday,
  events = {},
}: MiniCalendarProps) {
  const currentDate = new Date();
  const year = propYear ?? currentDate.getFullYear();
  const month = propMonth ?? currentDate.getMonth();
  const today = propToday ?? currentDate.getDate();

  // 月の最初の日と最後の日を取得
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 (日曜) から 6 (土曜)

  // カレンダーの日付配列を生成
  const calendarDays: (number | null)[] = [];
  // 前月の空白を追加
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // 当月の日付を追加
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // 週に分割
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const dayLabels = ["日", "月", "火", "水", "木", "金", "土"];

  // 指定日の予定（ドット）を取得
  const getEventDots = (day: number | null): string[] => {
    if (day === null) return [];
    return events[day] || [];
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        fontSize: "16px",
        width: "100%",
      }}
    >
      {/* 曜日ヘッダー */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "-4px",
          width: "100%",
        }}
      >
        {dayLabels.map((label, index) => (
          <div
            key={label}
            style={{
              flex: 1,
              textAlign: "center",
              fontWeight: index === 0 ? "bold" : "normal",
              color: index === 0 ? "#ff0000" : "#000000",
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      {weeks.map((week) => {
        const weekStartDay = week.find((d) => d !== null) ?? 0;
        return (
          <div
            key={`week-${year}-${month}-${weekStartDay}`}
            style={{
              display: "flex",
              gap: "8px",
              width: "100%",
            }}
          >
            {week.map((day, dayIndex) => {
              const eventDots = getEventDots(day);
              return (
                <div
                  key={`day-${year}-${month}-${day ?? `empty-${dayIndex}`}`}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "1px",
                  }}
                >
                  {/* 日付 */}
                  <div
                    style={{
                      width: "100%",
                      minHeight: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        day === today ? "#000000" : "transparent",
                      color: day === today ? "#ffffff" : "#000000",
                      fontWeight: day === today ? "bold" : "normal",
                      borderRadius: "2px",
                    }}
                  >
                    {day !== null ? day : ""}
                  </div>
                  {/* 予定ドット */}
                  {day !== null && eventDots.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "2px",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "4px",
                      }}
                    >
                      {eventDots.map((color) => (
                        <div
                          key={`dot-${year}-${month}-${day}-${color}`}
                          style={{
                            width: "3px",
                            height: "3px",
                            backgroundColor: color,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
