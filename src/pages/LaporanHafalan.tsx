import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, TrendingUp, BookOpen, Calendar, BarChart3, Target, Users, School, BookOpenCheck } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { LaporanCharts, CapaianKelasChart, CapaianHalaqohChart, CapaianSiswaChart } from "@/components/laporan/LaporanCharts";
import { MOCK_KELAS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { getSantriByNama } from "@/lib/mock-data";
import { getDrillsForJuz } from "@/lib/drill-data";
import { 
  MOCK_SANTRI_TILAWAH, 
  MOCK_SETORAN_TILAWAH,
  TILAWATI_JILID,
  HALAMAN_PER_JILID,
  getProgressJilid
} from "@/lib/tilawah-data";

// Mock data
const mockLaporanHarian = [
  { tanggal: "15/01/2025", santri: "Muhammad Faiz", halaqoh: "Al-Azhary", kelas: "Paket A Kelas 6", juz: 3, halaman: "45-50", ayat: 60, nilai: 95, status: "Lancar" },
  { tanggal: "15/01/2025", santri: "Fatimah Zahra", halaqoh: "Al-Azhary", kelas: "KBTK A", juz: 4, halaman: "1-5", ayat: 50, nilai: 92, status: "Lancar" },
  { tanggal: "14/01/2025", santri: "Aisyah Nur", halaqoh: "Al-Furqon", kelas: "Paket B Kelas 8", juz: 3, halaman: "40-44", ayat: 45, nilai: 88, status: "Lancar" },
  { tanggal: "14/01/2025", santri: "Ahmad Rasyid", halaqoh: "Al-Furqon", kelas: "Paket A Kelas 6", juz: 2, halaman: "30-35", ayat: 55, nilai: 90, status: "Lancar" },
  { tanggal: "13/01/2025", santri: "Muhammad Faiz", halaqoh: "Al-Azhary", kelas: "Paket A Kelas 6", juz: 3, halaman: "40-44", ayat: 48, nilai: 94, status: "Lancar" },
];

const mockLaporanMingguan = [
  { minggu: "Minggu 1", totalSetoran: 25, totalAyat: 450, rataRata: 92, santriAktif: 45 },
  { minggu: "Minggu 2", totalSetoran: 28, totalAyat: 520, rataRata: 94, santriAktif: 48 },
  { minggu: "Minggu 3", totalSetoran: 22, totalAyat: 400, rataRata: 90, santriAktif: 42 },
  { minggu: "Minggu 4", totalSetoran: 30, totalAyat: 580, rataRata: 93, santriAktif: 50 },
];

const mockCapaianJuz = [
  { juz: 1, santriSelesai: 45, totalSantri: 50, persentase: 90 },
  { juz: 2, santriSelesai: 38, totalSantri: 50, persentase: 76 },
  { juz: 3, santriSelesai: 30, totalSantri: 50, persentase: 60 },
  { juz: 4, santriSelesai: 22, totalSantri: 50, persentase: 44 },
  { juz: 5, santriSelesai: 15, totalSantri: 50, persentase: 30 },
];

const mockDrillHafalan = [
  { id: 1, tanggal: "15/01/2025", santri: "Muhammad Faiz", halaqoh: "Al-Azhary", kelas: "Paket A Kelas 6", juz: 30, level: 3, materi: "Drill 3 - Al-Buruj s.d Al-Fajr", nilai: 92, status: "Lulus" },
  { id: 2, tanggal: "14/01/2025", santri: "Fatimah Zahra", halaqoh: "Al-Azhary", kelas: "KBTK A", juz: 30, level: 5, materi: "Drill 5 - Az-Zalzalah s.d An-Nas", nilai: 88, status: "Lulus" },
  { id: 3, tanggal: "13/01/2025", santri: "Aisyah Nur", halaqoh: "Al-Furqon", kelas: "Paket B Kelas 8", juz: 29, level: 2, materi: "Drill 2 - Al-Haqqah & Al-Ma'arij", nilai: 75, status: "Mengulang" },
  { id: 4, tanggal: "12/01/2025", santri: "Ahmad Rasyid", halaqoh: "Al-Furqon", kelas: "Paket A Kelas 6", juz: 1, level: 4, materi: "Drill 4 - Halaman 16-20", nilai: 95, status: "Lulus" },
  { id: 5, tanggal: "11/01/2025", santri: "Umar Faruq", halaqoh: "Al-Hidayah", kelas: "KBTK B", juz: 30, level: 1, materi: "Drill 1 - An-Naba s.d Abasa", nilai: 85, status: "Mengulang" },
];

// Drill Level Indicator for Laporan
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

// Chart data
const mockCapaianKelas = [
  { kelas: "KBTK A", rataRata: 92, totalSetoran: 156 },
  { kelas: "KBTK B", rataRata: 88, totalSetoran: 142 },
  { kelas: "Paket A Kelas 6", rataRata: 94, totalSetoran: 178 },
  { kelas: "Paket B Kelas 8", rataRata: 90, totalSetoran: 165 },
  { kelas: "Paket C Kelas 10", rataRata: 86, totalSetoran: 134 },
];

const mockCapaianHalaqoh = [
  { halaqoh: "Al-Azhary", rataRata: 93, totalSetoran: 234 },
  { halaqoh: "Al-Furqon", rataRata: 91, totalSetoran: 198 },
  { halaqoh: "Al-Hidayah", rataRata: 89, totalSetoran: 187 },
  { halaqoh: "An-Nur", rataRata: 87, totalSetoran: 156 },
];

const mockCapaianSiswa = [
  { nama: "Ahmad Rasyid", juzSelesai: 15, totalJuz: 30, persentase: 50 },
  { nama: "Muhammad Faiz", juzSelesai: 12, totalJuz: 30, persentase: 40 },
  { nama: "Fatimah Zahra", juzSelesai: 10, totalJuz: 30, persentase: 33 },
  { nama: "Aisyah Nur", juzSelesai: 8, totalJuz: 30, persentase: 27 },
  { nama: "Umar Faruq", juzSelesai: 6, totalJuz: 30, persentase: 20 },
];

const mockSantri = [
  { id: "1", nama: "Muhammad Faiz", halaqoh: "azhary" },
  { id: "2", nama: "Fatimah Zahra", halaqoh: "azhary" },
  { id: "3", nama: "Aisyah Nur", halaqoh: "furqon" },
  { id: "4", nama: "Ahmad Rasyid", halaqoh: "furqon" },
];

const LaporanHafalan = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hafalan");
  const [filterPeriode, setFilterPeriode] = useState("bulanan");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterBulan, setFilterBulan] = useState("januari");
  const [filterSantri, setFilterSantri] = useState("all");
  const [filterKelas, setFilterKelas] = useState("all");
  // Per-table filters
  const [harianFilterSantri, setHarianFilterSantri] = useState("all");
  const [harianFilterStatus, setHarianFilterStatus] = useState("all");
  const [harianFilterHalaqoh, setHarianFilterHalaqoh] = useState("all");
  const [harianFilterKelas, setHarianFilterKelas] = useState("all");
  const [mingguanFilterMinggu, setMingguanFilterMinggu] = useState("all");
  const [mingguanFilterHalaqoh, setMingguanFilterHalaqoh] = useState("all");
  const [mingguanFilterKelas, setMingguanFilterKelas] = useState("all");
  const [mingguanFilterSantri, setMingguanFilterSantri] = useState("all");
  const [capaianFilterJuz, setCapaianFilterJuz] = useState("all");
  const [capaianFilterHalaqoh, setCapaianFilterHalaqoh] = useState("all");
  const [capaianFilterKelas, setCapaianFilterKelas] = useState("all");
  const [capaianFilterSantri, setCapaianFilterSantri] = useState("all");
  const [drillFilterHalaqoh, setDrillFilterHalaqoh] = useState("all");
  const [drillFilterKelas, setDrillFilterKelas] = useState("all");
  const [drillFilterStatus, setDrillFilterStatus] = useState("all");
  const [drillFilterSantri, setDrillFilterSantri] = useState("all");
  // Tilawah filters
  const [tilawahHalaqoh, setTilawahHalaqoh] = useState("all");
  const [tilawahKelas, setTilawahKelas] = useState("all");
  const [tilawahJilid, setTilawahJilid] = useState("all");
  const [tilawahSantri, setTilawahSantri] = useState("all");

  // Tilawah stats
  const santriTilawahStats = MOCK_SANTRI_TILAWAH.map(santri => {
    const setoranSantri = MOCK_SETORAN_TILAWAH.filter(s => s.idSantri === santri.id);
    const totalHalaman = setoranSantri.reduce((acc, s) => acc + (s.halamanSampai - s.halamanDari + 1), 0);
    const rataRataNilai = setoranSantri.length > 0
      ? Math.round(setoranSantri.reduce((acc, s) => acc + (s.nilaiRataRata || 0), 0) / setoranSantri.length)
      : 0;
    const progressJilid = getProgressJilid(santri.halamanSaatIni, santri.jilidSaatIni);
    return { ...santri, jumlahSetoran: setoranSantri.length, totalHalaman, rataRataNilai, progressJilid: Math.round(progressJilid) };
  });

  const filteredTilawahSantri = santriTilawahStats.filter(santri => {
    const matchHalaqoh = tilawahHalaqoh === "all" || santri.halaqoh === tilawahHalaqoh;
    const matchKelas = tilawahKelas === "all" || santri.kelas === tilawahKelas;
    const matchJilid = tilawahJilid === "all" || santri.jilidSaatIni === parseInt(tilawahJilid);
    const matchSantri = tilawahSantri === "all" || santri.nama === tilawahSantri;
    return matchHalaqoh && matchKelas && matchJilid && matchSantri;
  });

  const filteredSantri = filterHalaqoh === "all" 
    ? mockSantri 
    : mockSantri.filter(s => s.halaqoh === filterHalaqoh);

  const filteredDrill = mockDrillHafalan.filter((d) => {
    const matchHalaqoh = drillFilterHalaqoh === "all" || d.halaqoh.toLowerCase().includes(drillFilterHalaqoh);
    const matchKelas = drillFilterKelas === "all" || d.kelas === drillFilterKelas;
    const matchStatus = drillFilterStatus === "all" || 
      (drillFilterStatus === "lulus" && d.status === "Lulus") ||
      (drillFilterStatus === "mengulang" && d.status === "Mengulang");
    const matchSantri = drillFilterSantri === "all" || d.santri === drillFilterSantri;
    return matchHalaqoh && matchKelas && matchStatus && matchSantri;
  });

  const filteredHarian = mockLaporanHarian.filter((item) => {
    const matchSantri = harianFilterSantri === "all" || item.santri === harianFilterSantri;
    const matchStatus = harianFilterStatus === "all" || item.status === harianFilterStatus;
    const matchHalaqoh = harianFilterHalaqoh === "all" || item.halaqoh === harianFilterHalaqoh;
    const matchKelas = harianFilterKelas === "all" || item.kelas === harianFilterKelas;
    return matchSantri && matchStatus && matchHalaqoh && matchKelas;
  });

  const filteredMingguan = mockLaporanMingguan.filter((item) => {
    return mingguanFilterMinggu === "all" || item.minggu === mingguanFilterMinggu;
  });

  const filteredCapaian = mockCapaianJuz.filter((item) => {
    return capaianFilterJuz === "all" || item.juz === Number(capaianFilterJuz);
  });

  const uniqueHarianSantri = [...new Set(mockLaporanHarian.map(h => h.santri))];
  const uniqueHarianHalaqoh = [...new Set(mockLaporanHarian.map(h => h.halaqoh))];
  const uniqueHarianKelas = [...new Set(mockLaporanHarian.map(h => h.kelas))];
  const uniqueDrillHalaqoh = [...new Set(mockDrillHafalan.map(d => d.halaqoh))];
  const uniqueDrillKelas = [...new Set(mockDrillHafalan.map(d => d.kelas))];
  const uniqueDrillSantri = [...new Set(mockDrillHafalan.map(d => d.santri))];
  const uniqueTilawahSantri = [...new Set(MOCK_SANTRI_TILAWAH.map(s => s.nama))];

  const getStatusBadge = (status: string) => {
    if (status === "Lulus") return <Badge className="bg-green-500 hover:bg-green-600 text-white">Lulus</Badge>;
    if (status === "Proses") return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Proses</Badge>;
    return <Badge variant="outline" className="text-muted-foreground">-</Badge>;
  };

  const handleExportPDF = () => {
    toast.success("Laporan berhasil diexport ke PDF!");
  };

  const handleExportExcel = () => {
    toast.success("Laporan berhasil diexport ke Excel!");
  };

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Laporan</h1>
            <p className="text-sm md:text-base text-muted-foreground">Rekap dan analisis capaian hafalan & tilawah santri</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 md:flex-none" onClick={handleExportExcel}>
              <Download className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Excel</span>
              <span className="sm:hidden">XLS</span>
            </Button>
            <Button size="sm" className="flex-1 md:flex-none bg-[#015504]" onClick={handleExportPDF}>
              <FileText className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>

        {/* Top-level Hafalan / Tilawah tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="hafalan" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Hafalan
            </TabsTrigger>
            <TabsTrigger value="tilawah" className="flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4" />
              Tilawah
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hafalan" className="space-y-4 md:space-y-6 mt-4">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          <Card>
            <CardContent className="p-3 md:pt-4 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">105</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">Total Setoran</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:pt-4 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">1,950</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">Total Ayat</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:pt-4 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-accent-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">92.5</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">Rata-rata</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:pt-4 md:p-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg md:text-2xl font-bold">48</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground truncate">Santri Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium">Periode</label>
                <Select value={filterPeriode} onValueChange={setFilterPeriode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="harian">Harian</SelectItem>
                    <SelectItem value="mingguan">Mingguan</SelectItem>
                    <SelectItem value="bulanan">Bulanan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium">Bulan</label>
                <Select value={filterBulan} onValueChange={setFilterBulan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="januari">Januari 2025</SelectItem>
                    <SelectItem value="februari">Februari 2025</SelectItem>
                    <SelectItem value="maret">Maret 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium">Halaqoh</label>
                <Select value={filterHalaqoh} onValueChange={(v) => { setFilterHalaqoh(v); setFilterSantri("all"); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Halaqoh</SelectItem>
                    <SelectItem value="azhary">Halaqoh Al-Azhary</SelectItem>
                    <SelectItem value="furqon">Halaqoh Al-Furqon</SelectItem>
                    <SelectItem value="hidayah">Halaqoh Al-Hidayah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium">Kelas</label>
                <Select value={filterKelas} onValueChange={setFilterKelas}>
                  <SelectTrigger>
                    <SelectValue />
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
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-xs md:text-sm font-medium">Santri</label>
                <Select value={filterSantri} onValueChange={setFilterSantri}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Santri</SelectItem>
                    {filteredSantri.map((santri) => (
                      <SelectItem key={santri.id} value={santri.id}>{santri.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Visualisasi Capaian
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CapaianKelasChart data={mockCapaianKelas} />
            <CapaianHalaqohChart data={mockCapaianHalaqoh} />
          </div>
          <CapaianSiswaChart data={mockCapaianSiswa} />
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="harian" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="harian" className="text-xs md:text-sm px-2 py-2">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
              Rekap Harian
            </TabsTrigger>
            <TabsTrigger value="mingguan" className="text-xs md:text-sm px-2 py-2">
              <BarChart3 className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
              Rekap Mingguan
            </TabsTrigger>
            <TabsTrigger value="capaian" className="text-xs md:text-sm px-2 py-2">
              <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
              Capaian Juz
            </TabsTrigger>
            <TabsTrigger value="drill" className="text-xs md:text-sm px-2 py-2">
              <Target className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-2 shrink-0" />
              Rekap Drill
            </TabsTrigger>
          </TabsList>

          {/* Rekap Harian */}
          <TabsContent value="harian">
            <Card>
              <CardHeader>
                <CardTitle>Rekap Setoran Harian</CardTitle>
                <CardDescription>Daftar setoran hafalan harian santri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Select value={harianFilterHalaqoh} onValueChange={setHarianFilterHalaqoh}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Halaqoh" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Halaqoh</SelectItem>
                      {uniqueHarianHalaqoh.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={harianFilterKelas} onValueChange={setHarianFilterKelas}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Kelas" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {uniqueHarianKelas.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={harianFilterSantri} onValueChange={setHarianFilterSantri}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Santri" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Santri</SelectItem>
                      {uniqueHarianSantri.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={harianFilterStatus} onValueChange={setHarianFilterStatus}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="Lancar">Lancar</SelectItem>
                      <SelectItem value="Mengulang">Mengulang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Santri</TableHead>
                        <TableHead>Juz</TableHead>
                        <TableHead>Halaman</TableHead>
                        <TableHead>Ayat</TableHead>
                        <TableHead>Nilai</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHarian.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.tanggal}</TableCell>
                          <TableCell
                            className="font-medium text-primary cursor-pointer hover:underline"
                            onClick={() => {
                              const s = getSantriByNama(item.santri);
                              if (s) navigate(`/santri/${s.id}`);
                            }}
                          >{item.santri}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary">Juz {item.juz}</Badge>
                          </TableCell>
                          <TableCell>{item.halaman}</TableCell>
                          <TableCell>{item.ayat} ayat</TableCell>
                          <TableCell className="font-semibold text-primary">{item.nilai}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500 hover:bg-green-600">{item.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rekap Mingguan */}
          <TabsContent value="mingguan">
            <Card>
              <CardHeader>
                <CardTitle>Rekap Mingguan</CardTitle>
                <CardDescription>Statistik setoran per minggu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Select value={mingguanFilterHalaqoh} onValueChange={setMingguanFilterHalaqoh}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Halaqoh" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Halaqoh</SelectItem>
                      {uniqueHarianHalaqoh.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={mingguanFilterKelas} onValueChange={setMingguanFilterKelas}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Kelas" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {uniqueHarianKelas.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={mingguanFilterSantri} onValueChange={setMingguanFilterSantri}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Santri" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Santri</SelectItem>
                      {uniqueHarianSantri.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={mingguanFilterMinggu} onValueChange={setMingguanFilterMinggu}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Minggu" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Minggu</SelectItem>
                      {mockLaporanMingguan.map(m => <SelectItem key={m.minggu} value={m.minggu}>{m.minggu}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Periode</TableHead>
                        <TableHead className="text-center">Total Setoran</TableHead>
                        <TableHead className="text-center">Total Ayat</TableHead>
                        <TableHead className="text-center">Rata-rata Nilai</TableHead>
                        <TableHead className="text-center">Santri Aktif</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMingguan.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.minggu}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{item.totalSetoran}</Badge>
                          </TableCell>
                          <TableCell className="text-center">{item.totalAyat}</TableCell>
                          <TableCell className="text-center font-semibold text-primary">{item.rataRata}</TableCell>
                          <TableCell className="text-center">{item.santriAktif}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Capaian per Juz */}
          <TabsContent value="capaian">
            <Card>
              <CardHeader>
                <CardTitle>Capaian Hafalan per Juz</CardTitle>
                <CardDescription>Progress penyelesaian hafalan santri per juz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Select value={capaianFilterHalaqoh} onValueChange={setCapaianFilterHalaqoh}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Halaqoh" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Halaqoh</SelectItem>
                      {uniqueHarianHalaqoh.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={capaianFilterKelas} onValueChange={setCapaianFilterKelas}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Kelas" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {uniqueHarianKelas.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={capaianFilterSantri} onValueChange={setCapaianFilterSantri}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Santri" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Santri</SelectItem>
                      {uniqueHarianSantri.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={capaianFilterJuz} onValueChange={setCapaianFilterJuz}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Juz" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Juz</SelectItem>
                      {mockCapaianJuz.map(j => <SelectItem key={j.juz} value={String(j.juz)}>Juz {j.juz}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  {filteredCapaian.map((item) => (
                    <div key={item.juz} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">Juz {item.juz}</Badge>
                          <span className="text-sm text-muted-foreground">{item.santriSelesai} dari {item.totalSantri} santri</span>
                        </div>
                        <span className="font-semibold text-primary">{item.persentase}%</span>
                      </div>
                      <Progress value={item.persentase} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rekap Drill Hafalan */}
          <TabsContent value="drill">
            <Card>
              <CardHeader>
                <CardTitle>Rekap Drill Hafalan</CardTitle>
                <CardDescription>Progress drill hafalan per santri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Select value={drillFilterHalaqoh} onValueChange={setDrillFilterHalaqoh}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Halaqoh" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Halaqoh</SelectItem>
                      {uniqueDrillHalaqoh.map(h => <SelectItem key={h} value={h.toLowerCase().replace("halaqoh ", "").replace("al-", "")}>{h}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={drillFilterKelas} onValueChange={setDrillFilterKelas}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Kelas" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {MOCK_KELAS.map(k => <SelectItem key={k.id} value={k.nama_kelas}>{k.nama_kelas}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={drillFilterSantri} onValueChange={setDrillFilterSantri}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Santri" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Santri</SelectItem>
                      {uniqueDrillSantri.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={drillFilterStatus} onValueChange={setDrillFilterStatus}>
                    <SelectTrigger className="text-xs md:text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="lulus">Lulus</SelectItem>
                      <SelectItem value="mengulang">Mengulang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm">Tanggal</TableHead>
                        <TableHead className="text-xs md:text-sm">Santri</TableHead>
                        <TableHead className="text-xs md:text-sm">Juz</TableHead>
                        <TableHead className="text-xs md:text-sm">Level Drill</TableHead>
                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Materi</TableHead>
                        <TableHead className="text-xs md:text-sm">Nilai</TableHead>
                        <TableHead className="text-xs md:text-sm">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDrill.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs md:text-sm">{item.tanggal}</TableCell>
                          <TableCell
                            className="font-medium text-primary text-xs md:text-sm cursor-pointer hover:underline"
                            onClick={() => {
                              const s = getSantriByNama(item.santri);
                              if (s) navigate(`/santri/${s.id}`);
                            }}
                          >{item.santri}</TableCell>
                          <TableCell>
                            <Badge className="bg-primary/10 text-primary border-primary text-[10px] md:text-xs">Juz {item.juz}</Badge>
                          </TableCell>
                          <TableCell>
                            <DrillLevelIndicator juz={item.juz} currentLevel={item.level} />
                          </TableCell>
                          <TableCell className="text-xs md:text-sm hidden md:table-cell">{item.materi}</TableCell>
                          <TableCell className="font-semibold text-primary text-xs md:text-sm">{item.nilai}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "text-[10px] md:text-xs",
                              item.status === "Lulus" ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                            )}>{item.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
          </TabsContent>

          {/* Tilawah Tab */}
          <TabsContent value="tilawah" className="space-y-4 md:space-y-6 mt-4">
            {/* Tilawah Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Laporan Tilawah</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Select value={tilawahHalaqoh} onValueChange={setTilawahHalaqoh}>
                    <SelectTrigger className="text-xs md:text-sm">
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
                  <Select value={tilawahKelas} onValueChange={setTilawahKelas}>
                    <SelectTrigger className="text-xs md:text-sm">
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
                  <Select value={tilawahSantri} onValueChange={setTilawahSantri}>
                    <SelectTrigger className="text-xs md:text-sm">
                      <SelectValue placeholder="Pilih Santri" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Santri</SelectItem>
                      {uniqueTilawahSantri.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={tilawahJilid} onValueChange={setTilawahJilid}>
                    <SelectTrigger className="text-xs md:text-sm">
                      <SelectValue placeholder="Pilih Jilid" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jilid</SelectItem>
                      {TILAWATI_JILID.map((jilid) => (
                        <SelectItem key={jilid.jilid} value={jilid.jilid.toString()}>
                          Jilid {jilid.jilid}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tilawah Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Data Laporan Tilawah</CardTitle>
                <CardDescription>Perkembangan tilawah metode Tilawati</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Nama Santri</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Halaqoh</TableHead>
                      <TableHead>Jilid</TableHead>
                      <TableHead>Halaman</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Setoran</TableHead>
                      <TableHead>Nilai</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTilawahSantri.length > 0 ? (
                      filteredTilawahSantri.map((santri, index) => (
                        <TableRow key={santri.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell
                            className="font-medium text-primary cursor-pointer hover:underline"
                            onClick={() => {
                              const s = getSantriByNama(santri.nama);
                              if (s) navigate(`/santri/${s.id}`);
                            }}
                          >{santri.nama}</TableCell>
                          <TableCell>{santri.kelas}</TableCell>
                          <TableCell>{santri.halaqoh}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Jilid {santri.jilidSaatIni}</Badge>
                          </TableCell>
                          <TableCell>{santri.halamanSaatIni}/{HALAMAN_PER_JILID}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={santri.progressJilid} className="w-16 h-2" />
                              <span className="text-xs text-muted-foreground">{santri.progressJilid}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{santri.jumlahSetoran}x</TableCell>
                          <TableCell>
                            <Badge variant={santri.rataRataNilai >= 80 ? "default" : santri.rataRataNilai >= 70 ? "secondary" : "outline"}>
                              {santri.rataRataNilai || "-"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                          Belum ada data laporan tilawah
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LaporanHafalan;
