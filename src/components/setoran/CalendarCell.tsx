import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Star, Home } from "lucide-react";

export interface CalendarEntry {
  id?: string;
  tanggal: Date;
  santriId: string;
  jenis:
    | "setoran_hafalan"
    | "drill"
    | "tasmi"
    | "murojaah"
    | "tilawah"
    | "ujian_jilid"
    | "murojaah_rumah";
  juz?: number;
  surah?: string;
  surahNumber?: number;
  halaman?: string;
  ayat?: string;
  ayatDari?: number;
  ayatSampai?: number;
  jilid?: string;
  level?: number;
  nilai?: number;
  status?: string;
  catatan?: string;
  rolePengisi?: string;
}

interface CalendarCellProps {
  date: Date;
  inMonth: boolean;
  isWeekend: boolean;
  isJumat: boolean;
  isToday: boolean;
  entries: CalendarEntry[];
  onClick: () => void;
  allowWeekends?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  Lancar: "bg-[hsl(160,60%,45%)]/15 text-[hsl(160,60%,30%)] border-[hsl(160,60%,45%)]/30",
  Lulus: "bg-[hsl(160,60%,45%)]/15 text-[hsl(160,60%,30%)] border-[hsl(160,60%,45%)]/30",
  "Kurang Lancar": "bg-[hsl(45,90%,55%)]/15 text-[hsl(45,90%,35%)] border-[hsl(45,90%,55%)]/30",
  Ulangi: "bg-destructive/15 text-destructive border-destructive/30",
  Mengulang: "bg-destructive/15 text-destructive border-destructive/30",
  Sakit: "bg-muted text-muted-foreground border-border",
  Izin: "bg-muted text-muted-foreground border-border",
};

function getStatusBadgeClass(status?: string) {
  if (!status) return "bg-muted text-muted-foreground";
  return STATUS_COLORS[status] || "bg-muted text-muted-foreground";
}

function isExamType(jenis: string) {
  return jenis === "tasmi" || jenis === "ujian_jilid";
}

function isHomeType(jenis: string) {
  return jenis === "murojaah_rumah";
}

export function CalendarCell({
  date,
  inMonth,
  isWeekend,
  isJumat,
  isToday: today,
  entries,
  onClick,
  allowWeekends = false,
}: CalendarCellProps) {
  const dayNum = format(date, "d");
  const hasEntries = entries.length > 0;
  const hasExam = entries.some((e) => isExamType(e.jenis));
  const hasHome = entries.some((e) => isHomeType(e.jenis));

  if (!inMonth) {
    return <div className="min-h-[60px] md:min-h-[90px] bg-muted/30 border-b border-r border-border" />;
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative min-h-[60px] md:min-h-[90px] border-b border-r border-border p-0.5 md:p-1 transition-colors",
        isWeekend && !allowWeekends
          ? "bg-muted/50 cursor-default"
          : "bg-card hover:bg-accent/40 cursor-pointer",
        isJumat && "bg-[hsl(160,40%,90%)]/50",
        today && "ring-2 ring-inset ring-primary/50",
      )}
    >
      {/* Date number */}
      <div className="flex items-start justify-between">
        <div />
        <span
          className={cn(
            "text-[10px] md:text-xs font-medium leading-none",
            isWeekend ? "text-muted-foreground/60" : "text-muted-foreground",
            today && "text-primary font-bold"
          )}
        >
          {dayNum}
        </span>
      </div>

      {/* Icons */}
      {hasExam && (
        <Star className="absolute top-0.5 left-0.5 w-2.5 h-2.5 md:w-3 md:h-3 text-[hsl(45,90%,55%)] fill-[hsl(45,90%,55%)]" />
      )}
      {hasHome && (
        <Home className="absolute top-0.5 left-0.5 w-2.5 h-2.5 md:w-3 md:h-3 text-primary" />
      )}

      {/* Entry content */}
      {hasEntries && (
        <div className="mt-0.5 space-y-0.5 overflow-hidden">
          {entries.slice(0, 2).map((entry, i) => (
            <div key={i} className="text-[9px] md:text-xs leading-tight">
              {entry.jenis === "drill" && entry.juz && (
                <span className="font-medium">Drill J{entry.juz}</span>
              )}
              {entry.jenis === "setoran_hafalan" && (
                <span className="font-medium">
                  {entry.surah ? entry.surah : `Juz ${entry.juz}`}
                </span>
              )}
              {entry.jenis === "tasmi" && (
                <span className="font-medium">Tasmi' J{entry.juz}</span>
              )}
              {entry.jenis === "murojaah" && (
                <span className="font-medium">Juz {entry.juz}</span>
              )}
              {entry.jenis === "tilawah" && (
                <span className="font-medium">{entry.surah || `Tilawah`}</span>
              )}
              {entry.jenis === "ujian_jilid" && (
                <span className="font-medium">Ujian Jilid</span>
              )}
              {entry.jenis === "murojaah_rumah" && (
                <span className="font-medium">Juz {entry.juz}</span>
              )}

              {entry.halaman && (
                <div className="text-muted-foreground text-[8px] md:text-[10px]">Hal {entry.halaman}</div>
              )}
              {entry.ayat && (
                <div className="text-muted-foreground text-[8px] md:text-[10px]">Ay {entry.ayat}</div>
              )}

              {entry.status && (
                <span
                  className={cn(
                    "inline-block px-1 py-0 rounded text-[7px] md:text-[9px] font-semibold mt-0.5 border",
                    getStatusBadgeClass(entry.status)
                  )}
                >
                  {entry.status === "Lancar" || entry.status === "Lulus" ? "L" : 
                   entry.status === "Ulangi" || entry.status === "Mengulang" ? "U" : 
                   entry.status === "Kurang Lancar" ? "KL" : entry.status.charAt(0)}
                </span>
              )}
            </div>
          ))}
          {entries.length > 2 && (
            <div className="text-[7px] md:text-[9px] text-muted-foreground">
              +{entries.length - 2} lagi
            </div>
          )}
        </div>
      )}
    </div>
  );
}
