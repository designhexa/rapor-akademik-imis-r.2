import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, Upload, BookOpen, ClipboardCheck, Trophy, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AkademikDashboard() {
  const [stats, setStats] = useState({
    totalSantri: 0,
    totalMapel: 0,
    totalNilai: 0,
    avgNilai: 0,
    totalKomponen: 0,
    totalEkskul: 0,
  });
  const [nilaiPerMapel, setNilaiPerMapel] = useState<{ nama: string; rataRata: number }[]>([]);
  const [distribusiNilai, setDistribusiNilai] = useState<{ name: string; value: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ mapel: string; santri: number; waktu: string }[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [santriRes, mapelRes, nilaiRes, komponenRes, ekskulRes] = await Promise.all([
      supabase.from("santri").select("id", { count: "exact" }).eq("status", "Aktif"),
      supabase.from("mata_pelajaran").select("id, nama", { count: "exact" }).eq("kategori", "Umum").eq("aktif", true),
      supabase.from("nilai_akademik").select("nilai, id_komponen, id_santri, komponen_nilai!inner(mata_pelajaran!inner(nama, kategori))").not("nilai", "is", null),
      supabase.from("komponen_nilai").select("id", { count: "exact" }),
      supabase.from("ekstrakurikuler").select("id", { count: "exact" }).eq("aktif", true),
    ]);

    const totalSantri = santriRes.count || 0;
    const totalMapel = mapelRes.count || 0;
    const totalKomponen = komponenRes.count || 0;
    const totalEkskul = ekskulRes.count || 0;

    // Filter only Umum category
    const umumNilai = (nilaiRes.data || []).filter((n: any) => n.komponen_nilai?.mata_pelajaran?.kategori === "Umum");
    const totalNilai = umumNilai.length;
    const avgNilai = totalNilai > 0
      ? Math.round(umumNilai.reduce((sum: number, n: any) => sum + Number(n.nilai || 0), 0) / totalNilai * 10) / 10
      : 0;

    setStats({ totalSantri, totalMapel, totalNilai, avgNilai, totalKomponen, totalEkskul });

    // Rata-rata per mapel
    const mapelMap: Record<string, { total: number; count: number }> = {};
    umumNilai.forEach((n: any) => {
      const nama = n.komponen_nilai?.mata_pelajaran?.nama || "Unknown";
      if (!mapelMap[nama]) mapelMap[nama] = { total: 0, count: 0 };
      mapelMap[nama].total += Number(n.nilai || 0);
      mapelMap[nama].count += 1;
    });
    const perMapel = Object.entries(mapelMap).map(([nama, v]) => ({
      nama,
      rataRata: Math.round(v.total / v.count * 10) / 10,
    })).sort((a, b) => b.rataRata - a.rataRata).slice(0, 8);
    setNilaiPerMapel(perMapel);

    // Distribusi nilai
    const ranges = { "90-100": 0, "80-89": 0, "70-79": 0, "60-69": 0, "<60": 0 };
    umumNilai.forEach((n: any) => {
      const v = Number(n.nilai || 0);
      if (v >= 90) ranges["90-100"]++;
      else if (v >= 80) ranges["80-89"]++;
      else if (v >= 70) ranges["70-79"]++;
      else if (v >= 60) ranges["60-69"]++;
      else ranges["<60"]++;
    });
    setDistribusiNilai(Object.entries(ranges).map(([name, value]) => ({ name, value })));

    // Recent activity (mapel with most entries)
    const mapelActivity = Object.entries(mapelMap).map(([mapel, v]) => ({
      mapel,
      santri: v.count,
      waktu: "Semester ini",
    })).sort((a, b) => b.santri - a.santri).slice(0, 5);
    setRecentActivity(mapelActivity);
  };

  const statCards = [
    { title: "Total Santri Aktif", value: stats.totalSantri, desc: "Santri terdaftar", icon: Users, color: "text-blue-500" },
    { title: "Mata Pelajaran", value: stats.totalMapel, desc: "Mapel umum aktif", icon: BookOpen, color: "text-green-500" },
    { title: "Data Nilai", value: stats.totalNilai, desc: "Nilai terinput", icon: FileText, color: "text-orange-500" },
    { title: "Rata-rata Nilai", value: stats.avgNilai || "-", desc: "Semua mapel umum", icon: TrendingUp, color: "text-purple-500" },
    { title: "Komponen Nilai", value: stats.totalKomponen, desc: "Total komponen", icon: ClipboardCheck, color: "text-cyan-500" },
    { title: "Ekstrakurikuler", value: stats.totalEkskul, desc: "Ekskul aktif", icon: Trophy, color: "text-pink-500" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Akademik</h1>
          <p className="text-muted-foreground text-sm mt-1">Ringkasan data akademik mata pelajaran umum</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rata-rata Nilai per Mapel</CardTitle>
            </CardHeader>
            <CardContent>
              {nilaiPerMapel.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={nilaiPerMapel} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="nama" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="rataRata" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">Belum ada data nilai</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribusi Nilai</CardTitle>
            </CardHeader>
            <CardContent>
              {distribusiNilai.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={distribusiNilai} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                      {distribusiNilai.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">Belum ada data nilai</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan Nilai per Mata Pelajaran</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{a.mapel}</p>
                        <p className="text-xs text-muted-foreground">{a.waktu}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{a.santri} nilai</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Belum ada aktivitas</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
