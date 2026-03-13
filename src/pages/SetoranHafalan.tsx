import { useState, useMemo, useCallback } from "react";

import { Layout } from "@/components/Layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  RefreshCw,
  BookMarked,
  Home,
  User,
} from "lucide-react";
import { MonthlyCalendar } from "@/components/setoran/MonthlyCalendar";
import { MobileCalendar } from "@/components/setoran/MobileCalendar";
import { EntryModal } from "@/components/setoran/EntryModal";
import { EntryHistoryPopup } from "@/components/setoran/EntryHistoryPopup";
import { type CalendarEntry } from "@/components/setoran/CalendarCell";
import { MOCK_SANTRI, MOCK_HALAQOH, getSantriByHalaqoh } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AddDrillModal } from "@/components/setoran/AddDrillModal";
import { TasmiForm1Juz } from "@/components/tasmi/TasmiForm1Juz";
import { TasmiForm5Juz } from "@/components/tasmi/TasmiForm5Juz";
import { TilawatiUjianForm } from "@/components/tilawah/TilawatiUjianForm";
import { TilawahSetoranForm } from "@/components/tilawah/TilawahSetoranForm";
import { useSetoranPersistence } from "@/hooks/use-setoran-persistence";
import { toast } from "sonner";


type MainTab = "setoran_hafalan" | "murojaah" | "tilawah" | "murojaah_rumah";

const HEADER_TITLES: Record<MainTab, string> = {
  setoran_hafalan: "SETORAN HAFALAN",
  murojaah: "MUROJAAH DI SEKOLAH",
  tilawah: "SETORAN TILAWAH",
  murojaah_rumah: "MUROJAAH DI RUMAH",
};

// Sub-type options per tab
const SUB_OPTIONS: Record<MainTab, { value: string; label: string }[]> = {
  setoran_hafalan: [
    { value: "setoran_hafalan", label: "Setoran Hafalan" },
    { value: "drill", label: "Drill Hafalan" },
    { value: "tasmi", label: "Ujian Tasmi'" },
    { value: "tasmi5juz", label: "Tasmi' 5 Juz" },
  ],
  murojaah: [],
  tilawah: [
    { value: "tilawah_harian", label: "Setoran Tilawah Harian" },
    { value: "ujian_jilid", label: "Ujian Kenaikan Jilid" },
  ],
  murojaah_rumah: [],
};

const SetoranHafalan = () => {
  const now = new Date();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<MainTab>("setoran_hafalan");
  const [subType, setSubType] = useState("setoran_hafalan");
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  // Filters
  const [selectedHalaqoh, setSelectedHalaqoh] = useState("");
  const [selectedSantri, setSelectedSantri] = useState("");

  // Modal
  const [modalDate, setModalDate] = useState<Date | null>(null);

  const [openEntry, setOpenEntry] = useState(false);
  const [openDrill, setOpenDrill] = useState(false);
  const [openTasmi, setOpenTasmi] = useState(false);
  const [openTasmi5Juz, setOpenTasmi5Juz] = useState(false);
  const [openTilawah, setOpenTilawah] = useState(false);
  const [openUjianJilid, setOpenUjianJilid] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);

  // Read tasmi registered candidates from localStorage
  const registeredCandidates = useMemo(() => {
    try {
      const stored = localStorage.getItem("tasmi-registered-candidates");
      return stored ? JSON.parse(stored) as string[] : [];
    } catch { return [] as string[]; }
  }, [openTasmi, openTasmi5Juz]);

  // Tasmi' component state
  const dummySantri = useMemo(() => MOCK_SANTRI.map(s => ({
    id: s.id,
    nama: s.nama,
    halaqoh: MOCK_HALAQOH.find(h => h.id === s.idHalaqoh)?.nama || "-",
    kelas: "-",
    juzSelesai: []
  })), []);
  const getPredikat = (nilai: number): { label: string; color: string; passed: boolean } => {
    if (nilai >= 93) return { label: "Mumtaz Murtafi'", color: "bg-emerald-500", passed: true };
    if (nilai >= 86) return { label: "Mumtaz", color: "bg-green-500", passed: true };
    if (nilai >= 78) return { label: "Jayyid Jiddan", color: "bg-blue-500", passed: true };
    if (nilai >= 70) return { label: "Jayyid", color: "bg-amber-500", passed: true };
    return { label: "Mengulang", color: "bg-red-500", passed: false };
  };

  // Ujian kenaikan jilid state
  const [remedialTarget, setRemedialTarget] = useState<any>(null);

  // Global entries storage
  const { entries, addEntries, deleteEntry } = useSetoranPersistence();

  const santriList = useMemo(() => {
    if (!selectedHalaqoh) return MOCK_SANTRI;
    return getSantriByHalaqoh(selectedHalaqoh);
  }, [selectedHalaqoh]);

  const santriData = MOCK_SANTRI.find((s) => s.id === selectedSantri);

  // Filter entries for current tab and santri - each tab has its own calendar
  const filteredEntries = useMemo(() => {
    if (!selectedSantri) return [];

    // Map tab to allowed jenis
    const tabJenisMap: Record<MainTab, string[]> = {
      setoran_hafalan: ["setoran_hafalan", "drill", "tasmi", "tasmi5juz"],
      murojaah: ["murojaah"],
      tilawah: ["tilawah", "ujian_jilid"],
      murojaah_rumah: ["murojaah_rumah"],
    };

    const allowedJenis = tabJenisMap[activeTab] || [];

    return entries.filter(
      (e) =>
        e.santriId === selectedSantri &&
        allowedJenis.includes(e.jenis)
    );
  }, [entries, selectedSantri, activeTab]);

  // Get entries for a specific date (for history popup)
  const getEntriesForDate = (date: Date) => {
    if (!date) return [];
    const dateStr = format(date, "yyyy-MM-dd");
    return filteredEntries.filter(
      (e) => format(e.tanggal, "yyyy-MM-dd") === dateStr
    );
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDateClick = useCallback(
    (date: Date) => {
      if (!selectedSantri) return;

      setModalDate(date);

      // Check if this date already has an entry for this tab
      const dateStr = format(date, "yyyy-MM-dd");
      const existingEntries = filteredEntries.filter(
        (e) => format(e.tanggal, "yyyy-MM-dd") === dateStr
      );

      // If already has entry, show history popup
      if (existingEntries.length > 0) {
        setOpenHistory(true);
        return;
      }

      if (activeTab === "setoran_hafalan") {
        if (subType === "drill") {
          setOpenDrill(true);
        } else if (subType === "tasmi") {
          if (!registeredCandidates.includes(selectedSantri)) {
            toast.warning("Santri belum terdaftar sebagai peserta Tasmi'. Daftarkan terlebih dahulu di halaman Ujian Tasmi'.");
            return;
          }
          setOpenTasmi(true);
        } else if (subType === "tasmi5juz") {
          if (!registeredCandidates.includes(selectedSantri)) {
            toast.warning("Santri belum terdaftar sebagai peserta Tasmi'. Daftarkan terlebih dahulu di halaman Ujian Tasmi'.");
            return;
          }
          setOpenTasmi5Juz(true);
        } else {
          setOpenEntry(true);
        }
        return;
      }

      if (activeTab === "tilawah") {
        if (subType === "tilawah_harian") {
          setOpenTilawah(true);
        } else if (subType === "ujian_jilid") {
          setOpenUjianJilid(true);
        }
        return;
      }

      // Tab lainnya tetap pakai entry modal
      setOpenEntry(true);
    },
    [selectedSantri, activeTab, subType, filteredEntries]
  );

  const handleSaveEntry = useCallback(
    (data: any | any[]) => {
      const dataArray = Array.isArray(data) ? data : [data];
      const newEntries = dataArray.map((item) => ({
        tanggal: item.tanggal,
        santriId: selectedSantri,
        jenis: item.jenis,
        juz: item.juz,
        surah: item.surah,
        surahNumber: item.surahNumber,
        halaman: item.halaman,
        ayat: item.ayat,
        ayatDari: item.ayatDari,
        ayatSampai: item.ayatSampai,
        jilid: item.jilid,
        status: item.status,
        catatan: item.catatan,
      }));
      addEntries(newEntries);
    },
    [selectedSantri, addEntries]
  );

  const handleDeleteEntry = useCallback(
    (entry: CalendarEntry) => {
      deleteEntry(entry);
      setOpenHistory(false);
    },
    [deleteEntry]
  );

  const monthOptions = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const currentYear = now.getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const subOpts = SUB_OPTIONS[activeTab];

  return (
    <Layout>
      <div className="space-y-4 md:space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Setoran Harian
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitoring setoran hafalan, murojaah, dan tilawah
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Filter</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              <div className="space-y-1">
                <Label className="text-xs md:text-sm">Halaqoh</Label>
                <Select
                  value={selectedHalaqoh || "all"}
                  onValueChange={(v) => {
                    setSelectedHalaqoh(v === "all" ? "" : v);
                    setSelectedSantri("");
                  }}
                >
                  <SelectTrigger className="h-9 text-xs md:text-sm">
                    <SelectValue placeholder="Semua Halaqoh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Halaqoh</SelectItem>
                    {MOCK_HALAQOH.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs md:text-sm">Santri *</Label>
                <Select
                  value={selectedSantri}
                  onValueChange={setSelectedSantri}
                >
                  <SelectTrigger className="h-9 text-xs md:text-sm">
                    <SelectValue placeholder="Pilih Santri" />
                  </SelectTrigger>
                  <SelectContent>
                    {santriList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs md:text-sm">Bulan</Label>
                <Select
                  value={String(month)}
                  onValueChange={(v) => setMonth(Number(v))}
                >
                  <SelectTrigger className="h-9 text-xs md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((m, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs md:text-sm">Tahun</Label>
                <Select
                  value={String(year)}
                  onValueChange={(v) => setYear(Number(v))}
                >
                  <SelectTrigger className="h-9 text-xs md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {santriData && (
              <div className="mt-3 p-2 bg-primary/10 rounded text-xs md:text-sm">
                <span className="font-medium">{santriData.nama}</span> •{" "}
                NIS: {santriData.nis} •{" "}
                {MOCK_HALAQOH.find((h) => h.id === santriData.idHalaqoh)?.nama || "-"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as MainTab);
            const subs = SUB_OPTIONS[v as MainTab];
            setSubType(subs.length > 0 ? subs[0].value : "");
          }}
        >
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger
              value="setoran_hafalan"
              className="text-[10px] md:text-sm py-2 gap-1"
            >
              <BookMarked className="w-3 h-3 hidden md:block" />
              Hafalan
            </TabsTrigger>
            <TabsTrigger
              value="murojaah"
              className="text-[10px] md:text-sm py-2 gap-1"
            >
              <RefreshCw className="w-3 h-3 hidden md:block" />
              Murojaah
            </TabsTrigger>
            <TabsTrigger
              value="tilawah"
              className="text-[10px] md:text-sm py-2 gap-1"
            >
              <BookOpen className="w-3 h-3 hidden md:block" />
              Tilawah
            </TabsTrigger>
            <TabsTrigger
              value="murojaah_rumah"
              className="text-[10px] md:text-sm py-2 gap-1"
            >
              <Home className="w-3 h-3 hidden md:block" />
              Rumah
            </TabsTrigger>
          </TabsList>

          {/* Sub-type selector */}
          {subOpts.length > 0 && (
            <div className="mt-3 flex gap-1.5 flex-wrap">
              {subOpts.map((opt) => (
                <Button
                  key={opt.value}
                  size="sm"
                  variant={subType === opt.value ? "default" : "outline"}
                  className="h-7 text-[10px] md:text-sm"
                  onClick={() => setSubType(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          )}

          {/* Month navigation */}
          <div className="flex items-center justify-between mt-3">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-foreground">
              {monthOptions[month]} {year}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar */}
          <div className="mt-3">
            {!selectedSantri ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground text-sm">
                  Pilih santri terlebih dahulu untuk melihat kalender monitoring
                </CardContent>
              </Card>
            ) : isMobile ? (
              <MobileCalendar
                month={month}
                year={year}
                entries={filteredEntries}
                onDateClick={handleDateClick}
                headerTitle={HEADER_TITLES[activeTab]}
                allowWeekends={activeTab === "murojaah_rumah"}
              />
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                  <MonthlyCalendar
                    month={month}
                    year={year}
                    entries={filteredEntries}
                    onDateClick={handleDateClick}
                    headerTitle={HEADER_TITLES[activeTab]}
                    allowWeekends={activeTab === "murojaah_rumah"}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          {selectedSantri && (
            <div className="flex flex-wrap gap-3 mt-3 text-[10px] md:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-[hsl(160,60%,45%)]/20 border border-[hsl(160,60%,45%)]/40" />
                <span>Lancar / Lulus</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-[hsl(45,90%,55%)]/20 border border-[hsl(45,90%,55%)]/40" />
                <span>Kurang Lancar</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-destructive/20 border border-destructive/40" />
                <span>Ulangi</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span>Ujian</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🏠</span>
                <span>Murojaah Rumah</span>
              </div>
            </div>
          )}
        </Tabs>

        {/* Entry Modal */}
        <EntryModal
          open={openEntry}
          onOpenChange={setOpenEntry}
          date={modalDate}
          santriName={santriData?.nama || ""}
          activeTab={activeTab}
          subType={subType as any}
          onSave={handleSaveEntry}
          santriId={selectedSantri}
          existingRecords={entries as any}
        />

        <AddDrillModal
          open={openDrill}
          onOpenChange={setOpenDrill}
          date={modalDate}
          santriName={santriData?.nama || ""}
          initialSantriId={selectedSantri || undefined}
          onSuccess={handleSaveEntry}
          drillHistory={[]}
        />

        <TasmiForm1Juz 
          open={openTasmi} 
          onOpenChange={setOpenTasmi} 
          santriList={dummySantri} 
          date={modalDate}
          santriName={santriData?.nama || ""}
          getPredikat={getPredikat} 
          onSuccess={handleSaveEntry}
        />

        <TasmiForm5Juz
          open={openTasmi5Juz}
          onOpenChange={setOpenTasmi5Juz}
          santriList={dummySantri}
          date={modalDate}
          santriName={santriData?.nama || ""}
          getPredikat={getPredikat}
          onSuccess={handleSaveEntry}
        />

        <TilawatiUjianForm 
          open={openUjianJilid} 
          onSubmit={handleSaveEntry}
          date={modalDate}
          santriName={santriData?.nama || ""}
          onOpenChange={setOpenUjianJilid}
          initialData={remedialTarget} 
        />

        <TilawahSetoranForm 
          open={openTilawah} 
          onOpenChange={setOpenTilawah}
          date={modalDate}
          santriName={santriData?.nama || ""}
          onSuccess={handleSaveEntry}
          initialSantriId={selectedSantri}
        />

        <EntryHistoryPopup
          open={openHistory}
          onOpenChange={setOpenHistory}
          date={modalDate}
          santriName={santriData?.nama || ""}
          entries={modalDate ? getEntriesForDate(modalDate) : []}
          onDelete={handleDeleteEntry}
          onAddNew={() => {
            setOpenHistory(false);
            if (activeTab === "setoran_hafalan") {
              if (subType === "drill") setOpenDrill(true);
              else if (subType === "tasmi") setOpenTasmi(true);
              else if (subType === "tasmi5juz") setOpenTasmi5Juz(true);
              else setOpenEntry(true);
            } else if (activeTab === "tilawah") {
              if (subType === "tilawah_harian") setOpenTilawah(true);
              else setOpenUjianJilid(true);
            } else {
              setOpenEntry(true);
            }
          }}
        />
      </div>
    </Layout>
  );
};

export default SetoranHafalan;
