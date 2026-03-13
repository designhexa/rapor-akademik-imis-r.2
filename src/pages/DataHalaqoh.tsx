import { useState } from "react";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  MOCK_HALAQOH,
  MOCK_USTADZ,
  MockHalaqoh,
  getUstadzNama,
  getSantriByHalaqoh,
} from "@/lib/mock-data";

const tingkatOptions = ["Pemula", "Menengah", "Lanjutan"];

export default function DataHalaqoh() {
  const [halaqohList, setHalaqohList] = useState<MockHalaqoh[]>([...MOCK_HALAQOH]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedHalaqoh, setSelectedHalaqoh] = useState<MockHalaqoh | null>(null);

  // Form state
  const [nama, setNama] = useState("");
  const [idUstadz, setIdUstadz] = useState("");
  const [tingkat, setTingkat] = useState("");

  const resetForm = () => {
    setNama("");
    setIdUstadz("");
    setTingkat("");
    setSelectedHalaqoh(null);
    setIsEditMode(false);
  };

  const handleSubmit = () => {
    if (!nama.trim()) {
      toast.error("Nama halaqoh harus diisi");
      return;
    }
    if (!idUstadz) {
      toast.error("Ustadz pengampu harus dipilih");
      return;
    }
    if (!tingkat) {
      toast.error("Tingkat harus dipilih");
      return;
    }

    if (isEditMode && selectedHalaqoh) {
      setHalaqohList(prev =>
        prev.map(h =>
          h.id === selectedHalaqoh.id
            ? { ...h, nama, idUstadz, tingkat }
            : h
        )
      );
      toast.success("Halaqoh berhasil diupdate");
    } else {
      const newHalaqoh: MockHalaqoh = {
        id: `h${Date.now()}`,
        nama,
        idUstadz,
        tingkat,
        jumlahSantri: 0,
      };
      setHalaqohList(prev => [...prev, newHalaqoh]);
      toast.success("Halaqoh berhasil ditambahkan");
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (halaqoh: MockHalaqoh) => {
    setSelectedHalaqoh(halaqoh);
    setNama(halaqoh.nama);
    setIdUstadz(halaqoh.idUstadz);
    setTingkat(halaqoh.tingkat);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus halaqoh ini?")) return;
    setHalaqohList(prev => prev.filter(h => h.id !== id));
    toast.success("Halaqoh berhasil dihapus");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Halaqoh</h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola data halaqoh dan ustadz pengampu</p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Halaqoh
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">No</TableHead>
                <TableHead className="text-muted-foreground">Nama Halaqoh</TableHead>
                <TableHead className="text-muted-foreground">Ustadz Pengampu</TableHead>
                <TableHead className="text-muted-foreground">Tingkat</TableHead>
                <TableHead className="text-muted-foreground">Jumlah Santri</TableHead>
                <TableHead className="text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {halaqohList.map((halaqoh, index) => {
                const santriCount = getSantriByHalaqoh(halaqoh.id).length;
                return (
                  <TableRow key={halaqoh.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-semibold">{halaqoh.nama}</TableCell>
                    <TableCell className="text-primary">{getUstadzNama(halaqoh.idUstadz)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{halaqoh.tingkat}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {santriCount} santri
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(halaqoh)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(halaqoh.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Dialog Tambah/Edit Halaqoh */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Halaqoh" : "Tambah Halaqoh Baru"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama Halaqoh *</Label>
                <Input
                  placeholder="Contoh: Halaqoh Al-Fatih"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Ustadz Pengampu *</Label>
                <Select value={idUstadz} onValueChange={setIdUstadz}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Ustadz Pengampu" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_USTADZ.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tingkat *</Label>
                <Select value={tingkat} onValueChange={setTingkat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Tingkat" />
                  </SelectTrigger>
                  <SelectContent>
                    {tingkatOptions.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Batal
                </Button>
                <Button onClick={handleSubmit}>
                  {isEditMode ? "Simpan Perubahan" : "Tambah Halaqoh"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
