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
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Constants } from "@/integrations/supabase/types";

const JENIS_PENILAIAN = Constants.public.Enums.jenis_penilaian;

type Mapel = { id: string; nama: string; kategori: string; jenjang: string };
type KomponenNilai = {
  id: string;
  id_mapel: string;
  nama_komponen: string;
  jenis: string;
  bobot: number | null;
  urutan: number | null;
  kelas: string | null;
  mata_pelajaran?: { nama: string; kategori: string; jenjang: string } | null;
};

export default function KomponenPenilaian() {
  const [komponen, setKomponen] = useState<KomponenNilai[]>([]);
  const [mapelList, setMapelList] = useState<Mapel[]>([]);
  const [filterMapel, setFilterMapel] = useState("all");
  const [filterKategori, setFilterKategori] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    id_mapel: "",
    nama_komponen: "",
    jenis: "Tugas Harian",
    bobot: "1",
    urutan: "0",
    kelas: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: mapels }, { data: komponenData }] = await Promise.all([
      supabase.from("mata_pelajaran").select("id, nama, kategori, jenjang").eq("aktif", true).order("urutan"),
      supabase.from("komponen_nilai").select("*, mata_pelajaran(nama, kategori, jenjang)").order("urutan"),
    ]);
    if (mapels) setMapelList(mapels);
    if (komponenData) setKomponen(komponenData as any);
  };

  const filtered = komponen.filter((k) => {
    if (filterMapel !== "all" && k.id_mapel !== filterMapel) return false;
    if (filterKategori !== "all" && k.mata_pelajaran?.kategori !== filterKategori) return false;
    if (searchTerm && !k.nama_komponen.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleSave = async () => {
    if (!form.id_mapel || !form.nama_komponen.trim()) {
      toast.error("Mata pelajaran dan nama komponen wajib diisi");
      return;
    }
    const payload = {
      id_mapel: form.id_mapel,
      nama_komponen: form.nama_komponen.trim(),
      jenis: form.jenis as any,
      bobot: parseFloat(form.bobot) || 1,
      urutan: parseInt(form.urutan) || 0,
      kelas: form.kelas || null,
    };

    if (editId) {
      const { error } = await supabase.from("komponen_nilai").update(payload).eq("id", editId);
      if (error) toast.error("Gagal update: " + error.message);
      else toast.success("Komponen berhasil diupdate");
    } else {
      const { error } = await supabase.from("komponen_nilai").insert(payload);
      if (error) toast.error("Gagal menambah: " + error.message);
      else toast.success("Komponen berhasil ditambahkan");
    }
    setDialogOpen(false);
    setEditId(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("komponen_nilai").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus: " + error.message);
    else { toast.success("Komponen dihapus"); fetchData(); }
  };

  const openEdit = (k: KomponenNilai) => {
    setEditId(k.id);
    setForm({
      id_mapel: k.id_mapel,
      nama_komponen: k.nama_komponen,
      jenis: k.jenis,
      bobot: String(k.bobot ?? 1),
      urutan: String(k.urutan ?? 0),
      kelas: k.kelas || "",
    });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setForm({ id_mapel: "", nama_komponen: "", jenis: "Tugas Harian", bobot: "1", urutan: "0", kelas: "" });
    setDialogOpen(true);
  };

  const getJenisBadge = (jenis: string) => {
    const colors: Record<string, string> = {
      "PAS": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      "PTS": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      "Ujian Tulis": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "Ujian Lisan": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "Tugas Harian": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    };
    return <Badge className={colors[jenis] || "bg-muted text-muted-foreground"}>{jenis}</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Komponen Penilaian</h1>
            <p className="text-muted-foreground">Kelola komponen penilaian untuk semua mata pelajaran</p>
          </div>
          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" /> Tambah Komponen
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Cari komponen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterKategori} onValueChange={setFilterKategori}>
                <SelectTrigger><SelectValue placeholder="Filter Kategori" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="Umum">Umum</SelectItem>
                  <SelectItem value="Agama">Agama</SelectItem>
                  <SelectItem value="Muatan Lokal">Muatan Lokal</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterMapel} onValueChange={setFilterMapel}>
                <SelectTrigger><SelectValue placeholder="Filter Mapel" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Mapel</SelectItem>
                  {mapelList.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead>Nama Komponen</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-center">Bobot</TableHead>
                    <TableHead className="text-center">Kelas</TableHead>
                    <TableHead className="w-24">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Tidak ada data komponen penilaian
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((k) => (
                      <TableRow key={k.id}>
                        <TableCell className="font-medium">{k.mata_pelajaran?.nama || "-"}</TableCell>
                        <TableCell>{k.nama_komponen}</TableCell>
                        <TableCell>{getJenisBadge(k.jenis)}</TableCell>
                        <TableCell className="text-center">{k.bobot}</TableCell>
                        <TableCell className="text-center">{k.kelas || "Semua"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => openEdit(k)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(k.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">Total: {filtered.length} komponen</p>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Tambah"} Komponen Penilaian</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Mata Pelajaran</Label>
              <Select value={form.id_mapel} onValueChange={(v) => setForm({ ...form, id_mapel: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih Mapel" /></SelectTrigger>
                <SelectContent>
                  {mapelList.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.nama} ({m.jenjang})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nama Komponen</Label>
              <Input value={form.nama_komponen} onChange={(e) => setForm({ ...form, nama_komponen: e.target.value })} placeholder="Contoh: Ujian Tulis 1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label>Jenis</Label>
                <Select value={form.jenis} onValueChange={(v) => setForm({ ...form, jenis: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {JENIS_PENILAIAN.map((j) => (
                      <SelectItem key={j} value={j}>{j}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Bobot</Label>
                <Input type="number" value={form.bobot} onChange={(e) => setForm({ ...form, bobot: e.target.value })} />
              </div>
              <div>
                <Label>Kelas</Label>
                <Input value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })} placeholder="Kosong = Semua" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Simpan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
