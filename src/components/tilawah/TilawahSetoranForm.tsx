import { useState, useEffect, useMemo } from "react";
import { BookOpen, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MOCK_SANTRI_TILAWAH, 
  TILAWATI_JILID,
  getAspekPenilaianByJilid 
} from "@/lib/tilawah-data";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { JuzSelector } from "@/components/JuzSelector";
import {
  getSurahListByJuz,
  getPageCountForJuz,
  getPageMappingByJuz,
  getPageRangeFromAyatRange,
  getPageSummaryByJuz,
} from "@/lib/mushaf-madinah";
import { SurahAyatLimitInfo, PageRangeDetailInfo } from "@/components/setoran/AyatRangeInfo";

interface TilawahSetoranFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newData: any) => void;
  initialSantriId?: string;
  date: Date | null;
  santriName: string;
}

export const TilawahSetoranForm = ({ 
  open, 
  onOpenChange, 
  onSuccess,
  initialSantriId,
  date, 
  santriName
}: TilawahSetoranFormProps) => {
  
  const [selectedSantri, setSelectedSantri] = useState("");
  const [selectedJilid, setSelectedJilid] = useState("");
  const [inputMode, setInputMode] = useState<"halaman" | "surah">("surah");
  const [selectedJuz, setSelectedJuz] = useState("");

  const [surah, setSurah] = useState("");
  const [ayatDari, setAyatDari] = useState("");
  const [ayatSampai, setAyatSampai] = useState("");
  const [halamanDari, setHalamanDari] = useState("");
  const [halamanSampai, setHalamanSampai] = useState("");

  const [scores, setScores] = useState({ tartil: "", fashohah: "", tajwid: "", ghorib: "" });
  const [status, setStatus] = useState<"selesai" | "lanjut" | "ulang">("lanjut");
  const [catatan, setCatatan] = useState("");

  // Derived
  const surahByJuz = useMemo(() => {
    if (!selectedJuz) return [];
    return getSurahListByJuz(Number(selectedJuz));
  }, [selectedJuz]);

  const selectedSurah = useMemo(() => {
    return surahByJuz.find((s) => String(s.number) === surah);
  }, [surah, surahByJuz]);

  const maxHalaman = selectedJuz ? getPageCountForJuz(Number(selectedJuz)) : 20;

  const pageInfo = useMemo(() => {
    if (!selectedJuz || !halamanDari || inputMode !== "halaman") return "";
    return getPageSummaryByJuz(Number(selectedJuz), Number(halamanDari));
  }, [selectedJuz, halamanDari, inputMode]);

  const aspekPenilaian = selectedJilid ? getAspekPenilaianByJilid(parseInt(selectedJilid)) : [];

  useEffect(() => {
    if (!open) return;
    if (initialSantriId) {
      setSelectedSantri(initialSantriId);
      const santri = MOCK_SANTRI_TILAWAH.find(s => s.id === initialSantriId);
      if (santri) setSelectedJilid(String(santri.jilidSaatIni));
    } else {
      setSelectedSantri("");
      setSelectedJilid("");
    }
  }, [open]);

  const resetForm = () => {
    setSelectedSantri("");
    setSelectedJilid("");
    setSelectedJuz("");
    setSurah("");
    setAyatDari("");
    setAyatSampai("");
    setHalamanDari("");
    setHalamanSampai("");
    setInputMode("surah");
    setScores({ tartil: "", fashohah: "", tajwid: "", ghorib: "" });
    setStatus("lanjut");
    setCatatan("");
  };

  const handleProcessSubmit = () => {
    if (!selectedSantri || !selectedJilid) {
      toast.error("Santri dan Jilid wajib dipilih");
      return;
    }

    if (selectedJilid === "7") {
      if (!selectedJuz) { toast.error("Pilih Juz terlebih dahulu"); return; }
      if (inputMode === "surah" && !surah) { toast.error("Pilih Surah terlebih dahulu"); return; }
      if (inputMode === "halaman" && (!halamanDari || !halamanSampai)) { toast.error("Isi halaman"); return; }
    }

    const activeScores = Object.values(scores).filter(v => v !== "").map(v => parseFloat(v));
    const rataRata = activeScores.length > 0 
      ? Math.round(activeScores.reduce((a, b) => a + b, 0) / activeScores.length)
      : 0;

    const finalData = {
      tanggal: date,
      santriId: selectedSantri,
      jenis: "tilawah",
      jilid: selectedJilid === "7" ? "quran" : selectedJilid,
      juz: selectedJilid === "7" ? Number(selectedJuz) : undefined,
      surah: surahByJuz.find(s => String(s.number) === surah)?.name || surah || undefined,
      surahNumber: surah ? Number(surah) : undefined,
      ayatDari: ayatDari ? Number(ayatDari) : undefined,
      ayatSampai: ayatSampai ? Number(ayatSampai) : undefined,
      halaman: halamanDari && halamanSampai ? `${halamanDari}–${halamanSampai}` : halamanDari || undefined,
      status: status === "selesai" ? "Lancar" : status === "ulang" ? "Ulangi" : "Lancar",
      catatan,
    };
    onSuccess(finalData);
    toast.success("Setoran berhasil disimpan");
    onOpenChange(false);
    resetForm();
  };

  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Tambah Setoran Tilawah
          </DialogTitle>
          <DialogDescription>
            {santriName} • {format(date, "EEEE, d MMMM yyyy", { locale: localeId })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Hidden Santri selector */}
          <div className="space-y-2 hidden">
            <Label>Pilih Santri</Label>
            <Select value={selectedSantri} onValueChange={setSelectedSantri} disabled={!!initialSantriId}>
              <SelectTrigger><SelectValue placeholder="Pilih santri..." /></SelectTrigger>
              <SelectContent>
                {MOCK_SANTRI_TILAWAH.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nama} - {s.kelas} (Jilid {s.jilidSaatIni})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {/* JILID */}
            <div className="space-y-2">
              <Label>Jilid</Label>
              <Select
                value={selectedJilid}
                onValueChange={(value) => {
                  setSelectedJilid(value);
                  setSelectedJuz(""); setSurah(""); setHalamanDari(""); setHalamanSampai("");
                  setAyatDari(""); setAyatSampai(""); setInputMode("surah");
                }}
              >
                <SelectTrigger><SelectValue placeholder="Jilid..." /></SelectTrigger>
                <SelectContent>
                  {TILAWATI_JILID.map((j) => (
                    <SelectItem key={j.jilid} value={j.jilid.toString()}>Jilid {j.jilid}</SelectItem>
                  ))}
                  <SelectItem value="7">Al-Qur'an</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* JILID 1-6: halaman only */}
            {selectedJilid && selectedJilid !== "7" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Halaman Dari</Label>
                  <Input type="number" value={halamanDari} onChange={(e) => setHalamanDari(e.target.value)} />
                </div>
                <div>
                  <Label>Sampai</Label>
                  <Input type="number" value={halamanSampai} onChange={(e) => setHalamanSampai(e.target.value)} />
                </div>
              </div>
            )}

            {/* AL-QUR'AN */}
            {selectedJilid === "7" && (
              <>
                <JuzSelector
                  value={selectedJuz}
                  onValueChange={(v) => {
                    setSelectedJuz(v);
                    setSurah(""); setAyatDari(""); setAyatSampai("");
                    setHalamanDari(""); setHalamanSampai(""); setInputMode("surah");
                  }}
                  order="asc"
                  required
                />

                {selectedJuz && (
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant={inputMode === "surah" ? "default" : "outline"} className="h-7 text-xs flex-1" onClick={() => { setInputMode("surah"); setHalamanDari(""); setHalamanSampai(""); }}>
                      Pilih Surah & Ayat
                    </Button>
                    <Button type="button" size="sm" variant={inputMode === "halaman" ? "default" : "outline"} className="h-7 text-xs flex-1" onClick={() => { setInputMode("halaman"); setSurah(""); setAyatDari(""); setAyatSampai(""); }}>
                      Pilih Halaman
                    </Button>
                  </div>
                )}

                {/* Mode Surah */}
                {selectedJuz && inputMode === "surah" && (
                  <>
                    <div className="space-y-2">
                      <Label>Surah</Label>
                      <Select value={surah} onValueChange={(val) => { setSurah(val); setAyatDari("1"); setAyatSampai("1"); setHalamanDari(""); setHalamanSampai(""); }}>
                        <SelectTrigger><SelectValue placeholder="Pilih surah" /></SelectTrigger>
                        <SelectContent>
                          {surahByJuz.map((s) => (
                            <SelectItem key={s.number} value={String(s.number)}>{s.number}. {s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Show ayat limit for selected surah */}
                    {surah && selectedJuz && (
                      <SurahAyatLimitInfo
                        juz={selectedJuz}
                        surahNumber={surah}
                        surahName={selectedSurah?.name}
                      />
                    )}
                    {selectedSurah && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Ayat dari</Label>
                          <Input type="number" value={ayatDari} min={1} max={selectedSurah.numberOfAyahs}
                            onChange={(e) => {
                              setAyatDari(e.target.value);
                              if (e.target.value && ayatSampai) {
                                const pr = getPageRangeFromAyatRange(Number(selectedJuz), Number(surah), Number(e.target.value), Number(ayatSampai));
                                if (pr) { setHalamanDari(String(pr.dari)); setHalamanSampai(String(pr.sampai)); }
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Ayat sampai</Label>
                          <Input type="number" value={ayatSampai} min={Number(ayatDari)} max={selectedSurah.numberOfAyahs}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (val >= Number(ayatDari)) {
                                setAyatSampai(e.target.value);
                                const pr = getPageRangeFromAyatRange(Number(selectedJuz), Number(surah), Number(ayatDari), val);
                                if (pr) { setHalamanDari(String(pr.dari)); setHalamanSampai(String(pr.sampai)); }
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {halamanDari && (
                      <div className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>📖 Halaman {halamanDari}{halamanSampai && halamanSampai !== halamanDari ? `–${halamanSampai}` : ""} (dalam juz)</span>
                      </div>
                    )}
                  </>
                )}

                {/* Mode Halaman */}
                {selectedJuz && inputMode === "halaman" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Halaman dari (maks {maxHalaman})</Label>
                        <Input type="number" value={halamanDari} min={1} max={maxHalaman}
                          onChange={(e) => {
                            setHalamanDari(e.target.value);
                            if (e.target.value) {
                              const mapping = getPageMappingByJuz(Number(selectedJuz), Number(e.target.value));
                              if (mapping) { setSurah(String(mapping.surahNumber)); setAyatDari(String(mapping.startAyat)); }
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Halaman sampai</Label>
                        <Input type="number" value={halamanSampai} min={Number(halamanDari) || 1} max={maxHalaman}
                          onChange={(e) => {
                            setHalamanSampai(e.target.value);
                            if (e.target.value) {
                              const mapping = getPageMappingByJuz(Number(selectedJuz), Number(e.target.value));
                              if (mapping) { setAyatSampai(String(mapping.endAyat)); }
                            }
                          }}
                        />
                      </div>
                    </div>
                    {/* Detailed page range content */}
                    {halamanDari && (
                      <PageRangeDetailInfo
                        juz={selectedJuz}
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

            {/* Card Penilaian */}
            <Card className="bg-muted/30">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Penilaian {selectedJilid === "7" ? "Al-Qur'an" : `Jilid ${selectedJilid || '...'}`}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Tartil (0-100)</Label>
                  <Input type="number" value={scores.tartil} onChange={(e) => setScores({...scores, tartil: e.target.value})} placeholder="85" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Fashohah (0-100)</Label>
                  <Input type="number" value={scores.fashohah} onChange={(e) => setScores({...scores, fashohah: e.target.value})} placeholder="85" />
                </div>
                {aspekPenilaian.includes("tajwid_dasar") && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Tajwid (0-100)</Label>
                    <Input type="number" value={scores.tajwid} onChange={(e) => setScores({...scores, tajwid: e.target.value})} placeholder="80" />
                  </div>
                )}
                {aspekPenilaian.includes("ghorib") && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Ghorib (0-100)</Label>
                    <Input type="number" value={scores.ghorib} onChange={(e) => setScores({...scores, ghorib: e.target.value})} placeholder="75" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status & Catatan */}
            <div className="space-y-2">
              <Label>Status Progres</Label>
              <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lanjut">Lanjut ke Halaman Berikutnya</SelectItem>
                  <SelectItem value="ulang">Ulang Materi Ini</SelectItem>
                  <SelectItem value="selesai">Selesai Jilid (Siap Ujian)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Catatan Ustadz/ah</Label>
              <Textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Contoh: Perbaiki dengung di hukum Nun Mati..." rows={2} />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
              <Button onClick={handleProcessSubmit} className="px-6">Simpan Setoran</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};