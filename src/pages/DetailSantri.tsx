import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Award, TrendingUp, BookOpenCheck } from "lucide-react";
import { MOCK_SANTRI, getKelasNama, getHalaqohNama } from "@/lib/mock-data";
import { MOCK_SETORAN_TILAWAH, TILAWATI_JILID, HALAMAN_PER_JILID } from "@/lib/tilawah-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

// Mock setoran tahfidz data
const MOCK_SETORAN_TAHFIDZ = [
  { id: "st1", idSantri: "s1", tanggal: "2025-01-05", juz: 30, surah: "An-Naba", ayatDari: 1, ayatSampai: 20, nilai: 85, status: "Lancar" },
  { id: "st2", idSantri: "s1", tanggal: "2025-01-12", juz: 30, surah: "An-Naba", ayatDari: 21, ayatSampai: 40, nilai: 80, status: "Lancar" },
  { id: "st3", idSantri: "s1", tanggal: "2025-01-19", juz: 30, surah: "An-Naziat", ayatDari: 1, ayatSampai: 25, nilai: 75, status: "Kurang" },
  { id: "st4", idSantri: "s1", tanggal: "2025-01-26", juz: 30, surah: "An-Naziat", ayatDari: 26, ayatSampai: 46, nilai: 90, status: "Lancar" },
  { id: "st5", idSantri: "s1", tanggal: "2025-02-02", juz: 30, surah: "Abasa", ayatDari: 1, ayatSampai: 42, nilai: 88, status: "Lancar" },
  { id: "st6", idSantri: "s2", tanggal: "2025-01-05", juz: 30, surah: "An-Naba", ayatDari: 1, ayatSampai: 15, nilai: 78, status: "Kurang" },
  { id: "st7", idSantri: "s2", tanggal: "2025-01-12", juz: 30, surah: "An-Naba", ayatDari: 16, ayatSampai: 40, nilai: 82, status: "Lancar" },
  { id: "st8", idSantri: "s3", tanggal: "2025-01-10", juz: 29, surah: "Al-Mulk", ayatDari: 1, ayatSampai: 15, nilai: 92, status: "Lancar" },
  { id: "st9", idSantri: "s4", tanggal: "2025-01-08", juz: 30, surah: "At-Takwir", ayatDari: 1, ayatSampai: 29, nilai: 70, status: "Kurang" },
  { id: "st10", idSantri: "s4", tanggal: "2025-01-15", juz: 30, surah: "Al-Infitar", ayatDari: 1, ayatSampai: 19, nilai: 85, status: "Lancar" },
];

// Mock penilaian data
const MOCK_PENILAIAN = [
  { id: "p1", idSantri: "s1", tanggal: "2025-01-10", tajwid: 80, makharij: 85, kelancaran: 78, catatan: "Perlu perbaikan mad" },
  { id: "p2", idSantri: "s1", tanggal: "2025-01-24", tajwid: 85, makharij: 88, kelancaran: 82, catatan: "Meningkat dari sebelumnya" },
  { id: "p3", idSantri: "s1", tanggal: "2025-02-07", tajwid: 88, makharij: 90, kelancaran: 85, catatan: "Bagus, pertahankan" },
  { id: "p4", idSantri: "s2", tanggal: "2025-01-15", tajwid: 75, makharij: 78, kelancaran: 72, catatan: "Harus lebih sering muroja'ah" },
  { id: "p5", idSantri: "s3", tanggal: "2025-01-20", tajwid: 90, makharij: 92, kelancaran: 88, catatan: "Sangat baik" },
];

// Mock ujian kenaikan jilid
const MOCK_UJIAN_JILID = [
  { id: "uj1", idSantri: "s1", tanggal: "2025-01-30", jilidDari: 3, jilidTujuan: 4, nilaiTotal: 32, skorMaksimal: 30, status: "lulus" },
  { id: "uj2", idSantri: "s2", tanggal: "2025-01-28", jilidDari: 2, jilidTujuan: 3, nilaiTotal: 15, skorMaksimal: 20, status: "lulus" },
  { id: "uj3", idSantri: "s4", tanggal: "2025-02-01", jilidDari: 3, jilidTujuan: 4, nilaiTotal: 12, skorMaksimal: 20, status: "tidak_lulus" },
];

export default function DetailSantri() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const santri = MOCK_SANTRI.find(s => s.id === id);
  
  if (!santri) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Santri tidak ditemukan</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/santri")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
        </div>
      </Layout>
    );
  }

  const setoranTahfidz = MOCK_SETORAN_TAHFIDZ.filter(s => s.idSantri === santri.id);
  const setoranTilawah = MOCK_SETORAN_TILAWAH.filter(s => s.idSantri === santri.id);
  const penilaian = MOCK_PENILAIAN.filter(p => p.idSantri === santri.id);
  const ujianJilid = MOCK_UJIAN_JILID.filter(u => u.idSantri === santri.id);

  // Progress tilawah
  const totalHalamanSelesai = (santri.jilidSaatIni - 1) * HALAMAN_PER_JILID + santri.halamanSaatIni;
  const totalHalamanAll = HALAMAN_PER_JILID * 6;
  const progressTilawah = Math.round((totalHalamanSelesai / totalHalamanAll) * 100);

  // Grafik penilaian
  const grafikPenilaian = penilaian.map(p => ({
    tanggal: p.tanggal.slice(5),
    Tajwid: p.tajwid,
    Makharij: p.makharij,
    Kelancaran: p.kelancaran,
    "Rata-rata": Math.round((p.tajwid + p.makharij + p.kelancaran) / 3),
  }));

  // Grafik setoran
  const grafikSetoran = setoranTahfidz.map(s => ({
    tanggal: s.tanggal.slice(5),
    Nilai: s.nilai,
  }));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/santri")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{santri.nama}</h1>
            <p className="text-muted-foreground text-sm">NIS: {santri.nis} • {getKelasNama(santri.idKelas)} • {getHalaqohNama(santri.idHalaqoh)}</p>
          </div>
          <Badge variant="default" className="bg-primary/10 text-primary">{santri.status}</Badge>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BookOpenCheck className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tilawah</p>
                  <p className="font-medium text-sm">Jilid {santri.jilidSaatIni} - Hal {santri.halamanSaatIni}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Setoran Tahfidz</p>
                  <p className="font-medium text-sm">{setoranTahfidz.length} kali</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Placement Test</p>
                  <p className="font-medium text-sm">Jilid {santri.jilidSaatIni > 1 ? santri.jilidSaatIni - 1 : 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tahfidz" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tahfidz">Setoran Tahfidz</TabsTrigger>
            <TabsTrigger value="tilawah">Setoran Tilawah</TabsTrigger>
            <TabsTrigger value="penilaian">Penilaian</TabsTrigger>
            <TabsTrigger value="ujian">Ujian Jilid</TabsTrigger>
          </TabsList>

          {/* Setoran Tahfidz */}
          <TabsContent value="tahfidz" className="space-y-4">
            {grafikSetoran.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Grafik Nilai Setoran Tahfidz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={grafikSetoran}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tanggal" fontSize={12} />
                      <YAxis domain={[0, 100]} fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="Nilai" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Surah</TableHead>
                      <TableHead>Ayat</TableHead>
                      <TableHead>Juz</TableHead>
                      <TableHead className="text-center">Nilai</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {setoranTahfidz.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Belum ada data setoran</TableCell></TableRow>
                    ) : setoranTahfidz.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="text-sm">{s.tanggal}</TableCell>
                        <TableCell className="font-medium">{s.surah}</TableCell>
                        <TableCell>{s.ayatDari}-{s.ayatSampai}</TableCell>
                        <TableCell>{s.juz}</TableCell>
                        <TableCell className="text-center font-semibold">{s.nilai}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={s.status === "Lancar" ? "bg-green-600 text-white" : "bg-red-600 text-white"}>{s.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Setoran Tilawah */}
          <TabsContent value="tilawah" className="space-y-4">
            {/* Progress Tilawah */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Progres Tilawah Keseluruhan</CardTitle>
                <CardDescription>Jilid {santri.jilidSaatIni} dari 6 • Halaman {totalHalamanSelesai} dari {totalHalamanAll}</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progressTilawah} className="h-3" />
                <div className="flex justify-between mt-2">
                  {TILAWATI_JILID.map(j => (
                    <div key={j.jilid} className="text-center">
                      <div className={`text-xs font-medium ${j.jilid <= santri.jilidSaatIni ? "text-primary" : "text-muted-foreground"}`}>
                        J{j.jilid}
                      </div>
                      <div className={`w-3 h-3 rounded-full mx-auto mt-1 ${
                        j.jilid < santri.jilidSaatIni ? "bg-primary" :
                        j.jilid === santri.jilidSaatIni ? "bg-primary/50" :
                        "bg-muted"
                      }`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Jilid</TableHead>
                      <TableHead>Halaman</TableHead>
                      <TableHead className="text-center">Tartil</TableHead>
                      <TableHead className="text-center">Fashohah</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {setoranTilawah.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Belum ada data setoran tilawah</TableCell></TableRow>
                    ) : setoranTilawah.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="text-sm">{s.tanggal}</TableCell>
                        <TableCell>Jilid {s.jilid}</TableCell>
                        <TableCell>{s.halamanDari}-{s.halamanSampai}</TableCell>
                        <TableCell className="text-center">{s.nilaiTartil || "-"}</TableCell>
                        <TableCell className="text-center">{s.nilaiFashohah || "-"}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={
                            s.status === "selesai" ? "bg-green-600 text-white" :
                            s.status === "lanjut" ? "bg-blue-600 text-white" :
                            "bg-red-600 text-white"
                          }>{s.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Penilaian */}
          <TabsContent value="penilaian" className="space-y-4">
            {grafikPenilaian.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Grafik Penilaian
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={grafikPenilaian}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tanggal" fontSize={12} />
                      <YAxis domain={[0, 100]} fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Tajwid" fill="hsl(var(--primary))" />
                      <Bar dataKey="Makharij" fill="hsl(210, 70%, 50%)" />
                      <Bar dataKey="Kelancaran" fill="hsl(150, 60%, 45%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-center">Tajwid</TableHead>
                      <TableHead className="text-center">Makharij</TableHead>
                      <TableHead className="text-center">Kelancaran</TableHead>
                      <TableHead className="text-center">Rata-rata</TableHead>
                      <TableHead>Catatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {penilaian.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Belum ada data penilaian</TableCell></TableRow>
                    ) : penilaian.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="text-sm">{p.tanggal}</TableCell>
                        <TableCell className="text-center font-medium">{p.tajwid}</TableCell>
                        <TableCell className="text-center font-medium">{p.makharij}</TableCell>
                        <TableCell className="text-center font-medium">{p.kelancaran}</TableCell>
                        <TableCell className="text-center font-semibold">{Math.round((p.tajwid + p.makharij + p.kelancaran) / 3)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.catatan}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ujian Kenaikan Jilid */}
          <TabsContent value="ujian" className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Dari Jilid</TableHead>
                      <TableHead>Ke Jilid</TableHead>
                      <TableHead className="text-center">Nilai</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ujianJilid.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">Belum ada data ujian</TableCell></TableRow>
                    ) : ujianJilid.map(u => (
                      <TableRow key={u.id}>
                        <TableCell className="text-sm">{u.tanggal}</TableCell>
                        <TableCell>Jilid {u.jilidDari}</TableCell>
                        <TableCell>{u.jilidTujuan <= 6 ? `Jilid ${u.jilidTujuan}` : "Al-Qur'an"}</TableCell>
                        <TableCell className="text-center font-semibold">{u.nilaiTotal}/{u.skorMaksimal}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={u.status === "lulus" ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                            {u.status === "lulus" ? "Lulus" : "Mengulang"}
                          </Badge>
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
    </Layout>
  );
}
