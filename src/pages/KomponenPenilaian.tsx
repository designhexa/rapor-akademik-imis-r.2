import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Constants } from "@/integrations/supabase/types";
import { usePagination } from "@/hooks/use-pagination";
import { TablePagination } from "@/components/TablePagination";

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
};

export default function KomponenPenilaian() {
  const [komponen, setKomponen] = useState<KomponenNilai[]>([]);
  const [mapelList, setMapelList] = useState<Mapel[]>([]);
  const [selectedMapel, setSelectedMapel] = useState<string>("");
  const [filterKategori, setFilterKategori] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nama_komponen: "",
    jenis: "Tugas Harian",
    bobot: "1",
    urutan: "0",
    kelas: "",
  });

  useEffect(() => {
    fetchMapelList();
  }, []);

  useEffect(() => {
    if (selectedMapel) fetchKomponen();
  }, [selectedMapel]);

  const fetchMapelList = async () => {
    const { data } = await supabase.from("mata_pelajaran").select("id, nama, kategori, jenjang").eq("aktif", true).order("urutan");
    if (data) {
      setMapelList(data);
      if (data.length > 0 && !selectedMapel) setSelectedMapel(data[0].id);
    }
  };

  const fetchKomponen = async () => {
    const { data } = await supabase.from("komponen_nilai").select("id, id_mapel, nama_komponen, jenis, bobot, urutan, kelas").eq("id_mapel", selectedMapel).order("urutan");
    if (data) setKomponen(data as any);
  };

  const filtered = komponen.filter((k) => {
    if (searchTerm && !k.nama_komponen.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredMapel = mapelList.filter((m) => {
    if (filterKategori !== "all" && m.kategori !== filterKategori) return false;
    return true;
  });

  const selectedMapelData = mapelList.find((m) => m.id === selectedMapel);

  const pagination = usePagination(filtered);

  const handleSave = async () => {
    if (!selectedMapel || !form.nama_komponen.trim()) {
      toast.error("Nama komponen wajib diisi");
      return;
    }
    const payload = {
      id_mapel: selectedMapel,
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
    fetchKomponen();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("komponen_nilai").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus: " + error.message);
    else { toast.success("Komponen dihapus"); fetchKomponen(); }
  };

  const openEdit = (k: KomponenNilai) => {
    setEditId(k.id);
    setForm({
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
    setForm({ nama_komponen: "", jenis: "Tugas Harian", bobot: "1", urutan: "0", kelas: "" });
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
            <p className="text-muted-foreground">Kelola komponen penilaian per mata pelajaran</p>
          </div>
          <Button onClick={openNew} disabled={!selectedMapel}>
            <Plus className="w-4 h-4 mr-2" /> Tambah Komponen
          </Button>
        </div>

        {/* Mapel Selector */}
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select value={filterKategori} onValueChange={(v) => { setFilterKategori(v); pagination.resetPage(); }}>
                <SelectTrigger><SelectValue placeholder="Filter Kategori" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="Umum">Umum</SelectItem>
                  <SelectItem value="Agama">Agama</SelectItem>
                  <SelectItem value="Muatan Lokal">Muatan Lokal</SelectItem>
                  <SelectItem value="Pemberdayaan">Pemberdayaan</SelectItem>
                  <SelectItem value="Keterampilan">Keterampilan</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedMapel} onValueChange={(v) => { setSelectedMapel(v); pagination.resetPage(); }}>
                <SelectTrigger><SelectValue placeholder="Pilih Mata Pelajaran" /></SelectTrigger>
                <SelectContent>
                  {filteredMapel.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.nama} ({m.jenjang})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Cari komponen..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); pagination.resetPage(); }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedMapelData && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">{selectedMapelData.jenjang}</Badge>
            <Badge variant="secondary">{selectedMapelData.kategori}</Badge>
            <span className="text-sm text-muted-foreground">— {filtered.length} komponen</span>
          </div>
        )}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Nama Komponen</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-center">Bobot</TableHead>
                    <TableHead className="text-center">Kelas</TableHead>
                    <TableHead className="w-24">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedMapel ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Pilih mata pelajaran terlebih dahulu
                      </TableCell>
                    </TableRow>
                  ) : pagination.paginatedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Tidak ada komponen penilaian untuk mapel ini
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagination.paginatedItems.map((k, i) => (
                      <TableRow key={k.id}>
                        <TableCell>{pagination.startIndex + i + 1}</TableCell>
                        <TableCell className="font-medium">{k.nama_komponen}</TableCell>
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
            <div className="px-4 pb-4">
              <TablePagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                startIndex={pagination.startIndex}
                onPageChange={pagination.setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Tambah"} Komponen Penilaian</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
