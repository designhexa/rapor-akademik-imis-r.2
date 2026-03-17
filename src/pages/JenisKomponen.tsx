import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Constants } from "@/integrations/supabase/types";

// Jenis penilaian from DB enum + custom ones from table
const ENUM_JENIS = Constants.public.Enums.jenis_penilaian;

export default function JenisKomponen() {
  const [jenisList, setJenisList] = useState<string[]>([]);
  const [customJenis, setCustomJenis] = useState<{ id: string; nama: string; deskripsi: string | null }[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nama: "", deskripsi: "" });

  useEffect(() => {
    setJenisList([...ENUM_JENIS]);
    fetchCustomJenis();
  }, []);

  const fetchCustomJenis = async () => {
    const { data } = await supabase.from("jenis_komponen_custom" as any).select("*").order("nama");
    if (data) setCustomJenis(data as any);
  };

  const handleSave = async () => {
    if (!form.nama.trim()) {
      toast.error("Nama jenis komponen wajib diisi");
      return;
    }
    // Check duplicate against enum
    if (ENUM_JENIS.includes(form.nama.trim() as any)) {
      toast.error("Jenis komponen sudah ada di sistem");
      return;
    }

    if (editId) {
      const { error } = await supabase
        .from("jenis_komponen_custom" as any)
        .update({ nama: form.nama.trim(), deskripsi: form.deskripsi || null } as any)
        .eq("id", editId);
      if (error) toast.error("Gagal mengupdate: " + error.message);
      else toast.success("Jenis komponen berhasil diupdate");
    } else {
      const { error } = await supabase
        .from("jenis_komponen_custom" as any)
        .insert({ nama: form.nama.trim(), deskripsi: form.deskripsi || null } as any);
      if (error) toast.error("Gagal menambah: " + error.message);
      else toast.success("Jenis komponen berhasil ditambahkan");
    }
    setDialogOpen(false);
    setEditId(null);
    setForm({ nama: "", deskripsi: "" });
    fetchCustomJenis();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("jenis_komponen_custom" as any).delete().eq("id", id);
    if (error) toast.error("Gagal menghapus: " + error.message);
    else {
      toast.success("Jenis komponen dihapus");
      fetchCustomJenis();
    }
  };

  const openEdit = (item: { id: string; nama: string; deskripsi: string | null }) => {
    setEditId(item.id);
    setForm({ nama: item.nama, deskripsi: item.deskripsi || "" });
    setDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Jenis Komponen Penilaian</h1>
            <p className="text-muted-foreground">Kelola jenis/tipe komponen penilaian yang tersedia</p>
          </div>
          <Button onClick={() => { setEditId(null); setForm({ nama: "", deskripsi: "" }); setDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Tambah Jenis
          </Button>
        </div>

        {/* Built-in types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="w-5 h-5" /> Jenis Bawaan Sistem
            </CardTitle>
            <CardDescription>Jenis komponen penilaian standar yang sudah tersedia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {jenisList.map((j) => (
                <Badge key={j} variant="secondary" className="text-sm py-1 px-3">{j}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="w-5 h-5" /> Jenis Kustom
            </CardTitle>
            <CardDescription>Jenis komponen penilaian tambahan yang dibuat pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            {customJenis.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Belum ada jenis komponen kustom. Klik "Tambah Jenis" untuk menambahkan.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Jenis</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead className="w-24">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customJenis.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.nama}</TableCell>
                        <TableCell className="text-muted-foreground">{item.deskripsi || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => openEdit(item)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit" : "Tambah"} Jenis Komponen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Jenis Komponen</Label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Contoh: Kuis, Portofolio, dll."
              />
            </div>
            <div>
              <Label>Deskripsi (opsional)</Label>
              <Input
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                placeholder="Keterangan singkat"
              />
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
