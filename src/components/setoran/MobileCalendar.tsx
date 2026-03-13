import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
  getDay,
} from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Star, Home } from "lucide-react";
import { type CalendarEntry } from "./CalendarCell";

const HARI_SHORT = ["Ahd", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const STATUS_COLORS: Record<string, string> = {
  Lancar: "bg-[hsl(160,60%,45%)]/15 text-[hsl(160,60%,30%)]",
  Lulus: "bg-[hsl(160,60%,45%)]/15 text-[hsl(160,60%,30%)]",
  "Kurang Lancar": "bg-[hsl(45,90%,55%)]/15 text-[hsl(45,90%,35%)]",
  Ulangi: "bg-destructive/15 text-destructive",
  Mengulang: "bg-destructive/15 text-destructive",
  Sakit: "bg-muted text-muted-foreground",
  Izin: "bg-muted text-muted-foreground",
};

function getStatusBadge(status?: string) {
  if (!status) return "";
  return STATUS_COLORS[status] || "bg-muted text-muted-foreground";
}

function getStatusAbbr(status?: string) {
  if (!status) return "";
  if (status === "Lancar" || status === "Lulus") return "L";
  if (status === "Ulangi" || status === "Mengulang") return "U";
  if (status === "Kurang Lancar") return "KL";
  return status.charAt(0);
}

interface MobileCalendarProps {
  month: number;
  year: number;
  entries: CalendarEntry[];
  onDateClick: (date: Date) => void;
  headerTitle: string;
  allowWeekends?: boolean;
}

export function MobileCalendar({
  month,
  year,
  entries,
  onDateClick,
  headerTitle,
  allowWeekends = false,
}: MobileCalendarProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(monthStart);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
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

  // Group days by day-of-week (row = day name, columns = dates)
  // Each row: Ahad, Senin, ..., Sabtu
  // Each column: week 1, 2, 3, 4, 5
  const weekCount = useMemo(() => {
    const weeks = new Set<number>();
    days.forEach((d) => {
      // week index: which week of the month (0-based)
      const weekIdx = Math.floor((d.getDate() + getDay(startOfMonth(new Date(year, month))) - 1) / 7);
      weeks.add(weekIdx);
    });
    return weeks.size;
  }, [days, month, year]);

  const grid = useMemo(() => {
    // Create a 7 x weekCount grid
    // grid[dayOfWeek][weekIndex] = day | null
    const firstDayOfWeek = getDay(startOfMonth(new Date(year, month)));
    const result: (Date | null)[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: weekCount }, () => null)
    );
    days.forEach((d) => {
      const dow = getDay(d);
      const weekIdx = Math.floor((d.getDate() + firstDayOfWeek - 1) / 7);
      result[dow][weekIdx] = d;
    });
    return result;
  }, [days, weekCount, month, year]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-[hsl(160,60%,45%)] text-white text-center py-2 px-3 rounded-t-lg font-bold text-xs uppercase tracking-wide">
        {headerTitle} BULAN {format(currentMonth, "MMMM yyyy", { locale: localeId }).toUpperCase()}
      </div>

      {/* Grid: rows = days of week, columns = week numbers */}
      <div className="border border-t-0 border-border rounded-b-lg overflow-hidden">
        {grid.map((weekDates, dayOfWeek) => {
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          return (
            <div
              key={dayOfWeek}
              className={cn(
                "flex border-b border-border last:border-b-0",
                isWeekend && "bg-muted/40"
              )}
            >
              {/* Day label */}
              <div
                className={cn(
                  "w-10 shrink-0 flex items-center justify-center text-[9px] font-bold border-r border-border py-1",
                  isWeekend
                    ? "bg-muted/70 text-muted-foreground"
                    : dayOfWeek === 5
                    ? "bg-[hsl(160,40%,90%)] text-[hsl(160,60%,30%)]"
                    : "bg-card text-foreground"
                )}
              >
                {HARI_SHORT[dayOfWeek]}
              </div>

              {/* Date cells scroll horizontally */}
              <div className="flex flex-1 overflow-x-auto">
                {weekDates.map((day, weekIdx) => {
                  if (!day) {
                    return (
                      <div
                        key={weekIdx}
                        className="min-w-[60px] flex-1 border-r border-border last:border-r-0 bg-muted/20"
                      />
                    );
                  }

                  const dateKey = format(day, "yyyy-MM-dd");
                  const dayEntries = entriesByDate.get(dateKey) || [];
                  const hasExam = dayEntries.some(
                    (e) => e.jenis === "tasmi" || e.jenis === "ujian_jilid"
                  );
                  const hasHome = dayEntries.some((e) => e.jenis === "murojaah_rumah");
                  const today = isToday(day);

                  return (
                    <div
                      key={weekIdx}
                      onClick={() => {
                        if (isWeekend && !allowWeekends) return;

                        const monthStart = startOfMonth(new Date(year, month));

                        const previousDays = eachDayOfInterval({
                          start: monthStart,
                          end: new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1),
                        });

                        const activePreviousDays = previousDays.filter((d) => {
                          const dow = getDay(d);
                          const weekend = dow === 0 || dow === 6;
                          return allowWeekends || !weekend;
                        });

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
                      className={cn(
                        "relative min-w-[60px] flex-1 border-r border-border last:border-r-0 p-0.5 min-h-[52px]",
                        isWeekend && !allowWeekends
                          ? "bg-muted/40 cursor-default"
                          : "bg-card hover:bg-accent/40 cursor-pointer",
                        dayOfWeek === 5 && "bg-[hsl(160,40%,90%)]/30",
                        today && "ring-2 ring-inset ring-primary/50"
                      )}
                    >
                      {/* Date number top-right */}
                      <div className="flex items-start justify-between">
                        <div className="flex gap-0.5">
                          {hasExam && (
                            <Star className="w-2.5 h-2.5 text-[hsl(45,90%,55%)] fill-[hsl(45,90%,55%)]" />
                          )}
                          {hasHome && (
                            <Home className="w-2.5 h-2.5 text-primary" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-medium leading-none",
                            isWeekend ? "text-muted-foreground/60" : "text-muted-foreground",
                            today && "text-primary font-bold"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                      </div>

                      {/* Entries */}
                      {dayEntries.length > 0 && (
                        <div className="mt-0.5 space-y-0.5">
                          {dayEntries.slice(0, 1).map((entry, i) => (
                            <div key={i} className="text-[8px] leading-tight">
                              {entry.jenis === "drill" && entry.juz && (
                                <span className="font-medium">D.J{entry.juz}</span>
                              )}
                              {entry.jenis === "setoran_hafalan" && (
                                <span className="font-medium">
                                  {entry.surah ? entry.surah.substring(0, 6) : `J${entry.juz}`}
                                </span>
                              )}
                              {entry.jenis === "tasmi" && (
                                <span className="font-medium">T.J{entry.juz}</span>
                              )}
                              {entry.jenis === "murojaah" && (
                                <span className="font-medium">J{entry.juz}</span>
                              )}
                              {entry.jenis === "tilawah" && (
                                <span className="font-medium">Tlw</span>
                              )}
                              {entry.jenis === "ujian_jilid" && (
                                <span className="font-medium">UJ</span>
                              )}
                              {entry.jenis === "murojaah_rumah" && (
                                <span className="font-medium">J{entry.juz}</span>
                              )}

                              {entry.status && (
                                <span
                                  className={cn(
                                    "inline-block ml-0.5 px-0.5 rounded text-[7px] font-semibold",
                                    getStatusBadge(entry.status)
                                  )}
                                >
                                  {getStatusAbbr(entry.status)}
                                </span>
                              )}
                            </div>
                          ))}
                          {dayEntries.length > 1 && (
                            <div className="text-[7px] text-muted-foreground">
                              +{dayEntries.length - 1}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
