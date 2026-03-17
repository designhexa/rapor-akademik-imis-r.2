import { useState, useEffect } from "react";
import { MOCK_USTADZ } from "@/lib/mock-data";
import { usePagination } from "@/hooks/use-pagination";
import { TablePagination } from "@/components/TablePagination";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Kelas {
  id: string;
  nama_kelas: string;
  deskripsi: string | null;
  id_wali_kelas: string | null;
  created_at: string;
}


export default function DataKelas() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const ustadzList = MOCK_USTADZ;
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
  const [namaKelas, setNamaKelas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [waliKelas, setWaliKelas] = useState("");

  const fetchKelas = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("kelas")
      .select("*")
      .order("nama_kelas");

    if (error) {
      console.error("Error fetching kelas:", error);
      toast.error("Gagal memuat data kelas");
    } else {
      setKelasList((data as Kelas[]) || []);
    }
    setIsLoading(false);
  };


  useEffect(() => {
    fetchKelas();
  }, []);

  const getWaliName = (id: string | null) => {
    if (!id) return "-";
    return ustadzList.find(u => u.id === id)?.nama || "-";
  };

  const handleSubmit = async () => {
    if (!namaKelas.trim()) {
      toast.error("Nama kelas harus diisi");
      return;
    }

    const payload: any = {
      nama_kelas: namaKelas,
      deskripsi: deskripsi || null,
      id_wali_kelas: waliKelas || null,
    };

    if (isEditMode && selectedKelas) {
      const { error } = await supabase
        .from("kelas")
        .update(payload)
        .eq("id", selectedKelas.id);

      if (error) {
        console.error("Error updating kelas:", error);
        toast.error("Gagal mengupdate kelas");
      } else {
        toast.success("Kelas berhasil diupdate");
        fetchKelas();
      }
    } else {
      const { error } = await supabase
        .from("kelas")
        .insert(payload);

      if (error) {
        console.error("Error creating kelas:", error);
        toast.error("Gagal menambah kelas");
      } else {
        toast.success("Kelas berhasil ditambahkan");
        fetchKelas();
      }
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (kelas: Kelas) => {
    setSelectedKelas(kelas);
    setNamaKelas(kelas.nama_kelas);
    setDeskripsi(kelas.deskripsi || "");
    setWaliKelas(kelas.id_wali_kelas || "");
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kelas ini?")) return;

    const { error } = await supabase.from("kelas").delete().eq("id", id);

    if (error) {
      console.error("Error deleting kelas:", error);
      toast.error("Gagal menghapus kelas");
    } else {
      toast.success("Kelas berhasil dihapus");
      fetchKelas();
    }
  };

  const resetForm = () => {
    setNamaKelas("");
    setDeskripsi("");
    setWaliKelas("");
    setSelectedKelas(null);
    setIsEditMode(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-primary" />
              Data Kelas
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Kelola data kelas seperti KBTK, Paket A, Paket B, dll.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kelas
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit Kelas" : "Tambah Kelas Baru"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nama Kelas *</Label>
                  <Input
                    placeholder="Contoh: KBTK A, Paket A Kelas 6, Paket B Kelas 8"
                    value={namaKelas}
                    onChange={(e) => setNamaKelas(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Input
                    placeholder="Deskripsi kelas (opsional)"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Wali Kelas</Label>
                  <Select value={waliKelas} onValueChange={setWaliKelas}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih wali kelas (opsional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— Tidak ada —</SelectItem>
                      {ustadzList.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSubmit}>
                    {isEditMode ? "Simpan Perubahan" : "Tambah Kelas"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Memuat data...
            </div>
          ) : kelasList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada data kelas. Klik "Tambah Kelas" untuk menambahkan.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Kelas</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Wali Kelas</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kelasList.map((kelas, index) => (
                  <TableRow key={kelas.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-semibold">{kelas.nama_kelas}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {kelas.deskripsi || "-"}
                    </TableCell>
                    <TableCell>{getWaliName(kelas.id_wali_kelas)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(kelas)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(kelas.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </Layout>
  );
}
