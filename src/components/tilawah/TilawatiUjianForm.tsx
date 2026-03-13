import { useState, useEffect } from "react";
import { Award, Clock, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MOCK_SANTRI_TILAWAH, 
  TILAWATI_JILID, 
  DURASI_UJIAN,
  getSkorMaksimalByJilid,
  getNilaiMinimumLulusByJilid,
  getAspekPenilaianByJilid 
} from "@/lib/tilawah-data";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface TilawatiUjianFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any; // Jika ada, otomatis masuk mode Remedial
  date: Date | null;
  santriName: string;
}

export const TilawatiUjianForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  date, 
  santriName
}: TilawatiUjianFormProps) => {
  const isRemedial = !!initialData;

  // Form States
  const [selectedSantri, setSelectedSantri] = useState("");
  const [jilidDari, setJilidDari] = useState("");
  const [jilidTujuan, setJilidTujuan] = useState("");

  // Scoring States
  const [scores, setScores] = useState({
    tartilTajwid: "", tartilKalimat: "", tartilKelancaran: "", tartilNafas: "", tartilWaqaf: "",
    fashohahMakhraj: "", fashohahShifat: "", fashohahHarakat: "", fashohahSuara: "",
    tajwidPaham: "", tajwidUraian: "", ghoribBaca: "", ghoribKomentar: ""
  });

  // Sync state saat initialData berubah (untuk Remedial)
  useEffect(() => {
    if (initialData) {
      setSelectedSantri(initialData.santriId);
      setJilidDari(initialData.jilidDari.toString());
      setJilidTujuan(initialData.jilidTujuan.toString());
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setSelectedSantri("");
    setJilidDari("");
    setJilidTujuan("");
    setScores({
      tartilTajwid: "", tartilKalimat: "", tartilKelancaran: "", tartilNafas: "", tartilWaqaf: "",
      fashohahMakhraj: "", fashohahShifat: "", fashohahHarakat: "", fashohahSuara: "",
      tajwidPaham: "", tajwidUraian: "", ghoribBaca: "", ghoribKomentar: ""
    });
  };

  const currentJilid = parseInt(jilidDari) || 1;
  const kriteria = getAspekPenilaianByJilid(currentJilid);
  const skorMaks = getSkorMaksimalByJilid(currentJilid);
  const nilaiMin = getNilaiMinimumLulusByJilid(currentJilid);

  const hitungTotal = () => {
    let total = 0;
    const s = (val: string) => parseFloat(val) || 0;
    
    if (kriteria.includes("tartil")) {
      total += Math.min(s(scores.tartilTajwid) + s(scores.tartilKalimat) + s(scores.tartilKelancaran) + s(scores.tartilNafas) + s(scores.tartilWaqaf), 10);
    }
    if (kriteria.includes("fashohah")) {
      total += Math.min(s(scores.fashohahMakhraj) + s(scores.fashohahShifat) + s(scores.fashohahHarakat) + s(scores.fashohahSuara), 10);
    }
    if (kriteria.includes("tajwid_dasar")) {
      total += Math.min(s(scores.tajwidPaham) + s(scores.tajwidUraian), 10);
    }
    if (kriteria.includes("ghorib")) {
      total += Math.min(s(scores.ghoribBaca) + s(scores.ghoribKomentar), 10);
    }
    return Math.round(total * 10) / 10;
  };

  const totalNilai = hitungTotal();
  const lulus = totalNilai >= nilaiMin;

  const handleProcessSubmit = () => {
    onSubmit({
      tanggal: date,
      santriId: selectedSantri,
      jenis: "ujian_jilid",
      jilid: jilidDari,
      status: lulus ? "Lulus" : "Mengulang",
      catatan: `Ujian Jilid ${jilidDari} ke ${jilidTujuan}. Skor: ${totalNilai}/${skorMaks}`,
    });
    onOpenChange(false);
  };

  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {isRemedial ? <RefreshCw className="w-6 h-6 text-orange-500" /> : <Award className="w-6 h-6 text-primary" />}
            {isRemedial ? `Remedial Ujian: ${initialData.nama}` : "Form Ujian Kenaikan Jilid"}
          </DialogTitle>
          <DialogDescription>
            {santriName} •{" "}
            {format(date, "EEEE, d MMMM yyyy", { locale: localeId })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Info Badge Bar */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="flex gap-1.5 px-3 py-1">
              <Clock className="w-3.5 h-3.5" /> {DURASI_UJIAN} Menit
            </Badge>
            <Badge variant="secondary" className="flex gap-1.5 px-3 py-1">
              <FileText className="w-3.5 h-3.5" /> Maks Skor: {skorMaks}
            </Badge>
            <Badge variant="outline" className="flex gap-1.5 px-3 py-1 border-primary/30">
              <Award className="w-3.5 h-3.5" /> Min Lulus: {nilaiMin}
            </Badge>
          </div>

          {/* Pemilihan Santri & Jilid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 hidden">
              <Label>Santri</Label>
              <Select value={selectedSantri} onValueChange={setSelectedSantri} disabled={isRemedial}>
                <SelectTrigger><SelectValue placeholder="Pilih santri..." /></SelectTrigger>
                <SelectContent>
                  {MOCK_SANTRI_TILAWAH.map(s => <SelectItem key={s.id} value={s.id}>{s.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jilid Saat Ini</Label>
              <Select value={jilidDari} onValueChange={v => { setJilidDari(v); setJilidTujuan((parseInt(v)+1).toString()); }} disabled={isRemedial}>
                <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                <SelectContent>
                  {TILAWATI_JILID.map(j => <SelectItem key={j.jilid} value={j.jilid.toString()}>Jilid {j.jilid}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Jilid</Label>
              <Select value={jilidTujuan} onValueChange={setJilidTujuan} disabled={isRemedial}>
                <SelectTrigger><SelectValue placeholder="Tujuan..." /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7].map(j => <SelectItem key={j} value={j.toString()}>{j === 7 ? "Al-Qur'an" : `Jilid ${j}`}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Penilaian Tabs */}
          <Tabs defaultValue="tartil" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tartil" disabled={!kriteria.includes("tartil")}>Tartil</TabsTrigger>
              <TabsTrigger value="fashohah" disabled={!kriteria.includes("fashohah")}>Fashohah</TabsTrigger>
              <TabsTrigger value="tajwid" disabled={!kriteria.includes("tajwid_dasar")}>Tajwid</TabsTrigger>
              <TabsTrigger value="ghorib" disabled={!kriteria.includes("ghorib")}>Ghorib</TabsTrigger>
            </TabsList>

            {/* Content Tartil */}
            <TabsContent value="tartil" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Tajwid (0-2)</Label>
                  <Input type="number" step={0.5} value={scores.tartilTajwid} onChange={e => setScores({...scores, tartilTajwid: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Kalimat (0-2)</Label>
                  <Input type="number" step={0.5} value={scores.tartilKalimat} onChange={e => setScores({...scores, tartilKalimat: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Kelancaran (0-4)</Label>
                  <Input type="number" step={0.5} value={scores.tartilKelancaran} onChange={e => setScores({...scores, tartilKelancaran: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Nafas (0-1)</Label>
                  <Input type="number" step={0.5} value={scores.tartilNafas} onChange={e => setScores({...scores, tartilNafas: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Waqaf (0-1)</Label>
                  <Input type="number" step={0.5} value={scores.tartilWaqaf} onChange={e => setScores({...scores, tartilWaqaf: e.target.value})} />
                </div>
              </div>
            </TabsContent>

            {/* Content Fashohah */}
            <TabsContent value="fashohah" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Makhorijul Huruf (0-4)</Label>
                  <Input type="number" step={0.5} value={scores.fashohahMakhraj} onChange={e => setScores({...scores, fashohahMakhraj: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Shifatul Huruf (0-3)</Label>
                  <Input type="number" step={0.5} value={scores.fashohahShifat} onChange={e => setScores({...scores, fashohahShifat: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Harakat/Imalah (0-2)</Label>
                  <Input type="number" step={0.5} value={scores.fashohahHarakat} onChange={e => setScores({...scores, fashohahHarakat: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Suara Jelas (0-1)</Label>
                  <Input type="number" step={0.5} value={scores.fashohahSuara} onChange={e => setScores({...scores, fashohahSuara: e.target.value})} />
                </div>
              </div>
            </TabsContent>

            {/* Content Tajwid */}
            <TabsContent value="tajwid" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Paham Teori (0-5)</Label>
                  <Input type="number" step={0.5} value={scores.tajwidPaham} onChange={e => setScores({...scores, tajwidPaham: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Uraian Hukum (0-5)</Label>
                  <Input type="number" step={0.5} value={scores.tajwidUraian} onChange={e => setScores({...scores, tajwidUraian: e.target.value})} />
                </div>
              </div>
            </TabsContent>

            {/* Content Ghorib */}
            <TabsContent value="ghorib" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Membaca Ghorib (0-6)</Label>
                  <Input type="number" step={0.5} value={scores.ghoribBaca} onChange={e => setScores({...scores, ghoribBaca: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Komentar/Penjelasan (0-4)</Label>
                  <Input type="number" step={0.5} value={scores.ghoribKomentar} onChange={e => setScores({...scores, ghoribKomentar: e.target.value})} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Skor Akhir Section */}
          <Card className={`border-2 ${lulus ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
            <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Hasil Akhir</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{totalNilai}</span>
                  <span className="text-lg text-muted-foreground">/ {skorMaks}</span>
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-end gap-1">
                <Badge className={`text-xl px-6 py-1.5 font-bold ${lulus ? "bg-emerald-600 hover:bg-emerald-600" : "bg-red-600 hover:bg-red-600"}`}>
                  {lulus ? "LULUS" : "MENGULANG"}
                </Badge>
                <p className="text-[10px] text-muted-foreground">Minimal kelulusan: {nilaiMin} poin</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button 
              className="px-8 bg-primary hover:bg-primary/90" 
              onClick={handleProcessSubmit}
              disabled={!selectedSantri || !jilidDari}
            >
              {isRemedial ? "Update Hasil Remedial" : "Simpan Ujian"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};