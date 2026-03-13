import { useState } from "react";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { JuzSelector } from "@/components/JuzSelector";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  santriName: string;
  santriList: any[];
  getPredikat: (nilai: number) => { label: string; color: string; passed: boolean };
  onSuccess?: (data: any) => void;
}

export const TasmiForm1Juz = ({ open, onOpenChange, santriList, getPredikat, date, santriName, onSuccess }: Props) => {
  const [selectedSantri, setSelectedSantri] = useState("");
  useEffect(() => {
    if (open && santriName) {
      const santri = santriList.find(s => s.nama === santriName);
      if (santri) setSelectedSantri(santri.id);
    }
  }, [open, santriName, santriList]);

  const [selectedJuz, setSelectedJuz] = useState("");
  const [catatanUmum, setCatatanUmum] = useState("");
  const [diberhentikan, setDiberhentikan] = useState(false);
  const [penilaianHalaman, setPenilaianHalaman] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedJuz) return;

    const total = getTotalHalaman(selectedJuz);

    setPenilaianHalaman(
      Array.from({ length: total }, (_, i) => ({
        halaman: i + 1,
        pancingan: 0,
        catatan: "",
      }))
    );
  }, [selectedJuz]);

  const nilaiTotal = penilaianHalaman.reduce((t, h) => t + Math.max(0, 5 - h.pancingan), 0);
  const predikat = getPredikat(nilaiTotal);

  const resetForm = () => {
    setSelectedSantri("");
    setSelectedJuz("");
    setCatatanUmum("");
    setDiberhentikan(false);
    setPenilaianHalaman([]);
  };

  const handleSave = () => {
    onSuccess?.({
      tanggal: date,
      santriId: selectedSantri,
      jenis: "tasmi",
      juz: Number(selectedJuz),
      status: predikat.label,
      catatan: catatanUmum + (diberhentikan ? " (Diberhentikan)" : ""),
    });
    onOpenChange(false);
    resetForm();
  };

  if (!date) return null;

  const getTotalHalaman = (juz: string) => {
    if (juz === "30") return 23;
    return 20;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Form Ujian Tasmi' (1 Juz)</DialogTitle>
          <DialogDescription>
            {santriName} •{" "}
            {format(date, "EEEE, d MMMM yyyy", { locale: localeId })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2 hidden">
              <Label>Santri</Label>
              <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                <SelectTrigger><SelectValue placeholder="Pilih santri" /></SelectTrigger>
                <SelectContent>
                  {santriList.map((s) => (<SelectItem key={s.id} value={s.id}>{s.nama}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <JuzSelector value={selectedJuz} onValueChange={setSelectedJuz} label="Juz" required />
          </div>

          <Card className={`${predikat.passed ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div><p className="text-sm text-muted-foreground">Nilai Total</p><p className="text-3xl font-bold">{nilaiTotal}</p></div>
              <div className="text-right"><p className="text-sm text-muted-foreground">Predikat</p><Badge className={`${predikat.color} text-white`}>{predikat.label}</Badge></div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Penilaian Per Halaman</Label>
            <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {penilaianHalaman.map((h, idx) => (
                <div key={idx} className="flex items-center gap-1.5 p-1.5 border rounded-md bg-card">
                  <span className="text-xs font-medium whitespace-nowrap">Hal {h.halaman}</span>
                  <div className="flex items-center gap-0.5 ml-auto">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => {
                      const n = [...penilaianHalaman]; n[idx].pancingan = Math.max(0, n[idx].pancingan - 1); setPenilaianHalaman(n);
                    }}>-</Button>
                    <span className="w-5 text-center text-xs font-medium">{h.pancingan}</span>
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => {
                      const n = [...penilaianHalaman]; n[idx].pancingan = Math.min(5, n[idx].pancingan + 1); setPenilaianHalaman(n);
                    }}>+</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2"><Label>Catatan Tajwid</Label><Textarea value={catatanUmum} onChange={(e) => setCatatanUmum(e.target.value)} rows={3} /></div>
          
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4 flex items-start gap-3">
              <input type="checkbox" id="stop" checked={diberhentikan} onChange={(e) => setDiberhentikan(e.target.checked)} className="mt-1" />
              <div><Label htmlFor="stop" className="text-red-600 font-medium">Santri Diberhentikan</Label></div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-amber-500 to-orange-500" disabled={!selectedSantri || !selectedJuz}>Simpan</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};