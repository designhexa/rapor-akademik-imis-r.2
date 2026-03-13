import { useState, useMemo, useEffect } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { 
  Unlock, Lock, Save, Trophy, RotateCcw, CheckCircle, AlertCircle, Info, BookOpen
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { JuzSelector } from "@/components/JuzSelector";
import { 
  getDrillsForJuz, 
  DrillDefinition, 
  formatDrillDescription 
} from "@/lib/drill-data";
import {
  getPageMappingByJuz,
  getPageRangeFromAyatRange,
  getPageSummaryByJuz,
  getPageCountForJuz,
  getSurahListByJuz,
} from "@/lib/mushaf-madinah";
import { SurahAyatLimitInfo, PageRangeDetailInfo } from "@/components/setoran/AyatRangeInfo";

const mockSantri = [
  { id: "1", nama: "Muhammad Faiz", nis: "S001", halaqoh: "Halaqoh Al-Azhary" },
  { id: "2", nama: "Fatimah Zahra", nis: "S003", halaqoh: "Halaqoh Al-Furqon" },
  { id: "3", nama: "Aisyah Nur", nis: "S002", halaqoh: "Halaqoh Al-Azhary" },
];

interface AddDrillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (data: any) => void;
  date: Date | null;
  santriName: string;
  initialSantriId?: string;
  drillHistory: {
    santri: string;
    juz: number;
    level: number;
    status: string;
  }[];
}

const BATAS_LULUS_DRILL = 88;
const BATAS_KESALAHAN_DRILL = 12;

export const AddDrillModal = ({
  open,
  onOpenChange,
  onSuccess,
  date,
  santriName,
  initialSantriId,
  drillHistory = []
}: AddDrillModalProps) => {

  const [selectedSantri, setSelectedSantri] = useState("");
  const [juz, setJuz] = useState("");
  const [level, setLevel] = useState("");
  const [kesalahan, setKesalahan] = useState("0");
  const [catatan, setCatatan] = useState("");

  // Page/Surah sync state
  const [inputMode, setInputMode] = useState<"halaman" | "surah">("halaman");
  const [halamanDari, setHalamanDari] = useState("");
  const [halamanSampai, setHalamanSampai] = useState("");
  const [surah, setSurah] = useState("");
  const [ayatDari, setAyatDari] = useState("");
  const [ayatSampai, setAyatSampai] = useState("");

  const drills: DrillDefinition[] = useMemo(
    () => (juz ? getDrillsForJuz(Number(juz)) : []),
    [juz]
  );

  const surahByJuz = useMemo(() => {
    if (!juz) return [];
    return getSurahListByJuz(Number(juz));
  }, [juz]);

  const selectedSurah = useMemo(() => {
    return surahByJuz.find((s) => String(s.number) === surah);
  }, [surah, surahByJuz]);

  const maxHalaman = juz ? getPageCountForJuz(Number(juz)) : 20;

  const pageInfo = useMemo(() => {
    if (!juz || !halamanDari) return "";
    return getPageSummaryByJuz(Number(juz), Number(halamanDari));
  }, [juz, halamanDari]);

  const nilai = Math.max(0, 100 - parseInt(kesalahan || "0"));

  // Selected drill info
  const selectedDrill = useMemo(() => {
    if (!level) return null;
    return drills.find(d => d.drillNumber === Number(level)) || null;
  }, [level, drills]);

  // Auto-fill page range when level is selected
  useEffect(() => {
    if (!selectedDrill || !juz) return;
    if (selectedDrill.type === 'page') {
      setHalamanDari(String(selectedDrill.pageStart ?? ""));
      setHalamanSampai(String(selectedDrill.pageEnd ?? ""));
      setInputMode("halaman");
      // Sync to surah/ayat
      if (selectedDrill.pageStart) {
        const startMapping = getPageMappingByJuz(Number(juz), selectedDrill.pageStart);
        if (startMapping) {
          setSurah(String(startMapping.surahNumber));
          setAyatDari(String(startMapping.startAyat));
        }
      }
      if (selectedDrill.pageEnd) {
        const endMapping = getPageMappingByJuz(Number(juz), selectedDrill.pageEnd);
        if (endMapping) {
          setAyatSampai(String(endMapping.endAyat));
        }
      }
    } else if (selectedDrill.type === 'surah' && selectedDrill.surahRanges?.length) {
      const first = selectedDrill.surahRanges[0];
      const last = selectedDrill.surahRanges[selectedDrill.surahRanges.length - 1];
      setSurah(String(first.surahNumber));
      setAyatDari(String(first.ayatStart ?? 1));
      setAyatSampai(String(last.ayatEnd ?? last.ayatStart ?? 1));
      setInputMode("surah");
      // Sync to page
      const pr = getPageRangeFromAyatRange(Number(juz), first.surahNumber, first.ayatStart ?? 1, last.ayatEnd ?? 1);
      if (pr) {
        setHalamanDari(String(pr.dari));
        setHalamanSampai(String(pr.sampai));
      }
    }
  }, [selectedDrill, juz]);

  // Reset saat modal dibuka
  useEffect(() => {
    if (open) {
      setSelectedSantri(initialSantriId || "");
      setJuz("");
      setLevel("");
      setKesalahan("0");
      setCatatan("");
      setInputMode("halaman");
      setHalamanDari("");
      setHalamanSampai("");
      setSurah("");
      setAyatDari("");
      setAyatSampai("");
    }
  }, [open, initialSantriId]);

  // Reset level kalau ganti juz
  useEffect(() => {
    setLevel("");
    setHalamanDari("");
    setHalamanSampai("");
    setSurah("");
    setAyatDari("");
    setAyatSampai("");
  }, [juz]);

  // 🔒 FUNCTION PENGUNCI LEVEL
  const isDrillUnlocked = (drillNumber: number) => {
    if (!selectedSantri || !juz) return false;
    if (drillNumber === 1) return true;
    const santri = mockSantri.find(s => s.id === selectedSantri);
    if (!santri) return false;
    const previousLevelLulus = (drillHistory ?? []).some(d =>
      d.santri === santri.nama &&
      d.juz === Number(juz) &&
      d.level === drillNumber - 1 &&
      d.status === "Lulus"
    );
    return previousLevelLulus;
  };

  const handleSave = (status: "Lulus" | "Mengulang") => {
    if (!date || !selectedSantri || !juz || !level) {
      toast.error("Lengkapi data wajib (*)");
      return;
    }

    if (!halamanDari && !surah) {
      toast.error("Pilih halaman atau surah yang disetor");
      return;
    }

    onSuccess({
      tanggal: date,
      santriId: selectedSantri,
      jenis: "drill",
      juz: Number(juz),
      level: Number(level),
      halaman: halamanDari && halamanSampai ? `${halamanDari}–${halamanSampai}` : halamanDari || undefined,
      surah: surahByJuz.find(s => String(s.number) === surah)?.name || surah || undefined,
      surahNumber: surah ? Number(surah) : undefined,
      ayatDari: ayatDari ? Number(ayatDari) : undefined,
      ayatSampai: ayatSampai ? Number(ayatSampai) : undefined,
      status,
      catatan
    });

    onOpenChange(false);
  };

  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Drill Hafalan</DialogTitle>
          <DialogDescription>
            {santriName} •{" "}
            {format(date, "EEEE, d MMMM yyyy", { locale: localeId })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">

          {/* Santri - hidden when opened from calendar */}
          {!initialSantriId && (
            <div className="space-y-2">
              <Label>Pilih Santri *</Label>
              <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih santri" />
                </SelectTrigger>
                <SelectContent>
                  {mockSantri.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nama} ({s.nis})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <JuzSelector value={juz} onValueChange={setJuz} required />

          {/* LEVEL DENGAN PENGUNCI */}
          <div className="space-y-2">
            <Label>Level Drill</Label>
            <Select value={level} onValueChange={setLevel} disabled={!juz}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih level" />
              </SelectTrigger>
              <SelectContent>
                {drills.map(d => {
                  const unlocked = isDrillUnlocked(d.drillNumber);
                  return (
                    <SelectItem
                      key={d.drillNumber}
                      value={String(d.drillNumber)}
                      disabled={!unlocked}
                    >
                      {unlocked ? (
                        <Unlock className="inline w-3 h-3 mr-1" />
                      ) : (
                        <Lock className="inline w-3 h-3 mr-1" />
                      )}
                      Level {d.drillNumber} — {formatDrillDescription(d)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Target info */}
          {selectedDrill && (
            <Card className="border-dashed border-primary/50 p-3">
              <div className="flex items-start gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-xs">Target Level {selectedDrill.drillNumber}</p>
                  <p className="text-xs text-muted-foreground">{formatDrillDescription(selectedDrill)}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Page/Surah input with sync */}
          {juz && level && (
            <>
              <div className="flex gap-2">
                <Button
                  type="button" size="sm"
                  variant={inputMode === "halaman" ? "default" : "outline"}
                  className="h-7 text-xs flex-1"
                  onClick={() => setInputMode("halaman")}
                >
                  Pilih Halaman
                </Button>
                <Button
                  type="button" size="sm"
                  variant={inputMode === "surah" ? "default" : "outline"}
                  className="h-7 text-xs flex-1"
                  onClick={() => setInputMode("surah")}
                >
                  Pilih Surah & Ayat
                </Button>
              </div>

              {inputMode === "halaman" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Halaman dari (maks {maxHalaman})</Label>
                      <Input
                        type="number" value={halamanDari} min={1} max={maxHalaman}
                        onChange={(e) => {
                          setHalamanDari(e.target.value);
                          if (e.target.value) {
                            const mapping = getPageMappingByJuz(Number(juz), Number(e.target.value));
                            if (mapping) {
                              setSurah(String(mapping.surahNumber));
                              setAyatDari(String(mapping.startAyat));
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Halaman sampai</Label>
                      <Input
                        type="number" value={halamanSampai} min={Number(halamanDari) || 1} max={maxHalaman}
                        onChange={(e) => {
                          setHalamanSampai(e.target.value);
                          if (e.target.value) {
                            const mapping = getPageMappingByJuz(Number(juz), Number(e.target.value));
                            if (mapping) {
                              setAyatSampai(String(mapping.endAyat));
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  {/* Detailed page range breakdown */}
                  {halamanDari && (
                    <PageRangeDetailInfo
                      juz={juz}
                      halamanDari={halamanDari}
                      halamanSampai={halamanSampai || halamanDari}
                    />
                  )}
                  {pageInfo && (
                    <div className="flex items-start gap-2 p-2 bg-primary/10 rounded text-xs text-foreground">
                      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                      <span>Isi halaman: <strong>{pageInfo}</strong></span>
                    </div>
                  )}
                  {/* Synced ayat info */}
                  {surah && ayatDari && (
                    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>
                        📖 Surah {surahByJuz.find(s => String(s.number) === surah)?.name || surah}, Ayat {ayatDari}
                        {ayatSampai ? `–${ayatSampai}` : ""}
                      </span>
                    </div>
                  )}
                </>
              )}

              {inputMode === "surah" && (
                <>
                  <div className="space-y-2">
                    <Label>Surah</Label>
                    <Select value={surah} onValueChange={(val) => {
                      setSurah(val);
                      setAyatDari("1"); setAyatSampai("1");
                      setHalamanDari(""); setHalamanSampai("");
                    }}>
                      <SelectTrigger><SelectValue placeholder="Pilih surah" /></SelectTrigger>
                      <SelectContent>
                        {surahByJuz.map((s) => (
                          <SelectItem key={s.number} value={String(s.number)}>
                            {s.number}. {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Show ayat limit for selected surah */}
                  {surah && juz && (
                    <SurahAyatLimitInfo
                      juz={juz}
                      surahNumber={surah}
                      surahName={selectedSurah?.name}
                    />
                  )}
                  {selectedSurah && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Ayat dari</Label>
                        <Input
                          type="number" value={ayatDari} min={1} max={selectedSurah.numberOfAyahs}
                          onChange={(e) => {
                            setAyatDari(e.target.value);
                            if (e.target.value && ayatSampai) {
                              const pr = getPageRangeFromAyatRange(Number(juz), Number(surah), Number(e.target.value), Number(ayatSampai));
                              if (pr) { setHalamanDari(String(pr.dari)); setHalamanSampai(String(pr.sampai)); }
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Ayat sampai</Label>
                        <Input
                          type="number" value={ayatSampai} min={Number(ayatDari)} max={selectedSurah.numberOfAyahs}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= Number(ayatDari)) {
                              setAyatSampai(e.target.value);
                              const pr = getPageRangeFromAyatRange(Number(juz), Number(surah), Number(ayatDari), val);
                              if (pr) { setHalamanDari(String(pr.dari)); setHalamanSampai(String(pr.sampai)); }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {/* Synced page info */}
                  {halamanDari && (
                    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>📖 Halaman {halamanDari}{halamanSampai && halamanSampai !== halamanDari ? `–${halamanSampai}` : ""} (dalam juz)</span>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Penilaian */}
          <div className="pt-4 border-t space-y-4">
            <div className="space-y-2">
              <Label>Jumlah Kesalahan *</Label>
              <Input
                type="number"
                value={kesalahan}
                onChange={(e) => setKesalahan(e.target.value)}
              />
            </div>

            <div className="flex justify-between p-3 bg-muted rounded-lg items-center">
              <Label>Nilai Kelancaran</Label>
              <span className={cn(
                "text-xl font-bold",
                nilai >= BATAS_LULUS_DRILL
                  ? "text-green-600"
                  : "text-destructive"
              )}>
                {nilai}
              </span>
            </div>

            <Card className={cn(
              "p-3 border-2",
              nilai >= BATAS_LULUS_DRILL
                ? "border-green-500 bg-green-50"
                : "border-destructive bg-destructive/10"
            )}>
              <div className="flex gap-3 items-center text-sm">
                {nilai >= BATAS_LULUS_DRILL ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}
                <span>
                  Batas lulus: {BATAS_LULUS_DRILL} | Maks kesalahan: {BATAS_KESALAHAN_DRILL}
                </span>
              </div>
            </Card>

            <div className="space-y-2">
              <Label>Catatan Tajwid</Label>
              <Textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
              />
            </div>
          </div>

          {/* Action */}
          <div className="grid grid-cols-3 gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => handleSave("Mengulang")}
            >
              <Save className="w-4 h-4 mr-1" />
              Simpan
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700"
              disabled={nilai < BATAS_LULUS_DRILL}
              onClick={() => handleSave("Lulus")}
            >
              <Trophy className="w-4 h-4 mr-1" />
              Lulus
            </Button>

            <Button
              variant="destructive"
              onClick={() => onOpenChange(false)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Batal
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
