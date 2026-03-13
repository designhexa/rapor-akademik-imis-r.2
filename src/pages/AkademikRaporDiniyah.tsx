import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, FileText, Download, Printer, Eye } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { mockSantriAkademik } from "@/lib/rapor-akademik-types";
import { MOCK_KELAS, getSantriByNama } from "@/lib/mock-data";
import { RaporDiniyahPreview } from "@/components/rapor/RaporDiniyahPreview";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export default function AkademikRaporDiniyah() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("all");
  const [filterSemester, setFilterSemester] = useState("1");
  const [selectedSantri, setSelectedSantri] = useState<typeof mockSantriAkademik[0] | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const raporRef = useRef<HTMLDivElement>(null);

  const filteredSantri = mockSantriAkademik.filter(santri => {
    const matchSearch = santri.nama.toLowerCase().includes(search.toLowerCase()) ||
                       santri.nis.includes(search);
    const matchKelas = filterKelas === "all" || santri.kelas.includes(filterKelas);
    return matchSearch && matchKelas;
  });

  const handlePreview = (santri: typeof mockSantriAkademik[0]) => {
    setSelectedSantri(santri);
    setPreviewOpen(true);
  };

  const handleDownload = async () => {
    if (!raporRef.current) return;
    
    try {
      const canvas = await html2canvas(raporRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `rapor-diniyah-${selectedSantri?.nama || 'santri'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success("Rapor berhasil diunduh");
    } catch (error) {
      toast.error("Gagal mengunduh rapor");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rapor Diniyah</h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola rapor mata pelajaran keagamaan (PAI & Budi Pekerti)</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Daftar Santri - Rapor Diniyah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau NIS..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterKelas} onValueChange={setFilterKelas}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter Kelas" />
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
              <Select value={filterSemester} onValueChange={setFilterSemester}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>NIS</TableHead>
                  <TableHead>NISN</TableHead>
                  <TableHead>Nama Santri</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Status Nilai</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSantri.map((santri, index) => (
                  <TableRow key={santri.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-mono">{santri.nis}</TableCell>
                    <TableCell className="font-mono">{santri.nisn}</TableCell>
                    <TableCell
                      className="font-medium text-primary cursor-pointer hover:underline"
                      onClick={() => {
                        const s = getSantriByNama(santri.nama);
                        if (s) navigate(`/santri/${s.id}`);
                      }}
                    >{santri.nama}</TableCell>
                    <TableCell>{santri.kelas}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          santri.statusNilai === "Lengkap" ? "default" : 
                          santri.statusNilai === "Sebagian" ? "secondary" : "outline"
                        }
                      >
                        {santri.statusNilai}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(santri)}
                          disabled={santri.statusNilai === "Belum Ada"}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDownload}
                          disabled={santri.statusNilai === "Belum Ada"}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Preview Rapor Diniyah - {selectedSantri?.nama}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-1" />
                    Cetak
                  </Button>
                  <Button size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div ref={raporRef}>
              {selectedSantri && <RaporDiniyahPreview santriId={selectedSantri.id} />}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
