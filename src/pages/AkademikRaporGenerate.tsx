import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Printer, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_SANTRI, MOCK_KELAS, getKelasNama } from "@/lib/mock-data";
import { RaporTKPreview, mockRaporTK, RaporTKData } from "@/components/rapor/RaporTKPreview";
import { RaporSDPreview, mockRaporSD, RaporSDData } from "@/components/rapor/RaporSDPreview";
import { RaporAkademikPreview } from "@/components/rapor/RaporAkademikPreview";
import { mockRaporAkademik, RaporAkademik } from "@/lib/rapor-akademik-types";
import { supabase } from "@/integrations/supabase/client";
import html2canvas from "html2canvas";

type JenjangType = "TK" | "SD" | "SMP";

function getJenjangFromKelas(kelasId: string): JenjangType {
  if (kelasId === "ka" || kelasId === "kb") return "TK";
  if (["k1", "k2", "k3", "k4", "k5", "k6"].includes(kelasId)) return "SD";
  return "SMP";
}

export default function AkademikRaporGenerate() {
  const [filterKelas, setFilterKelas] = useState("all");
  const [filterJenjang, setFilterJenjang] = useState<JenjangType | "all">("all");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<typeof MOCK_SANTRI[0] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const filteredSantri = MOCK_SANTRI.filter((s) => {
    if (filterKelas !== "all" && s.idKelas !== filterKelas) return false;
    if (filterJenjang !== "all" && getJenjangFromKelas(s.idKelas) !== filterJenjang) return false;
    return true;
  });

  const handlePreview = (santri: typeof MOCK_SANTRI[0]) => {
    setSelectedSantri(santri);
    setIsPreviewOpen(true);
  };

  const handleGenerateAI = async () => {
    if (!selectedSantri) return;
    setIsGenerating(true);
    try {
      const jenjang = getJenjangFromKelas(selectedSantri.idKelas);
      const { data, error } = await supabase.functions.invoke("generate-rapor-deskripsi", {
        body: {
          namaSantri: selectedSantri.nama,
          mapel: "Matematika",
          nilai: 85,
          materi: "bilangan, geometri, pengukuran",
          jenjang,
        },
      });

      if (error) throw error;

      toast({
        title: "AI Generate Berhasil!",
        description: `Deskripsi: "${data.deskripsi?.substring(0, 80)}..."`,
      });
    } catch (error: any) {
      toast({
        title: "Gagal generate",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const jenjang = selectedSantri ? getJenjangFromKelas(selectedSantri.idKelas) : "SMP";
    const elementId = jenjang === "TK" ? "rapor-tk-content" : jenjang === "SD" ? "rapor-sd-content" : "rapor-akademik-content";
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      toast({ title: "Menggenerate file...", description: "Mohon tunggu sebentar" });
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `Rapor_${jenjang}_${selectedSantri?.nama || "santri"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast({ title: "Berhasil!", description: "Rapor berhasil diunduh" });
    } catch {
      toast({ title: "Gagal", description: "Terjadi kesalahan saat menggenerate rapor", variant: "destructive" });
    }
  };

  const renderPreview = () => {
    if (!selectedSantri) return null;
    const jenjang = getJenjangFromKelas(selectedSantri.idKelas);

    if (jenjang === "TK") {
      const data: RaporTKData = {
        ...mockRaporTK,
        identitas: { ...mockRaporTK.identitas, nama: selectedSantri.nama, noInduk: selectedSantri.nis, kelompok: getKelasNama(selectedSantri.idKelas) },
      };
      return <RaporTKPreview data={data} />;
    }

    if (jenjang === "SD") {
      const data: RaporSDData = {
        ...mockRaporSD,
        identitas: { ...mockRaporSD.identitas, nama: selectedSantri.nama, noInduk: selectedSantri.nis, nisn: selectedSantri.nisn, kelas: getKelasNama(selectedSantri.idKelas) },
      };
      return <RaporSDPreview data={data} />;
    }

    const data: RaporAkademik = {
      ...mockRaporAkademik,
      identitas: { ...mockRaporAkademik.identitas, nama: selectedSantri.nama, noInduk: selectedSantri.nis, nisn: selectedSantri.nisn, kelas: getKelasNama(selectedSantri.idKelas) },
    };
    return <RaporAkademikPreview data={data} />;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Generate Rapor Multi-Jenjang</h1>
            <p className="text-muted-foreground text-sm mt-1">Generate rapor TK (naratif), SD (semi numerik), dan SMP (numerik)</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Filter</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterJenjang} onValueChange={(v) => setFilterJenjang(v as JenjangType | "all")}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Jenjang" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenjang</SelectItem>
                  <SelectItem value="TK">TK</SelectItem>
                  <SelectItem value="SD">SD (Paket A)</SelectItem>
                  <SelectItem value="SMP">SMP (Paket B)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterKelas} onValueChange={setFilterKelas}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Kelas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {MOCK_KELAS.map((k) => (<SelectItem key={k.id} value={k.id}>{k.nama_kelas}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Daftar Santri ({filteredSantri.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 w-8">No</th>
                    <th className="text-left p-2">NIS</th>
                    <th className="text-left p-2">Nama</th>
                    <th className="text-left p-2">Kelas</th>
                    <th className="text-center p-2">Jenjang</th>
                    <th className="text-center p-2">Format Rapor</th>
                    <th className="text-center p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSantri.map((s, idx) => {
                    const jenjang = getJenjangFromKelas(s.idKelas);
                    return (
                      <tr key={s.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2 font-mono text-xs">{s.nis}</td>
                        <td className="p-2 font-medium">{s.nama}</td>
                        <td className="p-2 text-xs">{getKelasNama(s.idKelas)}</td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className={
                            jenjang === "TK" ? "border-pink-300 text-pink-700" :
                            jenjang === "SD" ? "border-blue-300 text-blue-700" :
                            "border-green-300 text-green-700"
                          }>{jenjang}</Badge>
                        </td>
                        <td className="p-2 text-center text-xs text-muted-foreground">
                          {jenjang === "TK" ? "Naratif" : jenjang === "SD" ? "Semi Numerik" : "Numerik"}
                        </td>
                        <td className="p-2 text-center">
                          <Button variant="ghost" size="sm" onClick={() => handlePreview(s)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] p-0">
            <DialogHeader className="p-4 border-b sticky top-0 bg-background z-10">
              <div className="flex items-center justify-between">
                <DialogTitle>
                  Preview Rapor {selectedSantri ? getJenjangFromKelas(selectedSantri.idKelas) : ""}
                </DialogTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleGenerateAI} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    AI Generate
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="w-4 h-4 mr-2" />Cetak
                  </Button>
                  <Button size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />Unduh
                  </Button>
                </div>
              </div>
            </DialogHeader>
            <ScrollArea className="h-[calc(90vh-80px)]">
              <div className="p-4">{renderPreview()}</div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 text-sm">ℹ️ Informasi Format Rapor</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• <strong>TK (Naratif)</strong>: Penilaian berupa skala perkembangan (BB/MB/BSH/BSB) dengan narasi deskriptif per aspek</li>
              <li>• <strong>SD (Semi Numerik)</strong>: Nilai pengetahuan & keterampilan numerik + predikat + deskripsi + sikap</li>
              <li>• <strong>SMP (Numerik Penuh)</strong>: Nilai akhir numerik + capaian kompetensi + P5 + pembiasaan</li>
              <li>• Klik <strong>AI Generate</strong> untuk menghasilkan deskripsi capaian kompetensi otomatis</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
