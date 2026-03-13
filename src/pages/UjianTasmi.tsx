import { useState, useEffect, useMemo } from "react";
import { type CalendarEntry } from "@/components/setoran/CalendarCell";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Award, 
  Plus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  User,
  Image,
  Users,
  Calendar as CalendarIcon
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getJuzName } from "@/lib/quran-data";
import { JuzSelector } from "@/components/JuzSelector";
import { supabase } from "@/integrations/supabase/client";
import { TasmiCandidateCard } from "@/components/tasmi/TasmiCandidateCard";
import { TasmiForm1Juz } from "@/components/tasmi/TasmiForm1Juz";
import { mockSantriProgress, getNextTasmiJuz } from "@/lib/target-hafalan";
import { useSetoranPersistence } from "@/hooks/use-setoran-persistence";
import { toast } from "sonner";
import { MOCK_SANTRI, MOCK_HALAQOH, MOCK_KELAS, getHalaqohNama, getKelasNama, getSantriByNama } from "@/lib/mock-data";

const JUZ_ORDER = [30, 29, 28, 27, 26, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

const getTotalHalamanByJuz = (juz: number) => {
  if (juz === 30) return 23;
  return 20;
};

const getPredikat = (nilai: number): { label: string; color: string; passed: boolean } => {
  if (nilai >= 93) return { label: "Mumtaz Murtafi'", color: "bg-emerald-500", passed: true };
  if (nilai >= 86) return { label: "Mumtaz", color: "bg-green-500", passed: true };
  if (nilai >= 78) return { label: "Jayyid Jiddan", color: "bg-blue-500", passed: true };
  if (nilai >= 70) return { label: "Jayyid", color: "bg-amber-500", passed: true };
  return { label: "Mengulang", color: "bg-red-500", passed: false };
};

interface Halaqoh {
  id: string;
  nama_halaqoh: string;
}

interface Kelas {
  id: string;
  nama_kelas: string;
}

const dummySantri = MOCK_SANTRI.map(s => ({
  id: s.id,
  nama: s.nama,
  halaqoh: getHalaqohNama(s.idHalaqoh),
  kelas: getKelasNama(s.idKelas),
  juzSelesai: [] // Mock or derive from somewhere if possible
}));

const dummyHasilUjian = [
  { id: "1", santriId: "1", santriNama: "Ahmad Fauzi", juz: 30, tanggal: "2025-01-05", nilaiTotal: 92, predikat: "Mumtaz", status: "Lulus", penguji: "Ustadz Ahmad", catatanPerHalaman: [], catatanUmum: "Bagus" },
  { id: "2", santriId: "1", santriNama: "Ahmad Fauzi", juz: 29, tanggal: "2025-01-06", nilaiTotal: 88, predikat: "Jayyid Jiddan", status: "Lulus", penguji: "Ustadz Ahmad", catatanPerHalaman: [], catatanUmum: "Perlu lebih lancar" },
];

interface PenilaianHalaman { halaman: number; pancingan: number; catatan: string; }
interface PenilaianJuz { juz: number; halaman: PenilaianHalaman[]; catatanJuz: string; }

const UjianTasmi = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isForm5JuzOpen, setIsForm5JuzOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUjian, setSelectedUjian] = useState<typeof dummyHasilUjian[0] | null>(null);
  const [expandedRules, setExpandedRules] = useState(false);
  const [tasmiType, setTasmiType] = useState<"1juz" | "5juz">("1juz");

  // Registered tasmi candidates (persisted in localStorage)
  const [registeredCandidates, setRegisteredCandidates] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("tasmi-registered-candidates");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const saveRegistered = (ids: string[]) => {
    setRegisteredCandidates(ids);
    localStorage.setItem("tasmi-registered-candidates", JSON.stringify(ids));
  };

  const handleDaftarkan = (studentId: string) => {
    if (registeredCandidates.includes(studentId)) {
      toast.info("Santri sudah terdaftar sebagai peserta tasmi'");
      return;
    }
    const updated = [...registeredCandidates, studentId];
    saveRegistered(updated);
    toast.success("Santri berhasil didaftarkan sebagai peserta tasmi'!");
  };

  const handleBatalkanPendaftaran = (studentId: string) => {
    const updated = registeredCandidates.filter(id => id !== studentId);
    saveRegistered(updated);
    toast.success("Pendaftaran tasmi' dibatalkan");
  };

  // Filtered santri for exam forms - only registered candidates
  const registeredSantriForExam = useMemo(() => {
    return dummySantri.filter(s => registeredCandidates.includes(s.id));
  }, [registeredCandidates]);

  // Auto-open form from calendar redirect
  useEffect(() => {
    if (searchParams.get("santri")) {
      setIsFormOpen(true);
    }
  }, [searchParams]);
  
  const [selectedSantri, setSelectedSantri] = useState("");
  const [selectedJuz, setSelectedJuz] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterKelas, setFilterKelas] = useState("all");

  useEffect(() => {
    if (!selectedJuz) return;

    const totalHalaman = getTotalHalamanByJuz(Number(selectedJuz));

    setPenilaianHalaman(
      Array.from({ length: totalHalaman }, (_, i) => ({
        halaman: i + 1,
        pancingan: 0,
        catatan: "",
      }))
    );
  }, [selectedJuz]);

  const [penilaianHalaman, setPenilaianHalaman] = useState<PenilaianHalaman[]>([]);
  const [catatanUmum, setCatatanUmum] = useState("");
  const [diberhentikan, setDiberhentikan] = useState(false);

  const [selectedSantri5Juz, setSelectedSantri5Juz] = useState("");
  const [selectedJuzList, setSelectedJuzList] = useState<number[]>([]);
  const [selectedDate5Juz, setSelectedDate5Juz] = useState<Date>(new Date());
  const [penilaian5Juz, setPenilaian5Juz] = useState<PenilaianJuz[]>([]);
  const [catatanUmum5Juz, setCatatanUmum5Juz] = useState("");
  const [diberhentikan5Juz, setDiberhentikan5Juz] = useState(false);

  const { entries, addEntries } = useSetoranPersistence();

  const handleSelectJuz5Juz = (juzIndex: number, juzValue: string) => {
    const juzNumber = parseInt(juzValue);

    const newJuzList = [...selectedJuzList];
    newJuzList[juzIndex] = juzNumber;
    setSelectedJuzList(newJuzList);

    const totalHalaman = getTotalHalamanByJuz(juzNumber);

    const newPenilaian = [...penilaian5Juz];
    newPenilaian[juzIndex] = {
      juz: juzNumber,
      halaman: Array.from({ length: totalHalaman }, (_, i) => ({
        halaman: i + 1,
        pancingan: 0,
        catatan: "",
      })),
      catatanJuz: "",
    };

    setPenilaian5Juz(newPenilaian);
  };

  const hitungNilaiTotal = () => penilaianHalaman.reduce((t, h) => t + Math.max(0, 5 - h.pancingan), 0);
  const hitungNilaiTotal5Juz = () => penilaian5Juz.reduce((t, j) => t + j.halaman.reduce((th, h) => th + Math.max(0, 5 - h.pancingan), 0), 0);
  const getMaxScore5Juz = () =>
  penilaian5Juz.reduce(
    (total, juz) => total + juz.halaman.length * 5,
    0
  );
  const hitungPersentase5Juz = () => getMaxScore5Juz() === 0 ? 0 : Math.round((hitungNilaiTotal5Juz() / getMaxScore5Juz()) * 100);

  const nilaiTotal = hitungNilaiTotal();
  const predikat = getPredikat(nilaiTotal);
  const nilaiTotal5Juz = hitungPersentase5Juz();
  const predikat5Juz = getPredikat(nilaiTotal5Juz);

  const resetForm1Juz = () => {
    // Sync with calendar
    addEntries({
      tanggal: selectedDate,
      santriId: selectedSantri,
      jenis: "tasmi",
      juz: Number(selectedJuz),
      status: getPredikat(hitungNilaiTotal()).label,
      catatan: catatanUmum + (diberhentikan ? " (Diberhentikan)" : ""),
    });
    toast.success("Hasil Tasmi' 1 Juz disimpan ke kalender");

    setSelectedSantri(""); setSelectedJuz(""); setPenilaianHalaman([]); setDiberhentikan(false); setSelectedDate(new Date());
  };
  const resetForm5Juz = () => {
    // Sync with calendar
    const newEntries: CalendarEntry[] = selectedJuzList.filter(j => j).map(juz => ({
      tanggal: selectedDate5Juz,
      santriId: selectedSantri5Juz,
      jenis: "tasmi" as const,
      juz: juz,
      status: getPredikat(hitungPersentase5Juz()).label,
      catatan: catatanUmum5Juz + (diberhentikan5Juz ? " (Diberhentikan)" : ""),
    }));
    addEntries(newEntries);
    toast.success("Hasil Tasmi' 5 Juz disimpan ke kalender");

    setSelectedSantri5Juz(""); setSelectedJuzList([]); setPenilaian5Juz([]); setCatatanUmum5Juz(""); setDiberhentikan5Juz(false); setSelectedDate5Juz(new Date());
  };

  const handleUjian = (santri: any) => {
    // No longer opens form - just registers
    handleDaftarkan(santri.id);
  };

  const displayHasilUjian = useMemo(() => {
    const persistedTasmi = entries
      .filter(e => e.jenis === 'tasmi')
      .map(e => ({
        id: e.id,
        santriId: e.santriId,
        santriNama: MOCK_SANTRI.find(s => s.id === e.santriId)?.nama || "Santri",
        juz: e.juz || 30,
        tanggal: e.tanggal instanceof Date ? e.tanggal.toISOString() : e.tanggal,
        nilaiTotal: 0, // We don't store full score details in calendar entries yet
        predikat: e.status || "Selesai",
        status: e.status === "Mengulang" ? "Mengulang" : "Lulus",
        penguji: "Ustadz",
        catatanPerHalaman: [],
        catatanUmum: e.catatan || ""
      }));

    // Merge persisted with dummy data, filter out duplicates by ID if necessary
    const combined = [...persistedTasmi, ...dummyHasilUjian];
    return combined.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [entries]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Award className="w-7 h-7 text-amber-500" />
              Ujian Tasmi'
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Ujian hafalan 1 juz atau 5 juz penuh</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Plus className="w-4 h-4 mr-2" />Tasmi' 1 Juz
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" />Form Ujian Tasmi' (1 Juz)</DialogTitle></DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Santri (Terdaftar)</Label>
                      <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                        <SelectTrigger><SelectValue placeholder="Pilih santri terdaftar" /></SelectTrigger>
                        <SelectContent>
                          {registeredSantriForExam.length === 0 ? (
                            <SelectItem value="__none" disabled>Belum ada santri terdaftar</SelectItem>
                          ) : registeredSantriForExam.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.nama}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <JuzSelector value={selectedJuz} onValueChange={setSelectedJuz} label="Juz" required />
                    <div className="space-y-2">
                      <Label>Tanggal Ujian</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <Card className={`${predikat.passed ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Nilai Total</p><p className="text-3xl font-bold">{nilaiTotal}</p></div><div className="text-right"><p className="text-sm text-muted-foreground">Predikat</p><Badge className={`${predikat.color} text-white`}>{predikat.label}</Badge></div></div></CardContent></Card>
                  <div className="space-y-3"><Label className="text-base font-semibold">Penilaian Per Halaman</Label><p className="text-xs text-muted-foreground">Nilai per halaman: 5 poin. Maks 5 pancingan/halaman.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-2">{penilaianHalaman.map((h, idx) => (<div key={idx} className="flex items-center gap-1.5 p-1.5 border rounded-md bg-card"><span className="text-xs font-medium whitespace-nowrap">Hal {h.halaman} <span className="text-muted-foreground">({Math.max(0, 5 - h.pancingan)})</span></span><div className="flex items-center gap-0.5 ml-auto"><Button type="button" variant="outline" size="sm" className="h-6 w-6 p-0 text-xs" onClick={() => { const n = [...penilaianHalaman]; n[idx].pancingan = Math.max(0, n[idx].pancingan - 1); setPenilaianHalaman(n); }}>-</Button><span className="w-5 text-center text-xs font-medium">{h.pancingan}</span><Button type="button" variant="outline" size="sm" className="h-6 w-6 p-0 text-xs" onClick={() => { const n = [...penilaianHalaman]; n[idx].pancingan = Math.min(5, n[idx].pancingan + 1); setPenilaianHalaman(n); }}>+</Button></div></div>))}</div>
                  </div>
                  <div className="space-y-2"><Label>Catatan Tajwid</Label><Textarea placeholder="Catatan perbaikan..." value={catatanUmum} onChange={(e) => setCatatanUmum(e.target.value)} rows={3} /></div>
                  <Card className="border-red-500/30 bg-red-500/5"><CardContent className="p-4"><div className="flex items-start gap-3"><input type="checkbox" id="diberhentikan" checked={diberhentikan} onChange={(e) => setDiberhentikan(e.target.checked)} className="mt-1" /><div><Label htmlFor="diberhentikan" className="text-red-600 font-medium cursor-pointer">Santri Diberhentikan</Label><p className="text-xs text-muted-foreground mt-1">Centang jika santri harus mengulang.</p></div></div></CardContent></Card>
                  <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setIsFormOpen(false)}>Batal</Button><Button onClick={() => { setIsFormOpen(false); resetForm1Juz(); }} className="bg-gradient-to-r from-amber-500 to-orange-500" disabled={!selectedSantri || !selectedJuz}>Simpan</Button></div>
                </div>
              </DialogContent>
            </Dialog>
            {/* Komponen yang sudah dipisah */}
            {/* <TasmiForm1Juz 
              open={isFormOpen} 
              onOpenChange={setIsFormOpen} 
              santriList={dummySantri} 
              getPredikat={getPredikat} 
            /> */}

            <Dialog open={isForm5JuzOpen} onOpenChange={setIsForm5JuzOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50"><Plus className="w-4 h-4 mr-2" />Tasmi' 5 Juz</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-purple-500" />Form Ujian Tasmi' (5 Juz)</DialogTitle></DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Santri (Terdaftar)</Label>
                      <Select value={selectedSantri5Juz} onValueChange={setSelectedSantri5Juz}>
                        <SelectTrigger><SelectValue placeholder="Pilih santri terdaftar" /></SelectTrigger>
                        <SelectContent>
                          {registeredSantriForExam.length === 0 ? (
                            <SelectItem value="__none" disabled>Belum ada santri terdaftar</SelectItem>
                          ) : registeredSantriForExam.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.nama}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Ujian</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !selectedDate5Juz && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate5Juz ? format(selectedDate5Juz, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={selectedDate5Juz} onSelect={(date) => date && setSelectedDate5Juz(date)} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <Card className={`${predikat5Juz.passed ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Nilai Total</p><p className="text-3xl font-bold">{hitungNilaiTotal5Juz()} <span className="text-lg text-muted-foreground">/ {getMaxScore5Juz()}</span></p><p className="text-xs text-muted-foreground">Persentase: {nilaiTotal5Juz}%</p></div><div className="text-right"><p className="text-sm text-muted-foreground">Predikat</p><Badge className={`${predikat5Juz.color} text-white`}>{predikat5Juz.label}</Badge></div></div></CardContent></Card>
                  <div className="space-y-3"><Label className="text-base font-semibold">Penilaian Per Juz</Label>
                    <Accordion type="multiple" className="space-y-2">
                      {[0, 1, 2, 3, 4].map((juzIndex) => (
                        <AccordionItem key={juzIndex} value={`juz-${juzIndex}`} className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline"><div className="flex items-center gap-3"><Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Juz {juzIndex + 1}</Badge>{selectedJuzList[juzIndex] ? <span className="text-sm font-medium">{getJuzName(selectedJuzList[juzIndex])}{penilaian5Juz[juzIndex] && <span className="text-muted-foreground ml-2">(Nilai: {penilaian5Juz[juzIndex].halaman.reduce((t, h) => t + Math.max(0, 5 - h.pancingan), 0)}/100)</span>}</span> : <span className="text-sm text-muted-foreground">Pilih juz...</span>}</div></AccordionTrigger>
                          <AccordionContent className="pt-4 space-y-4">
                            <JuzSelector value={selectedJuzList[juzIndex]?.toString() || ""} onValueChange={(v) => handleSelectJuz5Juz(juzIndex, v)} label="Pilih Juz" />
                            {penilaian5Juz[juzIndex] && (<><div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-2">{penilaian5Juz[juzIndex].halaman.map((h, hIdx) => (<div key={hIdx} className="flex items-center gap-1.5 p-1.5 border rounded-md bg-card"><span className="text-xs font-medium whitespace-nowrap">Hal {h.halaman} <span className="text-muted-foreground">({Math.max(0, 5 - h.pancingan)})</span></span><div className="flex items-center gap-0.5 ml-auto"><Button type="button" variant="outline" size="sm" className="h-6 w-6 p-0 text-xs" onClick={() => { const n = [...penilaian5Juz]; n[juzIndex].halaman[hIdx].pancingan = Math.max(0, n[juzIndex].halaman[hIdx].pancingan - 1); setPenilaian5Juz(n); }}>-</Button><span className="w-5 text-center text-xs font-medium">{h.pancingan}</span><Button type="button" variant="outline" size="sm" className="h-6 w-6 p-0 text-xs" onClick={() => { const n = [...penilaian5Juz]; n[juzIndex].halaman[hIdx].pancingan = Math.min(5, n[juzIndex].halaman[hIdx].pancingan + 1); setPenilaian5Juz(n); }}>+</Button></div></div>))}</div><div className="space-y-2"><Label>Catatan {getJuzName(selectedJuzList[juzIndex])}</Label><Textarea placeholder="Catatan tajwid..." value={penilaian5Juz[juzIndex].catatanJuz} onChange={(e) => { const n = [...penilaian5Juz]; n[juzIndex].catatanJuz = e.target.value; setPenilaian5Juz(n); }} rows={2} /></div></>)}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                  <div className="space-y-2"><Label>Catatan Umum</Label><Textarea placeholder="Catatan umum..." value={catatanUmum5Juz} onChange={(e) => setCatatanUmum5Juz(e.target.value)} rows={3} /></div>
                  <Card className="border-red-500/30 bg-red-500/5"><CardContent className="p-4"><div className="flex items-start gap-3"><input type="checkbox" id="diberhentikan5juz" checked={diberhentikan5Juz} onChange={(e) => setDiberhentikan5Juz(e.target.checked)} className="mt-1" /><div><Label htmlFor="diberhentikan5juz" className="text-red-600 font-medium cursor-pointer">Santri Diberhentikan</Label></div></div></CardContent></Card>
                  <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setIsForm5JuzOpen(false)}>Batal</Button><Button onClick={() => { setIsForm5JuzOpen(false); resetForm5Juz(); }} className="bg-gradient-to-r from-purple-500 to-pink-500" disabled={!selectedSantri5Juz || penilaian5Juz.length === 0}>Simpan 5 Juz</Button></div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedRules(!expandedRules)}>
            <div className="flex items-center justify-between"><CardTitle className="text-base flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-500" />Ketentuan Ujian Tasmi'</CardTitle>{expandedRules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
          </CardHeader>
          {expandedRules && (<CardContent className="text-sm space-y-4"><div><h4 className="font-semibold mb-2">📚 Urutan Juz:</h4><p className="text-muted-foreground">Juz 30 → 29 → 28 → 27 → 26, lalu Juz 1 → 2 → 3 dst...</p></div><div><h4 className="font-semibold mb-2">🏆 Kriteria:</h4><div className="grid grid-cols-2 sm:grid-cols-5 gap-2"><Badge className="bg-emerald-500 text-white justify-center">96-100: Mumtaz Murtafi'</Badge><Badge className="bg-green-500 text-white justify-center">90-95: Mumtaz</Badge><Badge className="bg-blue-500 text-white justify-center">76-89: Jayyid Jiddan</Badge><Badge className="bg-amber-500 text-white justify-center">70-75: Jayyid</Badge><Badge className="bg-red-500 text-white justify-center">&lt;70: Mengulang</Badge></div></div></CardContent>)}
        </Card>

        {/* Tabs untuk Calon Tasmi dan Riwayat */}
        <Tabs defaultValue="candidates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="candidates">
              <Users className="w-4 h-4 mr-2" />
              Calon Peserta
            </TabsTrigger>
            <TabsTrigger value="history">
              <FileText className="w-4 h-4 mr-2" />
              Riwayat Ujian
            </TabsTrigger>
            <TabsTrigger value="generate">
              <Image className="w-4 h-4 mr-2" />
              Generate Gambar
            </TabsTrigger>
          </TabsList>

          {/* Calon Peserta Tasmi' */}
          <TabsContent value="candidates" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Calon Peserta Ujian Tasmi'
                </CardTitle>
                <CardDescription>
                  Santri yang telah menyelesaikan drill dan siap mengikuti ujian
                </CardDescription>
                <div className="pt-2">
                  <Select value={tasmiType} onValueChange={(v) => setTasmiType(v as "1juz" | "5juz")}>
                    <SelectTrigger className="w-full sm:w-60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1juz">Tasmi' 1 Juz</SelectItem>
                      <SelectItem value="5juz">Tasmi' 5 Juz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">No</TableHead>
                        <TableHead>Nama Lengkap</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead className="text-center">Jumlah Hafalan</TableHead>
                         <TableHead className="text-center">Juz Berikutnya</TableHead>
                         <TableHead className="text-center">Juz Diujikan</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSantriProgress
                        .filter(s => tasmiType === "5juz" ? s.jumlahJuzHafal >= 5 : s.eligibleForTasmi)
                        .map((student, index) => {
                          const nextJuz = getNextTasmiJuz(student.juzSelesai);
                          return (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{index + 1}</TableCell>
                              <TableCell
                                className="font-medium text-primary cursor-pointer hover:underline"
                                onClick={() => {
                                  const s = getSantriByNama(student.nama);
                                  if (s) navigate(`/santri/${s.id}`);
                                }}
                              >{student.nama}</TableCell>
                              <TableCell>{student.kelas}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary">{student.jumlahJuzHafal} Juz</Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                {nextJuz ? (
                                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                                    Juz {nextJuz}
                                  </Badge>
                                ) : (
                                  <Badge className="bg-emerald-500 text-white">Khatam!</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {tasmiType === "5juz" ? (
                                  <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
                                    Juz {student.juzSelesai.slice(-5).join(", ")}
                                  </Badge>
                                ) : nextJuz ? (
                                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                                    Juz {nextJuz}
                                  </Badge>
                                ) : (
                                  <Badge className="bg-emerald-500 text-white">Khatam!</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {registeredCandidates.includes(student.id) ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <Badge className="bg-primary text-primary-foreground">
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Terdaftar
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                      onClick={() => handleBatalkanPendaftaran(student.id)}
                                      title="Batalkan pendaftaran"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-primary text-primary hover:bg-primary/10"
                                    onClick={() => handleUjian(student)}
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Daftarkan
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Riwayat Ujian */}
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Riwayat Ujian Tasmi'
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Santri</TableHead>
                        <TableHead>Juz</TableHead>
                        <TableHead className="text-center">Nilai</TableHead>
                        <TableHead className="text-center">Predikat</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayHasilUjian.map((ujian) => {
                        const pred = getPredikat(ujian.nilaiTotal || (ujian.predikat === "Mengulang" ? 60 : 80));
                        const displayPredikat = ujian.predikat || pred.label;
                        const isLulus = displayPredikat !== "Mengulang";

                        return (
                          <TableRow key={ujian.id}>
                            <TableCell className="whitespace-nowrap">
                              {new Date(ujian.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </TableCell>
                            <TableCell
                              className="font-medium text-primary cursor-pointer hover:underline"
                              onClick={() => {
                                const s = getSantriByNama(ujian.santriNama);
                                if (s) navigate(`/santri/${s.id}`);
                              }}
                            >{ujian.santriNama}</TableCell>
                            <TableCell>{getJuzName(ujian.juz)}</TableCell>
                            <TableCell className="text-center font-bold">{ujian.nilaiTotal || "-"}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={`${isLulus ? 'bg-green-500' : 'bg-red-500'} text-white`}>{displayPredikat}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {isLulus ? (
                                <Badge variant="outline" className="border-green-500 text-green-600">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />Lulus
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-red-500 text-red-600">
                                  <XCircle className="w-3 h-3 mr-1" />Mengulang
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate Gambar */}
          <TabsContent value="generate" className="mt-4">
            <div className="mb-4">
              <Select value={tasmiType} onValueChange={(v) => setTasmiType(v as "1juz" | "5juz")}>
                <SelectTrigger className="w-full sm:w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1juz">Tasmi' 1 Juz</SelectItem>
                  <SelectItem value="5juz">Tasmi' 5 Juz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TasmiCandidateCard
              candidates={mockSantriProgress
                .filter(s => tasmiType === "5juz" ? s.jumlahJuzHafal >= 5 : s.eligibleForTasmi)
                .map((s, i) => {
                  const nextJuz = getNextTasmiJuz(s.juzSelesai);
                  return {
                    no: i + 1,
                    nama: s.nama,
                    kelas: s.kelasNumber,
                    jumlahHafalan: `${s.jumlahJuzHafal} Juz`,
                    juzDiujikan: tasmiType === "5juz"
                      ? `Juz ${s.juzSelesai.slice(-5).join(", ")}`
                      : nextJuz 
                        ? `Juz ${nextJuz}`
                        : "Khatam"
                  };
                })}
            />
          </TabsContent>
        </Tabs>

        {/* Progress Per Santri */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Progress Tasmi' Per Santri
            </CardTitle>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Select value={filterHalaqoh} onValueChange={setFilterHalaqoh}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Halaqoh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Halaqoh</SelectItem>
                  {MOCK_HALAQOH.map((h) => (
                    <SelectItem key={h.id} value={h.id}>{h.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterKelas} onValueChange={setFilterKelas}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {MOCK_KELAS.map((k) => (
                    <SelectItem key={k.id} value={k.id}>{k.nama_kelas}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummySantri
                .filter(s => filterHalaqoh === "all" || s.halaqoh === getHalaqohNama(filterHalaqoh))
                .filter(s => filterKelas === "all" || s.kelas === getKelasNama(filterKelas))
                .map((santri) => (
                <Card key={santri.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{santri.nama}</h4>
                        <p className="text-xs text-muted-foreground">{santri.halaqoh}</p>
                      </div>
                      <Badge variant="outline">{santri.juzSelesai.length} Juz Lulus</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {JUZ_ORDER.slice(0, 10).map((juz) => {
                        const selesai = santri.juzSelesai.includes(juz);
                        return (
                          <div
                            key={juz}
                            className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                              selesai ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}
                            title={`Juz ${juz}`}
                          >
                            {juz}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UjianTasmi;
