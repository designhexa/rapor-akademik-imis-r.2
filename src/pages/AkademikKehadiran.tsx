import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BULAN = ["Juli", "Agustus", "September", "Oktober", "November", "Desember", "Januari", "Februari", "Maret", "April", "Mei", "Juni"];
const BULAN_NUM = [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];

type Santri = { id: string; nama_santri: string; nis: string };
type KehadiranEntry = { bulan: number; sakit: number; izin: number; alpha: number; dbId?: string };

export default function AkademikKehadiran() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [kelasList, setKelasList] = useState<{ id: string; nama_kelas: string; jenjang: string | null }[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<any[]>([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedTa, setSelectedTa] = useState("");
  const [filterJenjang, setFilterJenjang] = useState("SMP");
  const [selectedSemester, setSelectedSemester] = useState<"Ganjil" | "Genap">("Ganjil");
  const [kehadiranMap, setKehadiranMap] = useState<Record<string, KehadiranEntry>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const semesterBulan = selectedSemester === "Ganjil" ? BULAN_NUM.slice(0, 6) : BULAN_NUM.slice(6);
  const semesterBulanNames = selectedSemester === "Ganjil" ? BULAN.slice(0, 6) : BULAN.slice(6);
  const filteredKelas = kelasList.filter(k => !k.jenjang || k.jenjang === filterJenjang);

  useEffect(() => {
    (async () => {
      const [taRes, kelasRes] = await Promise.all([
        supabase.from("tahun_ajaran").select("*").order("created_at", { ascending: false }),
        supabase.from("kelas").select("id, nama_kelas, jenjang").order("nama_kelas"),
      ]);
      if (taRes.data) {
        setTahunAjaranList(taRes.data);
        const aktif = taRes.data.find((t: any) => t.aktif);
        if (aktif) setSelectedTa(aktif.id);
      }
      if (kelasRes.data) setKelasList(kelasRes.data);
    })();
  }, []);

  useEffect(() => {
    if (selectedKelas && selectedTa) loadData();
  }, [selectedKelas, selectedTa]);

  const loadData = async () => {
    setLoading(true);
    const { data: santriData } = await supabase.from("santri").select("id, nama_santri, nis")
      .eq("id_kelas", selectedKelas).eq("status", "Aktif").order("nama_santri");
    if (santriData) setSantriList(santriData);

    if (santriData && santriData.length > 0) {
      const { data: khData } = await supabase.from("kehadiran_akademik").select("*")
        .in("id_santri", santriData.map(s => s.id)).eq("id_tahun_ajaran", selectedTa);

      const map: Record<string, KehadiranEntry> = {};
      (khData || []).forEach((k: any) => {
        const key = `${k.id_santri}_${k.bulan}`;
        map[key] = { bulan: k.bulan, sakit: k.sakit || 0, izin: k.izin || 0, alpha: k.alpha || 0, dbId: k.id };
      });
      setKehadiranMap(map);
    }
    setLoading(false);
  };

  const handleChange = (santriId: string, bulan: number, field: "sakit" | "izin" | "alpha", value: string) => {
    const key = `${santriId}_${bulan}`;
    const num = value === "" ? 0 : Number(value);
    setKehadiranMap(prev => ({
      ...prev,
      [key]: { ...(prev[key] || { bulan, sakit: 0, izin: 0, alpha: 0 }), [field]: num },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const upsertData = Object.entries(kehadiranMap).map(([key, entry]) => {
      const [id_santri, bulanStr] = key.split("_");
      const tahun = Number(bulanStr) >= 7 ? 2025 : 2026;
      return {
        ...(entry.dbId ? { id: entry.dbId } : {}),
        id_santri,
        id_tahun_ajaran: selectedTa,
        bulan: Number(bulanStr),
        tahun,
        sakit: entry.sakit,
        izin: entry.izin,
        alpha: entry.alpha,
      };
    });

    const { error } = await supabase.from("kehadiran_akademik").upsert(upsertData as any, { onConflict: "id_santri,id_tahun_ajaran,bulan,tahun" });
    if (error) toast.error("Gagal menyimpan: " + error.message);
    else { toast.success("Kehadiran berhasil disimpan"); loadData(); }
    setSaving(false);
  };

  const getTotal = (santriId: string, field: "sakit" | "izin" | "alpha") => {
    return semesterBulan.reduce((sum, b) => {
      const entry = kehadiranMap[`${santriId}_${b}`];
      return sum + (entry ? entry[field] : 0);
    }, 0);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Kehadiran Akademik</h1>
            <p className="text-muted-foreground text-sm mt-1">Rekap kehadiran siswa per bulan</p>
          </div>
          <Button onClick={handleSave} disabled={saving}><Save className="w-4 h-4 mr-1" /> Simpan</Button>
        </div>

        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Tahun Ajaran</label>
                <Select value={selectedTa} onValueChange={setSelectedTa}>
                  <SelectTrigger><SelectValue placeholder="Pilih TA" /></SelectTrigger>
                  <SelectContent>
                    {tahunAjaranList.map((ta: any) => <SelectItem key={ta.id} value={ta.id}>{ta.nama} - {ta.semester} {ta.aktif ? "✓" : ""}</SelectItem>)}
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
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Semester</label>
                <Select value={selectedSemester} onValueChange={v => setSelectedSemester(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                    <SelectItem value="Genap">Genap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {santriList.length > 0 && (
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={2} className="w-10 sticky left-0 bg-[#015504] z-10">No</TableHead>
                    <TableHead rowSpan={2} className="min-w-[160px] sticky left-10 bg-[#015504] z-10">Nama Siswa</TableHead>
                    {semesterBulanNames.map((b) => (
                      <TableHead key={b} colSpan={3} className="text-center border-l border-white/20">{b}</TableHead>
                    ))}
                    <TableHead colSpan={3} className="text-center border-l border-white/20">REKAP</TableHead>
                  </TableRow>
                  <TableRow>
                    {semesterBulanNames.map(b => (
                      <>
                        <TableHead key={`${b}-s`} className="text-center text-[10px] w-10">S</TableHead>
                        <TableHead key={`${b}-i`} className="text-center text-[10px] w-10">I</TableHead>
                        <TableHead key={`${b}-a`} className="text-center text-[10px] w-10">A</TableHead>
                      </>
                    ))}
                    <TableHead className="text-center text-[10px] w-10">S</TableHead>
                    <TableHead className="text-center text-[10px] w-10">I</TableHead>
                    <TableHead className="text-center text-[10px] w-10">A</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {santriList.map((s, idx) => (
                    <TableRow key={s.id}>
                      <TableCell className="sticky left-0 bg-card z-10">{idx + 1}</TableCell>
                      <TableCell className="sticky left-10 bg-card z-10 text-sm">{s.nama_santri}</TableCell>
                      {semesterBulan.map(bulan => (
                        ["sakit", "izin", "alpha"].map(field => (
                          <TableCell key={`${bulan}-${field}`} className="p-1">
                            <Input
                              type="number"
                              min={0}
                              className="w-10 h-7 text-center text-xs p-0"
                              value={kehadiranMap[`${s.id}_${bulan}`]?.[field as "sakit"] || ""}
                              onChange={e => handleChange(s.id, bulan, field as any, e.target.value)}
                            />
                          </TableCell>
                        ))
                      ))}
                      <TableCell className="text-center font-semibold text-sm">{getTotal(s.id, "sakit") || "-"}</TableCell>
                      <TableCell className="text-center font-semibold text-sm">{getTotal(s.id, "izin") || "-"}</TableCell>
                      <TableCell className="text-center font-semibold text-sm">{getTotal(s.id, "alpha") || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {!selectedKelas && (
          <Card className="bg-muted/30">
            <CardContent className="text-center py-12 text-muted-foreground">
              Pilih tahun ajaran dan kelas untuk memulai input kehadiran
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
