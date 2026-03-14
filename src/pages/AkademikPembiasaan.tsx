import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_SANTRI, MOCK_KELAS, getKelasNama } from "@/lib/mock-data";

type PredikatPembiasaan = "A" | "B" | "C" | "D";

const PEMBIASAAN_SEKOLAH = [
  "Datang tepat waktu",
  "Berpakaian bersih dan rapi",
  "Murojaah sebelum mulai belajar",
  "Mengucapkan salam ketika bertemu",
  "Sholat Dhuha",
  "Tertib belajar",
  "Menerapkan adab makan dan minum",
  "Menjaga kebersihan sekolah",
  "Bersikap ramah dan sopan",
  "Membuang sampah pada tempatnya",
  "Rajin Puasa sunnah",
  "Tidak meninggalkan barang bawaan",
];

const PEMBIASAAN_RUMAH = [
  "Sholat Shubuh",
  "Sholat Dhuhur",
  "Sholat Ashar",
  "Sholat Maghrib",
  "Sholat Isya'",
  "Sholat sunnah rawatib",
  "Membaca/murojaah Al Quran",
  "Belajar/mengerjakan tugas",
  "Membantu orang tua di rumah",
  "Melaksanakan dzikir pagi",
  "Melaksanakan dzikir petang",
  "Menerapkan adab sehari-hari",
];

interface PembiasaanData {
  [santriId: string]: {
    sekolah: PredikatPembiasaan[];
    rumah: PredikatPembiasaan[];
  };
}

// Generate mock data
function generateMockPembiasaan(): PembiasaanData {
  const predikat: PredikatPembiasaan[] = ["A", "B", "C", "D"];
  const data: PembiasaanData = {};
  MOCK_SANTRI.forEach((s, i) => {
    data[s.id] = {
      sekolah: PEMBIASAAN_SEKOLAH.map((_, j) => predikat[(i + j) % 4 === 3 ? 0 : (i + j) % 4]),
      rumah: PEMBIASAAN_RUMAH.map((_, j) => predikat[(i + j + 1) % 4 === 3 ? 0 : (i + j + 1) % 4]),
    };
  });
  return data;
}

const predikatColors: Record<PredikatPembiasaan, string> = {
  A: "bg-green-500/10 text-green-700 hover:bg-green-500/20",
  B: "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20",
  C: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20",
  D: "bg-red-500/10 text-red-700 hover:bg-red-500/20",
};

export default function AkademikPembiasaan() {
  const [filterKelas, setFilterKelas] = useState("k8");
  const [lokasi, setLokasi] = useState<"sekolah" | "rumah">("sekolah");
  const [data, setData] = useState<PembiasaanData>(generateMockPembiasaan);
  const { toast } = useToast();

  const items = lokasi === "sekolah" ? PEMBIASAAN_SEKOLAH : PEMBIASAAN_RUMAH;
  const filteredSantri = MOCK_SANTRI.filter((s) => filterKelas === "all" || s.idKelas === filterKelas);

  const handleChange = (santriId: string, idx: number, value: PredikatPembiasaan) => {
    setData((prev) => {
      const copy = { ...prev };
      if (!copy[santriId]) {
        copy[santriId] = {
          sekolah: PEMBIASAAN_SEKOLAH.map(() => "A" as PredikatPembiasaan),
          rumah: PEMBIASAAN_RUMAH.map(() => "A" as PredikatPembiasaan),
        };
      }
      copy[santriId] = { ...copy[santriId], [lokasi]: [...copy[santriId][lokasi]] };
      copy[santriId][lokasi][idx] = value;
      return copy;
    });
  };

  const handleSave = () => {
    toast({ title: "Berhasil!", description: "Data pembiasaan berhasil disimpan (mock)" });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Input Pembiasaan</h1>
            <p className="text-muted-foreground text-sm mt-1">Penilaian pembiasaan santri di sekolah dan rumah</p>
          </div>
          <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Simpan</Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterKelas} onValueChange={setFilterKelas}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Kelas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {MOCK_KELAS.map((k) => (
                    <SelectItem key={k.id} value={k.id}>{k.nama_kelas}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={lokasi} onValueChange={(v) => setLokasi(v as "sekolah" | "rumah")}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sekolah">Pembiasaan di Sekolah</SelectItem>
                  <SelectItem value="rumah">Pembiasaan di Rumah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Pembiasaan di {lokasi === "sekolah" ? "Sekolah" : "Rumah"} ({filteredSantri.length} santri)
              </CardTitle>
              <div className="flex gap-2 text-xs">
                {(["A", "B", "C", "D"] as PredikatPembiasaan[]).map((p) => (
                  <Badge key={p} className={predikatColors[p]}>{p}</Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-background z-10 w-8">No</TableHead>
                    <TableHead className="sticky left-8 bg-background z-10 min-w-[140px]">Nama</TableHead>
                    {items.map((item, i) => (
                      <TableHead key={i} className="text-center text-xs min-w-[80px] max-w-[100px]">
                        <div className="truncate" title={item}>{item}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSantri.map((santri, sIdx) => (
                    <TableRow key={santri.id}>
                      <TableCell className="sticky left-0 bg-background z-10">{sIdx + 1}</TableCell>
                      <TableCell className="sticky left-8 bg-background z-10 font-medium text-sm">{santri.nama}</TableCell>
                      {items.map((_, iIdx) => {
                        const val = data[santri.id]?.[lokasi]?.[iIdx] || "A";
                        return (
                          <TableCell key={iIdx} className="text-center p-1">
                            <Select value={val} onValueChange={(v) => handleChange(santri.id, iIdx, v as PredikatPembiasaan)}>
                              <SelectTrigger className="h-7 w-12 mx-auto text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {(["A", "B", "C", "D"] as PredikatPembiasaan[]).map((p) => (
                                  <SelectItem key={p} value={p}>{p}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 text-sm">ℹ️ Keterangan Predikat</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• <strong>A</strong> = Sangat Baik (konsisten melaksanakan)</li>
              <li>• <strong>B</strong> = Baik (sering melaksanakan)</li>
              <li>• <strong>C</strong> = Cukup (kadang-kadang melaksanakan)</li>
              <li>• <strong>D</strong> = Kurang (jarang melaksanakan)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
