import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, Upload } from "lucide-react";
import { MOCK_SANTRI } from "@/lib/mock-data";
import { mockSantriAkademik } from "@/lib/rapor-akademik-types";

export default function AkademikDashboard() {
  const totalSantri = MOCK_SANTRI.length;
  const dataNilaiDiimpor = mockSantriAkademik.filter(s => s.statusNilai === "Lengkap").length;
  const raporDigenerate = mockSantriAkademik.filter(s => s.statusRapor === "Sudah Generate").length;
  const rataRataNilai = 84.5;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Rapor Akademik</h1>
          <p className="text-muted-foreground text-sm mt-1">Ringkasan data rapor akademik</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Santri</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSantri}</div>
              <p className="text-xs text-muted-foreground">Santri terdaftar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Data Nilai Diimpor</CardTitle>
              <Upload className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dataNilaiDiimpor}</div>
              <p className="text-xs text-muted-foreground">Data nilai lengkap</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rapor Digenerate</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{raporDigenerate}</div>
              <p className="text-xs text-muted-foreground">Rapor akademik</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Nilai</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rataRataNilai}</div>
              <p className="text-xs text-muted-foreground">Nilai akademik</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">Belum ada aktivitas rapor akademik</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
