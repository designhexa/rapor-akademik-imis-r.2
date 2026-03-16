import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, BookOpen, Settings, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Mapel = {
  id: string;
  nama: string;
  kode: string | null;
  jenjang: string;
  kategori: string;
  kkm: number | null;
  urutan: number | null;
  aktif: boolean | null;
};

type KomponenNilai = {
  id: string;
  id_mapel: string;
  nama_komponen: string;
  jenis: string;
  bobot: number | null;
  urutan: number | null;
  kelas: string | null;
};

type EditingKomponen = KomponenNilai | null;

type TahunAjaran = {
  id: string;
  nama: string;
  semester: string;
  aktif: boolean | null;
};

const KATEGORI_OPTIONS = ["Umum", "Agama", "Muatan Lokal", "Pemberdayaan", "Keterampilan"];
const JENJANG_OPTIONS = ["TK", "SD", "SMP"];
const JENIS_PENILAIAN = ["Tugas Harian", "Ujian Lisan", "Ujian Tulis", "Praktikum", "Proyek", "PAS", "PTS"];

export default function AkademikKurikulum() {
  const [mapelList, setMapelList] = useState<Mapel[]>([]);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([]);
  const [komponenList, setKomponenList] = useState<KomponenNilai[]>([]);
  const [filterJenjang, setFilterJenjang] = useState("SMP");
  const [filterKategori, setFilterKategori] = useState("all");
  const [loading, setLoading] = useState(true);

  // Mapel dialog
  const [mapelDialogOpen, setMapelDialogOpen] = useState(false);
  const [editingMapel, setEditingMapel] = useState<Mapel | null>(null);
  const [mapelForm, setMapelForm] = useState({ nama: "", kode: "", jenjang: "SMP", kategori: "Umum", kkm: 70, urutan: 0 });

  // Komponen dialog
  const [komponenDialogOpen, setKomponenDialogOpen] = useState(false);
  const [selectedMapelForKomponen, setSelectedMapelForKomponen] = useState<Mapel | null>(null);
  const [komponenForm, setKomponenForm] = useState({ nama_komponen: "", jenis: "Tugas Harian", bobot: 1, kelas: "" });

  // Tahun ajaran dialog
  const [taDialogOpen, setTaDialogOpen] = useState(false);
  const [taForm, setTaForm] = useState({ nama: "", semester: "Ganjil" });

  const [activeTab, setActiveTab] = useState("mapel");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [mapelRes, taRes] = await Promise.all([
      supabase.from("mata_pelajaran").select("*").order("urutan"),
      supabase.from("tahun_ajaran").select("*").order("created_at", { ascending: false }),
    ]);
    if (mapelRes.data) setMapelList(mapelRes.data as Mapel[]);
    if (taRes.data) setTahunAjaranList(taRes.data as TahunAjaran[]);
    setLoading(false);
  };

  const fetchKomponen = async (mapelId: string) => {
    const { data } = await supabase.from("komponen_nilai").select("*").eq("id_mapel", mapelId).order("urutan");
    if (data) setKomponenList(data as KomponenNilai[]);
  };

  // MAPEL CRUD
  const handleSaveMapel = async () => {
    if (!mapelForm.nama.trim()) { toast.error("Nama mapel wajib diisi"); return; }
    if (editingMapel) {
      const { error } = await supabase.from("mata_pelajaran").update({
        nama: mapelForm.nama, kode: mapelForm.kode || null, jenjang: mapelForm.jenjang as any,
        kategori: mapelForm.kategori as any, kkm: mapelForm.kkm, urutan: mapelForm.urutan,
      }).eq("id", editingMapel.id);
      if (error) { toast.error("Gagal mengupdate mapel"); return; }
      toast.success("Mapel berhasil diupdate");
    } else {
      const { error } = await supabase.from("mata_pelajaran").insert({
        nama: mapelForm.nama, kode: mapelForm.kode || null, jenjang: mapelForm.jenjang as any,
        kategori: mapelForm.kategori as any, kkm: mapelForm.kkm, urutan: mapelForm.urutan,
      });
      if (error) { toast.error("Gagal menambah mapel"); return; }
      toast.success("Mapel berhasil ditambahkan");
    }
    setMapelDialogOpen(false);
    setEditingMapel(null);
    fetchData();
  };

  const handleDeleteMapel = async (id: string) => {
    if (!confirm("Yakin ingin menghapus mapel ini?")) return;
    const { error } = await supabase.from("mata_pelajaran").delete().eq("id", id);
    if (error) { toast.error("Gagal menghapus mapel"); return; }
    toast.success("Mapel dihapus");
    fetchData();
  };

  const openEditMapel = (m: Mapel) => {
    setEditingMapel(m);
    setMapelForm({ nama: m.nama, kode: m.kode || "", jenjang: m.jenjang, kategori: m.kategori, kkm: m.kkm || 70, urutan: m.urutan || 0 });
    setMapelDialogOpen(true);
  };

  const openNewMapel = () => {
    setEditingMapel(null);
    setMapelForm({ nama: "", kode: "", jenjang: filterJenjang, kategori: "Umum", kkm: 70, urutan: mapelList.length + 1 });
    setMapelDialogOpen(true);
  };

  // KOMPONEN CRUD
  const openKomponenDialog = (m: Mapel) => {
    setSelectedMapelForKomponen(m);
    fetchKomponen(m.id);
    setKomponenDialogOpen(true);
  };

  const handleAddKomponen = async () => {
    if (!selectedMapelForKomponen || !komponenForm.nama_komponen.trim()) return;
    const { error } = await supabase.from("komponen_nilai").insert({
      id_mapel: selectedMapelForKomponen.id,
      nama_komponen: komponenForm.nama_komponen,
      jenis: komponenForm.jenis as any,
      bobot: komponenForm.bobot,
      kelas: komponenForm.kelas || null,
      urutan: komponenList.length,
    });
    if (error) { toast.error("Gagal menambah komponen"); return; }
    toast.success("Komponen ditambahkan");
    setKomponenForm({ nama_komponen: "", jenis: "Tugas Harian", bobot: 1, kelas: "" });
    fetchKomponen(selectedMapelForKomponen.id);
  };

  const handleDeleteKomponen = async (id: string) => {
    const { error } = await supabase.from("komponen_nilai").delete().eq("id", id);
    if (error) { toast.error("Gagal menghapus komponen"); return; }
    toast.success("Komponen dihapus");
    if (selectedMapelForKomponen) fetchKomponen(selectedMapelForKomponen.id);
  };

  // TAHUN AJARAN CRUD
  const handleSaveTa = async () => {
    if (!taForm.nama.trim()) { toast.error("Nama tahun ajaran wajib diisi"); return; }
    const { error } = await supabase.from("tahun_ajaran").insert({
      nama: taForm.nama, semester: taForm.semester as any,
    });
    if (error) { toast.error("Gagal menambah tahun ajaran"); return; }
    toast.success("Tahun ajaran ditambahkan");
    setTaDialogOpen(false);
    fetchData();
  };

  const handleSetAktifTa = async (id: string) => {
    // set all to false first
    await supabase.from("tahun_ajaran").update({ aktif: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("tahun_ajaran").update({ aktif: true }).eq("id", id);
    toast.success("Tahun ajaran aktif diubah");
    fetchData();
  };

  const filteredMapel = mapelList.filter(m => {
    if (m.jenjang !== filterJenjang) return false;
    if (filterKategori !== "all" && m.kategori !== filterKategori) return false;
    return true;
  });

  const getKategoriBadge = (k: string) => {
    const colors: Record<string, string> = {
      "Umum": "bg-blue-500/10 text-blue-700",
      "Agama": "bg-emerald-500/10 text-emerald-700",
      "Muatan Lokal": "bg-purple-500/10 text-purple-700",
      "Pemberdayaan": "bg-amber-500/10 text-amber-700",
      "Keterampilan": "bg-pink-500/10 text-pink-700",
    };
    return <Badge className={colors[k] || ""}>{k}</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kurikulum & Mata Pelajaran</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola struktur kurikulum, mata pelajaran, dan komponen penilaian</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="mapel"><BookOpen className="w-4 h-4 mr-1" /> Mata Pelajaran</TabsTrigger>
            <TabsTrigger value="tahun-ajaran"><GraduationCap className="w-4 h-4 mr-1" /> Tahun Ajaran</TabsTrigger>
          </TabsList>

          <TabsContent value="mapel" className="space-y-4">
            {/* Filter & Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-2">
                <Select value={filterJenjang} onValueChange={setFilterJenjang}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {JENJANG_OPTIONS.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filterKategori} onValueChange={setFilterKategori}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {KATEGORI_OPTIONS.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={openNewMapel}><Plus className="w-4 h-4 mr-1" /> Tambah Mapel</Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No</TableHead>
                      <TableHead>Nama Mapel</TableHead>
                      <TableHead>Kode</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead className="text-center">KKM</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Memuat data...</TableCell></TableRow>
                    ) : filteredMapel.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Belum ada mata pelajaran untuk jenjang {filterJenjang}</TableCell></TableRow>
                    ) : filteredMapel.map((m, i) => (
                      <TableRow key={m.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium">{m.nama}</TableCell>
                        <TableCell className="font-mono text-xs">{m.kode || "-"}</TableCell>
                        <TableCell>{getKategoriBadge(m.kategori)}</TableCell>
                        <TableCell className="text-center">{m.kkm}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openKomponenDialog(m)} title="Kelola Komponen Nilai">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditMapel(m)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteMapel(m.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tahun-ajaran" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => { setTaForm({ nama: "", semester: "Ganjil" }); setTaDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-1" /> Tambah Tahun Ajaran
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No</TableHead>
                      <TableHead>Tahun Ajaran</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tahunAjaranList.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada tahun ajaran</TableCell></TableRow>
                    ) : tahunAjaranList.map((ta, i) => (
                      <TableRow key={ta.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium">{ta.nama}</TableCell>
                        <TableCell>{ta.semester}</TableCell>
                        <TableCell className="text-center">
                          {ta.aktif ? <Badge className="bg-primary/10 text-primary">Aktif</Badge> : <Badge variant="outline">Nonaktif</Badge>}
                        </TableCell>
                        <TableCell className="text-center">
                          {!ta.aktif && (
                            <Button variant="outline" size="sm" onClick={() => handleSetAktifTa(ta.id)}>Set Aktif</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mapel Dialog */}
      <Dialog open={mapelDialogOpen} onOpenChange={setMapelDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingMapel ? "Edit" : "Tambah"} Mata Pelajaran</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nama Mapel</Label><Input value={mapelForm.nama} onChange={e => setMapelForm(f => ({ ...f, nama: e.target.value }))} /></div>
            <div><Label>Kode</Label><Input value={mapelForm.kode} onChange={e => setMapelForm(f => ({ ...f, kode: e.target.value }))} placeholder="Opsional" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Jenjang</Label>
                <Select value={mapelForm.jenjang} onValueChange={v => setMapelForm(f => ({ ...f, jenjang: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{JENJANG_OPTIONS.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Kategori</Label>
                <Select value={mapelForm.kategori} onValueChange={v => setMapelForm(f => ({ ...f, kategori: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{KATEGORI_OPTIONS.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>KKM</Label><Input type="number" value={mapelForm.kkm} onChange={e => setMapelForm(f => ({ ...f, kkm: Number(e.target.value) }))} /></div>
              <div><Label>Urutan</Label><Input type="number" value={mapelForm.urutan} onChange={e => setMapelForm(f => ({ ...f, urutan: Number(e.target.value) }))} /></div>
            </div>
          </div>
          <DialogFooter><Button onClick={handleSaveMapel}>Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Komponen Nilai Dialog */}
      <Dialog open={komponenDialogOpen} onOpenChange={setKomponenDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Komponen Nilai: {selectedMapelForKomponen?.nama}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {/* Add Form */}
            <div className="grid grid-cols-4 gap-2 items-end">
              <div className="col-span-1">
                <Label className="text-xs">Nama</Label>
                <Input value={komponenForm.nama_komponen} onChange={e => setKomponenForm(f => ({ ...f, nama_komponen: e.target.value }))} placeholder="Tugas Harian 1" />
              </div>
              <div>
                <Label className="text-xs">Jenis</Label>
                <Select value={komponenForm.jenis} onValueChange={v => setKomponenForm(f => ({ ...f, jenis: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{JENIS_PENILAIAN.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Kelas (opsional)</Label>
                <Input value={komponenForm.kelas} onChange={e => setKomponenForm(f => ({ ...f, kelas: e.target.value }))} placeholder="7, 8, 9..." />
              </div>
              <Button onClick={handleAddKomponen} size="sm"><Plus className="w-4 h-4 mr-1" /> Tambah</Button>
            </div>

            {/* List */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Komponen</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {komponenList.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-4">Belum ada komponen</TableCell></TableRow>
                ) : komponenList.map(k => (
                  <TableRow key={k.id}>
                    <TableCell>{k.nama_komponen}</TableCell>
                    <TableCell><Badge variant="outline">{k.jenis}</Badge></TableCell>
                    <TableCell>{k.kelas || "Semua"}</TableCell>
                    <TableCell><Button variant="ghost" size="sm" onClick={() => handleDeleteKomponen(k.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tahun Ajaran Dialog */}
      <Dialog open={taDialogOpen} onOpenChange={setTaDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tambah Tahun Ajaran</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Tahun Ajaran</Label><Input value={taForm.nama} onChange={e => setTaForm(f => ({ ...f, nama: e.target.value }))} placeholder="2025/2026" /></div>
            <div><Label>Semester</Label>
              <Select value={taForm.semester} onValueChange={v => setTaForm(f => ({ ...f, semester: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ganjil">Ganjil</SelectItem>
                  <SelectItem value="Genap">Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={handleSaveTa}>Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
