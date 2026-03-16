import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Santri = { id: string; nama_santri: string; nis: string; id_kelas: string | null };
type Mapel = { id: string; nama: string; jenjang: string; kategori: string; kkm: number | null };
type Komponen = { id: string; nama_komponen: string; jenis: string; kelas: string | null };
type TahunAjaran = { id: string; nama: string; semester: string; aktif: boolean | null };

export default function DiniyahInputNilai() {
  const [mapelList, setMapelList] = useState<Mapel[]>([]);
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [komponenList, setKomponenList] = useState<Komponen[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [kelasList, setKelasList] = useState<{ id: string; nama_kelas: string }[]>([]);

  const [selectedMapel, setSelectedMapel] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedTa, setSelectedTa] = useState("");

  const [nilaiMap, setNilaiMap] = useState<Record<string, { value: number | null; dirty: boolean; dbId?: string }>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const [mapelRes, taRes, kelasRes] = await Promise.all([
      supabase.from("mata_pelajaran").select("*").eq("aktif", true).eq("kategori", "Agama").order("urutan"),
      supabase.from("tahun_ajaran").select("*").order("created_at", { ascending: false }),
      supabase.from("kelas").select("id, nama_kelas").order("nama_kelas"),
    ]);
    if (mapelRes.data) setMapelList(mapelRes.data as Mapel[]);
    if (taRes.data) {
      setTahunAjaranList(taRes.data as TahunAjaran[]);
      const aktif = (taRes.data as TahunAjaran[]).find(t => t.aktif);
      if (aktif) setSelectedTa(aktif.id);
    }
    if (kelasRes.data) setKelasList(kelasRes.data);
  };

  const loadNilai = useCallback(async () => {
    if (!selectedMapel || !selectedKelas || !selectedTa) return;
    setLoading(true);

    const { data: santriData } = await supabase.from("santri").select("id, nama_santri, nis, id_kelas")
      .eq("id_kelas", selectedKelas).eq("status", "Aktif").order("nama_santri");
    if (santriData) setSantriList(santriData);

    const { data: kompData } = await supabase.from("komponen_nilai").select("*")
      .eq("id_mapel", selectedMapel).order("urutan");
    if (kompData) setKomponenList(kompData as Komponen[]);

    if (santriData && kompData) {
      const santriIds = santriData.map(s => s.id);
      const kompIds = (kompData as Komponen[]).map(k => k.id);
      
      if (santriIds.length > 0 && kompIds.length > 0) {
        const { data: nilaiData } = await supabase.from("nilai_akademik").select("*")
          .in("id_santri", santriIds).in("id_komponen", kompIds).eq("id_tahun_ajaran", selectedTa);
        
        const map: Record<string, { value: number | null; dirty: boolean; dbId?: string }> = {};
        if (nilaiData) {
          nilaiData.forEach((n: any) => {
            const key = `${n.id_santri}_${n.id_komponen}`;
            map[key] = { value: n.nilai !== null ? Number(n.nilai) : null, dirty: false, dbId: n.id };
          });
        }
        setNilaiMap(map);
      } else {
        setNilaiMap({});
      }
    }
    setLoading(false);
  }, [selectedMapel, selectedKelas, selectedTa]);

  useEffect(() => {
    if (selectedMapel && selectedKelas && selectedTa) loadNilai();
  }, [selectedMapel, selectedKelas, selectedTa, loadNilai]);

  const handleNilaiChange = (santriId: string, komponenId: string, value: string) => {
    const key = `${santriId}_${komponenId}`;
    const numVal = value === "" ? null : Number(value);
    setNilaiMap(prev => ({
      ...prev,
      [key]: { ...prev[key], value: numVal, dirty: true, dbId: prev[key]?.dbId },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const dirtyEntries = Object.entries(nilaiMap).filter(([, v]) => v.dirty);

    const upsertData = dirtyEntries.map(([key, v]) => {
      const [id_santri, id_komponen] = key.split("_");
      return {
        ...(v.dbId ? { id: v.dbId } : {}),
        id_santri,
        id_komponen,
        id_tahun_ajaran: selectedTa,
        nilai: v.value,
        id_guru: user?.id || null,
      };
    });

    if (upsertData.length === 0) { toast.info("Tidak ada perubahan"); setSaving(false); return; }

    const { error } = await supabase.from("nilai_akademik").upsert(upsertData as any, { onConflict: "id_santri,id_komponen,id_tahun_ajaran" });
    if (error) {
      toast.error("Gagal menyimpan nilai: " + error.message);
    } else {
      toast.success(`${upsertData.length} nilai berhasil disimpan`);
      loadNilai();
    }
    setSaving(false);
  };

  const getAverage = (santriId: string): string => {
    const values = komponenList.map(k => nilaiMap[`${santriId}_${k.id}`]?.value).filter(v => v !== null && v !== undefined) as number[];
    if (values.length === 0) return "-";
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Input Nilai Diniyah</h1>
            <p className="text-muted-foreground text-sm mt-1">Input nilai mata pelajaran keagamaan per kelas</p>
          </div>
          <Button onClick={handleSave} disabled={saving || !Object.values(nilaiMap).some(v => v.dirty)}>
            <Save className="w-4 h-4 mr-1" />
            {saving ? "Menyimpan..." : "Simpan Nilai"}
          </Button>
        </div>

        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Tahun Ajaran</label>
                <Select value={selectedTa} onValueChange={setSelectedTa}>
                  <SelectTrigger><SelectValue placeholder="Pilih TA" /></SelectTrigger>
                  <SelectContent>
                    {tahunAjaranList.map(ta => (
                      <SelectItem key={ta.id} value={ta.id}>{ta.nama} - {ta.semester} {ta.aktif ? "✓" : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Mata Pelajaran Diniyah</label>
                <Select value={selectedMapel} onValueChange={setSelectedMapel}>
                  <SelectTrigger><SelectValue placeholder="Pilih Mapel" /></SelectTrigger>
                  <SelectContent>
                    {mapelList.map(m => <SelectItem key={m.id} value={m.id}>{m.nama}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Kelas</label>
                <Select value={selectedKelas} onValueChange={setSelectedKelas}>
                  <SelectTrigger><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
                  <SelectContent>
                    {kelasList.map(k => <SelectItem key={k.id} value={k.id}>{k.nama_kelas}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedMapel && selectedKelas && selectedTa && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {mapelList.find(m => m.id === selectedMapel)?.nama} — {santriList.length} siswa, {komponenList.length} komponen
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={loadNilai}><RefreshCw className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Memuat data...</div>
              ) : komponenList.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Belum ada komponen penilaian untuk mapel ini. Silakan tambahkan di halaman Kurikulum.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10 sticky left-0 bg-[#015504] z-10">No</TableHead>
                        <TableHead className="min-w-[180px] sticky left-10 bg-[#015504] z-10">Nama Siswa</TableHead>
                        {komponenList.map(k => (
                          <TableHead key={k.id} className="min-w-[80px] text-center">
                            <div className="text-[10px] leading-tight">{k.nama_komponen}</div>
                            <div className="text-[9px] opacity-70 font-normal">{k.jenis}</div>
                          </TableHead>
                        ))}
                        <TableHead className="text-center min-w-[70px]">Rata-rata</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {santriList.map((s, idx) => (
                        <TableRow key={s.id}>
                          <TableCell className="sticky left-0 bg-card z-10">{idx + 1}</TableCell>
                          <TableCell className="sticky left-10 bg-card z-10 font-medium text-sm">{s.nama_santri}</TableCell>
                          {komponenList.map(k => {
                            const key = `${s.id}_${k.id}`;
                            const val = nilaiMap[key]?.value;
                            const isDirty = nilaiMap[key]?.dirty;
                            return (
                              <TableCell key={k.id} className="p-1">
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  className={`w-16 h-8 text-center text-sm p-1 ${isDirty ? "border-primary ring-1 ring-primary/30" : ""}`}
                                  value={val ?? ""}
                                  onChange={e => handleNilaiChange(s.id, k.id, e.target.value)}
                                />
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center font-semibold">{getAverage(s.id)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {(!selectedMapel || !selectedKelas || !selectedTa) && (
          <Card className="bg-muted/30">
            <CardContent className="text-center py-12 text-muted-foreground">
              Pilih tahun ajaran, mata pelajaran diniyah, dan kelas untuk memulai input nilai
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
