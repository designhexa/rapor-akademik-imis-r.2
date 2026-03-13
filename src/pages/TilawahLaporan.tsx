 import { Layout } from "@/components/Layout";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Badge } from "@/components/ui/badge";
 import { Progress } from "@/components/ui/progress";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
 import { 
   MOCK_SANTRI_TILAWAH, 
   MOCK_SETORAN_TILAWAH,
   TILAWATI_JILID,
   HALAMAN_PER_JILID,
   getProgressJilid
 } from "@/lib/tilawah-data";
 import { MOCK_KELAS, getSantriByNama } from "@/lib/mock-data";

export default function TilawahLaporan() {
  const navigate = useNavigate();
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterKelas, setFilterKelas] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("bulan-ini");
   const [filterJilid, setFilterJilid] = useState("all");
 
   // Calculate stats for each santri
   const santriStats = MOCK_SANTRI_TILAWAH.map(santri => {
     const setoranSantri = MOCK_SETORAN_TILAWAH.filter(s => s.idSantri === santri.id);
     const totalHalaman = setoranSantri.reduce((acc, s) => acc + (s.halamanSampai - s.halamanDari + 1), 0);
     const rataRataNilai = setoranSantri.length > 0 
       ? Math.round(setoranSantri.reduce((acc, s) => acc + (s.nilaiRataRata || 0), 0) / setoranSantri.length)
       : 0;
     const progressJilid = getProgressJilid(santri.halamanSaatIni, santri.jilidSaatIni);
 
     return {
       ...santri,
       jumlahSetoran: setoranSantri.length,
       totalHalaman,
       rataRataNilai,
       progressJilid: Math.round(progressJilid),
     };
   });
 
   const filteredSantri = santriStats.filter(santri => {
     const matchHalaqoh = filterHalaqoh === "all" || santri.halaqoh === filterHalaqoh;
     const matchKelas = filterKelas === "all" || santri.kelas === filterKelas;
     const matchJilid = filterJilid === "all" || santri.jilidSaatIni === parseInt(filterJilid);
     return matchHalaqoh && matchKelas && matchJilid;
   });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Laporan Tilawah</h1>
           <p className="text-muted-foreground text-sm mt-1">Laporan perkembangan tilawah metode Tilawati</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Laporan</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                 <SelectTrigger>
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bulan-ini">Bulan Ini</SelectItem>
                  <SelectItem value="minggu-ini">Minggu Ini</SelectItem>
                  <SelectItem value="semester">Semester Ini</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterHalaqoh} onValueChange={setFilterHalaqoh}>
                 <SelectTrigger>
                  <SelectValue placeholder="Pilih Halaqoh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Halaqoh</SelectItem>
                   <SelectItem value="Halaqoh 1">Halaqoh 1</SelectItem>
                   <SelectItem value="Halaqoh 2">Halaqoh 2</SelectItem>
                   <SelectItem value="Halaqoh 3">Halaqoh 3</SelectItem>
                   <SelectItem value="Halaqoh 4">Halaqoh 4</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterKelas} onValueChange={setFilterKelas}>
                 <SelectTrigger>
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {MOCK_KELAS.map((k) => (
                    <SelectItem key={k.id} value={k.id}>
                      {k.nama_kelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <Select value={filterJilid} onValueChange={setFilterJilid}>
                 <SelectTrigger>
                   <SelectValue placeholder="Pilih Jilid" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">Semua Jilid</SelectItem>
                   {TILAWATI_JILID.map((jilid) => (
                     <SelectItem key={jilid.jilid} value={jilid.jilid.toString()}>
                       Jilid {jilid.jilid}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Laporan Tilawah</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Santri</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Halaqoh</TableHead>
                   <TableHead>Jilid</TableHead>
                   <TableHead>Halaman</TableHead>
                   <TableHead>Progress</TableHead>
                   <TableHead>Setoran</TableHead>
                   <TableHead>Nilai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {filteredSantri.length > 0 ? (
                   filteredSantri.map((santri, index) => (
                     <TableRow key={santri.id}>
                       <TableCell>{index + 1}</TableCell>
                       <TableCell
                         className="font-medium text-primary cursor-pointer hover:underline"
                         onClick={() => {
                           const s = getSantriByNama(santri.nama);
                           if (s) navigate(`/santri/${s.id}`);
                         }}
                       >{santri.nama}</TableCell>
                       <TableCell>{santri.kelas}</TableCell>
                       <TableCell>{santri.halaqoh}</TableCell>
                       <TableCell>
                         <Badge variant="outline">Jilid {santri.jilidSaatIni}</Badge>
                       </TableCell>
                       <TableCell>{santri.halamanSaatIni}/{HALAMAN_PER_JILID}</TableCell>
                       <TableCell>
                         <div className="flex items-center gap-2">
                           <Progress value={santri.progressJilid} className="w-16 h-2" />
                           <span className="text-xs text-muted-foreground">{santri.progressJilid}%</span>
                         </div>
                       </TableCell>
                       <TableCell>{santri.jumlahSetoran}x</TableCell>
                       <TableCell>
                         <Badge variant={santri.rataRataNilai >= 80 ? "default" : santri.rataRataNilai >= 70 ? "secondary" : "outline"}>
                           {santri.rataRataNilai || "-"}
                         </Badge>
                       </TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow>
                     <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                       Belum ada data laporan tilawah
                     </TableCell>
                   </TableRow>
                 )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
