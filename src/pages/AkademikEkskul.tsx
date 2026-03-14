import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_SANTRI, MOCK_KELAS } from "@/lib/mock-data";

interface Ekskul {
  id: string;
  nama: string;
  aktif: boolean;
}

interface NilaiEkskul {
  rekap_kehadiran: number;
  nilai_praktik: number;
  konversi_nilai: number;
  hasil_akhir: number;
}

const MOCK_EKSKUL: Ekskul[] = [
  { id: "e1", nama: "Panahan", aktif: true },
  { id: "e2", nama: "Renang", aktif: true },
  { id: "e3", nama: "Pramuka", aktif: true },
  { id: "e4", nama: "Kaligrafi", aktif: true },
  { id: "e5", nama: "Public Speaking", aktif: true },
];

function generateMockNilai(): Record<string, Record<string, NilaiEkskul>> {
  const data: Record<string, Record<string, NilaiEkskul>> = {};
  MOCK_SANTRI.forEach((s, i) => {
    data[s.id] = {};
    // Each santri gets 1-2 ekskul
    const ekskulIds = [MOCK_EKSKUL[i % MOCK_EKSKUL.length].id];
    if (i % 3 === 0) ekskulIds.push(MOCK_EKSKUL[(i + 2) % MOCK_EKSKUL.length].id);
    ekskulIds.forEach((eid, j) => {
      const kehadiran = 70 + ((i * 3 + j * 7) % 30);
      const praktik = 65 + ((i * 5 + j * 11) % 35);
      const konversi = Math.round((kehadiran * 0.3 + praktik * 0.7));
      data[s.id][eid] = {
        rekap_kehadiran: kehadiran,
        nilai_praktik: praktik,
        konversi_nilai: konversi,
        hasil_akhir: konversi,
      };
    });
  });
  return data;
}

function getPredikat(nilai: number): string {
  if (nilai >= 90) return "A";
  if (nilai >= 80) return "B";
  if (nilai >= 70) return "C";
  return "D";
}

export default function AkademikEkskul() {
  const [filterKelas, setFilterKelas] = useState("k8");
  const [selectedEkskul, setSelectedEkskul] = useState(MOCK_EKSKUL[0].id);
  const [ekskuls] = useState<Ekskul[]>(MOCK_EKSKUL);
  const [data, setData] = useState(generateMockNilai);
  const { toast } = useToast();

  const filteredSantri = MOCK_SANTRI.filter((s) => filterKelas === "all" || s.idKelas === filterKelas);
  const currentEkskul = ekskuls.find((e) => e.id === selectedEkskul);

  const handleChange = (santriId: string, field: keyof NilaiEkskul, value: string) => {
    const num = Math.max(0, Math.min(100, parseInt(value) || 0));
    setData((prev) => {
      const copy = { ...prev };
      if (!copy[santriId]) copy[santriId] = {};
      if (!copy[santriId][selectedEkskul]) {
        copy[santriId][selectedEkskul] = { rekap_kehadiran: 0, nilai_praktik: 0, konversi_nilai: 0, hasil_akhir: 0 };
      }
      copy[santriId] = { ...copy[santriId] };
      copy[santriId][selectedEkskul] = { ...copy[santriId][selectedEkskul], [field]: num };
      // Auto-calculate
      const d = copy[santriId][selectedEkskul];
      d.konversi_nilai = Math.round(d.rekap_kehadiran * 0.3 + d.nilai_praktik * 0.7);
      d.hasil_akhir = d.konversi_nilai;
      return copy;
    });
  };

  const handleSave = () => {
    toast({ title: "Berhasil!", description: "Nilai ekstrakurikuler berhasil disimpan (mock)" });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ekstrakurikuler</h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola data dan penilaian ekstrakurikuler</p>
          </div>
          <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Simpan</Button>
        </div>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Filter</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterKelas} onValueChange={setFilterKelas}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Kelas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {MOCK_KELAS.map((k) => (<SelectItem key={k.id} value={k.id}>{k.nama_kelas}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={selectedEkskul} onValueChange={setSelectedEkskul}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ekskuls.filter((e) => e.aktif).map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Penilaian {currentEkskul?.nama} ({filteredSantri.length} santri)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">No</TableHead>
                    <TableHead className="min-w-[140px]">Nama Santri</TableHead>
                    <TableHead className="text-center">Rekap Kehadiran (%)</TableHead>
                    <TableHead className="text-center">Nilai Praktik</TableHead>
                    <TableHead className="text-center">Konversi Nilai</TableHead>
                    <TableHead className="text-center">Hasil Akhir</TableHead>
                    <TableHead className="text-center">Predikat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSantri.map((santri, sIdx) => {
                    const d = data[santri.id]?.[selectedEkskul];
                    if (!d) {
                      return (
                        <TableRow key={santri.id}>
                          <TableCell>{sIdx + 1}</TableCell>
                          <TableCell className="font-medium text-sm">{santri.nama}</TableCell>
                          <TableCell colSpan={5} className="text-center text-muted-foreground text-xs">
                            Tidak mengikuti ekskul ini
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return (
                      <TableRow key={santri.id}>
                        <TableCell>{sIdx + 1}</TableCell>
                        <TableCell className="font-medium text-sm">{santri.nama}</TableCell>
                        <TableCell className="p-1">
                          <Input type="number" min={0} max={100} value={d.rekap_kehadiran}
                            onChange={(e) => handleChange(santri.id, "rekap_kehadiran", e.target.value)}
                            className="h-8 w-16 text-center mx-auto text-sm" />
                        </TableCell>
                        <TableCell className="p-1">
                          <Input type="number" min={0} max={100} value={d.nilai_praktik}
                            onChange={(e) => handleChange(santri.id, "nilai_praktik", e.target.value)}
                            className="h-8 w-16 text-center mx-auto text-sm" />
                        </TableCell>
                        <TableCell className="text-center font-semibold">{d.konversi_nilai}</TableCell>
                        <TableCell className="text-center font-bold">{d.hasil_akhir}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={
                            d.hasil_akhir >= 90 ? "bg-green-500/10 text-green-700" :
                            d.hasil_akhir >= 80 ? "bg-blue-500/10 text-blue-700" :
                            d.hasil_akhir >= 70 ? "bg-amber-500/10 text-amber-700" : "bg-red-500/10 text-red-700"
                          }>{getPredikat(d.hasil_akhir)}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 text-sm">ℹ️ Informasi</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Konversi = 30% Kehadiran + 70% Praktik</li>
              <li>• Daftar ekskul: {ekskuls.filter((e) => e.aktif).map((e) => e.nama).join(", ")}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
