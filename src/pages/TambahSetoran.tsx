import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, User, RotateCcw, Info } from "lucide-react";
import { toast } from "sonner";
import { JuzSelector } from "@/components/JuzSelector";
import { getSurahsByJuz, Surah } from "@/lib/quran-data";
import { SetoranCalendar } from "@/components/setoran/SetoranCalendar";
import { format } from "date-fns";
import {
  getPageSummaryByJuz,
  getPageCountForJuz,
  checkDuplicateSetoran,
  type SetoranRecord,
} from "@/lib/mushaf-madinah";

/* ================= MOCK DATA ================= */

const mockSantri = [
  { id: "1", nama: "Muhammad Faiz", nis: "S001", halaqoh: "Halaqoh Al-Azhary", halaqohId: "h1" },
  { id: "2", nama: "Fatimah Zahra", nis: "S003", halaqoh: "Halaqoh Al-Furqon", halaqohId: "h2" },
  { id: "3", nama: "Aisyah Nur", nis: "S002", halaqoh: "Halaqoh Al-Azhary", halaqohId: "h1" },
];

const mockHalaqoh = [
  { id: "h1", nama_halaqoh: "Halaqoh Al-Azhary" },
  { id: "h2", nama_halaqoh: "Halaqoh Al-Furqon" },
];

const getTanggalHMinus2 = () => {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  return d;
};

const mockSetoranRecords = [
  {
    tanggal: getTanggalHMinus2(),
    santriId: "1",
    jenis: "setoran_baru" as const,
    status: "selesai" as const,
  },
];

// Mock existing setoran for anti-duplication
const mockExistingSetoran: SetoranRecord[] = [];

const BATAS_LANCAR_SETORAN = 80;

function tentukanStatusSetoran(nilai: number): "Lancar" | "Kurang" {
  return nilai >= BATAS_LANCAR_SETORAN ? "Lancar" : "Kurang";
}

const TAB_DESCRIPTIONS: Record<string, string> = {
  setoran_baru: "Hafalan baru yang belum pernah disetorkan sebelumnya",
  murojaah: "Mengulang hafalan yang sudah pernah disetorkan",
  tilawah: "Membaca Al-Quran dengan tartil di hadapan ustadz",
  tilawah_rumah: "Laporan tilawah yang dilakukan di rumah",
};

/* ================= COMPONENT ================= */

const TambahSetoran = () => {
  const [halaqohFilter, setHalaqohFilter] = useState("");
  const [selectedSantri, setSelectedSantri] = useState("");
  const [tanggalSetoran, setTanggalSetoran] = useState<Date>();

  const [resetMode, setResetMode] = useState(false);
  const [activeTab, setActiveTab] = useState("setoran_baru");
  const [juz, setJuz] = useState("");
  const [surah, setSurah] = useState("");
  const [ayatDari, setAyatDari] = useState("1");
  const [ayatSampai, setAyatSampai] = useState("7");
  const [jumlahKesalahan, setJumlahKesalahan] = useState("0");
  const [catatanTajwid, setCatatanTajwid] = useState("");
  const [inputMode, setInputMode] = useState<"halaman" | "surah">("surah");
  const [halamanDari, setHalamanDari] = useState("");
  const [halamanSampai, setHalamanSampai] = useState("");

  const filteredSantri = useMemo(() => {
    if (!halaqohFilter) return mockSantri;
    return mockSantri.filter(s => s.halaqohId === halaqohFilter);
  }, [halaqohFilter]);

  const selectedSantriData = mockSantri.find(s => s.id === selectedSantri);

  const surahByJuz: Surah[] = useMemo(() => {
    if (!juz) return [];
    return getSurahsByJuz(Number(juz));
  }, [juz]);

  const selectedSurah = useMemo(() => {
    return surahByJuz.find(s => s.number === Number(surah));
  }, [surah, surahByJuz]);

  const nilaiKelancaran = Math.max(0, 100 - parseInt(jumlahKesalahan || "0"));
  const selisihNilai = Math.max(0, BATAS_LANCAR_SETORAN - nilaiKelancaran);
  const maxHalaman = juz ? getPageCountForJuz(Number(juz)) : 20;

  const pageInfo = useMemo(() => {
    if (!juz || !halamanDari || inputMode !== "halaman") return "";
    return getPageSummaryByJuz(Number(juz), Number(halamanDari));
  }, [juz, halamanDari, inputMode]);

  const isFormEnabled = selectedSantri && tanggalSetoran;

  const handleSubmit = () => {
    if (!selectedSantri || !tanggalSetoran || !juz) {
      toast.error("Lengkapi data terlebih dahulu");
      return;
    }

    // Anti-duplication check for surah mode
    if (inputMode === "surah" && surah) {
      const overlap = checkDuplicateSetoran(
        {
          surahNumber: Number(surah),
          ayatDari: Number(ayatDari),
          ayatSampai: Number(ayatSampai),
        },
        mockExistingSetoran,
        selectedSantri,
        activeTab
      );

      if (overlap) {
        toast.error(
          `Rentang ayat ini sudah pernah disetor (${overlap.ayatDari}–${overlap.ayatSampai}). Hapus dulu jika ingin input ulang.`
        );
        return;
      }
    }

    const nilai = nilaiKelancaran;
    const status = tentukanStatusSetoran(nilai);

    const dataBaru = {
      santriId: selectedSantri,
      tanggal: tanggalSetoran,
      jenis: activeTab,
      juz,
      surah: inputMode === "surah" ? surah : undefined,
      halaman: inputMode === "halaman" ? `${halamanDari}–${halamanSampai}` : undefined,
      ayatDari: inputMode === "surah" ? ayatDari : undefined,
      ayatSampai: inputMode === "surah" ? ayatSampai : undefined,
      nilai,
      status,
      catatanTajwid,
      pageInfo: pageInfo || undefined,
    };

    console.log("SETORAN BARU:", dataBaru);

    toast.success(
      status === "Lancar"
        ? "✅ Setoran lancar"
        : `⚠️ Setoran kurang ${selisihNilai} poin`
    );

    // Reset form (keep santri selection)
    setTanggalSetoran(undefined);
    setJuz("");
    setSurah("");
    setAyatDari("1");
    setAyatSampai("7");
    setJumlahKesalahan("0");
    setCatatanTajwid("");
    setHalamanDari("");
    setHalamanSampai("");
    setInputMode("surah");
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (resetMode) return;
    setTanggalSetoran(date);
  };

  const handleResetCalendar = (checked: boolean) => {
    setResetMode(checked);
    if (checked) {
      setTanggalSetoran(new Date());
      toast.info("Mode reset aktif. Tanggal otomatis hari ini.");
    } else {
      toast.info("Mode reset dinonaktifkan.");
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "setoran_baru": return "Setoran Baru";
      case "murojaah": return "Murojaah";
      case "tilawah": return "Tilawah";
      case "tilawah_rumah": return "Murojaah di Rumah";
      default: return tab;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4">
      {/* ================= Informasi Santri ================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <span className="font-medium">Pilih Santri</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Filter Halaqoh</Label>
            <Select
              value={halaqohFilter || "all"}
              onValueChange={(v) => {
                setHalaqohFilter(v === "all" ? "" : v);
                setSelectedSantri("");
                setTanggalSetoran(undefined);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Halaqoh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Halaqoh</SelectItem>
                {mockHalaqoh.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.nama_halaqoh}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pilih Santri *</Label>
            <Select 
              value={selectedSantri} 
              onValueChange={(v) => {
                setSelectedSantri(v);
                setTanggalSetoran(undefined);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih santri" />
              </SelectTrigger>
              <SelectContent>
                {filteredSantri.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nama} ({s.nis})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedSantriData && (
          <div className="p-3 bg-primary/10 rounded border text-sm">
            <span className="font-medium">{selectedSantriData.nama}</span> • {selectedSantriData.halaqoh}
          </div>
        )}
      </div>

      {/* ================= Kalender ================= */}
      {selectedSantri && (
        <>
          <SetoranCalendar
            santriId={selectedSantri}
            setoranRecords={resetMode ? [] : mockSetoranRecords}
            onSelectDate={handleDateSelect}
            selectedDate={tanggalSetoran}
          />

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <Label htmlFor="reset-mode" className="text-sm cursor-pointer">
                Mode reset pengisian
              </Label>
            </div>
            <Switch
              id="reset-mode"
              checked={resetMode}
              onCheckedChange={handleResetCalendar}
            />
          </div>
        </>
      )}

      {/* ================= Tabs ================= */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setoran_baru" className="text-xs" disabled={!isFormEnabled}>Setoran Baru</TabsTrigger>
          <TabsTrigger value="murojaah" className="text-xs" disabled={!isFormEnabled}>Murojaah</TabsTrigger>
          <TabsTrigger value="tilawah" className="text-xs" disabled={!isFormEnabled}>Tilawah</TabsTrigger>
          <TabsTrigger value="tilawah_rumah" className="text-xs" disabled={!isFormEnabled}>Rumah</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {!isFormEnabled ? (
            <div className="text-center py-8 text-muted-foreground">
              {!selectedSantri 
                ? "Silakan pilih santri terlebih dahulu"
                : "Pilih tanggal pada kalender untuk melanjutkan"
              }
            </div>
          ) : (
            <>
              <div className="p-3 bg-secondary rounded-lg text-sm space-y-1">
                <div>📅 Tanggal: <strong>{format(tanggalSetoran, "dd MMMM yyyy")}</strong></div>
                <div className="text-muted-foreground text-xs">
                  {TAB_DESCRIPTIONS[activeTab]}
                </div>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{getTabLabel(activeTab)}</CardTitle>
                  <CardDescription>Pilih juz, lalu surah & ayat atau halaman</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <JuzSelector value={juz} onValueChange={(v) => { setJuz(v); setSurah(""); setHalamanDari(""); setHalamanSampai(""); }} required />

                  {/* Toggle mode */}
                  {juz && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={inputMode === "surah" ? "default" : "outline"}
                        className="h-7 text-xs flex-1"
                        onClick={() => setInputMode("surah")}
                      >
                        Pilih Surah & Ayat
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={inputMode === "halaman" ? "default" : "outline"}
                        className="h-7 text-xs flex-1"
                        onClick={() => setInputMode("halaman")}
                      >
                        Pilih Halaman
                      </Button>
                    </div>
                  )}

                  {/* Mode Surah */}
                  {juz && inputMode === "surah" && (
                    <>
                      <div className="space-y-2">
                        <Label>Surah *</Label>
                        <Select value={surah} onValueChange={setSurah} disabled={!juz}>
                          <SelectTrigger>
                            <SelectValue placeholder={juz ? "Pilih surah" : "Pilih juz dulu"} />
                          </SelectTrigger>
                          <SelectContent>
                            {surahByJuz.map((s) => (
                              <SelectItem key={s.number} value={String(s.number)}>
                                {s.number}. {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedSurah && (
                        <div className="text-sm bg-primary/10 p-2 rounded">
                          {selectedSurah.name} – {selectedSurah.numberOfAyahs} ayat
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label>Ayat dari *</Label>
                          <Input
                            type="number"
                            value={ayatDari}
                            min={1}
                            max={selectedSurah?.numberOfAyahs}
                            onChange={(e) => setAyatDari(e.target.value)}
                            disabled={!selectedSurah}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Ayat sampai *</Label>
                          <Input
                            type="number"
                            value={ayatSampai}
                            min={Number(ayatDari)}
                            max={selectedSurah?.numberOfAyahs}
                            onChange={(e) => setAyatSampai(e.target.value)}
                            disabled={!selectedSurah}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Mode Halaman */}
                  {juz && inputMode === "halaman" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label>Halaman dari (maks {maxHalaman})</Label>
                          <Input
                            type="number"
                            value={halamanDari}
                            min={1}
                            max={maxHalaman}
                            onChange={(e) => setHalamanDari(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Halaman sampai</Label>
                          <Input
                            type="number"
                            value={halamanSampai}
                            min={Number(halamanDari) || 1}
                            max={maxHalaman}
                            onChange={(e) => setHalamanSampai(e.target.value)}
                          />
                        </div>
                      </div>

                      {pageInfo && (
                        <div className="flex items-start gap-2 p-2 bg-primary/10 rounded text-xs text-foreground">
                          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                          <span>Isi halaman: <strong>{pageInfo}</strong></span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Penilaian */}
              <Card>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Catatan</Label>
                    <Textarea
                      value={catatanTajwid}
                      onChange={(e) => setCatatanTajwid(e.target.value)}
                      placeholder="Catatan perbaikan bacaan..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSubmit} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Simpan {getTabLabel(activeTab)}
              </Button>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TambahSetoran;
