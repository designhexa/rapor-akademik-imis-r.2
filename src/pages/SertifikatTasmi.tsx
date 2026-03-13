import { useRef, useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Download, Award, CheckCircle2, Upload, Image, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { useSetoranPersistence } from "@/hooks/use-setoran-persistence";
import { MOCK_SANTRI } from "@/lib/mock-data";
import { getJuzName } from "@/lib/quran-data";
import { SertifikatPreview, type SertifikatData } from "@/components/sertifikat/SertifikatPreview";

// Dummy riwayat ujian yang lulus (sama dengan UjianTasmi)
const dummyHasilUjian = [
  { id: "1", santriId: "1", santriNama: "Ahmad Fauzi", juz: 30, tanggal: "2025-01-05", predikat: "Mumtaz", status: "Lulus" },
  { id: "2", santriId: "1", santriNama: "Ahmad Fauzi", juz: 29, tanggal: "2025-01-06", predikat: "Jayyid Jiddan", status: "Lulus" },
];

interface LulusCandidate {
  id: string;
  santriId: string;
  santriNama: string;
  juz: number;
  tanggal: string;
  predikat: string;
}

export default function SertifikatTasmi() {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [bgImage, setBgImage] = useState<string | null>(null);

  // Settings
  const [nomorSertifikat, setNomorSertifikat] = useState("001/IMIS/TASMI/2026");
  const [namaKetuaPKBM, setNamaKetuaPKBM] = useState("NANANG KOSIM, S.SI");

  const { entries } = useSetoranPersistence();

  // Merge persisted tasmi entries (lulus only) with dummy data
  const lulusCandidates: LulusCandidate[] = useMemo(() => {
    const fromPersisted = entries
      .filter(e => e.jenis === "tasmi" && e.status !== "Mengulang")
      .map(e => ({
        id: e.id || `${e.santriId}-${e.juz}`,
        santriId: e.santriId,
        santriNama: MOCK_SANTRI.find(s => s.id === e.santriId)?.nama || "Santri",
        juz: e.juz || 30,
        tanggal: e.tanggal instanceof Date ? e.tanggal.toISOString() : String(e.tanggal),
        predikat: e.status || "Mumtaz",
      }));

    const fromDummy = dummyHasilUjian
      .filter(u => u.status === "Lulus")
      .map(u => ({
        id: u.id,
        santriId: u.santriId,
        santriNama: u.santriNama,
        juz: u.juz,
        tanggal: u.tanggal,
        predikat: u.predikat,
      }));

    // Combine, deduplicate by id
    const combined = [...fromPersisted, ...fromDummy];
    const seen = new Set<string>();
    return combined.filter(c => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [entries]);

  const selected = lulusCandidates.find(c => c.id === selectedCandidate);

  const sertifikatData: SertifikatData = useMemo(() => {
    if (!selected) {
      return {
        nama: "",
        nomorSertifikat,
        juzLulus: "",
        tanggalUjian: "",
        predikat: "",
        namaKetuaPKBM,
      };
    }
    const tgl = new Date(selected.tanggal);
    return {
      nama: selected.santriNama,
      nomorSertifikat,
      juzLulus: getJuzName(selected.juz),
      tanggalUjian: format(tgl, "d MMMM yyyy", { locale: idLocale }),
      predikat: selected.predikat,
      namaKetuaPKBM,
    };
  }, [selected, nomorSertifikat, namaKetuaPKBM]);

  const handleDownloadImage = async () => {
    if (!printRef.current || !selected) return;

    setIsGenerating(true);
    try {
      const fonts = (document as any).fonts as FontFaceSet | undefined;
      if (fonts?.ready) await fonts.ready;
      await new Promise((r) => setTimeout(r, 200));

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `sertifikat-tasmi-${selected.santriNama.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Sertifikat berhasil diunduh!");
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Gagal generate sertifikat");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setBgImage(reader.result as string);
      toast.success("Background template berhasil diupload");
    };
    reader.readAsDataURL(file);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Sertifikat Lulus Ujian Tasmi'
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Generate sertifikat dari daftar santri yang lulus ujian tasmi'
          </p>
        </div>

        {/* Daftar Santri Lulus */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Daftar Santri Lulus Ujian Tasmi'
            </CardTitle>
            <CardDescription>
              Pilih santri untuk generate sertifikat kelulusan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lulusCandidates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Belum ada santri yang lulus ujian tasmi'</p>
                <p className="text-sm mt-1">Santri yang lulus ujian di halaman Ujian Tasmi' akan muncul di sini</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No</TableHead>
                      <TableHead>Nama Santri</TableHead>
                      <TableHead>Juz</TableHead>
                      <TableHead>Tanggal Ujian</TableHead>
                      <TableHead>Predikat</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lulusCandidates.map((c, idx) => (
                      <TableRow
                        key={c.id}
                        className={selectedCandidate === c.id ? "bg-primary/5" : ""}
                      >
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell className="font-medium">{c.santriNama}</TableCell>
                        <TableCell>{getJuzName(c.juz)}</TableCell>
                        <TableCell>
                          {new Date(c.tanggal).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500 text-white">{c.predikat}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant={selectedCandidate === c.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCandidate(c.id)}
                          >
                            {selectedCandidate === c.id ? "Dipilih" : "Pilih"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings & Download */}
        {selected && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Image className="w-4 h-4" />
                Pengaturan Sertifikat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nomor Sertifikat</Label>
                  <Input
                    value={nomorSertifikat}
                    onChange={(e) => setNomorSertifikat(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nama Ketua PKBM</Label>
                  <Input
                    value={namaKetuaPKBM}
                    onChange={(e) => setNamaKetuaPKBM(e.target.value)}
                  />
                </div>
              </div>

              {/* Background template upload */}
              <div className="space-y-2">
                <Label>Template Background (Opsional)</Label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBgUpload}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-muted transition-colors">
                      <Upload className="w-4 h-4" />
                      {bgImage ? "Ganti Template" : "Upload Template BG"}
                    </div>
                  </label>
                  {bgImage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => {
                        setBgImage(null);
                        toast.info("Background template dihapus");
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload gambar background sertifikat (landscape 1120×794px). Jika tidak diupload, akan menggunakan desain default.
                </p>
              </div>

              <Button
                onClick={handleDownloadImage}
                disabled={isGenerating}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : `Download Sertifikat - ${selected.santriNama}`}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Certificate Preview */}
        {selected && (
          <div className="overflow-auto border rounded-lg bg-muted/50 p-4">
            <SertifikatPreview
              ref={printRef}
              data={sertifikatData}
              bgImage={bgImage}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
