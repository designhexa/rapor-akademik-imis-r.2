import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_SANTRI, MOCK_KELAS } from "@/lib/mock-data";

const JENIS_IBADAH = [
  "Praktek Wudhu",
  "Praktek Shalat",
  "Dzikir Setelah Shalat",
  "Dzikir Pagi Petang",
];

interface IbadahData {
  [santriId: string]: { nilai: number; kkm: number }[];
}

function getPredikat(nilai: number): { predikat: string; color: string } {
  if (nilai >= 90) return { predikat: "A", color: "bg-green-500/10 text-green-700" };
  if (nilai >= 80) return { predikat: "B", color: "bg-blue-500/10 text-blue-700" };
  if (nilai >= 70) return { predikat: "C", color: "bg-amber-500/10 text-amber-700" };
  return { predikat: "D", color: "bg-red-500/10 text-red-700" };
}

function generateMockData(): IbadahData {
  const data: IbadahData = {};
  MOCK_SANTRI.forEach((s, i) => {
    data[s.id] = JENIS_IBADAH.map((_, j) => ({
      nilai: Math.max(40, Math.min(100, 70 + ((i * 7 + j * 13) % 35) - 5)),
      kkm: 70,
    }));
  });
  return data;
}

export default function AkademikIbadah() {
  const [filterKelas, setFilterKelas] = useState("k8");
  const [data, setData] = useState<IbadahData>(generateMockData);
  const { toast } = useToast();

  const filteredSantri = MOCK_SANTRI.filter((s) => filterKelas === "all" || s.idKelas === filterKelas);

  const handleNilaiChange = (santriId: string, idx: number, value: string) => {
    const num = Math.max(0, Math.min(100, parseInt(value) || 0));
    setData((prev) => {
      const copy = { ...prev };
      copy[santriId] = [...(copy[santriId] || JENIS_IBADAH.map(() => ({ nilai: 0, kkm: 70 })))];
      copy[santriId][idx] = { ...copy[santriId][idx], nilai: num };
      return copy;
    });
  };

  const handleSave = () => {
    toast({ title: "Berhasil!", description: "Nilai keterampilan ibadah berhasil disimpan (mock)" });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Keterampilan Ibadah</h1>
            <p className="text-muted-foreground text-sm mt-1">Penilaian praktek ibadah santri</p>
          </div>
          <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Simpan</Button>
        </div>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Filter</CardTitle></CardHeader>
          <CardContent>
            <Select value={filterKelas} onValueChange={setFilterKelas}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Kelas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {MOCK_KELAS.map((k) => (<SelectItem key={k.id} value={k.id}>{k.nama_kelas}</SelectItem>))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Nilai Keterampilan Ibadah ({filteredSantri.length} santri)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">No</TableHead>
                    <TableHead className="min-w-[140px]">Nama Santri</TableHead>
                    {JENIS_IBADAH.map((j, i) => (
                      <TableHead key={i} className="text-center min-w-[120px]">
                        <div className="text-xs">{j}</div>
                        <div className="text-[10px] text-muted-foreground">KKM: 70</div>
                      </TableHead>
                    ))}
                    {JENIS_IBADAH.map((_, i) => (
                      <TableHead key={`pred-${i}`} className="text-center w-16">Predikat</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSantri.map((santri, sIdx) => {
                    const santriData = data[santri.id] || JENIS_IBADAH.map(() => ({ nilai: 0, kkm: 70 }));
                    return (
                      <TableRow key={santri.id}>
                        <TableCell>{sIdx + 1}</TableCell>
                        <TableCell className="font-medium text-sm">{santri.nama}</TableCell>
                        {santriData.map((d, iIdx) => (
                          <TableCell key={iIdx} className="p-1">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              value={d.nilai}
                              onChange={(e) => handleNilaiChange(santri.id, iIdx, e.target.value)}
                              className={`h-8 w-16 text-center mx-auto text-sm ${d.nilai < d.kkm ? "border-red-400 text-red-600" : ""}`}
                            />
                          </TableCell>
                        ))}
                        {santriData.map((d, iIdx) => {
                          const { predikat, color } = getPredikat(d.nilai);
                          return (
                            <TableCell key={`pred-${iIdx}`} className="text-center">
                              <Badge className={color}>{predikat}</Badge>
                            </TableCell>
                          );
                        })}
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
              <li>• KKM (Kriteria Ketuntasan Minimal) = 70</li>
              <li>• Predikat: A (90-100), B (80-89), C (70-79), D (0-69)</li>
              <li>• Nilai di bawah KKM ditandai merah</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
