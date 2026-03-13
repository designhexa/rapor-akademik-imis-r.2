import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  getDay,
} from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarCell, type CalendarEntry } from "./CalendarCell";

const HARI = ["AHAD", "SENIN", "SELASA", "RABU", "KAMIS", "JUM'AT", "SABTU"];

interface MonthlyCalendarProps {
  month: number; // 0-indexed
  year: number;
  entries: CalendarEntry[];
  onDateClick: (date: Date) => void;
  headerTitle: string;
  allowWeekends?: boolean;
}

export function MonthlyCalendar({
  month,
  year,
  entries,
  onDateClick,
  headerTitle,
  allowWeekends = false,
}: MonthlyCalendarProps) {
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(monthStart);
    // Week starts on Sunday (0)
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [month, year]);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    entries.forEach((e) => {
      const key = format(e.tanggal, "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return map;
  }, [entries]);

  const currentMonth = new Date(year, month);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-[hsl(160,60%,45%)] text-white text-center py-2.5 px-4 rounded-t-lg font-bold text-sm md:text-base uppercase tracking-wide">
        {headerTitle} BULAN {format(currentMonth, "MMMM yyyy", { locale: localeId }).toUpperCase()}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-x border-border">
        {HARI.map((hari, i) => {
          const isWeekend = i === 0 || i === 6;
          return (
            <div
              key={hari}
              className={cn(
                "text-center py-1.5 md:py-2 text-[10px] md:text-xs font-bold border-b border-border uppercase tracking-wider",
                isWeekend
                  ? "bg-muted/70 text-muted-foreground"
                  : i === 5
                  ? "bg-[hsl(160,40%,90%)] text-[hsl(160,60%,30%)]"
                  : "bg-card text-foreground"
              )}
            >
              {hari}
            </div>
          );
        })}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-x border-b border-border rounded-b-lg overflow-hidden">
        {calendarDays.map((day, idx) => {
          const dayOfWeek = getDay(day); // 0=Sun, 6=Sat
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const isJumat = dayOfWeek === 5;
          const inMonth = isSameMonth(day, currentMonth);
          const dateKey = format(day, "yyyy-MM-dd");
          const dayEntries = entriesByDate.get(dateKey) || [];

          return (
            <CalendarCell
              key={idx}
              date={day}
              inMonth={inMonth}
              isWeekend={isWeekend}
              isJumat={isJumat}
              isToday={isToday(day)}
              entries={dayEntries}
              allowWeekends={allowWeekends}
              onClick={() => {
                if (!inMonth) return;
                if (isWeekend && !allowWeekends) return;

                const monthStart = startOfMonth(new Date(year, month));

                // Semua hari sebelum tanggal yang diklik
                const previousDays = eachDayOfInterval({
                  start: monthStart,
                  end: new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1),
                });

                // Filter hanya hari aktif
                const activePreviousDays = previousDays.filter((d) => {
                  const dow = getDay(d);
                  const weekend = dow === 0 || dow === 6;
                  return allowWeekends || !weekend;
                });

                // Cek apakah ada hari sebelumnya yang belum punya entry
                const hasUnfilledDay = activePreviousDays.some((d) => {
                  const key = format(d, "yyyy-MM-dd");
                  return !entriesByDate.has(key);
                });

                if (hasUnfilledDay) {
                  alert("Hari sebelumnya belum diisi.");
                  return;
                }

                onDateClick(day);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
