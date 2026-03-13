import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Plus, Info, RefreshCw, Shuffle, Search } from "lucide-react";
import { JuzSelector } from "@/components/JuzSelector";
import { supabase } from "@/integrations/supabase/client";
import { generateExamQuestions, formatQuestionDisplay, ExamQuestion, getHalamanPerJuz } from "@/lib/quran-exam-generator";
import { toast } from "sonner";
import { MOCK_KELAS, getSantriByNama } from "@/lib/mock-data";

interface Halaqoh {
  id: string;
  nama_halaqoh: string;
}

interface Kelas {
  id: string;
  nama_kelas: string;
}

const UjianTahfidz = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState("");
  const [selectedAsatidz, setSelectedAsatidz] = useState("");
  const [tanggalUjian, setTanggalUjian] = useState("");
  const [materiDari, setMateriDari] = useState("");
  const [materiSampai, setMateriSampai] = useState("");
  const [catatan, setCatatan] = useState("");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterKelas, setFilterKelas] = useState("all");
  const [halaqohList, setHalaqohList] = useState<Halaqoh[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  
  // Generated questions
  const [generatedQuestions, setGeneratedQuestions] = useState<ExamQuestion[]>([]);
  const [isQuestionsGenerated, setIsQuestionsGenerated] = useState(false);
  
  // State untuk 10 soal - setiap soal memiliki pengurangan nilai
  const [soalData, setSoalData] = useState<Array<{
    pengurangan: number;
  }>>(Array.from({ length: 10 }, () => ({ pengurangan: 0 })));

  useEffect(() => {
    const fetchFilters = async () => {
      const [halaqohRes, kelasRes] = await Promise.all([
        supabase.from("halaqoh").select("id, nama_halaqoh").order("nama_halaqoh"),
        supabase.from("kelas").select("id, nama_kelas").order("nama_kelas"),
      ]);
      if (halaqohRes.data) setHalaqohList(halaqohRes.data);
      if (kelasRes.data) setKelasList(kelasRes.data);
    };
    fetchFilters();
  }, []);

  // Dummy data
  const santriList = [
    { id: "1", nama: "Ahmad Fauzi", nis: "2024001", halaqoh: "Halaqoh A", kelas: "Paket A Kelas 6" },
    { id: "2", nama: "Muhammad Rizki", nis: "2024002", halaqoh: "Halaqoh A", kelas: "Paket A Kelas 6" },
    { id: "3", nama: "Abdullah Rahman", nis: "2024003", halaqoh: "Halaqoh B", kelas: "KBTK A" },
  ];

  const asatidzList = [
    { id: "1", nama: "Ustadz Ahmad" },
    { id: "2", nama: "Ustadz Mahmud" },
    { id: "3", nama: "Ustadzah Fatimah" },
  ];

  // Filter riwayat
  const [riwayatFilterHalaqoh, setRiwayatFilterHalaqoh] = useState("all");
  const [riwayatFilterKelas, setRiwayatFilterKelas] = useState("all");
  const [riwayatSearch, setRiwayatSearch] = useState("");

  const ujianHistory = [
    { id: "1", santri: "Ahmad Fauzi", halaqoh: "Halaqoh A", kelas: "Paket A Kelas 6", tanggal: "2024-01-15", materi: "Juz 1-2", nilaiTotal: 85, status: "Lulus" },
    { id: "2", santri: "Muhammad Rizki", halaqoh: "Halaqoh A", kelas: "Paket A Kelas 6", tanggal: "2024-01-14", materi: "Juz 1-2", nilaiTotal: 65, status: "Mengulang" },
  ];

  const filteredUjianHistory = ujianHistory.filter((item) => {
    const matchSearch = item.santri.toLowerCase().includes(riwayatSearch.toLowerCase());
    const matchHalaqoh = riwayatFilterHalaqoh === "all" || item.halaqoh === riwayatFilterHalaqoh;
    const matchKelas = riwayatFilterKelas === "all" || item.kelas === riwayatFilterKelas;
    return matchSearch && matchHalaqoh && matchKelas;
  });

  const filteredSantriList = santriList.filter((s) => {
    const matchHalaqoh = filterHalaqoh === "all" || s.halaqoh === filterHalaqoh;
    const matchKelas = filterKelas === "all" || s.kelas === filterKelas;
    return matchHalaqoh && matchKelas;
  });

  // Generate random questions
  const handleGenerateQuestions = useCallback(() => {
    if (!materiDari || !materiSampai) {
      toast.error("Pilih materi ujian (juz) terlebih dahulu");
      return;
    }
    
    const juzDari = parseInt(materiDari);
    const juzSampai = parseInt(materiSampai);
    
    if (juzDari > juzSampai) {
      toast.error("Juz awal harus lebih kecil atau sama dengan juz akhir");
      return;
    }
    
    const questions = generateExamQuestions(juzDari, juzSampai);
    setGeneratedQuestions(questions);
    setIsQuestionsGenerated(true);
    setSoalData(Array.from({ length: 10 }, () => ({ pengurangan: 0 })));
    toast.success("10 soal acak berhasil di-generate!");
  }, [materiDari, materiSampai]);

  // Regenerate questions
  const handleRegenerateQuestions = () => {
    handleGenerateQuestions();
  };

  const handlePenguranganChange = (index: number, value: number) => {
    const newSoalData = [...soalData];
    newSoalData[index].pengurangan = Math.min(Math.max(0, value), 10);
    setSoalData(newSoalData);
  };

  const getNilaiSoal = (index: number) => {
    return 10 - soalData[index].pengurangan;
  };

  const getTotalNilai = () => {
    return soalData.reduce((total, soal) => total + (10 - soal.pengurangan), 0);
  };

  const isLulus = () => {
    return getTotalNilai() >= 70;
  };

  const handleSubmit = () => {
    console.log({
      santri: selectedSantri,
      asatidz: selectedAsatidz,
      tanggal: tanggalUjian,
      materiDari,
      materiSampai,
      generatedQuestions,
      soalData,
      totalNilai: getTotalNilai(),
      status: isLulus() ? "Lulus" : "Mengulang",
      catatan,
    });
    
    toast.success(isLulus() ? "Selamat! Santri lulus ujian tahfidz 🎉" : "Santri belum lulus. Perlu belajar lagi.");
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedSantri("");
    setSelectedAsatidz("");
    setTanggalUjian("");
    setMateriDari("");
    setMateriSampai("");
    setCatatan("");
    setGeneratedQuestions([]);
    setIsQuestionsGenerated(false);
    setSoalData(Array.from({ length: 10 }, () => ({ pengurangan: 0 })));
  };

  const selectedSantriData = santriList.find((s) => s.id === selectedSantri);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-purple-500" />
              Ujian Tahfidz Semester
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Ujian tahfidz Al-Qur'an dengan 10 soal sambung ayat acak
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Ujian Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-500" />
                  Form Ujian Tahfidz
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Info Aturan */}
                <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
                  <CardContent className="pt-4">
                    <div className="flex gap-2">
                      <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                        <p className="font-medium">Aturan Penilaian:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-xs">
                          <li>10 soal sambung ayat <strong>diacak otomatis</strong> dari juz yang diujikan</li>
                          <li>Peserta melanjutkan ayat hingga 5 baris (toleransi 5.5-6 baris)</li>
                          <li>Setiap baris sempurna = 2 poin (5 baris × 2 = 10 poin)</li>
                          <li>Kesalahan setelah 3x diingatkan = -1 poin per kesalahan</li>
                          <li>KKM (Kriteria Ketuntasan Minimal) = 70</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Filter Halaqoh & Kelas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Filter Halaqoh</Label>
                    <Select value={filterHalaqoh} onValueChange={setFilterHalaqoh}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Halaqoh" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Halaqoh</SelectItem>
                        {halaqohList.map((h) => (
                          <SelectItem key={h.id} value={h.nama_halaqoh}>
                            {h.nama_halaqoh}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Filter Kelas</Label>
                    <Select value={filterKelas} onValueChange={setFilterKelas}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Kelas" />
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
                </div>

                {/* Data Ujian */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Santri</Label>
                    <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih santri" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSantriList.map((santri) => (
                          <SelectItem key={santri.id} value={santri.id}>
                            {santri.nama} - {santri.nis}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Penguji</Label>
                    <Select value={selectedAsatidz} onValueChange={setSelectedAsatidz}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih penguji" />
                      </SelectTrigger>
                      <SelectContent>
                        {asatidzList.map((asatidz) => (
                          <SelectItem key={asatidz.id} value={asatidz.id}>
                            {asatidz.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tanggal Ujian</Label>
                    <Input
                      type="date"
                      value={tanggalUjian}
                      onChange={(e) => setTanggalUjian(e.target.value)}
                    />
                  </div>

                  {selectedSantriData && (
                    <div className="space-y-2">
                      <Label>Halaqoh</Label>
                      <Input value={selectedSantriData.halaqoh} disabled />
                    </div>
                  )}
                </div>

                {/* Materi Ujian - Juz Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Materi Ujian (Juz)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <JuzSelector
                      value={materiDari}
                      onValueChange={setMateriDari}
                      label="Dari Juz"
                    />
                    <JuzSelector
                      value={materiSampai}
                      onValueChange={setMateriSampai}
                      label="Sampai Juz"
                    />
                  </div>
                  {materiDari && materiSampai && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Materi: Juz {materiDari} - Juz {materiSampai} ({
                          Array.from({ length: parseInt(materiSampai) - parseInt(materiDari) + 1 }, (_, i) => 
                            getHalamanPerJuz(parseInt(materiDari) + i)
                          ).reduce((a, b) => a + b, 0)
                        } halaman)
                      </p>
                      <Button 
                        type="button" 
                        onClick={handleGenerateQuestions}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Shuffle className="w-4 h-4 mr-2" />
                        {isQuestionsGenerated ? "Acak Ulang Soal" : "Generate 10 Soal Acak"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Generated Questions */}
                {isQuestionsGenerated && generatedQuestions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Penilaian 10 Soal</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRegenerateQuestions}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Acak Ulang
                        </Button>
                        <span className="text-sm text-muted-foreground">Total Nilai:</span>
                        <Badge
                          className={`text-lg px-3 py-1 ${
                            isLulus()
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {getTotalNilai()}
                        </Badge>
                      </div>
                    </div>

                    <Accordion type="multiple" className="space-y-2">
                      {generatedQuestions.map((question, index) => (
                        <AccordionItem
                          key={index}
                          value={`soal-${index}`}
                          className="border rounded-lg px-4"
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Soal {index + 1}</span>
                                <span className="text-xs text-muted-foreground">
                                  - {question.surah.name} ayat {question.ayatStart}
                                </span>
                              </div>
                              <Badge
                                className={
                                  getNilaiSoal(index) === 10
                                    ? "bg-green-600"
                                    : getNilaiSoal(index) >= 7
                                    ? "bg-yellow-600"
                                    : "bg-red-600"
                                }
                              >
                                {getNilaiSoal(index)}/10
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-4 pb-4">
                            <div className="space-y-4">
                              {/* Question Info */}
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm font-medium">Soal Sambung Ayat:</p>
                                <p className="text-base mt-1">
                                  <span className="font-arabic text-lg">{question.surah.arabicName}</span>
                                  {" - "}
                                  {question.surah.name} ayat {question.ayatStart}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Juz {question.juz} | Estimasi halaman: {question.halamanEstimate}
                                </p>
                              </div>

                              {/* Pengurangan Nilai */}
                              <div className="space-y-3">
                                <Label className="text-sm">Pengurangan Nilai</Label>
                                <p className="text-xs text-muted-foreground">
                                  Kurangi nilai untuk setiap kesalahan setelah 3x diingatkan (-1 per kesalahan)
                                </p>
                                <div className="flex items-center gap-3">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePenguranganChange(index, soalData[index].pengurangan - 1)}
                                    disabled={soalData[index].pengurangan <= 0}
                                  >
                                    -
                                  </Button>
                                  <span className="w-12 text-center font-mono text-lg">
                                    -{soalData[index].pengurangan}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePenguranganChange(index, soalData[index].pengurangan + 1)}
                                    disabled={soalData[index].pengurangan >= 10}
                                  >
                                    +
                                  </Button>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    Nilai: {getNilaiSoal(index)}/10
                                  </span>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* Ringkasan Nilai */}
                {isQuestionsGenerated && (
                  <Card className={`${isLulus() ? "bg-green-50 dark:bg-green-950/30 border-green-200" : "bg-red-50 dark:bg-red-950/30 border-red-200"}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Total Nilai</p>
                          <p className="text-3xl font-bold">{getTotalNilai()}/100</p>
                        </div>
                        <Badge className={`text-lg px-4 py-2 ${isLulus() ? "bg-green-600" : "bg-red-600"}`}>
                          {isLulus() ? "LULUS" : "MENGULANG"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Catatan */}
                <div className="space-y-2">
                  <Label>Catatan</Label>
                  <Textarea
                    placeholder="Catatan tambahan..."
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!isQuestionsGenerated || !selectedSantri || !selectedAsatidz}
                >
                  Simpan Hasil Ujian
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Riwayat Ujian */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Ujian Tahfidz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Cari santri..." value={riwayatSearch} onChange={e => setRiwayatSearch(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <Label className="text-xs">Filter Halaqoh</Label>
                <Select value={riwayatFilterHalaqoh} onValueChange={setRiwayatFilterHalaqoh}>
                  <SelectTrigger><SelectValue placeholder="Semua Halaqoh" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Halaqoh</SelectItem>
                    {halaqohList.map((h) => (
                      <SelectItem key={h.id} value={h.nama_halaqoh}>{h.nama_halaqoh}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Filter Kelas</Label>
                <Select value={riwayatFilterKelas} onValueChange={setRiwayatFilterKelas}>
                  <SelectTrigger><SelectValue placeholder="Semua Kelas" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                    {kelasList.map((k) => (
                      <SelectItem key={k.id} value={k.nama_kelas}>{k.nama_kelas}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Santri</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Materi</TableHead>
                  <TableHead className="text-center">Nilai</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUjianHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Belum ada riwayat ujian
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUjianHistory.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell
                        className="font-medium text-primary cursor-pointer hover:underline"
                        onClick={() => {
                          const s = getSantriByNama(item.santri);
                          if (s) navigate(`/santri/${s.id}`);
                        }}
                      >{item.santri}</TableCell>
                      <TableCell>{item.tanggal}</TableCell>
                      <TableCell>{item.materi}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {item.nilaiTotal}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={item.status === "Lulus" ? "bg-green-600" : "bg-red-600"}>
                          {item.status}
                        </Badge>
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

export default UjianTahfidz;
