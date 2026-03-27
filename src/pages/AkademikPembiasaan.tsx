import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PredikatPembiasaan = "A" | "B" | "C" | "D";
type Santri = { id: string; nama_santri: string; nis: string };
type TahunAjaran = { id: string; nama: string; semester: string; aktif: boolean | null };

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

const predikatColors: Record<PredikatPembiasaan, string> = {
  A: "bg-green-500/10 text-green-700 hover:bg-green-500/20",
  B: "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20",
  C: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20",
  D: "bg-red-500/10 text-red-700 hover:bg-red-500/20",
};

export default function AkademikPembiasaan() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [kelasList, setKelasList] = useState<{ id: string; nama_kelas: string; jenjang: string | null }[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);

  const [selectedTa, setSelectedTa] = useState("");
  const [filterJenjang, setFilterJenjang] = useState("SMP");
  const [selectedKelas, setSelectedKelas] = useState("");
  const [lokasi, setLokasi] = useState<"sekolah" | "rumah">("sekolah");

  const [dataMap, setDataMap] = useState<Record<string, PredikatPembiasaan>>({});
  const [saving, setSaving] = useState(false);

  const items = lokasi === "sekolah" ? PEMBIASAAN_SEKOLAH : PEMBIASAAN_RUMAH;
  const filteredKelas = kelasList.filter(k => !k.jenjang || k.jenjang === filterJenjang);

  useEffect(() => {
    (async () => {
      const [taRes, kelasRes] = await Promise.all([
        supabase.from("tahun_ajaran").select("*").order("created_at", { ascending: false }),
        supabase.from("kelas").select("id, nama_kelas, jenjang").order("nama_kelas"),
      ]);
      if (taRes.data) {
        setTahunAjaranList(taRes.data as TahunAjaran[]);
        const aktif = (taRes.data as TahunAjaran[]).find(t => t.aktif);
        if (aktif) setSelectedTa(aktif.id);
      }
      if (kelasRes.data) setKelasList(kelasRes.data);
    })();
  }, []);

  useEffect(() => {
    if (selectedKelas && selectedTa) loadData();
  }, [selectedKelas, selectedTa, lokasi]);

  const loadData = async () => {
    const { data: santriData } = await supabase.from("santri").select("id, nama_santri, nis")
      .eq("id_kelas", selectedKelas).eq("status", "Aktif").order("nama_santri");
    if (santriData) setSantriList(santriData);

    if (santriData && santriData.length > 0) {
      const { data: pembiasaanData } = await supabase.from("pembiasaan").select("*")
        .in("id_santri", santriData.map(s => s.id))
        .eq("id_tahun_ajaran", selectedTa)
        .eq("lokasi", lokasi);

      const map: Record<string, PredikatPembiasaan> = {};
      (pembiasaanData || []).forEach((p: any) => {
        map[`${p.id_santri}_${p.nomor}`] = p.nilai as PredikatPembiasaan;
      });
      setDataMap(map);
    }
  };

  const handleChange = (santriId: string, idx: number, value: PredikatPembiasaan) => {
    setDataMap(prev => ({ ...prev, [`${santriId}_${idx}`]: value }));
  };

  const handleSave = async () => {
    if (!selectedKelas || !selectedTa) return;
    setSaving(true);
    const upsertData = santriList.flatMap(s =>
      items.map((_, idx) => ({
        id_santri: s.id,
        id_tahun_ajaran: selectedTa,
        lokasi,
        nomor: idx,
        nilai: dataMap[`${s.id}_${idx}`] || "A",
      }))
    );

    const { error } = await supabase.from("pembiasaan").upsert(upsertData as any, { onConflict: "id_santri,id_tahun_ajaran,lokasi,nomor" });
    if (error) toast.error("Gagal menyimpan: " + error.message);
    else toast.success("Data pembiasaan berhasil disimpan");
    setSaving(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Input Pembiasaan</h1>
            <p className="text-muted-foreground text-sm mt-1">Penilaian pembiasaan santri di sekolah dan rumah</p>
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
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Lokasi</label>
                <Select value={lokasi} onValueChange={(v) => setLokasi(v as "sekolah" | "rumah")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sekolah">Pembiasaan di Sekolah</SelectItem>
                    <SelectItem value="rumah">Pembiasaan di Rumah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedKelas && santriList.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Pembiasaan di {lokasi === "sekolah" ? "Sekolah" : "Rumah"} ({santriList.length} santri)
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
                    {santriList.map((santri, sIdx) => (
                      <TableRow key={santri.id}>
                        <TableCell className="sticky left-0 bg-background z-10">{sIdx + 1}</TableCell>
                        <TableCell className="sticky left-8 bg-background z-10 font-medium text-sm">{santri.nama_santri}</TableCell>
                        {items.map((_, iIdx) => {
                          const val = dataMap[`${santri.id}_${iIdx}`] || "A";
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
        )}

        {!selectedKelas && (
          <Card className="bg-muted/30">
            <CardContent className="text-center py-12 text-muted-foreground">
              Pilih tahun ajaran dan kelas untuk memulai input pembiasaan
            </CardContent>
          </Card>
        )}

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
