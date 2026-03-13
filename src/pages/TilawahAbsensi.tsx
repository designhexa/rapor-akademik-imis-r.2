 import { useNavigate } from "react-router-dom";
 import { Layout } from "@/components/Layout";
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Badge } from "@/components/ui/badge";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
 import { Textarea } from "@/components/ui/textarea";
 import { Search, Plus, BookOpen } from "lucide-react";
 import { useState, useEffect } from "react";

 import { 
   MOCK_SETORAN_TILAWAH, 
   MOCK_SANTRI_TILAWAH, 
   TILAWATI_JILID,
   HALAMAN_PER_JILID,
   getAspekPenilaianByJilid,
   SetoranTilawah 
 } from "@/lib/tilawah-data";
 import { MOCK_KELAS, getSantriByNama } from "@/lib/mock-data";
 import { toast } from "sonner";

type TilawahAbsensiProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialSantriId?: string;
  initialTanggal?: Date;
};

export default function TilawahAbsensi({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  initialSantriId,
  initialTanggal,
}: TilawahAbsensiProps = {}) {
  const navigate = useNavigate();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  const onOpenChange = externalOnOpenChange ?? setInternalOpen;
  const [search, setSearch] = useState("");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterKelas, setFilterKelas] = useState("all");

  useEffect(() => {
    if (open) {
      if (initialSantriId) {
        setSelectedSantri(initialSantriId);
      }
    }
  }, [open, initialSantriId]);
   
   // Form state
   const [selectedSantri, setSelectedSantri] = useState("");
   const [selectedJilid, setSelectedJilid] = useState("");
   const [halamanDari, setHalamanDari] = useState("");
   const [halamanSampai, setHalamanSampai] = useState("");
   const [nilaiTartil, setNilaiTartil] = useState("");
   const [nilaiFashohah, setNilaiFashohah] = useState("");
   const [nilaiTajwid, setNilaiTajwid] = useState("");
   const [nilaiGhorib, setNilaiGhorib] = useState("");
   const [catatan, setCatatan] = useState("");
   const [status, setStatus] = useState<"selesai" | "lanjut" | "ulang">("lanjut");
 
   const aspekPenilaian = selectedJilid ? getAspekPenilaianByJilid(parseInt(selectedJilid)) : [];
 
   const getSantriName = (idSantri: string) => {
     const santri = MOCK_SANTRI_TILAWAH.find(s => s.id === idSantri);
     return santri?.nama || "Unknown";
   };
 
   const getSantriKelas = (idSantri: string) => {
     const santri = MOCK_SANTRI_TILAWAH.find(s => s.id === idSantri);
     return santri?.kelas || "-";
   };
 
   const getSantriHalaqoh = (idSantri: string) => {
     const santri = MOCK_SANTRI_TILAWAH.find(s => s.id === idSantri);
     return santri?.halaqoh || "-";
   };
 
   const getStatusBadge = (status: string) => {
     switch (status) {
       case 'selesai':
         return <Badge variant="outline" className="border-green-500 text-green-700">Selesai</Badge>;
       case 'lanjut':
         return <Badge variant="outline" className="border-blue-500 text-blue-700">Lanjut</Badge>;
       case 'ulang':
         return <Badge variant="outline" className="border-red-500 text-red-700">Ulang</Badge>;
       default:
         return <Badge variant="secondary">{status}</Badge>;
     }
   };
 
   const handleSubmit = () => {
     if (!selectedSantri || !selectedJilid || !halamanDari || !halamanSampai) {
       toast.error("Lengkapi data setoran");
       return;
     }
     
     toast.success("Setoran tilawah berhasil disimpan");
     onOpenChange(false);
     resetForm();
   };
 
   const resetForm = () => {
     setSelectedSantri("");
     setSelectedJilid("");
     setHalamanDari("");
     setHalamanSampai("");
     setNilaiTartil("");
     setNilaiFashohah("");
     setNilaiTajwid("");
     setNilaiGhorib("");
     setCatatan("");
     setStatus("lanjut");
   };
 
   const filteredSetoran = MOCK_SETORAN_TILAWAH.filter(setoran => {
     const santri = MOCK_SANTRI_TILAWAH.find(s => s.id === setoran.idSantri);
     if (!santri) return false;
     
     const matchSearch = santri.nama.toLowerCase().includes(search.toLowerCase());
     const matchHalaqoh = filterHalaqoh === "all" || santri.halaqoh === filterHalaqoh;
     const matchKelas = filterKelas === "all" || santri.kelas === filterKelas;
     
     return matchSearch && matchHalaqoh && matchKelas;
   });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Setoran Tilawah</h1>
             <p className="text-muted-foreground text-sm mt-1">Kelola setoran tilawah metode Tilawati</p>
          </div>
           <Dialog open={open} onOpenChange={onOpenChange}>
             <DialogTrigger asChild>
               <Button>
                 <Plus className="w-4 h-4 mr-2" />
                 Tambah Setoran
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                 <DialogTitle className="flex items-center gap-2">
                   <BookOpen className="w-5 h-5" />
                   Tambah Setoran Tilawah
                 </DialogTitle>
               </DialogHeader>
               
               <div className="space-y-4 pt-4">
                 {/* Pilih Santri */}
                 <div className="space-y-2">
                   <Label>Pilih Santri</Label>
                   <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                     <SelectTrigger>
                       <SelectValue placeholder="Pilih santri..." />
                     </SelectTrigger>
                     <SelectContent>
                       {MOCK_SANTRI_TILAWAH.map((santri) => (
                         <SelectItem key={santri.id} value={santri.id}>
                           {santri.nama} - {santri.kelas} (Jilid {santri.jilidSaatIni})
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
 
                 {/* Pilih Jilid */}
                 <div className="space-y-2">
                   <Label>Jilid</Label>
                   <Select value={selectedJilid} onValueChange={setSelectedJilid}>
                     <SelectTrigger>
                       <SelectValue placeholder="Pilih jilid..." />
                     </SelectTrigger>
                     <SelectContent>
                    {TILAWATI_JILID.map((jilid) => (
                          <SelectItem key={jilid.jilid} value={jilid.jilid.toString()}>
                            {jilid.nama} (Hal 1-{jilid.totalHalaman})
                          </SelectItem>
                        ))}
                        <SelectItem value="quran">Al-Qur'an</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
 
                 {/* Halaman */}
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label>Halaman Dari</Label>
                     <Input 
                       type="number" 
                       min={1} 
                       max={HALAMAN_PER_JILID}
                       value={halamanDari}
                       onChange={(e) => setHalamanDari(e.target.value)}
                       placeholder="1"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>Halaman Sampai</Label>
                     <Input 
                       type="number" 
                       min={1} 
                       max={HALAMAN_PER_JILID}
                       value={halamanSampai}
                       onChange={(e) => setHalamanSampai(e.target.value)}
                       placeholder="3"
                     />
                   </div>
                 </div>
 
                 {/* Penilaian */}
                 <Card>
                   <CardHeader className="pb-3">
                     <CardTitle className="text-base">Penilaian</CardTitle>
                     <CardDescription>
                       {selectedJilid ? (
                         parseInt(selectedJilid) <= 3 
                           ? "Jilid 1-3: Penilaian Fashohah & Tartil"
                           : parseInt(selectedJilid) <= 5
                           ? "Jilid 4-5: Penilaian Tartil, Fashohah & Tajwid Dasar"
                           : "Jilid 6: Penilaian lengkap (Tartil, Fashohah, Tajwid, Ghorib)"
                       ) : "Pilih jilid untuk melihat aspek penilaian"}
                     </CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-3">
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label>Nilai Tartil (0-100)</Label>
                         <Input 
                           type="number" 
                           min={0} 
                           max={100}
                           value={nilaiTartil}
                           onChange={(e) => setNilaiTartil(e.target.value)}
                           placeholder="85"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>Nilai Fashohah (0-100)</Label>
                         <Input 
                           type="number" 
                           min={0} 
                           max={100}
                           value={nilaiFashohah}
                           onChange={(e) => setNilaiFashohah(e.target.value)}
                           placeholder="85"
                         />
                       </div>
                     </div>
                     
                     {aspekPenilaian.includes("tajwid_dasar") && (
                       <div className="space-y-2">
                         <Label>Nilai Tajwid Dasar (0-100)</Label>
                         <Input 
                           type="number" 
                           min={0} 
                           max={100}
                           value={nilaiTajwid}
                           onChange={(e) => setNilaiTajwid(e.target.value)}
                           placeholder="80"
                         />
                       </div>
                     )}
                     
                     {aspekPenilaian.includes("ghorib") && (
                       <div className="space-y-2">
                         <Label>Nilai Ghoribul Qur'an (0-100)</Label>
                         <Input 
                           type="number" 
                           min={0} 
                           max={100}
                           value={nilaiGhorib}
                           onChange={(e) => setNilaiGhorib(e.target.value)}
                           placeholder="75"
                         />
                       </div>
                     )}
                   </CardContent>
                 </Card>
 
                 {/* Status */}
                 <div className="space-y-2">
                   <Label>Status Setoran</Label>
                   <Select value={status} onValueChange={(v) => setStatus(v as "selesai" | "lanjut" | "ulang")}>
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="selesai">Selesai - Santri menyelesaikan materi dengan baik</SelectItem>
                       <SelectItem value="lanjut">Lanjut - Santri dapat melanjutkan ke halaman berikutnya</SelectItem>
                       <SelectItem value="ulang">Ulang - Santri perlu mengulang materi</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
 
                 {/* Catatan */}
                 <div className="space-y-2">
                   <Label>Catatan</Label>
                   <Textarea 
                     value={catatan}
                     onChange={(e) => setCatatan(e.target.value)}
                     placeholder="Catatan tambahan untuk setoran ini..."
                     rows={3}
                   />
                 </div>
 
                 <div className="flex justify-end gap-2 pt-4">
                   <Button variant="outline" onClick={() => onOpenChange(false)}>
                     Batal
                   </Button>
                   <Button onClick={handleSubmit}>
                     Simpan Setoran
                   </Button>
                 </div>
               </div>
             </DialogContent>
           </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Setoran</CardTitle>
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

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Santri</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Halaqoh</TableHead>
                   <TableHead>Jilid</TableHead>
                   <TableHead>Halaman</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Nilai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {filteredSetoran.length > 0 ? (
                   filteredSetoran.map((setoran, index) => (
                     <TableRow key={setoran.id}>
                       <TableCell>{index + 1}</TableCell>
                       <TableCell
                         className="font-medium text-primary cursor-pointer hover:underline"
                         onClick={() => {
                           const santriName = getSantriName(setoran.idSantri);
                           const s = getSantriByNama(santriName);
                           if (s) navigate(`/santri/${s.id}`);
                         }}
                       >{getSantriName(setoran.idSantri)}</TableCell>
                       <TableCell>{getSantriKelas(setoran.idSantri)}</TableCell>
                       <TableCell>{getSantriHalaqoh(setoran.idSantri)}</TableCell>
                       <TableCell>Jilid {setoran.jilid}</TableCell>
                       <TableCell>{setoran.halamanDari} - {setoran.halamanSampai}</TableCell>
                       <TableCell>{getStatusBadge(setoran.status)}</TableCell>
                       <TableCell>{setoran.nilaiRataRata || "-"}</TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow>
                     <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                       Belum ada data setoran tilawah
                     </TableCell>
                   </TableRow>
                 )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
