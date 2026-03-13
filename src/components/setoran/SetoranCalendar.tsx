import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isBefore, isToday, startOfDay, addDays, subDays } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertCircle, Lock } from "lucide-react";

interface SetoranRecord {
  tanggal: Date;
  santriId: string;
  jenis: "setoran_baru" | "murojaah" | "tilawah" | "tilawah_rumah" | "drill";
  status: "selesai" | "tidak_hadir";
}

interface SetoranCalendarProps {
  santriId: string;
  setoranRecords: SetoranRecord[];
  onSelectDate: (date: Date | undefined) => void;
  selectedDate?: Date;
}

export function SetoranCalendar({
  santriId,
  setoranRecords,
  onSelectDate,
  selectedDate,
}: SetoranCalendarProps) {
  const today = startOfDay(new Date());

  // Cari tanggal terakhir yang belum diisi
  const getFirstMissingDate = useMemo(() => {
    // Target tanggal = H-2
    const targetDate = subDays(today, 2);

    const hasRecord = setoranRecords.some(
      (r) =>
        r.santriId === santriId &&
        format(r.tanggal, "yyyy-MM-dd") === format(targetDate, "yyyy-MM-dd")
    );

    return hasRecord ? null : targetDate;
  }, [setoranRecords, santriId, today]);

  // Cek apakah tanggal bisa dipilih
  const isDateSelectable = (date: Date): boolean => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    // Tidak bisa pilih tanggal masa depan
    if (isBefore(today, startOfDay(date))) return false;
    
    // Jika ada tanggal sebelumnya yang belum diisi, hanya tanggal itu yang bisa dipilih
    if (getFirstMissingDate) {
      return format(getFirstMissingDate, "yyyy-MM-dd") === dateStr;
    }
    
    // Jika hari ini sudah diisi, tidak ada yang bisa dipilih
    const todayHasRecord = setoranRecords.some(
      (r) =>
        r.santriId === santriId &&
        format(r.tanggal, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
    );
    
    if (todayHasRecord) return false;
    
    // Hanya hari ini yang bisa dipilih
    return isToday(date);
  };

  // Status setiap tanggal
  const getDateStatus = (date: Date): "selesai" | "tidak_hadir" | "kosong" | "locked" | "available" => {
    const dateStr = format(date, "yyyy-MM-dd");
    const record = setoranRecords.find(
      (r) =>
        r.santriId === santriId &&
        format(r.tanggal, "yyyy-MM-dd") === dateStr
    );
    
    if (record) {
      return record.status;
    }
    
    if (isBefore(today, startOfDay(date))) return "locked";
    
    if (isDateSelectable(date)) return "available";
    
    if (isBefore(startOfDay(date), today)) return "kosong";
    
    return "locked";
  };

  const modifiers = useMemo(() => {
    const selesai: Date[] = [];
    const tidakHadir: Date[] = [];
    const available: Date[] = [];
    const locked: Date[] = [];

    // Iterate 60 hari
    for (let i = -30; i <= 30; i++) {
      const date = addDays(today, i);
      const status = getDateStatus(date);
      
      switch (status) {
        case "selesai":
          selesai.push(date);
          break;
        case "tidak_hadir":
          tidakHadir.push(date);
          break;
        case "available":
          available.push(date);
          break;
        case "locked":
        case "kosong":
          locked.push(date);
          break;
      }
    }

    return { selesai, tidakHadir, available, locked };
  }, [setoranRecords, santriId, today, getFirstMissingDate]);

  const modifiersStyles = {
    selesai: {
      backgroundColor: "hsl(var(--primary))",
      color: "white",
      borderRadius: "50%",
    },
    tidakHadir: {
      backgroundColor: "hsl(var(--destructive))",
      color: "white",
      borderRadius: "50%",
    },
    available: {
      backgroundColor: "hsl(var(--secondary))",
      color: "hsl(var(--secondary-foreground))",
      borderRadius: "50%",
      fontWeight: "bold",
    },
    locked: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          📅 Kalender Setoran
        </CardTitle>
        <CardDescription>
          Setoran wajib setiap hari. Isi hari sebelumnya dulu jika belum diisi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {getFirstMissingDate && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium">Setoran belum lengkap!</p>
                <p className="text-xs mt-1">
                  Silakan isi setoran untuk tanggal{" "}
                  <strong>
                    {format(getFirstMissingDate, "d MMMM yyyy", { locale: id })}
                  </strong>
                  {" "}
                  terlebih dahulu.
                </p>
              </div>
            </div>
          </div>
        )}

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={(date) => !isDateSelectable(date)}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-md border"
        />

        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-primary" />
            <span>Sudah setor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-destructive" />
            <span>Tidak hadir</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-secondary" />
            <span>Bisa diisi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span>Terkunci</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
