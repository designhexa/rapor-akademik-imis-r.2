import { useState } from "react";
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
import { Search, Plus, BookOpenCheck, RefreshCw, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { MOCK_SANTRI_TILAWAH, TILAWATI_JILID, HALAMAN_PER_JILID } from "@/lib/tilawah-data";
import { MOCK_HALAQOH, MOCK_KELAS, getSantriByNama } from "@/lib/mock-data";

interface SoalUjianSemester {
  id: number;
  jilid: number;
  halaman: number;
}

interface HasilUjianSemester {
  id: string;
  idSantri: string;
  namaSantri: string;
  kelas: string;
  halaqoh: string;
  jilid: number;
  halamanTerakhir: number;
  soal: SoalUjianSemester[];
  nilaiKelancaran: number;
  nilaiTartil: number;
  nilaiFashohah: number;
  nilaiTotal: number;
  catatan: string;
  tanggal: string;
  status: "Lulus" | "Tidak Lulus";
}

// Generate random halaman dari range setoran terakhir santri
const generateSoalSemester = (jilid: number, halamanTerakhir: number, jumlahSoal: number = 1): SoalUjianSemester[] => {
  const soal: SoalUjianSemester[] = [];
  const usedHalaman = new Set<number>();
  
  const halamanMulai = 1;
  const halamanAkhir = Math.min(halamanTerakhir, HALAMAN_PER_JILID);
  
  if (halamanAkhir < 1) return soal;

  let attempts = 0;
  while (soal.length < jumlahSoal && attempts < 50) {
    attempts++;
    const halaman = Math.floor(Math.random() * halamanAkhir) + halamanMulai;
    if (!usedHalaman.has(halaman)) {
      usedHalaman.add(halaman);
      soal.push({ id: soal.length + 1, jilid, halaman });
    }
  }
  
  return soal.sort((a, b) => a.halaman - b.halaman);
};

// Mock data ujian semester
const MOCK_UJIAN_SEMESTER: HasilUjianSemester[] = [
  {
    id: "us1", idSantri: "s1", namaSantri: "Qurrata 'Ayun", kelas: "Paket B Kelas 8", halaqoh: "Halaqoh Akhwat A",
    jilid: 4, halamanTerakhir: 28,
    soal: [{ id: 1, jilid: 4, halaman: 5 }, { id: 2, jilid: 4, halaman: 12 }, { id: 3, jilid: 4, halaman: 18 }, { id: 4, jilid: 4, halaman: 22 }, { id: 5, jilid: 4, halaman: 27 }],
    nilaiKelancaran: 85, nilaiTartil: 80, nilaiFashohah: 82,
    nilaiTotal: 82, catatan: "Baik", tanggal: "2025-06-15", status: "Lulus",
  },
  {
    id: "us2", idSantri: "s4", namaSantri: "Dzaki Ash Shiddiq", kelas: "Paket B Kelas 8", halaqoh: "Halaqoh Ikhwan A",
    jilid: 4, halamanTerakhir: 35,
    soal: [{ id: 1, jilid: 4, halaman: 3 }, { id: 2, jilid: 4, halaman: 10 }, { id: 3, jilid: 4, halaman: 20 }, { id: 4, jilid: 4, halaman: 28 }, { id: 5, jilid: 4, halaman: 33 }],
    nilaiKelancaran: 65, nilaiTartil: 60, nilaiFashohah: 68,
    nilaiTotal: 64, catatan: "Perlu perbaikan", tanggal: "2025-06-15", status: "Tidak Lulus",
  },
];

export default function TilawahUjianSemester() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterKelas, setFilterKelas] = useState("all");
  const [riwayatFilterHalaqoh, setRiwayatFilterHalaqoh] = useState("all");
  const [riwayatFilterKelas, setRiwayatFilterKelas] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ujianList, setUjianList] = useState<HasilUjianSemester[]>(MOCK_UJIAN_SEMESTER);

  // Form state
  const [selectedSantri, setSelectedSantri] = useState("");
  const [generatedSoal, setGeneratedSoal] = useState<SoalUjianSemester[]>([]);
  const [nilaiKelancaran, setNilaiKelancaran] = useState("");
  const [nilaiTartil, setNilaiTartil] = useState("");
  const [nilaiFashohah, setNilaiFashohah] = useState("");
  const [catatan, setCatatan] = useState("");

  const selectedSantriData = MOCK_SANTRI_TILAWAH.find(s => s.id === selectedSantri);

  // Filter santri by halaqoh/kelas
  const filteredSantriForForm = MOCK_SANTRI_TILAWAH.filter(s => {
    const matchHalaqoh = filterHalaqoh === "all" || s.halaqoh === filterHalaqoh;
    const matchKelas = filterKelas === "all" || s.kelas === filterKelas;
    return matchHalaqoh && matchKelas;
  });

  const handleSelectSantri = (santriId: string) => {
    setSelectedSantri(santriId);
    const santriData = MOCK_SANTRI_TILAWAH.find(s => s.id === santriId);
    if (santriData) {
      const soal = generateSoalSemester(santriData.jilidSaatIni, santriData.halamanSaatIni);
      setGeneratedSoal(soal);
    }
  };

  const handleRegenerateSoal = () => {
    if (selectedSantriData) {
      const soal = generateSoalSemester(selectedSantriData.jilidSaatIni, selectedSantriData.halamanSaatIni);
      setGeneratedSoal(soal);
      toast.info("Soal telah di-generate ulang");
    }
  };

  const hitungTotal = () => {
    const k = parseFloat(nilaiKelancaran) || 0;
    const t = parseFloat(nilaiTartil) || 0;
    const f = parseFloat(nilaiFashohah) || 0;
    return Math.round((k + t + f) / 3);
  };

  const handleSubmit = () => {
    if (!selectedSantri || !nilaiKelancaran || !nilaiTartil || !nilaiFashohah) {
      toast.error("Lengkapi semua data ujian");
      return;
    }

    const total = hitungTotal();
    const status: "Lulus" | "Tidak Lulus" = total >= 70 ? "Lulus" : "Tidak Lulus";

    const newUjian: HasilUjianSemester = {
      id: `us${Date.now()}`,
      idSantri: selectedSantri,
      namaSantri: selectedSantriData?.nama || "",
      kelas: selectedSantriData?.kelas || "",
      halaqoh: selectedSantriData?.halaqoh || "",
      jilid: selectedSantriData?.jilidSaatIni || 1,
      halamanTerakhir: selectedSantriData?.halamanSaatIni || 1,
      soal: generatedSoal,
      nilaiKelancaran: parseFloat(nilaiKelancaran),
      nilaiTartil: parseFloat(nilaiTartil),
      nilaiFashohah: parseFloat(nilaiFashohah),
      nilaiTotal: total,
      catatan,
      tanggal: new Date().toISOString().split("T")[0],
      status,
    };

    setUjianList(prev => [newUjian, ...prev]);
    toast.success(`Ujian disimpan. Nilai: ${total} - ${status}`);
    resetForm();
    setDialogOpen(false);
  };

  const resetForm = () => {
    setSelectedSantri("");
    setGeneratedSoal([]);
    setNilaiKelancaran("");
    setNilaiTartil("");
    setNilaiFashohah("");
    setCatatan("");
  };

  const filteredUjian = ujianList.filter(u => {
    const matchSearch = u.namaSantri.toLowerCase().includes(search.toLowerCase());
    const matchHalaqoh = riwayatFilterHalaqoh === "all" || u.halaqoh === riwayatFilterHalaqoh;
    const matchKelas = riwayatFilterKelas === "all" || u.kelas === riwayatFilterKelas;
    return matchSearch && matchHalaqoh && matchKelas;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ujian Tilawah Semester</h1>
            <p className="text-muted-foreground text-sm mt-1">Ujian semester dengan soal random dari halaman tilawati sesuai progres santri</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Ujian Semester
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BookOpenCheck className="w-5 h-5" />
                  Ujian Tilawah Semester
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                {/* Filter Halaqoh / Kelas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Filter Halaqoh</Label>
                    <Select value={filterHalaqoh} onValueChange={(v) => { setFilterHalaqoh(v); setSelectedSantri(""); setGeneratedSoal([]); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Halaqoh" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Halaqoh</SelectItem>
                        {MOCK_HALAQOH.map((h) => (
                          <SelectItem key={h.id} value={h.nama}>
                            {h.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Filter Kelas</Label>
                    <Select value={filterKelas} onValueChange={(v) => { setFilterKelas(v); setSelectedSantri(""); setGeneratedSoal([]); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kelas</SelectItem>
                        {MOCK_KELAS.map((k) => (
                          <SelectItem key={k.id} value={k.nama_kelas}>
                            {k.nama_kelas}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pilih Santri */}
                <div className="space-y-2">
                  <Label>Pilih Santri</Label>
                  <Select value={selectedSantri} onValueChange={handleSelectSantri}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih santri..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSantriForForm.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nama} - {s.kelas} (Jilid {s.jilidSaatIni}, Hal {s.halamanSaatIni})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Info Santri */}
                {selectedSantriData && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Kelas</p>
                          <p className="font-medium">{selectedSantriData.kelas}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Jilid Saat Ini</p>
                          <p className="font-medium">Jilid {selectedSantriData.jilidSaatIni}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Halaman Terakhir</p>
                          <p className="font-medium">Halaman {selectedSantriData.halamanSaatIni}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Soal Random */}
                {generatedSoal.length > 0 && (
                  <Card className="border-primary/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Shuffle className="w-4 h-4" />
                          Soal Ujian (Random dari Jilid {selectedSantriData?.jilidSaatIni}, Hal 1-{selectedSantriData?.halamanSaatIni})
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={handleRegenerateSoal}>
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Acak Ulang
                        </Button>
                      </div>
                      <CardDescription>Santri diminta membaca 1 halaman acak berikut:</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center">
                        {generatedSoal.map((soal) => (
                          <div key={soal.id} className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20 min-w-[120px]">
                            <p className="text-xs text-muted-foreground">Soal Ujian</p>
                            <p className="font-bold text-2xl text-primary">Hal {soal.halaman}</p>
                            <p className="text-sm text-muted-foreground">Jilid {soal.jilid}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Penilaian */}
                {generatedSoal.length > 0 && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Kelancaran (0-100)</Label>
                        <Input type="number" min={0} max={100} value={nilaiKelancaran} onChange={e => setNilaiKelancaran(e.target.value)} placeholder="0-100" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Tartil (0-100)</Label>
                        <Input type="number" min={0} max={100} value={nilaiTartil} onChange={e => setNilaiTartil(e.target.value)} placeholder="0-100" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Fashohah (0-100)</Label>
                        <Input type="number" min={0} max={100} value={nilaiFashohah} onChange={e => setNilaiFashohah(e.target.value)} placeholder="0-100" />
                      </div>
                    </div>

                    {/* Total */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Rata-rata Nilai</p>
                            <p className="text-3xl font-bold">{hitungTotal()} <span className="text-lg font-normal text-muted-foreground">/ 100</span></p>
                          </div>
                          <Badge
                            className={`text-lg px-4 py-2 ${hitungTotal() >= 70 ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                          >
                            {hitungTotal() >= 70 ? "LULUS" : "TIDAK LULUS"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Minimum lulus: 70</p>
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <Label>Catatan</Label>
                      <Textarea value={catatan} onChange={e => setCatatan(e.target.value)} placeholder="Catatan ujian..." />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                      <Button onClick={handleSubmit}>Simpan Hasil Ujian</Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Daftar Ujian */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Ujian Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Cari santri..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
              </div>
              <Select value={riwayatFilterHalaqoh} onValueChange={setRiwayatFilterHalaqoh}>
                <SelectTrigger><SelectValue placeholder="Semua Halaqoh" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Halaqoh</SelectItem>
                  {MOCK_HALAQOH.map((h) => (
                    <SelectItem key={h.id} value={h.nama}>{h.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={riwayatFilterKelas} onValueChange={setRiwayatFilterKelas}>
                <SelectTrigger><SelectValue placeholder="Semua Kelas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {MOCK_KELAS.map((k) => (
                    <SelectItem key={k.id} value={k.nama_kelas}>{k.nama_kelas}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead>Nama Santri</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Jilid</TableHead>
                  <TableHead className="text-center">Kelancaran</TableHead>
                  <TableHead className="text-center">Tartil</TableHead>
                  <TableHead className="text-center">Fashohah</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUjian.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">Belum ada data ujian semester</TableCell>
                  </TableRow>
                ) : filteredUjian.map((u, idx) => (
                  <TableRow key={u.id}>
                    <TableCell className="text-center">{idx + 1}</TableCell>
                    <TableCell
                      className="font-medium text-primary cursor-pointer hover:underline"
                      onClick={() => {
                        const s = getSantriByNama(u.namaSantri);
                        if (s) navigate(`/santri/${s.id}`);
                      }}
                    >{u.namaSantri}</TableCell>
                    <TableCell>{u.kelas}</TableCell>
                    <TableCell>Jilid {u.jilid}</TableCell>
                    <TableCell className="text-center">{u.nilaiKelancaran}</TableCell>
                    <TableCell className="text-center">{u.nilaiTartil}</TableCell>
                    <TableCell className="text-center">{u.nilaiFashohah}</TableCell>
                    <TableCell className="text-center font-semibold">{u.nilaiTotal}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={u.status === "Lulus" ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                        {u.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
