import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type Mapel = { id: string; nama: string; kkm: number | null };
type Santri = { id: string; nama_santri: string; nis: string };
type TahunAjaran = { id: string; nama: string; semester: string; aktif: boolean | null };

type RekapRow = {
  santri: Santri;
  nilaiPerMapel: Record<string, number | null>; // mapelId -> avg
  jumlah: number;
  rataRata: number;
  peringkat: number;
};

export default function AkademikRekap() {
  const [mapelList, setMapelList] = useState<Mapel[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [kelasList, setKelasList] = useState<{ id: string; nama_kelas: string }[]>([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedTa, setSelectedTa] = useState("");
  const [rekapData, setRekapData] = useState<RekapRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInit();
  }, []);

  const loadInit = async () => {
    const [mapelRes, taRes, kelasRes] = await Promise.all([
      supabase.from("mata_pelajaran").select("id, nama, kkm").eq("aktif", true).eq("jenjang", "SMP").order("urutan"),
      supabase.from("tahun_ajaran").select("*").order("created_at", { ascending: false }),
      supabase.from("kelas").select("id, nama_kelas").order("nama_kelas"),
    ]);
    if (mapelRes.data) setMapelList(mapelRes.data);
    if (taRes.data) {
      setTahunAjaranList(taRes.data as TahunAjaran[]);
      const aktif = (taRes.data as TahunAjaran[]).find(t => t.aktif);
      if (aktif) setSelectedTa(aktif.id);
    }
    if (kelasRes.data) setKelasList(kelasRes.data);
  };

  useEffect(() => {
    if (selectedKelas && selectedTa) loadRekap();
  }, [selectedKelas, selectedTa]);

  const loadRekap = async () => {
    setLoading(true);
    // Get santri
    const { data: santriData } = await supabase.from("santri").select("id, nama_santri, nis")
      .eq("id_kelas", selectedKelas).eq("status", "Aktif").order("nama_santri");
    if (!santriData || santriData.length === 0) { setRekapData([]); setLoading(false); return; }

    // Get all komponen for all mapel
    const mapelIds = mapelList.map(m => m.id);
    const { data: komponenData } = await supabase.from("komponen_nilai").select("id, id_mapel").in("id_mapel", mapelIds);
    
    // Get all nilai
    const santriIds = santriData.map(s => s.id);
    const kompIds = (komponenData || []).map(k => k.id);
    
    let nilaiData: any[] = [];
    if (kompIds.length > 0 && santriIds.length > 0) {
      const { data } = await supabase.from("nilai_akademik").select("id_santri, id_komponen, nilai")
        .in("id_santri", santriIds).in("id_komponen", kompIds).eq("id_tahun_ajaran", selectedTa);
      nilaiData = data || [];
    }

    // Map komponen to mapel
    const kompToMapel: Record<string, string> = {};
    (komponenData || []).forEach(k => { kompToMapel[k.id] = k.id_mapel; });

    // Calculate averages per santri per mapel
    const rows: RekapRow[] = santriData.map(s => {
      const nilaiPerMapel: Record<string, number | null> = {};
      let totalNilai = 0;
      let mapelCount = 0;

      mapelList.forEach(m => {
        const relevantKomp = (komponenData || []).filter(k => k.id_mapel === m.id).map(k => k.id);
        const values = nilaiData
          .filter(n => n.id_santri === s.id && relevantKomp.includes(n.id_komponen) && n.nilai !== null)
          .map(n => Number(n.nilai));
        
        if (values.length > 0) {
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          nilaiPerMapel[m.id] = Math.round(avg * 100) / 100;
          totalNilai += nilaiPerMapel[m.id]!;
          mapelCount++;
        } else {
          nilaiPerMapel[m.id] = null;
        }
      });

      return {
        santri: s,
        nilaiPerMapel,
        jumlah: Math.round(totalNilai * 100) / 100,
        rataRata: mapelCount > 0 ? Math.round((totalNilai / mapelCount) * 100) / 100 : 0,
        peringkat: 0,
      };
    });

    // Sort by jumlah for ranking
    rows.sort((a, b) => b.jumlah - a.jumlah);
    rows.forEach((r, i) => { r.peringkat = r.jumlah > 0 ? i + 1 : 0; });

    // Re-sort by nama
    rows.sort((a, b) => a.santri.nama_santri.localeCompare(b.santri.nama_santri));

    setRekapData(rows);
    setLoading(false);
  };

  const getPredikat = (nilai: number | null) => {
    if (nilai === null) return "-";
    if (nilai >= 90) return "A";
    if (nilai >= 80) return "B";
    if (nilai >= 70) return "C";
    return "D";
  };

  const getPredikatColor = (p: string) => {
    switch (p) {
      case "A": return "bg-emerald-500/10 text-emerald-700";
      case "B": return "bg-blue-500/10 text-blue-700";
      case "C": return "bg-amber-500/10 text-amber-700";
      case "D": return "bg-red-500/10 text-red-700";
      default: return "";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rekap Nilai & Peringkat</h1>
          <p className="text-muted-foreground text-sm mt-1">Rekapitulasi nilai semua mata pelajaran per kelas</p>
        </div>

        <Card>
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Select value={selectedTa} onValueChange={setSelectedTa}>
                <SelectTrigger className="w-52"><SelectValue placeholder="Pilih TA" /></SelectTrigger>
                <SelectContent>
                  {tahunAjaranList.map(ta => (
                    <SelectItem key={ta.id} value={ta.id}>{ta.nama} - {ta.semester} {ta.aktif ? "✓" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                <SelectTrigger className="w-52"><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
                <SelectContent>
                  {kelasList.map(k => <SelectItem key={k.id} value={k.id}>{k.nama_kelas}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card><CardContent className="text-center py-12 text-muted-foreground">Memuat data...</CardContent></Card>
        ) : rekapData.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10 sticky left-0 bg-[#015504] z-10">No</TableHead>
                      <TableHead className="min-w-[160px] sticky left-10 bg-[#015504] z-10">Nama Siswa</TableHead>
                      {mapelList.map(m => (
                        <TableHead key={m.id} className="text-center min-w-[60px]">
                          <div className="text-[9px] leading-tight">{m.nama.length > 10 ? m.nama.substring(0, 10) + "." : m.nama}</div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Jumlah</TableHead>
                      <TableHead className="text-center">Rata²</TableHead>
                      <TableHead className="text-center">Peringkat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rekapData.map((row, idx) => (
                      <TableRow key={row.santri.id}>
                        <TableCell className="sticky left-0 bg-card z-10">{idx + 1}</TableCell>
                        <TableCell className="sticky left-10 bg-card z-10 font-medium text-sm">{row.santri.nama_santri}</TableCell>
                        {mapelList.map(m => {
                          const val = row.nilaiPerMapel[m.id];
                          const kkm = m.kkm || 70;
                          const belowKkm = val !== null && val < kkm;
                          return (
                            <TableCell key={m.id} className={`text-center text-sm ${belowKkm ? "text-red-600 font-semibold" : ""}`}>
                              {val !== null ? val : "-"}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center font-semibold">{row.jumlah || "-"}</TableCell>
                        <TableCell className="text-center">
                          {row.rataRata > 0 && (
                            <Badge className={getPredikatColor(getPredikat(row.rataRata))}>
                              {row.rataRata} ({getPredikat(row.rataRata)})
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-bold text-lg">{row.peringkat || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : selectedKelas ? (
          <Card><CardContent className="text-center py-12 text-muted-foreground">Belum ada data nilai untuk kelas ini</CardContent></Card>
        ) : (
          <Card className="bg-muted/30"><CardContent className="text-center py-12 text-muted-foreground">Pilih tahun ajaran dan kelas untuk melihat rekap nilai</CardContent></Card>
        )}
      </div>
    </Layout>
  );
}
