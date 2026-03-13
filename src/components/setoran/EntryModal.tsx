import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";
import { JuzSelector } from "@/components/JuzSelector";
import { getSurahsByJuz, type Surah } from "@/lib/quran-data";
import { getHalamanPerJuz } from "@/lib/quran-exam-generator";
import {
  getPageSummaryByJuz,
  getPageCountForJuz,
  getPageMappingByJuz,
  checkDuplicateSetoran,
  getPageRangeFromAyatRange,
  getPageFromSurahAyat,
  getAyatRangeForSurahInJuz,
  getDetailedContentForPageRange,
  type SetoranRecord,
} from "@/lib/mushaf-madinah";
import { Plus, Info } from "lucide-react";
import { SurahAyatLimitInfo, PageRangeDetailInfo } from "@/components/setoran/AyatRangeInfo";

type TabType = "setoran_hafalan" | "murojaah" | "tilawah" | "murojaah_rumah";
type SubType =
  | "setoran_hafalan"
  | "drill"
  | "tasmi"
  | "tilawah_harian"
  | "ujian_jilid";

interface EntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  santriName: string;
  activeTab: TabType;
  subType?: SubType;
  onSave: (data: any) => void;
  existingRecords?: SetoranRecord[];
  santriId?: string;
}

export function EntryModal({
  open,
  onOpenChange,
  date,
  santriName,
  activeTab,
  subType,
  onSave,
  existingRecords = [],
  santriId = "",
}: EntryModalProps) {
  const [juz, setJuz] = useState("");
  const [surah, setSurah] = useState("");
  const [halamanDari, setHalamanDari] = useState("");
  const [halamanSampai, setHalamanSampai] = useState("");
  const [ayatDari, setAyatDari] = useState("1");
  const [ayatSampai, setAyatSampai] = useState("7");
  const [status, setStatus] = useState("");
  const [catatan, setCatatan] = useState("");
  const [jilid, setJilid] = useState("");
  const [inputMode, setInputMode] = useState<"halaman" | "surah">("surah");
  

  const surahByJuz: Surah[] = useMemo(() => {
    if (!juz) return [];
    return getSurahsByJuz(Number(juz));
  }, [juz]);

  const selectedSurah = useMemo(() => {
    return surahByJuz.find((s) => s.number === Number(surah));
  }, [surah, surahByJuz]);

  const validBoundaries = useMemo(() => {
    if (!juz || !surah) return null;
    return getAyatRangeForSurahInJuz(Number(juz), Number(surah));
  }, [juz, surah]);

  // Page info from Mushaf mapping
  const pageInfo = useMemo(() => {
    if (!juz || !halamanDari || inputMode !== "halaman") return "";
    return getPageSummaryByJuz(Number(juz), Number(halamanDari));
  }, [juz, halamanDari, inputMode]);

  const getTitle = () => {
    if (activeTab === "murojaah") return "Murojaah Hafalan";
    if (activeTab === "murojaah_rumah") return "Murojaah di Rumah";
    if (activeTab === "tilawah") {
      return subType === "ujian_jilid" ? "Ujian Kenaikan Jilid" : "Setoran Tilawah";
    }
    if (subType === "drill") return "Drill Hafalan";
    if (subType === "tasmi") return "Ujian Tasmi'";
    return "Setoran Hafalan";
  };

  const getStatusOptions = () => {
    if (activeTab === "murojaah" || activeTab === "murojaah_rumah") {
      return ["Lancar", "Kurang Lancar"];
    }
    if (subType === "drill") {
      return ["Lulus", "Mengulang"];
    }
    return ["Lancar", "Ulangi", "Sakit", "Izin"];
  };

  const isTilawahTab = activeTab === "tilawah";
  const isTilawahQuran = isTilawahTab && jilid === "quran";
  const maxHalaman = juz ? getPageCountForJuz(Number(juz)) : 20;

  const handleSave = () => {
    if (!date) return;
    if (!isTilawahTab && !juz) {
      toast.error("Pilih Juz terlebih dahulu");
      return;
    }
    if (!status) {
      toast.error("Pilih status terlebih dahulu");
      return;
    }

    // Anti-duplication check
    // ==============================
    // 🔒 VALIDASI TOTAL (SURAH & HALAMAN)
    // ==============================

    if (!santriId) {
      toast.error("Santri tidak valid");
      return;
    }

    const jenisKey =
      activeTab === "murojaah"
        ? "murojaah"
        : activeTab === "murojaah_rumah"
        ? "murojaah_rumah"
        : subType || "setoran_hafalan";

    // 1️⃣ CONVERT INPUT → RANGES
    let rangesToSave: any[] = [];

    if (inputMode === "surah") {
      if (!surah) {
        toast.error("Pilih surah terlebih dahulu");
        return;
      }

      if (!ayatDari || !ayatSampai) {
        toast.error("Isi ayat dari dan sampai");
        return;
      }

      if (Number(ayatSampai) < Number(ayatDari)) {
        toast.error("Ayat sampai tidak boleh lebih kecil dari ayat dari");
        return;
      }

      // Check against valid juz boundaries
      const validBoundaries = getAyatRangeForSurahInJuz(Number(juz), Number(surah));
      if (validBoundaries) {
        if (Number(ayatDari) < validBoundaries.ayatMin || Number(ayatSampai) > validBoundaries.ayatMax) {
          toast.error(`Range ayat tidak valid untuk Juz ${juz}. Batas: ${validBoundaries.ayatMin}-${validBoundaries.ayatMax}`);
          return;
        }
      }

      rangesToSave.push({
        surahNumber: Number(surah),
        surahName: selectedSurah?.name || surah,
        ayatDari: Number(ayatDari),
        ayatSampai: Number(ayatSampai),
        halaman: halamanDari && halamanSampai ? `${halamanDari}–${halamanSampai}` : halamanDari || undefined,
      });
    }

    if (inputMode === "halaman") {
      if (!halamanDari || !halamanSampai) {
        toast.error("Isi halaman dari dan sampai");
        return;
      }

      if (Number(halamanSampai) < Number(halamanDari)) {
        toast.error("Halaman sampai tidak boleh lebih kecil dari halaman dari");
        return;
      }

      if (Number(halamanSampai) > maxHalaman) {
        toast.error("Halaman melebihi batas juz");
        return;
      }

      const detailedSegments = getDetailedContentForPageRange(
        Number(juz),
        Number(halamanDari),
        Number(halamanSampai)
      );

      if (detailedSegments.length === 0) {
        toast.error("Mapping halaman tidak ditemukan");
        return;
      }

      rangesToSave = detailedSegments.map(s => ({
        surahNumber: s.surahNumber,
        surahName: s.surahName,
        ayatDari: s.ayatStart,
        ayatSampai: s.ayatEnd,
        halaman: `${halamanDari}–${halamanSampai}`, // Keep original page range as reference
      }));
    }

    if (rangesToSave.length === 0) {
      toast.error("Range tidak valid");
      return;
    }

    // 2️⃣ CEK DUPLICATE & SAVE
    const jenisMap: Record<string, string> = {
      setoran_hafalan: "setoran_hafalan",
      drill: "drill",
      tasmi: "tasmi",
      tilawah_harian: "tilawah",
      ujian_jilid: "ujian_jilid",
    };

    const finalJenis = activeTab === "murojaah"
      ? "murojaah"
      : activeTab === "murojaah_rumah"
      ? "murojaah_rumah"
      : jenisMap[subType || "setoran_hafalan"] || activeTab;

    let overlapFound = false;
    for (const range of rangesToSave) {
      const overlap = checkDuplicateSetoran(
        range,
        existingRecords,
        santriId,
        jenisKey
      );

      if (overlap) {
        toast.error(`Overlap di ${range.surahName} ayat ${range.ayatDari}-${range.ayatSampai}`);
        overlapFound = true;
        break;
      }
    }

    if (overlapFound) return;

    // 3️⃣ SAVE ALL SEGMENTS
    const segmentsToSave = rangesToSave.map((range) => ({
      tanggal: date,
      jenis: finalJenis,
      juz: juz ? Number(juz) : undefined,
      surah: range.surahName,
      surahNumber: range.surahNumber,
      halaman: range.halaman,
      ayat: `${range.ayatDari}-${range.ayatSampai}`,
      ayatDari: range.ayatDari,
      ayatSampai: range.ayatSampai,
      status,
      catatan,
      jilid: jilid || undefined,
      pageInfo: pageInfo || undefined,
    }));

    onSave(segmentsToSave);

    // Reset
    setJuz("");
    setSurah("");
    setHalamanDari("");
    setHalamanSampai("");
    setAyatDari("1");
    setAyatSampai("7");
    setStatus("");
    setCatatan("");
    setJilid("");
    setInputMode("surah");
    onOpenChange(false);
    toast.success("Data berhasil disimpan!");
  };

  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{getTitle()}</DialogTitle>
          <DialogDescription>
            {santriName} •{" "}
            {format(date, "EEEE, d MMMM yyyy", { locale: localeId })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {(!isTilawahTab || isTilawahQuran) && (
            <>
              {isTilawahTab && (
                <div className="space-y-2">
                  <Label>Jilid / Al-Qur'an</Label>
                  <Select value={jilid} onValueChange={setJilid}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jilid" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 6 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          Jilid {i + 1}
                        </SelectItem>
                      ))}
                      <SelectItem value="quran">Al-Qur'an</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <JuzSelector
                value={juz}
                onValueChange={(v) => {
                  setJuz(v);

                  // 🔒 reset total
                  setSurah("");
                  setAyatDari("1");
                  setAyatSampai("7");
                  setHalamanDari("");
                  setHalamanSampai("");
                  setInputMode("surah");
                }}
                required
              />

              {/* Toggle halaman/surah mode */}
              {juz && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={inputMode === "surah" ? "default" : "outline"}
                    className="h-7 text-xs flex-1"
                    onClick={() => {
                      setInputMode("surah");
                      setHalamanDari("");
                      setHalamanSampai("");
                    }}
                  >
                    Pilih Surah & Ayat
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={inputMode === "halaman" ? "default" : "outline"}
                    className="h-7 text-xs flex-1"
                    onClick={() => {
                      setInputMode("halaman");
                      setSurah("");
                      setAyatDari("1");
                      setAyatSampai("7");
                    }}
                  >
                    Pilih Halaman
                  </Button>
                </div>
              )}

              {/* Mode Surah */}
              {juz && inputMode === "surah" && (
                <>
                  <div className="space-y-2">
                    <Label>Surah</Label>
                    <Select
                      value={surah}
                      onValueChange={(val) => {
                        setSurah(val);
                        // Reset ayat to valid boundaries for the selected juz
                        const bounds = getAyatRangeForSurahInJuz(Number(juz), Number(val));
                        if (bounds) {
                          setAyatDari(String(bounds.ayatMin));
                          setAyatSampai(String(bounds.ayatMin));
                        } else {
                          setAyatDari("1");
                          setAyatSampai("1");
                        }
                        setHalamanDari("");
                        setHalamanSampai("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih surah" />
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
                          type="number"
                          value={ayatDari}
                      min={validBoundaries?.ayatMin || 1}
                      max={validBoundaries?.ayatMax || selectedSurah.numberOfAyahs}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const min = validBoundaries?.ayatMin || 1;
                            const max = validBoundaries?.ayatMax || selectedSurah.numberOfAyahs;
                            const clamped = Math.max(min, Math.min(max, val));
                            setAyatDari(String(clamped));
                            // Sync to page
                            if (clamped && ayatSampai) {
                              const pr = getPageRangeFromAyatRange(Number(juz), Number(surah), clamped, Number(ayatSampai));
                              if (pr) { setHalamanDari(String(pr.dari)); setHalamanSampai(String(pr.sampai)); }
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Ayat sampai</Label>
                        <Input
                          type="number"
                          value={ayatSampai}
                          min={Number(ayatDari)}
                      max={validBoundaries?.ayatMax || selectedSurah.numberOfAyahs}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const min = Number(ayatDari);
                            const max = validBoundaries?.ayatMax || selectedSurah.numberOfAyahs;
                            const clamped = Math.max(min, Math.min(max, val));
                            setAyatSampai(String(clamped));
                            // Sync to page
                            const pr = getPageRangeFromAyatRange(Number(juz), Number(surah), Number(ayatDari), clamped);
                            if (pr) { setHalamanDari(String(pr.dari)); setHalamanSampai(String(pr.sampai)); }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Show synced page info */}
                  {halamanDari && (
                    <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>📖 Halaman {halamanDari}{halamanSampai && halamanSampai !== halamanDari ? `–${halamanSampai}` : ""} (dalam juz)</span>
                    </div>
                  )}
                </>
              )}

              {/* Mode Halaman */}
              {juz && inputMode === "halaman" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Halaman dari (maks {maxHalaman})</Label>
                      <Input
                        type="number"
                        value={halamanDari}
                        min={1}
                        max={maxHalaman}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const clamped = Math.max(1, Math.min(maxHalaman, val));
                          setHalamanDari(String(clamped));
                          // Sync to surah/ayat
                          if (clamped) {
                            const mapping = getPageMappingByJuz(Number(juz), clamped);
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
                        type="number"
                        value={halamanSampai}
                        min={Number(halamanDari) || 1}
                        max={maxHalaman}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const min = Number(halamanDari) || 1;
                          const clamped = Math.max(min, Math.min(maxHalaman, val));
                          setHalamanSampai(String(clamped));
                          // Sync end ayat
                          if (clamped) {
                            const mapping = getPageMappingByJuz(Number(juz), clamped);
                            if (mapping) {
                              setAyatSampai(String(mapping.endAyat));
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Auto-detect surah/ayat info from page */}
                  {/* Detailed page range content */}
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
                </>
              )}
            </>
          )}

          {/* Tilawah fields (non-quran jilid) */}
          {isTilawahTab && !isTilawahQuran && (
            <>
              <div className="space-y-2">
                <Label>Jilid / Al-Qur'an</Label>
                <Select value={jilid} onValueChange={setJilid}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jilid" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 6 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        Jilid {i + 1}
                      </SelectItem>
                    ))}
                    <SelectItem value="quran">Al-Qur'an</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Halaman dari</Label>
                  <Input
                    type="number"
                    value={halamanDari}
                    min={1}
                    onChange={(e) => setHalamanDari(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Halaman sampai</Label>
                  <Input
                    type="number"
                    value={halamanSampai}
                    min={Number(halamanDari) || 1}
                    onChange={(e) => setHalamanSampai(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label>Status *</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {getStatusOptions().map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Catatan */}
          <div className="space-y-2">
            <Label>Catatan</Label>
            <Textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan ustadz..."
              rows={2}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
