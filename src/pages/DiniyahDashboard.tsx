import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function DiniyahDashboard() {
  const [stats, setStats] = useState({ totalSantri: 0, totalMapel: 0, totalNilai: 0, avgNilai: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [santriRes, mapelRes, nilaiRes] = await Promise.all([
      supabase.from("santri").select("id", { count: "exact" }).eq("status", "Aktif"),
      supabase.from("mata_pelajaran").select("id", { count: "exact" }).eq("kategori", "Agama").eq("aktif", true),
      supabase.from("nilai_akademik").select("nilai, komponen_nilai!inner(mata_pelajaran!inner(kategori))").not("nilai", "is", null),
    ]);

    const totalSantri = santriRes.count || 0;
    const totalMapel = mapelRes.count || 0;

    // Filter diniyah values
    const diniyahNilai = (nilaiRes.data || []).filter((n: any) => n.komponen_nilai?.mata_pelajaran?.kategori === "Agama");
    const totalNilai = diniyahNilai.length;
    const avgNilai = totalNilai > 0 
      ? diniyahNilai.reduce((sum: number, n: any) => sum + Number(n.nilai || 0), 0) / totalNilai 
      : 0;

    setStats({ totalSantri, totalMapel, totalNilai, avgNilai: Math.round(avgNilai * 10) / 10 });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Diniyah</h1>
          <p className="text-muted-foreground text-sm mt-1">Ringkasan data penilaian mata pelajaran keagamaan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Santri</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSantri}</div>
              <p className="text-xs text-muted-foreground">Santri aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mata Pelajaran</CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMapel}</div>
              <p className="text-xs text-muted-foreground">Mapel diniyah aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Data Nilai</CardTitle>
              <Star className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNilai}</div>
              <p className="text-xs text-muted-foreground">Nilai terinput</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Nilai</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgNilai || "-"}</div>
              <p className="text-xs text-muted-foreground">Semua mapel diniyah</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
