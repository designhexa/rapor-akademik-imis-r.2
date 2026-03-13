import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import {
  Plus, Download, Target, Search, CalendarIcon, Unlock, Lock,
  Save, Trophy, RotateCcw, CheckCircle, AlertCircle, X, Edit3, BookOpen, Info
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { JuzSelector } from "@/components/JuzSelector";
import { useSetoranPersistence } from "@/hooks/use-setoran-persistence";
import { MOCK_SANTRI, MOCK_HALAQOH, getSantriByNama } from "@/lib/mock-data";
import {
  getDrillsForJuz,
  DrillDefinition,
  isPageBasedDrill,
  formatDrillDescription,
} from "@/lib/drill-data";
import {
  getPageMappingByJuz,
  getPageRangeFromAyatRange,
  getPageSummaryByJuz,
  getPageCountForJuz,
  getSurahListByJuz,
} from "@/lib/mushaf-madinah";

const BATAS_LULUS_DRILL = 88;
const BATAS_KESALAHAN_DRILL = 12;

// Drill Level Indicator - square boxes like Progress Tasmi'
const DrillLevelIndicator = ({ juz, currentLevel }: { juz: number; currentLevel: number }) => {
  const totalLevels = getDrillsForJuz(juz).length || 7;
  return (
    <div className="grid grid-cols-4 gap-0.5 w-fit">
      {Array.from({ length: totalLevels }, (_, i) => {
        const level = i + 1;
        const isCurrent = level === currentLevel;
        return (
          <div
            key={level}
            className={cn(
              "w-4 h-4 md:w-6 md:h-6 rounded-sm flex items-center justify-center text-[8px] md:text-[10px] font-semibold border",
              isCurrent
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border"
            )}
            title={`Level ${level}`}
          >
            {level}
          </div>
        );
      })}
    </div>
  );
};

const mockDrillList = [
  { id: 1, tanggal: "15/01/2025", santri: "Muhammad Faiz", juz: 30, level: 1, materi: "Drill 1 - An-Naba", nilai: 92, status: "Lulus" },
  { id: 2, tanggal: "14/01/2025", santri: "Aisyah Nur", juz: 30, level: 1, materi: "Drill 1 - An-Naba", nilai: 88, status: "Lulus" },
  { id: 3, tanggal: "13/01/2025", santri: "Fatimah Zahra", juz: 29, level: 2, materi: "Drill 2 - Hal 11-20", nilai: 75, status: "Mengulang" },
  { id: 4, tanggal: "12/01/2025", santri: "Muhammad Faiz", juz: 30, level: 2, materi: "Drill 2 - An-Nazi'at", nilai: 95, status: "Lulus" },
];

const DrillHafalan = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterJuz, setFilterJuz] = useState("all");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");

  const { entries, addEntries } = useSetoranPersistence();

  // Dialog state
  const [isDrillDialogOpen, setIsDrillDialogOpen] = useState(false);

  // Drill form state
  const [drillFormHalaqohFilter, setDrillFormHalaqohFilter] = useState("");
  const [drillSelectedSantri, setDrillSelectedSantri] = useState("");
  const [tanggalDrill, setTanggalDrill] = useState<Date>();
  const [drillJuz, setDrillJuz] = useState("");
  const [drillLevelSelected, setDrillLevelSelected] = useState("");
  const drills: DrillDefinition[] = useMemo(() => {
    if (!drillJuz) return [];
    return getDrillsForJuz(Number(drillJuz));
  }, [drillJuz]);
  const [drillJumlahKesalahan, setDrillJumlahKesalahan] = useState("0");
  const [catatanTajwid, setCatatanTajwid] = useState("");

  // Page/Surah sync state for drill form
  const [drillInputMode, setDrillInputMode] = useState<"halaman" | "surah">("halaman");
  const [drillHalamanDari, setDrillHalamanDari] = useState("");
  const [drillHalamanSampai, setDrillHalamanSampai] = useState("");
  const [drillSurah, setDrillSurah] = useState("");
  const [drillAyatDari, setDrillAyatDari] = useState("");
  const [drillAyatSampai, setDrillAyatSampai] = useState("");

  const drillSurahByJuz = useMemo(() => {
    if (!drillJuz) return [];
    return getSurahListByJuz(Number(drillJuz));
  }, [drillJuz]);

  const drillSelectedSurahObj = useMemo(() => {
    return drillSurahByJuz.find((s) => String(s.number) === drillSurah);
  }, [drillSurah, drillSurahByJuz]);

  const drillMaxHalaman = drillJuz ? getPageCountForJuz(Number(drillJuz)) : 20;

  const drillPageInfo = useMemo(() => {
    if (!drillJuz || !drillHalamanDari) return "";
    return getPageSummaryByJuz(Number(drillJuz), Number(drillHalamanDari));
  }, [drillJuz, drillHalamanDari]);

  // Manual drill input state
  const [useManualInput, setUseManualInput] = useState(false);
  const [manualPages, setManualPages] = useState<{ id: string; page: number }[]>([]);
  const [manualSurahs, setManualSurahs] = useState<{
    id: string;
    surahNumber: number;
    surahName: string;
    ayatStart: number;
    ayatEnd: number;
    fullSurah: boolean;
  }[]>([]);

  const drillNilaiKelancaran = Math.max(0, 100 - parseInt(drillJumlahKesalahan || "0"));

  const isManualInputComplete = useMemo(() => {
    if (!useManualInput) return true;
    if (!drillLevelSelected || !drillJuz) return false;
    const selectedDrill = drills.find(d => d.drillNumber === Number(drillLevelSelected));
    if (!selectedDrill) return false;
    if (selectedDrill.type === 'page') {
      const requiredPagesCount = (selectedDrill.pageEnd ?? 0) - (selectedDrill.pageStart ?? 0) + 1;
      const inputPagesSet = new Set(manualPages.map(p => p.page));
      const allRequiredPages = Array.from({ length: requiredPagesCount }, (_, i) => (selectedDrill.pageStart ?? 0) + i);
      return allRequiredPages.every(page => inputPagesSet.has(page));
    }
    if (selectedDrill.type === 'surah' && selectedDrill.surahRanges) {
      for (const requiredSurah of selectedDrill.surahRanges) {
        const inputSurah = manualSurahs.find(s => s.surahNumber === requiredSurah.surahNumber);
        if (!inputSurah) return false;
        if (requiredSurah.fullSurah) {
          if (!inputSurah.fullSurah) return false;
        } else {
          const reqStart = requiredSurah.ayatStart ?? 1;
          const reqEnd = requiredSurah.ayatEnd ?? 1;
          if (inputSurah.ayatStart > reqStart || inputSurah.ayatEnd < reqEnd) return false;
        }
      }
      return true;
    }
    return false;
  }, [useManualInput, drillLevelSelected, drillJuz, drills, manualPages, manualSurahs]);

  const filteredSantriForDrillForm = useMemo(() => {
    if (!drillFormHalaqohFilter) return MOCK_SANTRI;
    return MOCK_SANTRI.filter(s => s.idHalaqoh === drillFormHalaqohFilter);
  }, [drillFormHalaqohFilter]);

  const isDrillUnlocked = (santriId: string, drillNumber: number, juzNum: number) => {
    return drillNumber === 1;
  };

  const resetDrillForm = () => {
    setDrillFormHalaqohFilter("");
    setDrillSelectedSantri("");
    setTanggalDrill(undefined);
    setDrillJuz("");
    setDrillLevelSelected("");
    setDrillJumlahKesalahan("0");
    setCatatanTajwid("");
    setUseManualInput(false);
    setManualPages([]);
    setManualSurahs([]);
    setDrillInputMode("halaman");
    setDrillHalamanDari("");
    setDrillHalamanSampai("");
    setDrillSurah("");
    setDrillAyatDari("");
    setDrillAyatSampai("");
  };

  const handleAddManualPage = () => {
    const selectedDrill = drills.find(d => d.drillNumber === Number(drillLevelSelected));
    const defaultPage = selectedDrill?.pageStart ?? 1;
    setManualPages(prev => [...prev, { id: crypto.randomUUID(), page: defaultPage }]);
  };

  const handleUpdateManualPage = (id: string, value: number) => {
    setManualPages(prev => prev.map(p => p.id === id ? { ...p, page: value } : p));
  };

  const handleRemoveManualPage = (id: string) => {
    setManualPages(prev => prev.filter(p => p.id !== id));
  };

  const handleAddManualSurah = () => {
    const selectedDrill = drills.find(d => d.drillNumber === Number(drillLevelSelected));
    const defaultSurah = selectedDrill?.surahRanges?.[0];
    if (defaultSurah) {
      setManualSurahs(prev => [...prev, {
        id: crypto.randomUUID(),
        surahNumber: defaultSurah.surahNumber,
        surahName: defaultSurah.surahName,
        ayatStart: defaultSurah.ayatStart ?? 1,
        ayatEnd: defaultSurah.ayatEnd ?? 1,
        fullSurah: defaultSurah.fullSurah ?? false
      }]);
    }
  };

  const handleUpdateManualSurah = (id: string, updates: Partial<typeof manualSurahs[0]>) => {
    setManualSurahs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleRemoveManualSurah = (id: string) => {
    setManualSurahs(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveDrill = (status: "Lulus" | "Mengulang") => {
    if (!tanggalDrill || !drillSelectedSantri || !drillJuz) {
      toast.error("Silakan lengkapi data drill terlebih dahulu");
      return;
    }
    
    addEntries({
      tanggal: tanggalDrill,
      santriId: drillSelectedSantri,
      jenis: "drill",
      juz: Number(drillJuz),
      halaman: drillHalamanDari && drillHalamanSampai ? `${drillHalamanDari}–${drillHalamanSampai}` : drillHalamanDari || undefined,
      surah: drillSurahByJuz.find(s => String(s.number) === drillSurah)?.name || drillSurah || undefined,
      surahNumber: drillSurah ? Number(drillSurah) : undefined,
      ayatDari: drillAyatDari ? Number(drillAyatDari) : undefined,
      ayatSampai: drillAyatSampai ? Number(drillAyatSampai) : undefined,
      status: status,
      catatan: catatanTajwid
    });

    toast.success("Drill berhasil disimpan ke kalender!");
    setIsDrillDialogOpen(false);
    resetDrillForm();
  };

  const handleLulusDrill = () => {
    if (drillNilaiKelancaran >= BATAS_LULUS_DRILL) {
      handleSaveDrill("Lulus");
    }
  };

  const handleUlangiDrill = () => {
    handleSaveDrill("Mengulang");
  };

  const handleExport = () => {
    toast.success("Data drill berhasil diexport!");
  };

  const displayDrillList = useMemo(() => {
    const persistedDrills = entries
      .filter(e => e.jenis === "drill")
      .map((e, idx) => ({
        id: `p-${idx}`,
        tanggal: format(e.tanggal, "dd/MM/yyyy"),
        santri: MOCK_SANTRI.find(s => s.id === e.santriId)?.nama || "Unknown",
        juz: e.juz || 0,
        level: e.level || 0,
        materi: e.surah ? `${e.surah} (Ayat ${e.ayat})` : `Halaman ${e.halaman}`,
        nilai: e.nilai || 0,
        status: e.status || "Lulus"
      }));

    return [...persistedDrills, ...mockDrillList];
  }, [entries]);

  const filteredDrill = displayDrillList.filter((item) => {
    const matchSearch = item.santri.toLowerCase().includes(search.toLowerCase());
    const matchJuz = filterJuz === "all" || item.juz === Number(filterJuz);
    return matchSearch && matchJuz;
  });

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-foreground">Drill Hafalan</h1>
            <p className="text-xs md:text-base text-muted-foreground">
              Kelola latihan drill hafalan intensif santri
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Export</span>
            </Button>

            <Dialog open={isDrillDialogOpen} onOpenChange={setIsDrillDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 md:mr-2" />
                  <span className="hidden sm:inline">Tambah Drill</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Drill Hafalan</DialogTitle>
                  <DialogDescription>
                    Masukkan penilaian drill hafalan untuk santri
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Filter Halaqoh */}
                  <div className="space-y-2">
                    <Label>Filter Halaqoh</Label>
                    <Select
                      value={drillFormHalaqohFilter || "all"}
                      onValueChange={(v) => setDrillFormHalaqohFilter(v === "all" ? "" : v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Semua Halaqoh" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Halaqoh</SelectItem>
                        {MOCK_HALAQOH.map((h) => (
                          <SelectItem key={h.id} value={h.id}>{h.nama}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Santri */}
                  <div className="space-y-2">
                    <Label>Pilih Santri *</Label>
                    <Select value={drillSelectedSantri} onValueChange={setDrillSelectedSantri}>
                      <SelectTrigger><SelectValue placeholder="Pilih santri" /></SelectTrigger>
                      <SelectContent>
                        {filteredSantriForDrillForm.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.nama} ({s.nis})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tanggal */}
                  <div className="space-y-2">
                    <Label>Tanggal Drill *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !tanggalDrill && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {tanggalDrill ? format(tanggalDrill, "dd/MM/yyyy") : "Pilih tanggal"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={tanggalDrill} onSelect={setTanggalDrill} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <JuzSelector value={drillJuz} onValueChange={setDrillJuz} required />

                  {/* Level Drill */}
                  <div className="space-y-2">
                    <Label>Level Drill</Label>
                    <Select value={drillLevelSelected} onValueChange={setDrillLevelSelected} disabled={!drillJuz}>
                      <SelectTrigger><SelectValue placeholder="Pilih level drill" /></SelectTrigger>
                      <SelectContent>
                        {drills.map(drill => {
                          const unlocked = isDrillUnlocked(drillSelectedSantri, drill.drillNumber, Number(drillJuz));
                          return (
                            <SelectItem key={drill.drillNumber} value={String(drill.drillNumber)} disabled={!unlocked}>
                              {unlocked ? <Unlock className="inline w-3 h-3 mr-1" /> : <Lock className="inline w-3 h-3 mr-1" />}
                              Level {drill.drillNumber} — {formatDrillDescription(drill)}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Page/Surah sync input */}
                  {drillJuz && drillLevelSelected && (
                    <>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" variant={drillInputMode === "halaman" ? "default" : "outline"} className="h-7 text-xs flex-1" onClick={() => setDrillInputMode("halaman")}>
                          Pilih Halaman
                        </Button>
                        <Button type="button" size="sm" variant={drillInputMode === "surah" ? "default" : "outline"} className="h-7 text-xs flex-1" onClick={() => setDrillInputMode("surah")}>
                          Pilih Surah & Ayat
                        </Button>
                      </div>

                      {drillInputMode === "halaman" && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Halaman dari (maks {drillMaxHalaman})</Label>
                              <Input type="number" value={drillHalamanDari} min={1} max={drillMaxHalaman}
                                onChange={(e) => {
                                  setDrillHalamanDari(e.target.value);
                                  if (e.target.value) {
                                    const mapping = getPageMappingByJuz(Number(drillJuz), Number(e.target.value));
                                    if (mapping) { setDrillSurah(String(mapping.surahNumber)); setDrillAyatDari(String(mapping.startAyat)); }
                                  }
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Halaman sampai</Label>
                              <Input type="number" value={drillHalamanSampai} min={Number(drillHalamanDari) || 1} max={drillMaxHalaman}
                                onChange={(e) => {
                                  setDrillHalamanSampai(e.target.value);
                                  if (e.target.value) {
                                    const mapping = getPageMappingByJuz(Number(drillJuz), Number(e.target.value));
                                    if (mapping) { setDrillAyatSampai(String(mapping.endAyat)); }
                                  }
                                }}
                              />
                            </div>
                          </div>
                          {drillPageInfo && (
                            <div className="flex items-start gap-2 p-2 bg-primary/10 rounded text-xs text-foreground">
                              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                              <span>Isi halaman: <strong>{drillPageInfo}</strong></span>
                            </div>
                          )}
                          {drillSurah && drillAyatDari && (
                            <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <span>📖 Surah {drillSurahByJuz.find(s => String(s.number) === drillSurah)?.name || drillSurah}, Ayat {drillAyatDari}{drillAyatSampai ? `–${drillAyatSampai}` : ""}</span>
                            </div>
                          )}
                        </>
                      )}

                      {drillInputMode === "surah" && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-xs">Surah</Label>
                            <Select value={drillSurah} onValueChange={(val) => { setDrillSurah(val); setDrillAyatDari("1"); setDrillAyatSampai("1"); setDrillHalamanDari(""); setDrillHalamanSampai(""); }}>
                              <SelectTrigger className="h-9"><SelectValue placeholder="Pilih surah" /></SelectTrigger>
                              <SelectContent>
                                {drillSurahByJuz.map((s) => (
                                  <SelectItem key={s.number} value={String(s.number)}>{s.number}. {s.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {drillSelectedSurahObj && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Ayat dari</Label>
                                <Input type="number" value={drillAyatDari} min={1} max={drillSelectedSurahObj.numberOfAyahs}
                                  onChange={(e) => {
                                    setDrillAyatDari(e.target.value);
                                    if (e.target.value && drillAyatSampai) {
                                      const pr = getPageRangeFromAyatRange(Number(drillJuz), Number(drillSurah), Number(e.target.value), Number(drillAyatSampai));
                                      if (pr) { setDrillHalamanDari(String(pr.dari)); setDrillHalamanSampai(String(pr.sampai)); }
                                    }
                                  }}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Ayat sampai</Label>
                                <Input type="number" value={drillAyatSampai} min={Number(drillAyatDari)} max={drillSelectedSurahObj.numberOfAyahs}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (val >= Number(drillAyatDari)) {
                                      setDrillAyatSampai(e.target.value);
                                      const pr = getPageRangeFromAyatRange(Number(drillJuz), Number(drillSurah), Number(drillAyatDari), val);
                                      if (pr) { setDrillHalamanDari(String(pr.dari)); setDrillHalamanSampai(String(pr.sampai)); }
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {drillHalamanDari && (
                            <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <span>📖 Halaman {drillHalamanDari}{drillHalamanSampai && drillHalamanSampai !== drillHalamanDari ? `–${drillHalamanSampai}` : ""} (dalam juz)</span>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* Info Drill */}
                  {drillLevelSelected && drillJuz && (() => {
                    const selectedDrill = drills.find(d => d.drillNumber === Number(drillLevelSelected));
                    if (!selectedDrill) return null;

                    if (selectedDrill.type === 'page') {
                      return (
                        <>
                          <Card className="border-dashed border-primary/50">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="font-medium">Target Drill: Halaman</p>
                                  <p className="text-sm text-muted-foreground">
                                    Halaman {selectedDrill.pageStart} – {selectedDrill.pageEnd}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                            <div className="flex items-center gap-2">
                              <Edit3 className="w-4 h-4 text-muted-foreground" />
                              <Label htmlFor="manual-input" className="text-sm cursor-pointer">Input Manual</Label>
                            </div>
                            <Switch id="manual-input" checked={useManualInput} onCheckedChange={(checked) => { setUseManualInput(checked); if (!checked) setManualPages([]); }} />
                          </div>

                          {useManualInput && (
                            <Card className="border-dashed border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-sm flex items-center gap-2"><Edit3 className="w-4 h-4" />Input Halaman Manual</CardTitle>
                                  <Button size="sm" variant="outline" onClick={handleAddManualPage} className="h-7"><Plus className="w-3 h-3 mr-1" />Tambah</Button>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {manualPages.length === 0 ? (
                                  <p className="text-sm text-muted-foreground text-center py-2">Klik "Tambah" untuk menambahkan halaman</p>
                                ) : (
                                  manualPages.map((mp, index) => (
                                    <div key={mp.id} className="flex items-center gap-2">
                                      <span className="text-xs text-muted-foreground w-6">{index + 1}.</span>
                                      <Input type="number" value={mp.page} min={selectedDrill.pageStart} max={selectedDrill.pageEnd} onChange={(e) => handleUpdateManualPage(mp.id, Number(e.target.value))} className="h-9 flex-1" />
                                      <Button size="icon" variant="ghost" onClick={() => handleRemoveManualPage(mp.id)} className="h-9 w-9 text-destructive hover:text-destructive"><X className="w-4 h-4" /></Button>
                                    </div>
                                  ))
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </>
                      );
                    }

                    if (selectedDrill.type === 'surah' && selectedDrill.surahRanges) {
                      return (
                        <>
                          <Card className="border-dashed border-primary/50">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Target className="w-5 h-5 text-primary mt-0.5" />
                                <div className="space-y-1">
                                  <p className="font-medium">Target Drill: Surat</p>
                                  <div className="text-sm text-muted-foreground space-y-0.5">
                                    {selectedDrill.surahRanges.map((s, i) => (
                                      <p key={i}>• {s.surahName}{s.fullSurah ? " (1 surat penuh)" : ` ayat ${s.ayatStart}–${s.ayatEnd}`}</p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                            <div className="flex items-center gap-2">
                              <Edit3 className="w-4 h-4 text-muted-foreground" />
                              <Label htmlFor="manual-input-surah" className="text-sm cursor-pointer">Input Manual</Label>
                            </div>
                            <Switch id="manual-input-surah" checked={useManualInput} onCheckedChange={(checked) => { setUseManualInput(checked); if (!checked) setManualSurahs([]); }} />
                          </div>

                          {useManualInput && (
                            <Card className="border-dashed border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-sm flex items-center gap-2"><Edit3 className="w-4 h-4" />Input Surat Manual</CardTitle>
                                  <Button size="sm" variant="outline" onClick={handleAddManualSurah} className="h-7"><Plus className="w-3 h-3 mr-1" />Tambah</Button>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                {manualSurahs.length === 0 ? (
                                  <p className="text-sm text-muted-foreground text-center py-2">Klik "Tambah" untuk menambahkan surat</p>
                                ) : (
                                  manualSurahs.map((ms, index) => (
                                    <div key={ms.id} className="p-3 border rounded-lg bg-background space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-muted-foreground">Surat {index + 1}</span>
                                        <Button size="icon" variant="ghost" onClick={() => handleRemoveManualSurah(ms.id)} className="h-7 w-7 text-destructive hover:text-destructive"><X className="w-3 h-3" /></Button>
                                      </div>
                                      <Select value={String(ms.surahNumber)} onValueChange={(v) => {
                                        const surah = selectedDrill.surahRanges?.find(s => s.surahNumber === Number(v));
                                        if (surah) handleUpdateManualSurah(ms.id, { surahNumber: surah.surahNumber, surahName: surah.surahName, fullSurah: surah.fullSurah ?? false, ayatStart: surah.ayatStart ?? 1, ayatEnd: surah.ayatEnd ?? 1 });
                                      }}>
                                        <SelectTrigger className="h-9"><SelectValue placeholder="Pilih Surat" /></SelectTrigger>
                                        <SelectContent>
                                          {selectedDrill.surahRanges?.map((surah) => (
                                            <SelectItem key={surah.surahNumber} value={String(surah.surahNumber)}>{surah.surahName}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <div className="flex items-center gap-2">
                                        <Switch id={`fullSurah-${ms.id}`} checked={ms.fullSurah} onCheckedChange={(checked) => handleUpdateManualSurah(ms.id, { fullSurah: checked })} />
                                        <Label htmlFor={`fullSurah-${ms.id}`} className="text-xs">Surat penuh</Label>
                                      </div>
                                      {!ms.fullSurah && (
                                        <div className="flex items-center gap-2">
                                          <div className="flex-1">
                                            <Label className="text-xs text-muted-foreground">Ayat mulai</Label>
                                            <Input type="number" value={ms.ayatStart} min={1} onChange={(e) => handleUpdateManualSurah(ms.id, { ayatStart: Number(e.target.value) })} className="h-8" />
                                          </div>
                                          <span className="text-muted-foreground mt-5">–</span>
                                          <div className="flex-1">
                                            <Label className="text-xs text-muted-foreground">Ayat akhir</Label>
                                            <Input type="number" value={ms.ayatEnd} min={ms.ayatStart} onChange={(e) => handleUpdateManualSurah(ms.id, { ayatEnd: Number(e.target.value) })} className="h-8" />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </>
                      );
                    }
                    return null;
                  })()}

                  {/* Penilaian */}
                  <div className="pt-4 border-t space-y-4">
                    <h4 className="font-semibold">Penilaian</h4>
                    <div className="space-y-2">
                      <Label>Jumlah Kesalahan *</Label>
                      <Input type="number" value={drillJumlahKesalahan} min={0} onChange={(e) => setDrillJumlahKesalahan(e.target.value)} />
                    </div>
                    <div className="flex justify-between p-3 bg-muted rounded-lg">
                      <Label>Nilai Kelancaran</Label>
                      <span className={cn("text-xl font-bold", drillNilaiKelancaran >= BATAS_LULUS_DRILL ? "text-green-600" : "text-destructive")}>{drillNilaiKelancaran}</span>
                    </div>
                    <Card className={cn("p-3 border-2", drillNilaiKelancaran >= BATAS_LULUS_DRILL ? "border-green-500 bg-green-50" : "border-destructive bg-destructive/10")}>
                      <div className="flex gap-3">
                        {drillNilaiKelancaran >= BATAS_LULUS_DRILL ? <CheckCircle className="text-green-600" /> : <AlertCircle className="text-destructive" />}
                        <div className="text-sm">Batas lulus: {BATAS_LULUS_DRILL} | Maks kesalahan: {BATAS_KESALAHAN_DRILL}</div>
                      </div>
                    </Card>
                    <div className="space-y-2">
                      <Label>Catatan Tajwid</Label>
                      <Textarea value={catatanTajwid} onChange={(e) => setCatatanTajwid(e.target.value)} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-4">
                    <Button variant="outline" onClick={() => handleSaveDrill("Mengulang")}><Save className="w-4 h-4 mr-1" /> Simpan</Button>
                    <Button className="bg-green-600 hover:bg-green-700 disabled:opacity-50" disabled={drillNilaiKelancaran < BATAS_LULUS_DRILL || !isManualInputComplete} onClick={handleLulusDrill}><Trophy className="w-4 h-4 mr-1" /> Lulus</Button>
                    <Button variant="destructive" onClick={handleUlangiDrill}><RotateCcw className="w-4 h-4 mr-1" /> Ulangi</Button>
                  </div>

                  {useManualInput && !isManualInputComplete && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                      ⚠️ Input manual belum lengkap. Lengkapi semua target drill untuk bisa lulus.
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">{mockDrillList.length}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">Total Drill</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">{mockDrillList.filter(d => d.status === "Lulus").length}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">Lulus</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4 md:w-5 md:h-5 text-destructive" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">{mockDrillList.filter(d => d.status === "Mengulang").length}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">Mengulang</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-3 md:pt-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              <div className="relative col-span-2 md:col-span-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Cari santri..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-9 md:h-10 text-sm" />
              </div>
              <Select value={filterJuz} onValueChange={setFilterJuz}>
                <SelectTrigger className="h-9 md:h-10 text-sm">
                  <SelectValue placeholder="Semua Juz" />
                </SelectTrigger>

                <SelectContent className="w-[260px] p-2">
                  <div className="grid grid-cols-6 gap-1">

                    {Array.from({ length: 30 }, (_, i) => (
                      <SelectItem
                        key={i + 1}
                        value={String(i + 1)}
                        className="justify-center text-center"
                      >
                        {i + 1}
                      </SelectItem>
                    ))}
                    
                    <SelectItem value="all" className="justify-center text-center">
                      Semua Juz
                    </SelectItem>

                  </div>
                </SelectContent>
              </Select>
              <Select value={filterHalaqoh} onValueChange={setFilterHalaqoh}>
                <SelectTrigger className="h-9 md:h-10 text-sm"><SelectValue placeholder="Halaqoh" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Halaqoh</SelectItem>
                  {MOCK_HALAQOH.map(h => (
                    <SelectItem key={h.id} value={h.id}>{h.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Riwayat Drill</CardTitle>
            <CardDescription className="text-xs md:text-sm">Daftar semua drill hafalan santri</CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs md:text-sm hidden md:table-cell">Tanggal</TableHead>
                    <TableHead className="text-xs md:text-sm">Santri</TableHead>
                    <TableHead className="text-xs md:text-sm">Juz</TableHead>
                    <TableHead className="text-xs md:text-sm">Level</TableHead>
                    <TableHead className="text-xs md:text-sm hidden md:table-cell">Materi</TableHead>
                    <TableHead className="text-xs md:text-sm hidden sm:table-cell">Nilai</TableHead>
                    <TableHead className="text-xs md:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrill.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8 text-sm">
                        Belum ada data drill
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrill.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs md:text-sm hidden md:table-cell">{item.tanggal}</TableCell>
                        <TableCell
                          className="font-medium text-primary text-xs md:text-sm max-w-[80px] md:max-w-none truncate cursor-pointer hover:underline"
                          onClick={() => {
                            const s = getSantriByNama(item.santri);
                            if (s) navigate(`/santri/${s.id}`);
                          }}
                        >{item.santri}</TableCell>
                        <TableCell>
                          <Badge className="bg-primary/10 text-primary border-primary text-[10px] md:text-xs">{item.juz}</Badge>
                        </TableCell>
                        <TableCell className="p-2 md:p-4">
                          <DrillLevelIndicator juz={item.juz} currentLevel={item.level} />
                        </TableCell>
                        <TableCell className="text-xs md:text-sm hidden md:table-cell">{item.materi}</TableCell>
                        <TableCell className="font-semibold text-primary text-xs md:text-sm hidden sm:table-cell">{item.nilai}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[10px] md:text-xs",
                            item.status === "Lulus" ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                          )}>{item.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DrillHafalan;
