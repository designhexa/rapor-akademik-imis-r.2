import { useState, useEffect, useMemo } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JuzSelector } from "@/components/JuzSelector";
import { getJuzName } from "@/lib/quran-data";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const getTotalHalamanByJuz = (juz: number) => (juz === 30 ? 23 : 20);

interface PenilaianHalaman {
  halaman: number;
  pancingan: number;
  catatan: string;
}

interface PenilaianJuz {
  juz: number;
  halaman: PenilaianHalaman[];
  catatanJuz: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  santriName: string;
  santriList: any[];
  getPredikat: (nilai: number) => { label: string; color: string; passed: boolean };
  onSuccess?: (data: any) => void;
}

export const TasmiForm5Juz = ({
  open,
  onOpenChange,
  date,
  santriName,
  santriList,
  getPredikat,
  onSuccess,
}: Props) => {
  const [selectedSantri, setSelectedSantri] = useState("");
  const [selectedJuzList, setSelectedJuzList] = useState<number[]>([]);
  const [penilaian5Juz, setPenilaian5Juz] = useState<PenilaianJuz[]>([]);
  const [catatanUmum, setCatatanUmum] = useState("");
  const [diberhentikan, setDiberhentikan] = useState(false);

  const handleSelectJuz = (juzIndex: number, juzValue: string) => {
    const juzNumber = parseInt(juzValue);
    const newJuzList = [...selectedJuzList];
    newJuzList[juzIndex] = juzNumber;
    setSelectedJuzList(newJuzList);

    const totalHalaman = getTotalHalamanByJuz(juzNumber);
    const newPenilaian = [...penilaian5Juz];
    newPenilaian[juzIndex] = {
      juz: juzNumber,
      halaman: Array.from({ length: totalHalaman }, (_, i) => ({
        halaman: i + 1,
        pancingan: 0,
        catatan: "",
      })),
      catatanJuz: "",
    };
    setPenilaian5Juz(newPenilaian);
  };

  const hitungNilaiTotal = () =>
    penilaian5Juz.reduce(
      (t, j) => t + j.halaman.reduce((th, h) => th + Math.max(0, 5 - h.pancingan), 0),
      0
    );

  const getMaxScore = () =>
    penilaian5Juz.reduce((total, juz) => total + juz.halaman.length * 5, 0);

  const hitungPersentase = () =>
    getMaxScore() === 0 ? 0 : Math.round((hitungNilaiTotal() / getMaxScore()) * 100);

  const nilaiTotal = hitungPersentase();
  const predikat = getPredikat(nilaiTotal);

  const resetForm = () => {
    setSelectedSantri("");
    setSelectedJuzList([]);
    setPenilaian5Juz([]);
    setCatatanUmum("");
    setDiberhentikan(false);
  };

  const handleSave = () => {
    const entries = selectedJuzList
      .filter((j) => j)
      .map((juz) => ({
        tanggal: date,
        santriId: selectedSantri || "s1", // Fallback if needed, but should be selected
        jenis: "tasmi",
        juz: juz,
        status: predikat.label,
        catatan: catatanUmum + (diberhentikan ? " (Diberhentikan)" : ""),
      }));
    onSuccess?.(entries);
    onOpenChange(false);
    resetForm();
  };

  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            Form Ujian Tasmi' (5 Juz)
          </DialogTitle>
          <DialogDescription>
            {santriName} • {format(date, "EEEE, d MMMM yyyy", { locale: localeId })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Santri selector hidden when santriName provided */}
          {!santriName && (
            <div className="space-y-2">
              <Label>Santri</Label>
              <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih santri" />
                </SelectTrigger>
                <SelectContent>
                  {santriList.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Score card */}
          <Card
            className={`${
              predikat.passed
                ? "border-green-500/50 bg-green-500/5"
                : "border-red-500/50 bg-red-500/5"
            }`}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nilai Total</p>
                <p className="text-3xl font-bold">
                  {hitungNilaiTotal()}{" "}
                  <span className="text-lg text-muted-foreground">/ {getMaxScore()}</span>
                </p>
                <p className="text-xs text-muted-foreground">Persentase: {nilaiTotal}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Predikat</p>
                <Badge className={`${predikat.color} text-white`}>{predikat.label}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Per-juz grading */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Penilaian Per Juz</Label>
            <Accordion type="multiple" className="space-y-2">
              {[0, 1, 2, 3, 4].map((juzIndex) => (
                <AccordionItem
                  key={juzIndex}
                  value={`juz-${juzIndex}`}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-600 border-purple-200"
                      >
                        Juz {juzIndex + 1}
                      </Badge>
                      {selectedJuzList[juzIndex] ? (
                        <span className="text-sm font-medium">
                          {getJuzName(selectedJuzList[juzIndex])}
                          {penilaian5Juz[juzIndex] && (
                            <span className="text-muted-foreground ml-2">
                              (Nilai:{" "}
                              {penilaian5Juz[juzIndex].halaman.reduce(
                                (t, h) => t + Math.max(0, 5 - h.pancingan),
                                0
                              )}
                              /100)
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Pilih juz...</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    <JuzSelector
                      value={selectedJuzList[juzIndex]?.toString() || ""}
                      onValueChange={(v) => handleSelectJuz(juzIndex, v)}
                      label="Pilih Juz"
                    />
                    {penilaian5Juz[juzIndex] && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-2">
                          {penilaian5Juz[juzIndex].halaman.map((h, hIdx) => (
                            <div
                              key={hIdx}
                              className="flex items-center gap-1.5 p-1.5 border rounded-md bg-card"
                            >
                              <span className="text-xs font-medium whitespace-nowrap">
                                Hal {h.halaman}{" "}
                                <span className="text-muted-foreground">
                                  ({Math.max(0, 5 - h.pancingan)})
                                </span>
                              </span>
                              <div className="flex items-center gap-0.5 ml-auto">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-xs"
                                  onClick={() => {
                                    const n = [...penilaian5Juz];
                                    n[juzIndex].halaman[hIdx].pancingan = Math.max(
                                      0,
                                      n[juzIndex].halaman[hIdx].pancingan - 1
                                    );
                                    setPenilaian5Juz(n);
                                  }}
                                >
                                  -
                                </Button>
                                <span className="w-5 text-center text-xs font-medium">
                                  {h.pancingan}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-xs"
                                  onClick={() => {
                                    const n = [...penilaian5Juz];
                                    n[juzIndex].halaman[hIdx].pancingan = Math.min(
                                      5,
                                      n[juzIndex].halaman[hIdx].pancingan + 1
                                    );
                                    setPenilaian5Juz(n);
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Label>Catatan {getJuzName(selectedJuzList[juzIndex])}</Label>
                          <Textarea
                            placeholder="Catatan tajwid..."
                            value={penilaian5Juz[juzIndex].catatanJuz}
                            onChange={(e) => {
                              const n = [...penilaian5Juz];
                              n[juzIndex].catatanJuz = e.target.value;
                              setPenilaian5Juz(n);
                            }}
                            rows={2}
                          />
                        </div>
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="space-y-2">
            <Label>Catatan Umum</Label>
            <Textarea
              placeholder="Catatan umum..."
              value={catatanUmum}
              onChange={(e) => setCatatanUmum(e.target.value)}
              rows={3}
            />
          </div>

          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4 flex items-start gap-3">
              <input
                type="checkbox"
                id="diberhentikan5juz-cal"
                checked={diberhentikan}
                onChange={(e) => setDiberhentikan(e.target.checked)}
                className="mt-1"
              />
              <div>
                <Label htmlFor="diberhentikan5juz-cal" className="text-red-600 font-medium cursor-pointer">
                  Santri Diberhentikan
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-500 to-purple-700"
              disabled={selectedJuzList.filter(Boolean).length === 0}
            >
              Simpan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};