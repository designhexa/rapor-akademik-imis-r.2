import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Download,
  Eye,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { RaporTahfidzPreview } from "@/components/rapor/RaporTahfidzPreview";
import { getMockRaporData, RaporTahfidz, getPredikat } from "@/lib/rapor-tahfidz-types";
import { mockSantriProgress } from "@/lib/target-hafalan";
import { MOCK_KELAS, getSantriByNama } from "@/lib/mock-data";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

// Mock data untuk daftar santri dengan status rapor
const mockSantriRapor = mockSantriProgress.map((santri, index) => ({
  ...santri,
  statusDataNilai: index % 3 === 0 ? "Lengkap" : index % 3 === 1 ? "Sebagian" : "Belum Ada",
  statusRapor: index % 4 === 0 ? "Sudah Generate" : "Belum Generate",
  raporData: getMockRaporData({
  id: santri.id,
  nama: santri.nama,
  nis: santri.nis,
  kelas: santri.kelas,
})

// In real app, this would be fetched per santri
}));

const RaporSemester = () => {
  const navigate = useNavigate();
  const [filterKelas, setFilterKelas] = useState("all");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterSemester, setFilterSemester] = useState("ganjil");
  const [selectedSantri, setSelectedSantri] = useState<typeof mockSantriRapor[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const raporRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get unique values for filters
  const uniqueKelas = [...new Set(mockSantriRapor.map(s => s.kelas))];
  const uniqueHalaqoh = [...new Set(mockSantriRapor.map(s => s.halaqoh))];

  // Filter santri
  const filteredSantri = mockSantriRapor.filter(santri => {
    if (filterKelas !== "all" && santri.kelas !== filterKelas) return false;
    if (filterHalaqoh !== "all" && santri.halaqoh !== filterHalaqoh) return false;
    return true;
  });

  const handlePreview = (santri: typeof mockSantriRapor[0]) => {
    setSelectedSantri(santri);
    setIsPreviewOpen(true);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("rapor-content");
    if (!element) return;

    try {
      toast({
        title: "Menggenerate PDF...",
        description: "Mohon tunggu sebentar",
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `Rapor_Tahfidz_${selectedSantri?.nama || "santri"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "Berhasil!",
        description: "Rapor berhasil diunduh",
      });
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menggenerate rapor",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Lengkap":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Lengkap</Badge>;
      case "Sebagian":
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"><Clock className="w-3 h-3 mr-1" /> Sebagian</Badge>;
      default:
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Belum Ada</Badge>;
    }
  };

  const getRaporStatusBadge = (status: string) => {
    if (status === "Sudah Generate") {
      return <Badge className="bg-primary/10 text-primary hover:bg-primary/20"><CheckCircle className="w-3 h-3 mr-1" /> Sudah</Badge>;
    }
    return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> Belum</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rapor Tahfidz</h1>
            <p className="text-muted-foreground text-sm mt-1">Generate dan cetak rapor tahfidz santri per semester</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Generate Semua Rapor
          </Button>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filter Rapor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterSemester} onValueChange={setFilterSemester}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ganjil">Semester Ganjil</SelectItem>
                  <SelectItem value="genap">Semester Genap</SelectItem>
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
              <Select value={filterHalaqoh} onValueChange={setFilterHalaqoh}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Pilih Halaqoh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Halaqoh</SelectItem>
                  {uniqueHalaqoh.map(halaqoh => (
                    <SelectItem key={halaqoh} value={halaqoh}>{halaqoh}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Daftar Santri */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Daftar Santri ({filteredSantri.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>NIS</TableHead>
                    <TableHead>Nama Santri</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Halaqoh</TableHead>
                    <TableHead className="text-center">Juz Hafal</TableHead>
                    <TableHead className="text-center">Status Data</TableHead>
                    <TableHead className="text-center">Status Rapor</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSantri.length > 0 ? (
                    filteredSantri.map((santri, index) => (
                      <TableRow key={santri.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-mono text-xs">{santri.nis}</TableCell>
                        <TableCell
                          className="font-medium text-primary cursor-pointer hover:underline"
                          onClick={() => {
                            const s = getSantriByNama(santri.nama);
                            if (s) navigate(`/santri/${s.id}`);
                          }}
                        >{santri.nama}</TableCell>
                        <TableCell>{santri.kelas}</TableCell>
                        <TableCell>{santri.halaqoh}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{santri.jumlahJuzHafal} Juz</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(santri.statusDataNilai)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getRaporStatusBadge(santri.statusRapor)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePreview(santri)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        Tidak ada data santri yang sesuai filter
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-4 border-b sticky top-0 bg-background z-10">
              <div className="flex items-center justify-between">
                <DialogTitle>Preview Rapor Tahfidz</DialogTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak
                  </Button>
                  <Button size="sm" onClick={handleDownloadPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Unduh
                  </Button>
                </div>
              </div>
            </DialogHeader>
            <ScrollArea className="h-[calc(90vh-80px)]">
              <div className="p-4" ref={raporRef}>
                {selectedSantri && (
                  <RaporTahfidzPreview data={selectedSantri.raporData} />
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 text-sm">ℹ️ Informasi</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Rapor menggabungkan data hafalan baru, murajaah, dan prestasi selama 1 semester</li>
              <li>• Status "Lengkap" berarti seluruh data penilaian sudah terisi</li>
              <li>• Klik ikon mata untuk preview rapor sebelum dicetak</li>
              <li>• Predikat: Mumtaz Murtafi' (93-100), Mumtaz (86-92), Jayyid Jiddan (78-85), Jayyid (70-77), Maqbul (&lt;70)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RaporSemester;
