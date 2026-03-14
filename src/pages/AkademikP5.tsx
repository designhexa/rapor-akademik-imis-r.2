import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_SANTRI, MOCK_KELAS } from "@/lib/mock-data";
import { keteranganPredikatP3 } from "@/lib/rapor-akademik-types";

type PredikatP5 = "MB" | "SB" | "BSH" | "SAB";

interface DimensiP5 {
  dimensi: string;
  elemen: string;
  deskripsi: string;
}

const DIMENSI_P5: DimensiP5[] = [
  { dimensi: "Beriman, Bertaqwa kepada Tuhan YME, dan Berakhlak Mulia", elemen: "Elemen akhlak beragama", deskripsi: "Terbiasa melaksanakan ibadah wajib sesuai tuntunan agama/kepercayaannya." },
  { dimensi: "Beriman, Bertaqwa kepada Tuhan YME, dan Berakhlak Mulia", elemen: "Elemen akhlak pribadi", deskripsi: "Mulai membiasakan diri untuk disiplin, rapi, menjaga tingkah laku." },
  { dimensi: "Beriman, Bertaqwa kepada Tuhan YME, dan Berakhlak Mulia", elemen: "Elemen akhlak kepada alam", deskripsi: "Terbiasa berperilaku ramah lingkungan." },
  { dimensi: "Bergotong Royong", elemen: "Elemen kolaborasi", deskripsi: "Menyadari perlunya saling membantu dalam memenuhi kebutuhan." },
  { dimensi: "Mandiri", elemen: "Elemen pemahaman diri", deskripsi: "Mengidentifikasi kemampuan dan tantangan yang dihadapi." },
  { dimensi: "Mandiri", elemen: "Elemen regulasi diri", deskripsi: "Menjalankan kegiatan secara mandiri dan bertahan mengerjakan tugas." },
  { dimensi: "Bernalar Kritis", elemen: "Elemen memperoleh informasi", deskripsi: "Mengajukan pertanyaan untuk mengidentifikasi permasalahan." },
  { dimensi: "Bernalar Kritis", elemen: "Elemen refleksi pemikiran", deskripsi: "Menyampaikan dan menjelaskan alasan dari hal yang dipikirkan." },
  { dimensi: "Kreatif", elemen: "Elemen menghasilkan karya orisinal", deskripsi: "Mengeksplorasi pikiran dalam bentuk karya dan tindakan." },
];

interface P5Data {
  [santriId: string]: { nilai: PredikatP5; deskripsi: string }[];
}

function generateMockP5(): P5Data {
  const predikats: PredikatP5[] = ["MB", "SB", "BSH", "SAB"];
  const data: P5Data = {};
  MOCK_SANTRI.forEach((s, i) => {
    data[s.id] = DIMENSI_P5.map((d, j) => ({
      nilai: predikats[(i + j) % 4],
      deskripsi: d.deskripsi,
    }));
  });
  return data;
}

const predikatColors: Record<PredikatP5, string> = {
  MB: "bg-amber-500/10 text-amber-700",
  SB: "bg-blue-500/10 text-blue-700",
  BSH: "bg-green-500/10 text-green-700",
  SAB: "bg-purple-500/10 text-purple-700",
};

export default function AkademikP5() {
  const [filterKelas, setFilterKelas] = useState("k8");
  const [selectedSantri, setSelectedSantri] = useState<string | null>(null);
  const [data, setData] = useState<P5Data>(generateMockP5);
  const { toast } = useToast();

  const filteredSantri = MOCK_SANTRI.filter((s) => filterKelas === "all" || s.idKelas === filterKelas);
  const activeSantri = selectedSantri || (filteredSantri.length > 0 ? filteredSantri[0].id : null);

  const handleNilaiChange = (idx: number, value: PredikatP5) => {
    if (!activeSantri) return;
    setData((prev) => {
      const copy = { ...prev };
      copy[activeSantri] = [...(copy[activeSantri] || DIMENSI_P5.map((d) => ({ nilai: "BSH" as PredikatP5, deskripsi: d.deskripsi })))];
      copy[activeSantri][idx] = { ...copy[activeSantri][idx], nilai: value };
      return copy;
    });
  };

  const handleSave = () => {
    toast({ title: "Berhasil!", description: "Data Profil Pelajar Pancasila berhasil disimpan (mock)" });
  };

  // Group dimensi
  const grouped = DIMENSI_P5.reduce((acc, d, idx) => {
    if (!acc[d.dimensi]) acc[d.dimensi] = [];
    acc[d.dimensi].push({ ...d, idx });
    return acc;
  }, {} as Record<string, (DimensiP5 & { idx: number })[]>);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Profil Pelajar Pancasila (P5)</h1>
            <p className="text-muted-foreground text-sm mt-1">Penilaian capaian dimensi P5 santri</p>
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
              <Select value={activeSantri || ""} onValueChange={setSelectedSantri}>
                <SelectTrigger className="w-full sm:w-64"><SelectValue placeholder="Pilih Santri" /></SelectTrigger>
                <SelectContent>
                  {filteredSantri.map((s) => (<SelectItem key={s.id} value={s.id}>{s.nama}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-2">
          {(Object.entries(keteranganPredikatP3) as [PredikatP5, string][]).map(([key, val]) => (
            <Badge key={key} className={predikatColors[key]}>{key} = {val}</Badge>
          ))}
        </div>

        {activeSantri && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Penilaian P5 — {MOCK_SANTRI.find((s) => s.id === activeSantri)?.nama}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(grouped).map(([dimensi, items]) => (
                  <div key={dimensi}>
                    <h3 className="font-semibold text-sm mb-2 text-primary">Dimensi: {dimensi}</h3>
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Elemen</TableHead>
                          <TableHead>Deskripsi</TableHead>
                          <TableHead className="text-center w-[200px]">Penilaian</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => {
                          const santriData = data[activeSantri]?.[item.idx];
                          return (
                            <TableRow key={item.idx}>
                              <TableCell className="text-sm font-medium">{item.elemen}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{item.deskripsi}</TableCell>
                              <TableCell>
                                <div className="flex justify-center gap-1">
                                  {(["MB", "SB", "BSH", "SAB"] as PredikatP5[]).map((p) => (
                                    <Button
                                      key={p}
                                      size="sm"
                                      variant={santriData?.nilai === p ? "default" : "outline"}
                                      className={`h-7 px-2 text-xs ${santriData?.nilai === p ? "" : ""}`}
                                      onClick={() => handleNilaiChange(item.idx, p)}
                                    >
                                      {p}
                                    </Button>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
