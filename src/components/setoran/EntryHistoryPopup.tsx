import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { type CalendarEntry } from "./CalendarCell";
import { cn } from "@/lib/utils";

interface EntryHistoryPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  santriName: string;
  entries: CalendarEntry[];
  onDelete: (entry: CalendarEntry) => void;
  onAddNew: () => void;
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

const JENIS_LABELS: Record<string, string> = {
  setoran_hafalan: "Setoran Hafalan",
  drill: "Drill Hafalan",
  tasmi: "Ujian Tasmi'",
  murojaah: "Murojaah",
  tilawah: "Tilawah",
  ujian_jilid: "Ujian Jilid",
  murojaah_rumah: "Murojaah Rumah",
};

export function EntryHistoryPopup({
  open,
  onOpenChange,
  date,
  santriName,
  entries,
  onDelete,
  onAddNew,
}: EntryHistoryPopupProps) {
  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">📋 Riwayat Setoran</DialogTitle>
          <DialogDescription>
            {santriName} • {format(date, "EEEE, d MMMM yyyy", { locale: localeId })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Belum ada catatan untuk tanggal ini
            </p>
          ) : (
            entries.map((entry, idx) => (
              <div
                key={idx}
                className="p-3 border rounded-lg space-y-1.5 bg-card"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {JENIS_LABELS[entry.jenis] || entry.jenis}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(entry)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="text-sm space-y-0.5">
                  {entry.juz && <div>Juz {entry.juz}</div>}
                  {entry.surah && <div>Surah: {entry.surah}</div>}
                  {entry.ayat && <div>Ayat: {entry.ayat}</div>}
                  {entry.halaman && <div>Halaman: {entry.halaman}</div>}
                </div>

                {entry.status && (
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 rounded text-xs font-semibold border",
                      STATUS_COLORS[entry.status] || "bg-muted text-muted-foreground"
                    )}
                  >
                    {entry.status}
                  </span>
                )}

                {entry.catatan && (
                  <p className="text-xs text-muted-foreground">📝 {entry.catatan}</p>
                )}
              </div>
            ))
          )}

          {entries.length === 0 && (
            <Button onClick={onAddNew} className="w-full">
              Tambah Setoran
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
