import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Santri = { id: string; nama_santri: string; nis: string };
type Ekskul = { id: string; nama: string; aktif: boolean | null };
type TahunAjaran = { id: string; nama: string; semester: string; aktif: boolean | null };

interface NilaiEkskul {
  rekap_kehadiran: number;
  nilai_praktik: number;
  konversi_nilai: number;
  hasil_akhir: number;
  dbId?: string;
}

function getPredikat(nilai: number): string {
  if (nilai >= 90) return "A";
  if (nilai >= 80) return "B";
  if (nilai >= 70) return "C";
  return "D";
}

export default function AkademikEkskul() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [kelasList, setKelasList] = useState<{ id: string; nama_kelas: string; jenjang: string | null }[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [ekskulList, setEkskulList] = useState<Ekskul[]>([]);

  const [selectedTa, setSelectedTa] = useState("");
  const [filterJenjang, setFilterJenjang] = useState("SMP");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedEkskul, setSelectedEkskul] = useState("");

  const [data, setData] = useState<Record<string, NilaiEkskul>>({});
  const [saving, setSaving] = useState(false);

  const filteredKelas = kelasList.filter(k => !k.jenjang || k.jenjang === filterJenjang);

  useEffect(() => {
    (async () => {
      const [taRes, kelasRes, ekskulRes] = await Promise.all([
        supabase.from("tahun_ajaran").select("*").order("created_at", { ascending: false }),
        supabase.from("kelas").select("id, nama_kelas, jenjang").order("nama_kelas"),
        supabase.from("ekstrakurikuler").select("*").eq("aktif", true).order("nama"),
      ]);
      if (taRes.data) {
        setTahunAjaranList(taRes.data as TahunAjaran[]);
        const aktif = (taRes.data as TahunAjaran[]).find(t => t.aktif);
        if (aktif) setSelectedTa(aktif.id);
      }
      if (kelasRes.data) setKelasList(kelasRes.data);
      if (ekskulRes.data) {
        setEkskulList(ekskulRes.data as Ekskul[]);
        if (ekskulRes.data.length > 0) setSelectedEkskul(ekskulRes.data[0].id);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedKelas && selectedTa && selectedEkskul) loadData();
  }, [selectedKelas, selectedTa, selectedEkskul]);

  const loadData = async () => {
    const { data: santriData } = await supabase.from("santri").select("id, nama_santri, nis")
      .eq("id_kelas", selectedKelas).eq("status", "Aktif").order("nama_santri");
    if (santriData) setSantriList(santriData);

    if (santriData && santriData.length > 0) {
      const { data: nilaiData } = await supabase.from("nilai_ekskul").select("*")
        .in("id_santri", santriData.map(s => s.id))
        .eq("id_ekskul", selectedEkskul)
        .eq("id_tahun_ajaran", selectedTa);

      const map: Record<string, NilaiEkskul> = {};
      (nilaiData || []).forEach((n: any) => {
        map[n.id_santri] = {
          rekap_kehadiran: n.rekap_kehadiran || 0,
          nilai_praktik: Number(n.nilai_praktik) || 0,
          konversi_nilai: Number(n.konversi_nilai) || 0,
          hasil_akhir: Number(n.hasil_akhir) || 0,
          dbId: n.id,
        };
      });
      setData(map);
    }
  };

  const handleChange = (santriId: string, field: keyof NilaiEkskul, value: string) => {
    const num = Math.max(0, Math.min(100, parseInt(value) || 0));
    setData(prev => {
      const entry = prev[santriId] || { rekap_kehadiran: 0, nilai_praktik: 0, konversi_nilai: 0, hasil_akhir: 0 };
      const updated = { ...entry, [field]: num };
      updated.konversi_nilai = Math.round(updated.rekap_kehadiran * 0.3 + updated.nilai_praktik * 0.7);
      updated.hasil_akhir = updated.konversi_nilai;
      return { ...prev, [santriId]: updated };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const upsertData = Object.entries(data).map(([id_santri, d]) => ({
      ...(d.dbId ? { id: d.dbId } : {}),
      id_santri,
      id_ekskul: selectedEkskul,
      id_tahun_ajaran: selectedTa,
      rekap_kehadiran: d.rekap_kehadiran,
      nilai_praktik: d.nilai_praktik,
      konversi_nilai: d.konversi_nilai,
      hasil_akhir: d.hasil_akhir,
    }));

    const { error } = await supabase.from("nilai_ekskul").upsert(upsertData as any, { onConflict: "id_santri,id_ekskul,id_tahun_ajaran" });
    if (error) toast.error("Gagal menyimpan: " + error.message);
    else { toast.success("Nilai ekstrakurikuler berhasil disimpan"); loadData(); }
    setSaving(false);
  };

  const currentEkskul = ekskulList.find(e => e.id === selectedEkskul);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ekstrakurikuler</h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola data dan penilaian ekstrakurikuler</p>
          </div>
          <Button onClick={handleSave} disabled={saving}><Save className="w-4 h-4 mr-2" />{saving ? "Menyimpan..." : "Simpan"}</Button>
        </div>

        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Tahun Ajaran</label>
                <Select value={selectedTa} onValueChange={setSelectedTa}>
                  <SelectTrigger><SelectValue placeholder="Pilih TA" /></SelectTrigger>
                  <SelectContent>
                    {tahunAjaranList.map(ta => <SelectItem key={ta.id} value={ta.id}>{ta.nama} - {ta.semester} {ta.aktif ? "✓" : ""}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Jenjang</label>
                <Select value={filterJenjang} onValueChange={v => { setFilterJenjang(v); setSelectedKelas(""); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TK">TK</SelectItem>
                    <SelectItem value="SD">SD</SelectItem>
                    <SelectItem value="SMP">SMP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Kelas</label>
                <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                  <SelectTrigger><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
                  <SelectContent>
                    {filteredKelas.map(k => <SelectItem key={k.id} value={k.id}>{k.nama_kelas}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Ekstrakurikuler</label>
                <Select value={selectedEkskul} onValueChange={setSelectedEkskul}>
                  <SelectTrigger><SelectValue placeholder="Pilih Ekskul" /></SelectTrigger>
                  <SelectContent>
                    {ekskulList.map(e => <SelectItem key={e.id} value={e.id}>{e.nama}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedKelas && selectedEkskul && santriList.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Penilaian {currentEkskul?.nama} ({santriList.length} santri)</CardTitle>
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
                    {santriList.map((santri, sIdx) => {
                      const d = data[santri.id] || { rekap_kehadiran: 0, nilai_praktik: 0, konversi_nilai: 0, hasil_akhir: 0 };
                      return (
                        <TableRow key={santri.id}>
                          <TableCell>{sIdx + 1}</TableCell>
                          <TableCell className="font-medium text-sm">{santri.nama_santri}</TableCell>
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
        )}

        {(!selectedKelas || !selectedEkskul) && (
          <Card className="bg-muted/30">
            <CardContent className="text-center py-12 text-muted-foreground">
              Pilih tahun ajaran, kelas, dan ekstrakurikuler untuk memulai penilaian
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 text-sm">ℹ️ Informasi</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Konversi = 30% Kehadiran + 70% Praktik</li>
              <li>• Predikat: A (90-100), B (80-89), C (70-79), D (0-69)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
