import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { usePagination } from "@/hooks/use-pagination";
import { TablePagination } from "@/components/TablePagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import {
  MOCK_SANTRI,
  MOCK_HALAQOH,
  MOCK_KELAS,
  getKelasNama,
  getHalaqohNama,
  MockSantri,
} from "@/lib/mock-data";
import { TILAWATI_JILID } from "@/lib/tilawah-data";
import { JuzSelector } from "@/components/JuzSelector";
import { getSurahsByJuz } from "@/lib/quran-data";
import { getSurahListByJuz, getPageCountForJuz } from "@/lib/mushaf-madinah";
import { toast } from "sonner";

const INITIAL_FORM: Omit<MockSantri, "id"> = {
  nis: "",
  nisn: "",
  nama: "",
  idKelas: "",
  idHalaqoh: "",
  tanggalMasuk: new Date().toISOString().split("T")[0],
  status: "Aktif",
  jilidSaatIni: 1,
  halamanSaatIni: 1,
  posisiHafalanJuz: 30,
  posisiHafalanSurah: "",
  pencapaianHafalan: "0 Juz",
};

type ModalMode = "add" | "edit";

export default function DataSantri() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterKelas, setFilterKelas] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [tilawahJuz, setTilawahJuz] = useState("");
  const [tilawahSurah, setTilawahSurah] = useState("");
  const [tilawahAyat, setTilawahAyat] = useState("");
  const [tilawahHalaman, setTilawahHalaman] = useState("");
  const [tilawahInputMode, setTilawahInputMode] = useState<"surah" | "halaman">("surah");
  const [hafalanJuz, setHafalanJuz] = useState("30");
  const [hafalanInputMode, setHafalanInputMode] = useState<"surah" | "halaman">("surah");
  const [hafalanSurah, setHafalanSurah] = useState("");
  const [hafalanAyat, setHafalanAyat] = useState("");
  const [hafalanHalaman, setHafalanHalaman] = useState("");
  const [, forceUpdate] = useState(0);

  // Surah list for tilawah (Al-Qur'an level)
  const tilawahSurahList = useMemo(() => {
    if (!tilawahJuz) return [];
    return getSurahListByJuz(Number(tilawahJuz));
  }, [tilawahJuz]);

  // Surah list for hafalan
  const hafalanSurahList = useMemo(() => {
    if (!hafalanJuz) return [];
    return getSurahListByJuz(Number(hafalanJuz));
  }, [hafalanJuz]);

  const selectedTilawahSurah = useMemo(() => {
    return tilawahSurahList.find(s => String(s.number) === tilawahSurah);
  }, [tilawahSurah, tilawahSurahList]);

  const tilawahMaxHalaman = tilawahJuz ? getPageCountForJuz(Number(tilawahJuz)) : 20;

  const selectedHafalanSurah = useMemo(() => {
    return hafalanSurahList.find(s => String(s.number) === hafalanSurah);
  }, [hafalanSurah, hafalanSurahList]);

  const hafalanMaxHalaman = hafalanJuz ? getPageCountForJuz(Number(hafalanJuz)) : 20;

  const filteredSantri = MOCK_SANTRI.filter((santri) => {
    const matchSearch = santri.nama.toLowerCase().includes(search.toLowerCase()) ||
      santri.nis.toLowerCase().includes(search.toLowerCase());
    const matchHalaqoh = filterHalaqoh === "all" || santri.idHalaqoh === filterHalaqoh;
    const matchKelas = filterKelas === "all" || santri.idKelas === filterKelas;
    return matchSearch && matchHalaqoh && matchKelas;
  });

  const pagination = usePagination(filteredSantri);

  const openAdd = () => {
    setForm(INITIAL_FORM);
    setTilawahJuz("");
    setTilawahSurah("");
    setTilawahAyat("");
    setTilawahHalaman("");
    setTilawahInputMode("surah");
    setHafalanJuz("30");
    setHafalanInputMode("surah");
    setHafalanSurah("");
    setHafalanAyat("");
    setHafalanHalaman("");
    setModalMode("add");
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (santri: MockSantri) => {
    const { id, ...rest } = santri;
    setForm(rest);
    setTilawahJuz(santri.jilidSaatIni >= 7 ? String(santri.halamanSaatIni || 1) : "");
    setTilawahSurah("");
    setTilawahAyat("");
    setTilawahHalaman("");
    setTilawahInputMode("surah");
    setHafalanJuz(String(santri.posisiHafalanJuz));
    setHafalanInputMode("surah");
    setHafalanSurah("");
    setHafalanAyat("");
    setHafalanHalaman("");
    setModalMode("edit");
    setEditId(id);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.nama) {
      toast.error("Mohon lengkapi nama santri");
      return;
    }
    if (modalMode === "edit" && editId) {
      const idx = MOCK_SANTRI.findIndex(s => s.id === editId);
      if (idx !== -1) {
        MOCK_SANTRI[idx] = { ...form, id: editId };
        toast.success(`Data ${form.nama} berhasil diperbarui`);
      }
    } else {
      MOCK_SANTRI.push({ ...form, id: `s${Date.now()}` });
      toast.success(`Santri ${form.nama} berhasil ditambahkan`);
    }
    setForm(INITIAL_FORM);
    setShowModal(false);
    forceUpdate(n => n + 1);
  };

  const getTilawahLabel = (santri: MockSantri) => {
    if (santri.jilidSaatIni >= 7) return "Al-Qur'an";
    return `Jilid ${santri.jilidSaatIni}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Data Santri</h1>
          <Button className="bg-primary hover:bg-primary/90" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Santri
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Cari santri..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterHalaqoh} onValueChange={setFilterHalaqoh}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Semua Halaqoh" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Halaqoh</SelectItem>
                {MOCK_HALAQOH.map((h) => (<SelectItem key={h.id} value={h.id}>{h.nama}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={filterKelas} onValueChange={setFilterKelas}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Semua Kelas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {MOCK_KELAS.map((k) => (<SelectItem key={k.id} value={k.id}>{k.nama_kelas}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">NIS</TableHead>
                  <TableHead className="text-muted-foreground">Nama Santri</TableHead>
                  <TableHead className="text-muted-foreground">Halaqoh</TableHead>
                  <TableHead className="text-muted-foreground">Kelas</TableHead>
                  <TableHead className="text-muted-foreground">Posisi Tilawah</TableHead>
                  <TableHead className="text-muted-foreground">Posisi Hafalan</TableHead>
                  
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSantri.map((santri) => (
                  <TableRow key={santri.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/santri/${santri.id}`)}>
                    <TableCell className="font-medium">{santri.nis}</TableCell>
                    <TableCell className="text-primary font-medium">{santri.nama}</TableCell>
                    <TableCell className="text-primary">{getHalaqohNama(santri.idHalaqoh)}</TableCell>
                    <TableCell>{getKelasNama(santri.idKelas)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{getTilawahLabel(santri)} - Hal {santri.halamanSaatIni}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">Juz {santri.posisiHafalanJuz} - {santri.posisiHafalanSurah || "-"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">{santri.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigate(`/santri/${santri.id}`)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(santri)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal Tambah / Edit Santri */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{modalMode === "edit" ? "Edit Data Santri" : "Tambah Santri Baru"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nama Santri *</Label>
              <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Nama lengkap santri" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>NIS</Label>
                <Input value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} placeholder="Masukkan NIS" />
              </div>
              <div className="space-y-2">
                <Label>NISN</Label>
                <Input value={form.nisn} onChange={(e) => setForm({ ...form, nisn: e.target.value })} placeholder="Masukkan NISN" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kelas</Label>
                <Select value={form.idKelas} onValueChange={(v) => setForm({ ...form, idKelas: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
                  <SelectContent>
                    {MOCK_KELAS.map((k) => (<SelectItem key={k.id} value={k.id}>{k.nama_kelas}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Halaqoh</Label>
                <Select value={form.idHalaqoh} onValueChange={(v) => setForm({ ...form, idHalaqoh: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih Halaqoh" /></SelectTrigger>
                  <SelectContent>
                    {MOCK_HALAQOH.map((h) => (<SelectItem key={h.id} value={h.id}>{h.nama}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tanggal Masuk</Label>
              <Input type="date" value={form.tanggalMasuk} onChange={(e) => setForm({ ...form, tanggalMasuk: e.target.value })} />
            </div>

            {/* ── Posisi Tilawah ── */}
            <div className="border-t pt-4 mt-2">
              <Label className="text-sm font-semibold text-muted-foreground">Posisi Tilawah Saat Ini</Label>
            </div>
            <div className="space-y-2">
              <Label>Jilid / Level</Label>
              <Select value={String(form.jilidSaatIni)} onValueChange={(v) => {
                setForm({ ...form, jilidSaatIni: Number(v), halamanSaatIni: 1 });
                if (v !== "7") setTilawahJuz("");
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TILAWATI_JILID.map((j) => (
                    <SelectItem key={j.jilid} value={String(j.jilid)}>Jilid {j.jilid}</SelectItem>
                  ))}
                  <SelectItem value="7">Al-Qur'an</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Jilid 1-6: halaman saja */}
            {form.jilidSaatIni < 7 && (
              <div className="space-y-2">
                <Label>Halaman Saat Ini</Label>
                <Input type="number" min={1} max={44} value={form.halamanSaatIni}
                  onChange={(e) => setForm({ ...form, halamanSaatIni: Number(e.target.value) })}
                  placeholder="1-44" />
              </div>
            )}

            {/* Al-Qur'an: JuzSelector + Halaman */}
            {form.jilidSaatIni >= 7 && (
              <>
                <JuzSelector
                  value={tilawahJuz}
                  onValueChange={(v) => {
                    setTilawahJuz(v);
                    setTilawahSurah("");
                    setTilawahAyat("");
                    setTilawahHalaman("");
                    setTilawahInputMode("surah");
                    setForm({ ...form, halamanSaatIni: 1 });
                  }}
                  label="Juz Tilawah"
                  order="asc"
                />
                {tilawahJuz && (
                  <>
                    <div className="flex gap-2">
                      <Button type="button" size="sm" variant={tilawahInputMode === "surah" ? "default" : "outline"} className="h-7 text-xs flex-1"
                        onClick={() => { setTilawahInputMode("surah"); setTilawahHalaman(""); }}>
                        Pilih Surah & Ayat
                      </Button>
                      <Button type="button" size="sm" variant={tilawahInputMode === "halaman" ? "default" : "outline"} className="h-7 text-xs flex-1"
                        onClick={() => { setTilawahInputMode("halaman"); setTilawahSurah(""); setTilawahAyat(""); }}>
                        Pilih Halaman
                      </Button>
                    </div>

                    {tilawahInputMode === "surah" && (
                      <>
                        <div className="space-y-2">
                          <Label>Surah Terakhir Dibaca</Label>
                          <Select value={tilawahSurah} onValueChange={(v) => {
                            setTilawahSurah(v);
                            setTilawahAyat("1");
                          }}>
                            <SelectTrigger><SelectValue placeholder="Pilih surah" /></SelectTrigger>
                            <SelectContent>
                              {tilawahSurahList.map((s) => (
                                <SelectItem key={s.number} value={String(s.number)}>{s.number}. {s.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {selectedTilawahSurah && (
                          <div className="space-y-2">
                            <Label className="text-xs">Sampai Ayat ke</Label>
                            <Input type="number" min={1} max={selectedTilawahSurah.numberOfAyahs}
                              value={tilawahAyat}
                              onChange={(e) => setTilawahAyat(e.target.value)}
                              placeholder={`1 - ${selectedTilawahSurah.numberOfAyahs}`} />
                          </div>
                        )}
                      </>
                    )}

                    {tilawahInputMode === "halaman" && (
                      <div className="space-y-2">
                        <Label>Halaman dalam Juz (maks {tilawahMaxHalaman})</Label>
                        <Input type="number" min={1} max={tilawahMaxHalaman}
                          value={tilawahHalaman}
                          onChange={(e) => setTilawahHalaman(e.target.value)} />
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* ── Posisi Hafalan ── */}
            <div className="border-t pt-4 mt-2">
              <Label className="text-sm font-semibold text-muted-foreground">Posisi Hafalan Saat Ini</Label>
            </div>
            <JuzSelector
              value={hafalanJuz}
              onValueChange={(v) => {
                setHafalanJuz(v);
                setHafalanSurah("");
                setHafalanAyat("");
                setHafalanHalaman("");
                setHafalanInputMode("surah");
                setForm({ ...form, posisiHafalanJuz: Number(v), posisiHafalanSurah: "" });
              }}
              label="Juz Hafalan"
              order="asc"
            />

            {hafalanJuz && (
              <>
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant={hafalanInputMode === "surah" ? "default" : "outline"} className="h-7 text-xs flex-1"
                    onClick={() => { setHafalanInputMode("surah"); setHafalanHalaman(""); }}>
                    Pilih Surah & Ayat
                  </Button>
                  <Button type="button" size="sm" variant={hafalanInputMode === "halaman" ? "default" : "outline"} className="h-7 text-xs flex-1"
                    onClick={() => { setHafalanInputMode("halaman"); setHafalanSurah(""); setHafalanAyat(""); }}>
                    Pilih Halaman
                  </Button>
                </div>

                {/* Mode Surah */}
                {hafalanInputMode === "surah" && (
                  <>
                    <div className="space-y-2">
                      <Label>Surah Terakhir Dihafal</Label>
                      <Select value={hafalanSurah} onValueChange={(v) => {
                        setHafalanSurah(v);
                        setHafalanAyat("1");
                        const s = hafalanSurahList.find(s => String(s.number) === v);
                        setForm({ ...form, posisiHafalanSurah: s?.name || "" });
                      }}>
                        <SelectTrigger><SelectValue placeholder="Pilih surah" /></SelectTrigger>
                        <SelectContent>
                          {hafalanSurahList.map((s) => (
                            <SelectItem key={s.number} value={String(s.number)}>{s.number}. {s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedHafalanSurah && (
                      <div className="space-y-2">
                        <Label className="text-xs">Sampai Ayat ke</Label>
                        <Input type="number" min={1} max={selectedHafalanSurah.numberOfAyahs}
                          value={hafalanAyat}
                          onChange={(e) => setHafalanAyat(e.target.value)}
                          placeholder={`1 - ${selectedHafalanSurah.numberOfAyahs}`} />
                      </div>
                    )}
                  </>
                )}

                {/* Mode Halaman */}
                {hafalanInputMode === "halaman" && (
                  <div className="space-y-2">
                    <Label>Halaman dalam Juz (maks {hafalanMaxHalaman})</Label>
                    <Input type="number" min={1} max={hafalanMaxHalaman}
                      value={hafalanHalaman}
                      onChange={(e) => setHafalanHalaman(e.target.value)} />
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
            <Button onClick={handleSubmit}>{modalMode === "edit" ? "Perbarui" : "Simpan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
