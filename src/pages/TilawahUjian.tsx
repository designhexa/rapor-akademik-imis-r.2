 import { Layout } from "@/components/Layout";
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Badge } from "@/components/ui/badge";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { Search, Plus, Award, Clock, FileText, RefreshCw, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { 
  MOCK_SANTRI_TILAWAH, 
  TILAWATI_JILID,
  KRITERIA_KELULUSAN,
  DURASI_UJIAN,
  SKOR_TOTAL_MAKSIMAL,
  getSkorMaksimalByJilid,
  getNilaiMinimumLulusByJilid,
  getAspekPenilaianByJilid
} from "@/lib/tilawah-data";
import { MOCK_KELAS } from "@/lib/mock-data";
import { useSetoranPersistence } from "@/hooks/use-setoran-persistence";
import { toast } from "sonner";

export default function TilawahUjian() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterKelas, setFilterKelas] = useState("all");
   const [dialogOpen, setDialogOpen] = useState(false);
   const [remedialDialogOpen, setRemedialDialogOpen] = useState(false);

  // Auto-open form from calendar redirect
  useEffect(() => {
    if (searchParams.get("santri")) {
      setDialogOpen(true);
    }
  }, [searchParams]);
   const [remedialTarget, setRemedialTarget] = useState<any>(null);
   
   // Form state
   const [selectedSantri, setSelectedSantri] = useState("");
   const [jilidDari, setJilidDari] = useState("");
   const [jilidTujuan, setJilidTujuan] = useState("");
   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
   
   // Nilai Tartil
   const [tartilTajwid, setTartilTajwid] = useState("");
   const [tartilKalimat, setTartilKalimat] = useState("");
   const [tartilKelancaran, setTartilKelancaran] = useState("");
   const [tartilNafas, setTartilNafas] = useState("");
   const [tartilWaqaf, setTartilWaqaf] = useState("");
   
   // Nilai Fashohah
   const [fashohahMakhraj, setFashohahMakhraj] = useState("");
   const [fashohahShifat, setFashohahShifat] = useState("");
   const [fashohahHarakat, setFashohahHarakat] = useState("");
   const [fashohahSuara, setFashohahSuara] = useState("");
   
   // Nilai Tajwid & Ghorib
   const [tajwidPaham, setTajwidPaham] = useState("");
   const [tajwidUraian, setTajwidUraian] = useState("");
   const [ghoribBaca, setGhoribBaca] = useState("");
   const [ghoribKomentar, setGhoribKomentar] = useState("");
 
   const { entries, addEntries } = useSetoranPersistence();

   // Mock ujian data with state
   const [ujianData, setUjianData] = useState([
     { id: "1", santriId: "s1", nama: "Qurrata 'Ayun", kelas: "Paket B Kelas 8", jilidDari: 3, jilidTujuan: 4, nilaiTotal: 17, skorMaksimal: 20, status: "Lulus", isRemedial: false, remedialKe: 0 },
     { id: "2", santriId: "s3", nama: "Fayyadah Fayola", kelas: "Paket B Kelas 8", jilidDari: 4, jilidTujuan: 5, nilaiTotal: 12, skorMaksimal: 30, status: "Mengulang", isRemedial: false, remedialKe: 0 },
     { id: "3", santriId: "s5", nama: "Salwah Lathifah Wasiso", kelas: "Paket B Kelas 8", jilidDari: 2, jilidTujuan: 3, nilaiTotal: 18, skorMaksimal: 20, status: "Lulus", isRemedial: false, remedialKe: 0 },
   ]);
 
   const getKriteriaByJilid = (jilid: number) => {
     return KRITERIA_KELULUSAN[jilid] || ["tartil", "fashohah", "tajwid_dasar", "ghorib"];
   };
 
   const hitungTotalNilai = () => {
     const jilid = parseInt(jilidDari) || 1;
     const kriteria = getKriteriaByJilid(jilid);
     let total = 0;

     // Tartil (max 10)
     if (kriteria.includes("tartil")) {
       const t1 = parseFloat(tartilTajwid) || 0;
       const t2 = parseFloat(tartilKalimat) || 0;
       const t3 = parseFloat(tartilKelancaran) || 0;
       const t4 = parseFloat(tartilNafas) || 0;
       const t5 = parseFloat(tartilWaqaf) || 0;
       total += Math.min(t1 + t2 + t3 + t4 + t5, 10);
     }

     // Fashohah (max 10)
     if (kriteria.includes("fashohah")) {
       const f1 = parseFloat(fashohahMakhraj) || 0;
       const f2 = parseFloat(fashohahShifat) || 0;
       const f3 = parseFloat(fashohahHarakat) || 0;
       const f4 = parseFloat(fashohahSuara) || 0;
       total += Math.min(f1 + f2 + f3 + f4, 10);
     }

     // Tajwid (max 10)
     if (kriteria.includes("tajwid_dasar")) {
       const tj1 = parseFloat(tajwidPaham) || 0;
       const tj2 = parseFloat(tajwidUraian) || 0;
       total += Math.min(tj1 + tj2, 10);
     }

     // Ghorib (max 10)
     if (kriteria.includes("ghorib")) {
       const g1 = parseFloat(ghoribBaca) || 0;
       const g2 = parseFloat(ghoribKomentar) || 0;
       total += Math.min(g1 + g2, 10);
     }

     return Math.round(total * 10) / 10; // Round to 1 decimal
   };

   const getSkorMaksimal = () => {
     const jilid = parseInt(jilidDari) || 1;
     return getSkorMaksimalByJilid(jilid);
   };

   const getNilaiMinimum = () => {
     const jilid = parseInt(jilidDari) || 1;
     return getNilaiMinimumLulusByJilid(jilid);
   };
 
   const handleSubmit = () => {
     if (!selectedSantri || !jilidDari || !jilidTujuan) {
       toast.error("Lengkapi data ujian");
       return;
     }

     const totalNilai = hitungTotalNilai();
     const nilaiMinimum = getNilaiMinimum();
     const lulus = totalNilai >= nilaiMinimum;
     const santriData = MOCK_SANTRI_TILAWAH.find(s => s.id === selectedSantri);

     const newUjian = {
       id: `uj${Date.now()}`,
       santriId: selectedSantri,
       nama: santriData?.nama || "",
       kelas: santriData?.kelas || "",
       jilidDari: parseInt(jilidDari),
       jilidTujuan: parseInt(jilidTujuan),
       nilaiTotal: totalNilai,
       skorMaksimal: getSkorMaksimal(),
       status: lulus ? "Lulus" : "Mengulang",
       isRemedial: false,
       remedialKe: 0,
     };

     setUjianData(prev => [newUjian, ...prev]);
     
     // Sync with calendar
     addEntries({
       tanggal: selectedDate,
       santriId: selectedSantri,
       jenis: "ujian_jilid",
       jilid: jilidDari,
       status: lulus ? "Lulus" : "Mengulang",
       catatan: `Ujian Jilid ${jilidDari} ke ${jilidTujuan}. Skor: ${totalNilai}/${getSkorMaksimal()}`,
     });

     toast.success(`Ujian berhasil disimpan. Nilai: ${totalNilai}/${getSkorMaksimal()} - ${lulus ? "LULUS" : "MENGULANG"}`);
     setDialogOpen(false);
     resetForm();
   };

   const handleOpenRemedial = (item: any) => {
     setRemedialTarget(item);
     setJilidDari(item.jilidDari.toString());
     setJilidTujuan(item.jilidTujuan.toString());
     setRemedialDialogOpen(true);
   };

   const handleSubmitRemedial = () => {
     if (!remedialTarget) return;
     const totalNilai = hitungTotalNilai();
     const nilaiMinimum = getNilaiMinimum();
     const lulus = totalNilai >= nilaiMinimum;

     const remedialResult = {
       id: `rem${Date.now()}`,
       santriId: remedialTarget.santriId,
       nama: remedialTarget.nama,
       kelas: remedialTarget.kelas,
       jilidDari: remedialTarget.jilidDari,
       jilidTujuan: remedialTarget.jilidTujuan,
       nilaiTotal: totalNilai,
       skorMaksimal: getSkorMaksimal(),
       status: lulus ? "Lulus" : "Mengulang",
       isRemedial: true,
       remedialKe: (remedialTarget.remedialKe || 0) + 1,
     };

     // Update the original entry status if lulus
     setUjianData(prev => {
       const updated = prev.map(u => u.id === remedialTarget.id ? { ...u, status: lulus ? "Lulus (Remedial)" : "Mengulang" } : u);
       return [remedialResult, ...updated.filter(u => u.id !== remedialTarget.id)];
     });

     // Sync with calendar
     addEntries({
       tanggal: new Date(), // Remedial is usually today, but we could use a date picker here too if needed
       santriId: remedialTarget.santriId,
       jenis: "ujian_jilid",
       jilid: remedialTarget.jilidDari,
       status: lulus ? "Lulus" : "Mengulang",
       catatan: `Remedial ${remedialResult.remedialKe} Jilid ${remedialTarget.jilidDari}. Skor: ${totalNilai}/${getSkorMaksimal()}`,
     });

     toast.success(`Remedial ke-${remedialResult.remedialKe}: Nilai ${totalNilai}/${getSkorMaksimal()} - ${lulus ? "LULUS" : "MASIH MENGULANG"}`);
     setRemedialDialogOpen(false);
     setRemedialTarget(null);
     resetForm();
   };
 
   const resetForm = () => {
     setSelectedSantri("");
     setJilidDari("");
     setJilidTujuan("");
     setSelectedDate(new Date());
     setTartilTajwid("");
     setTartilKalimat("");
     setTartilKelancaran("");
     setTartilNafas("");
     setTartilWaqaf("");
     setFashohahMakhraj("");
     setFashohahShifat("");
     setFashohahHarakat("");
     setFashohahSuara("");
     setTajwidPaham("");
     setTajwidUraian("");
     setGhoribBaca("");
     setGhoribKomentar("");
   };
 
   const kriteriaPenilaian = jilidDari
    ? getAspekPenilaianByJilid(parseInt(jilidDari))
    : ["tartil", "fashohah", "tajwid_dasar", "ghorib"];

  const displayUjianData = useMemo(() => {
    const persistedUjian = entries
      .filter(e => e.jenis === 'ujian_jilid')
      .map(e => ({
        id: e.id,
        santriId: e.santriId,
        nama: MOCK_SANTRI_TILAWAH.find(s => s.id === e.santriId)?.nama || "Santri",
        kelas: MOCK_SANTRI_TILAWAH.find(s => s.id === e.santriId)?.kelas || "Kelas",
        jilidDari: parseInt(e.jilid as string) || 1,
        jilidTujuan: (parseInt(e.jilid as string) || 1) + 1,
        nilaiTotal: 0,
        skorMaksimal: 0,
        status: e.status || "Selesai",
        isRemedial: e.catatan?.toLowerCase().includes("remedial") || false,
        remedialKe: 0,
        tanggal: e.tanggal instanceof Date ? e.tanggal.toISOString() : e.tanggal
      }));

    const combined = [...ujianData.map(u => ({ ...u, tanggal: '' })), ...persistedUjian];
    return combined.sort((a, b) => {
      const dateA = a.tanggal ? new Date(a.tanggal).getTime() : 0;
      const dateB = b.tanggal ? new Date(b.tanggal).getTime() : 0;
      return dateB - dateA;
    });
  }, [entries, ujianData]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ujian Tilawah Kenaikan Jilid</h1>
             <p className="text-muted-foreground text-sm mt-1">Kelola ujian kenaikan jilid metode Tilawati</p>
          </div>
           <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
             <DialogTrigger asChild>
               <Button>
                 <Plus className="w-4 h-4 mr-2" />
                 Tambah Ujian
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                 <DialogTitle className="flex items-center gap-2">
                   <Award className="w-5 h-5" />
                   Ujian Kenaikan Jilid
                 </DialogTitle>
               </DialogHeader>
               
               <div className="space-y-4 pt-4">
               {/* Info Ujian */}
                 <Card className="bg-muted/50">
                   <CardContent className="pt-4">
                     <div className="flex flex-wrap items-center gap-4 text-sm">
                       <div className="flex items-center gap-2">
                         <Clock className="w-4 h-4 text-muted-foreground" />
                         <span>Durasi: {DURASI_UJIAN} menit per santri</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <FileText className="w-4 h-4 text-muted-foreground" />
                         <span>Skor Maksimal: {jilidDari ? getSkorMaksimal() : SKOR_TOTAL_MAKSIMAL}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Award className="w-4 h-4 text-muted-foreground" />
                         <span>Nilai Minimum Lulus: {jilidDari ? getNilaiMinimum() : "70%"}</span>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
 
                 {/* Pilih Santri, Jilid & Tanggal */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="space-y-2">
                     <Label>Pilih Santri</Label>
                     <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                       <SelectTrigger>
                         <SelectValue placeholder="Pilih santri..." />
                       </SelectTrigger>
                       <SelectContent>
                         {MOCK_SANTRI_TILAWAH.map((santri) => (
                           <SelectItem key={santri.id} value={santri.id}>
                             {santri.nama} - {santri.kelas}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label>Jilid Saat Ini</Label>
                     <Select value={jilidDari} onValueChange={(v) => {
                       setJilidDari(v);
                       setJilidTujuan((parseInt(v) + 1).toString());
                     }}>
                       <SelectTrigger>
                         <SelectValue placeholder="Pilih jilid..." />
                       </SelectTrigger>
                       <SelectContent>
                         {TILAWATI_JILID.map((jilid) => (
                           <SelectItem key={jilid.jilid} value={jilid.jilid.toString()}>
                             Jilid {jilid.jilid}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label>Naik ke Jilid</Label>
                     <Select value={jilidTujuan} onValueChange={setJilidTujuan}>
                       <SelectTrigger>
                         <SelectValue placeholder="Jilid tujuan..." />
                       </SelectTrigger>
                       <SelectContent>
                         {TILAWATI_JILID.filter(j => j.jilid > parseInt(jilidDari || "0")).map((jilid) => (
                           <SelectItem key={jilid.jilid} value={jilid.jilid.toString()}>
                             Jilid {jilid.jilid}
                           </SelectItem>
                         ))}
                         <SelectItem value="7">Al-Qur'an</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label>Tanggal Ujian</Label>
                     <Popover>
                       <PopoverTrigger asChild>
                         <Button
                           variant={"outline"}
                           className={cn(
                             "w-full justify-start text-left font-normal",
                             !selectedDate && "text-muted-foreground"
                           )}
                         >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {selectedDate ? format(selectedDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0">
                         <Calendar
                           mode="single"
                           selected={selectedDate}
                           onSelect={(date) => date && setSelectedDate(date)}
                           initialFocus
                         />
                       </PopoverContent>
                     </Popover>
                   </div>
                 </div>
 
                 {/* Kriteria Penilaian Info */}
                 {jilidDari && (
                   <Card className="border-primary/30">
                     <CardHeader className="pb-2">
                       <CardTitle className="text-base">Kriteria Penilaian Jilid {jilidDari}</CardTitle>
                       <CardDescription>
                         {parseInt(jilidDari) <= 3 
                           ? "Jilid 1-3: Fokus pada Fashohah & Tartil"
                           : parseInt(jilidDari) <= 5
                           ? "Jilid 4-5: Tartil, Fashohah & Tajwid Dasar"
                           : "Jilid 6: Penilaian lengkap termasuk Ghoribul Qur'an"}
                       </CardDescription>
                     </CardHeader>
                   </Card>
                 )}
 
                 {/* Tabs Penilaian */}
                 <Tabs defaultValue="tartil" className="w-full">
                   <TabsList className="grid w-full grid-cols-4">
                     <TabsTrigger value="tartil" disabled={!kriteriaPenilaian.includes("tartil")}>
                       Tartil
                     </TabsTrigger>
                     <TabsTrigger value="fashohah" disabled={!kriteriaPenilaian.includes("fashohah")}>
                       Fashohah
                     </TabsTrigger>
                     <TabsTrigger value="tajwid" disabled={!kriteriaPenilaian.includes("tajwid_dasar")}>
                       Tajwid
                     </TabsTrigger>
                     <TabsTrigger value="ghorib" disabled={!kriteriaPenilaian.includes("ghorib")}>
                       Ghorib
                     </TabsTrigger>
                   </TabsList>
 
                   <TabsContent value="tartil" className="mt-4">
                     <Card>
                       <CardHeader className="pb-3">
                         <CardTitle className="text-sm flex items-center justify-between">
                           <span>Penilaian Tartil</span>
                           <Badge variant="outline">Maks: 10</Badge>
                         </CardTitle>
                         <CardDescription>Kesempurnaan bacaan, kelancaran, dan ketertiban</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-3">
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <Label className="text-xs">Kesempurnaan Tajwid (0-2)</Label>
                             <Input type="number" min={0} max={2} step={0.5} value={tartilTajwid} onChange={(e) => setTartilTajwid(e.target.value)} placeholder="0-2" />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-xs">Kesempurnaan Kalimat (0-2)</Label>
                             <Input type="number" min={0} max={2} step={0.5} value={tartilKalimat} onChange={(e) => setTartilKalimat(e.target.value)} placeholder="0-2" />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-xs">Kelancaran (0-4)</Label>
                             <Input type="number" min={0} max={4} step={0.5} value={tartilKelancaran} onChange={(e) => setTartilKelancaran(e.target.value)} placeholder="0-4" />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-xs">Nafas (0-1)</Label>
                             <Input type="number" min={0} max={1} step={0.5} value={tartilNafas} onChange={(e) => setTartilNafas(e.target.value)} placeholder="0-1" />
                           </div>
                           <div className="space-y-2 col-span-2">
                             <Label className="text-xs">Waqaf (0-1)</Label>
                             <Input type="number" min={0} max={1} step={0.5} value={tartilWaqaf} onChange={(e) => setTartilWaqaf(e.target.value)} placeholder="0-1" />
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   </TabsContent>
 
                   <TabsContent value="fashohah" className="mt-4">
                     <Card>
                       <CardHeader className="pb-3">
                         <CardTitle className="text-sm flex items-center justify-between">
                           <span>Penilaian Fashohah</span>
                           <Badge variant="outline">Maks: 10</Badge>
                         </CardTitle>
                         <CardDescription>Kesempurnaan makhorijul huruf dan shifatul huruf</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-3">
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <Label className="text-xs">Makhorijul Huruf (0-4)</Label>
                             <Input type="number" min={0} max={4} step={0.5} value={fashohahMakhraj} onChange={(e) => setFashohahMakhraj(e.target.value)} placeholder="0-4" />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-xs">Shifatul Huruf (0-3)</Label>
                             <Input type="number" min={0} max={3} step={0.5} value={fashohahShifat} onChange={(e) => setFashohahShifat(e.target.value)} placeholder="0-3" />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-xs">Harakat Tidak Imalah (0-2)</Label>
                             <Input type="number" min={0} max={2} step={0.5} value={fashohahHarakat} onChange={(e) => setFashohahHarakat(e.target.value)} placeholder="0-2" />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-xs">Suara Jelas (0-1)</Label>
                             <Input type="number" min={0} max={1} step={0.5} value={fashohahSuara} onChange={(e) => setFashohahSuara(e.target.value)} placeholder="0-1" />
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   </TabsContent>
 
                   <TabsContent value="tajwid" className="mt-4">
                     <Card>
                       <CardHeader className="pb-3">
                         <CardTitle className="text-sm flex items-center justify-between">
                           <span>Penilaian Tajwid Dasar</span>
                           <Badge variant="outline">Maks: 10</Badge>
                         </CardTitle>
                         <CardDescription>Pemahaman dan kemampuan menguraikan hukum tajwid</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-3">
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <Label className="text-xs">Paham Menguraikan Hukum Tajwid (0-5)</Label>
                             <Input type="number" min={0} max={5} step={0.5} value={tajwidPaham} onChange={(e) => setTajwidPaham(e.target.value)} placeholder="0-5" />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-xs">Mampu Menguraikan Hukum Tajwid (0-5)</Label>
                             <Input type="number" min={0} max={5} step={0.5} value={tajwidUraian} onChange={(e) => setTajwidUraian(e.target.value)} placeholder="0-5" />
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   </TabsContent>
 
                   <TabsContent value="ghorib" className="mt-4">
                     <Card>
                       <CardHeader className="pb-3">
                         <CardTitle className="text-sm flex items-center justify-between">
                           <span>Penilaian Ghoribul Qur'an</span>
                           <Badge variant="outline">Maks: 10</Badge>
                         </CardTitle>
                         <CardDescription>Kemampuan membaca dan memahami bacaan ghorib</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-3">
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <Label className="text-xs">Membaca Ghorib (0-6)</Label>
                             <Input type="number" min={0} max={6} step={0.5} value={ghoribBaca} onChange={(e) => setGhoribBaca(e.target.value)} placeholder="0-6" />
                           </div>
                           <div className="space-y-2">
                             <Label className="text-xs">Komentar Ghorib (0-4)</Label>
                             <Input type="number" min={0} max={4} step={0.5} value={ghoribKomentar} onChange={(e) => setGhoribKomentar(e.target.value)} placeholder="0-4" />
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   </TabsContent>
                 </Tabs>
 
                 {/* Total Nilai */}
                 <Card className="bg-primary/5 border-primary/20">
                   <CardContent className="pt-4">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-sm text-muted-foreground">Total Nilai</p>
                         <p className="text-3xl font-bold">{hitungTotalNilai()} <span className="text-lg font-normal text-muted-foreground">/ {getSkorMaksimal()}</span></p>
                       </div>
                       <Badge 
                         variant={hitungTotalNilai() >= getNilaiMinimum() ? "default" : "destructive"}
                         className="text-lg px-4 py-2"
                       >
                         {hitungTotalNilai() >= getNilaiMinimum() ? "LULUS" : "MENGULANG"}
                       </Badge>
                     </div>
                     <p className="text-xs text-muted-foreground mt-2">
                       Minimum lulus: {getNilaiMinimum()} ({Math.round((getNilaiMinimum() / getSkorMaksimal()) * 100)}%)
                     </p>
                   </CardContent>
                 </Card>
 
                 <div className="flex justify-end gap-2 pt-4">
                   <Button variant="outline" onClick={() => setDialogOpen(false)}>
                     Batal
                   </Button>
                   <Button onClick={handleSubmit}>
                     Simpan Hasil Ujian
                   </Button>
                 </div>
               </div>
             </DialogContent>
           </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Ujian Tilawah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari santri..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterHalaqoh} onValueChange={setFilterHalaqoh}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Pilih Halaqoh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Halaqoh</SelectItem>
                   <SelectItem value="Halaqoh 1">Halaqoh 1</SelectItem>
                   <SelectItem value="Halaqoh 2">Halaqoh 2</SelectItem>
                   <SelectItem value="Halaqoh 3">Halaqoh 3</SelectItem>
                   <SelectItem value="Halaqoh 4">Halaqoh 4</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterKelas} onValueChange={setFilterKelas}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {MOCK_KELAS.map((k) => (
                    <SelectItem key={k.id} value={k.id}>
                      {k.nama_kelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Table className="w-full min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead>Nama Santri</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Jilid Dari</TableHead>
                  <TableHead>Naik ke</TableHead>
                  <TableHead className="text-center w-24">Nilai</TableHead>
                  <TableHead className="text-center w-28">Status</TableHead>
                  <TableHead className="text-center w-28">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {displayUjianData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      Belum ada data ujian tilawah
                    </TableCell>
                  </TableRow>
                ) : (
                  displayUjianData.map((item, index) => {
                    const isLulus = item.status?.toLowerCase().includes("lulus");
                    const isMengulang = item.status === "Mengulang";

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="text-center w-12">{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {item.nama}
                          {item.isRemedial && (
                            <Badge variant="outline" className="ml-2 text-xs">Remedial {item.remedialKe}</Badge>
                          )}
                        </TableCell>
                        <TableCell>{item.kelas}</TableCell>
                        <TableCell>Jilid {item.jilidDari}</TableCell>
                        <TableCell>{item.jilidTujuan <= 6 ? `Jilid ${item.jilidTujuan}` : "Al-Qur'an"}</TableCell>
                        <TableCell className="text-center font-semibold w-24">
                          {item.nilaiTotal}/{item.skorMaksimal}
                        </TableCell>
                        <TableCell className="text-center w-28">
                          <Badge className={isLulus ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center w-28">
                          {isMengulang && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleOpenRemedial(item)}
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Remedial
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Remedial Dialog */}
        <Dialog open={remedialDialogOpen} onOpenChange={setRemedialDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Remedial Ujian Kenaikan Jilid
                {remedialTarget && (
                  <Badge variant="outline" className="ml-2">
                    {remedialTarget.nama} - Jilid {remedialTarget.jilidDari} → {remedialTarget.jilidTujuan}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {remedialTarget && (
              <div className="space-y-4 pt-4">
                <Card className="bg-destructive/5 border-destructive/20">
                  <CardContent className="pt-4">
                    <div className="text-sm space-y-1">
                      <p><strong>Santri:</strong> {remedialTarget.nama}</p>
                      <p><strong>Nilai sebelumnya:</strong> {remedialTarget.nilaiTotal}/{remedialTarget.skorMaksimal} (Mengulang)</p>
                      <p><strong>Remedial ke:</strong> {(remedialTarget.remedialKe || 0) + 1}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Same scoring tabs as main form */}
                <Tabs defaultValue="tartil" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="tartil">Tartil</TabsTrigger>
                    <TabsTrigger value="fashohah">Fashohah</TabsTrigger>
                    <TabsTrigger value="tajwid" disabled={!getAspekPenilaianByJilid(remedialTarget.jilidDari).includes("tajwid_dasar")}>Tajwid</TabsTrigger>
                    <TabsTrigger value="ghorib" disabled={!getAspekPenilaianByJilid(remedialTarget.jilidDari).includes("ghorib")}>Ghorib</TabsTrigger>
                  </TabsList>

                  <TabsContent value="tartil" className="mt-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Penilaian Tartil <Badge variant="outline">Maks: 10</Badge></CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label className="text-xs">Kesempurnaan Tajwid (0-2)</Label><Input type="number" min={0} max={2} step={0.5} value={tartilTajwid} onChange={e => setTartilTajwid(e.target.value)} /></div>
                          <div className="space-y-2"><Label className="text-xs">Kesempurnaan Kalimat (0-2)</Label><Input type="number" min={0} max={2} step={0.5} value={tartilKalimat} onChange={e => setTartilKalimat(e.target.value)} /></div>
                          <div className="space-y-2"><Label className="text-xs">Kelancaran (0-4)</Label><Input type="number" min={0} max={4} step={0.5} value={tartilKelancaran} onChange={e => setTartilKelancaran(e.target.value)} /></div>
                          <div className="space-y-2"><Label className="text-xs">Nafas (0-1)</Label><Input type="number" min={0} max={1} step={0.5} value={tartilNafas} onChange={e => setTartilNafas(e.target.value)} /></div>
                          <div className="space-y-2 col-span-2"><Label className="text-xs">Waqaf (0-1)</Label><Input type="number" min={0} max={1} step={0.5} value={tartilWaqaf} onChange={e => setTartilWaqaf(e.target.value)} /></div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="fashohah" className="mt-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Penilaian Fashohah <Badge variant="outline">Maks: 10</Badge></CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label className="text-xs">Makhorijul Huruf (0-4)</Label><Input type="number" min={0} max={4} step={0.5} value={fashohahMakhraj} onChange={e => setFashohahMakhraj(e.target.value)} /></div>
                          <div className="space-y-2"><Label className="text-xs">Shifatul Huruf (0-3)</Label><Input type="number" min={0} max={3} step={0.5} value={fashohahShifat} onChange={e => setFashohahShifat(e.target.value)} /></div>
                          <div className="space-y-2"><Label className="text-xs">Harakat Tidak Imalah (0-2)</Label><Input type="number" min={0} max={2} step={0.5} value={fashohahHarakat} onChange={e => setFashohahHarakat(e.target.value)} /></div>
                          <div className="space-y-2"><Label className="text-xs">Suara Jelas (0-1)</Label><Input type="number" min={0} max={1} step={0.5} value={fashohahSuara} onChange={e => setFashohahSuara(e.target.value)} /></div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tajwid" className="mt-4">
                    <Card>
                      <CardHeader className="pb-3"><CardTitle className="text-sm">Penilaian Tajwid <Badge variant="outline">Maks: 10</Badge></CardTitle></CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label className="text-xs">Paham Hukum Tajwid (0-5)</Label><Input type="number" min={0} max={5} step={0.5} value={tajwidPaham} onChange={e => setTajwidPaham(e.target.value)} /></div>
                          <div className="space-y-2"><Label className="text-xs">Mampu Menguraikan (0-5)</Label><Input type="number" min={0} max={5} step={0.5} value={tajwidUraian} onChange={e => setTajwidUraian(e.target.value)} /></div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="ghorib" className="mt-4">
                    <Card>
                      <CardHeader className="pb-3"><CardTitle className="text-sm">Penilaian Ghorib <Badge variant="outline">Maks: 10</Badge></CardTitle></CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label className="text-xs">Membaca Ghorib (0-6)</Label><Input type="number" min={0} max={6} step={0.5} value={ghoribBaca} onChange={e => setGhoribBaca(e.target.value)} /></div>
                          <div className="space-y-2"><Label className="text-xs">Komentar Ghorib (0-4)</Label><Input type="number" min={0} max={4} step={0.5} value={ghoribKomentar} onChange={e => setGhoribKomentar(e.target.value)} /></div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Total */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Nilai Remedial</p>
                        <p className="text-3xl font-bold">{hitungTotalNilai()} <span className="text-lg font-normal text-muted-foreground">/ {getSkorMaksimal()}</span></p>
                      </div>
                      <Badge className={`text-lg px-4 py-2 ${hitungTotalNilai() >= getNilaiMinimum() ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                        {hitungTotalNilai() >= getNilaiMinimum() ? "LULUS" : "MENGULANG"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setRemedialDialogOpen(false)}>Batal</Button>
                  <Button onClick={handleSubmitRemedial}>Simpan Hasil Remedial</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
