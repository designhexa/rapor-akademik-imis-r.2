 import { useNavigate } from "react-router-dom";
 import { Layout } from "@/components/Layout";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Badge } from "@/components/ui/badge";
 import { Users, BookOpen, TrendingUp, Percent, FileText } from "lucide-react";
 import { getDashboardStats, MOCK_SETORAN_TILAWAH, MOCK_SANTRI_TILAWAH, TILAWATI_JILID } from "@/lib/tilawah-data";

export default function TilawahDashboard() {
   const navigate = useNavigate();
   const stats = getDashboardStats();
 
   // Get santri name by id
   const getSantriName = (idSantri: string) => {
     const santri = MOCK_SANTRI_TILAWAH.find(s => s.id === idSantri);
     return santri?.nama || "Unknown";
   };
 
   const getSantriKelas = (idSantri: string) => {
     const santri = MOCK_SANTRI_TILAWAH.find(s => s.id === idSantri);
     return santri?.kelas || "-";
   };
 
   const getStatusBadge = (status: string) => {
     switch (status) {
       case 'selesai':
         return <Badge variant="outline" className="border-green-500 text-green-700">Selesai</Badge>;
       case 'lanjut':
         return <Badge variant="outline" className="border-blue-500 text-blue-700">Lanjut</Badge>;
       case 'ulang':
         return <Badge variant="outline" className="border-red-500 text-red-700">Ulang</Badge>;
       default:
         return <Badge variant="secondary">{status}</Badge>;
     }
   };
 
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Tilawah</h1>
           <p className="text-muted-foreground text-sm mt-1">Ringkasan data dan aktivitas tilawah metode Tilawati</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Santri</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{stats.totalSantri}</div>
              <p className="text-xs text-muted-foreground">Santri aktif tilawah</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Setoran Hari Ini</CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{stats.totalSetoranHariIni}</div>
               <p className="text-xs text-muted-foreground">Setoran hari ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Setoran</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{stats.rataRataHalaman}</div>
               <p className="text-xs text-muted-foreground">Halaman per santri</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Persentase Setoran</CardTitle>
               <Percent className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{stats.persentaseSetoran}%</div>
               <p className="text-xs text-muted-foreground">Santri sudah setor hari ini</p>
            </CardContent>
          </Card>
        </div>

         {/* Distribusi Jilid */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <FileText className="w-5 h-5" />
               Distribusi Santri per Jilid
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {TILAWATI_JILID.map((jilid) => {
                 const jumlahSantri = MOCK_SANTRI_TILAWAH.filter(
                   s => s.jilidSaatIni === jilid.jilid
                 ).length;
                 return (
                   <div 
                     key={jilid.jilid} 
                     className="p-4 rounded-lg border bg-card text-center"
                   >
                     <div className="text-2xl font-bold text-primary">{jumlahSantri}</div>
                     <div className="text-sm text-muted-foreground">Jilid {jilid.jilid}</div>
                   </div>
                 );
               })}
             </div>
           </CardContent>
         </Card>
 
         {/* Aktivitas Terbaru */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Tilawah Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
             {MOCK_SETORAN_TILAWAH.length > 0 ? (
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Nama Santri</TableHead>
                     <TableHead>Kelas</TableHead>
                     <TableHead>Jilid</TableHead>
                     <TableHead>Halaman</TableHead>
                     <TableHead>Nilai</TableHead>
                     <TableHead>Status</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {MOCK_SETORAN_TILAWAH.map((setoran) => (
                     <TableRow key={setoran.id}>
                        <TableCell
                          className="font-medium text-primary cursor-pointer hover:underline"
                          onClick={() => navigate(`/santri/${setoran.idSantri}`)}
                        >{getSantriName(setoran.idSantri)}</TableCell>
                       <TableCell>{getSantriKelas(setoran.idSantri)}</TableCell>
                       <TableCell>Jilid {setoran.jilid}</TableCell>
                       <TableCell>{setoran.halamanDari} - {setoran.halamanSampai}</TableCell>
                       <TableCell>{setoran.nilaiRataRata || "-"}</TableCell>
                       <TableCell>{getStatusBadge(setoran.status)}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             ) : (
               <p className="text-muted-foreground text-center py-8">Belum ada data aktivitas tilawah</p>
             )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
