import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Star, TrendingUp, Heart, ClipboardCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function DiniyahDashboard() {
  const [stats, setStats] = useState({
    totalSantri: 0, totalMapel: 0, totalNilai: 0, avgNilai: 0,
    totalPembiasaan: 0, totalIbadah: 0,
  });
  const [nilaiPerMapel, setNilaiPerMapel] = useState<{ nama: string; rataRata: number }[]>([]);
  const [distribusiNilai, setDistribusiNilai] = useState<{ name: string; value: number }[]>([]);
  const [pembiasaanSummary, setPembiasaanSummary] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [santriRes, mapelRes, nilaiRes, pembiasaanRes, ibadahRes] = await Promise.all([
      supabase.from("santri").select("id", { count: "exact" }).eq("status", "Aktif"),
      supabase.from("mata_pelajaran").select("id, nama", { count: "exact" }).eq("kategori", "Agama").eq("aktif", true),
      supabase.from("nilai_akademik").select("nilai, komponen_nilai!inner(mata_pelajaran!inner(nama, kategori))").not("nilai", "is", null),
      supabase.from("pembiasaan").select("id, nilai", { count: "exact" }),
      supabase.from("keterampilan_ibadah").select("id, nilai", { count: "exact" }),
    ]);

    const totalSantri = santriRes.count || 0;
    const totalMapel = mapelRes.count || 0;
    const totalPembiasaan = pembiasaanRes.count || 0;
    const totalIbadah = ibadahRes.count || 0;

    const diniyahNilai = (nilaiRes.data || []).filter((n: any) => n.komponen_nilai?.mata_pelajaran?.kategori === "Agama");
    const totalNilai = diniyahNilai.length;
    const avgNilai = totalNilai > 0
      ? Math.round(diniyahNilai.reduce((sum: number, n: any) => sum + Number(n.nilai || 0), 0) / totalNilai * 10) / 10
      : 0;

    setStats({ totalSantri, totalMapel, totalNilai, avgNilai, totalPembiasaan, totalIbadah });

    // Rata-rata per mapel diniyah
    const mapelMap: Record<string, { total: number; count: number }> = {};
    diniyahNilai.forEach((n: any) => {
      const nama = n.komponen_nilai?.mata_pelajaran?.nama || "Unknown";
      if (!mapelMap[nama]) mapelMap[nama] = { total: 0, count: 0 };
      mapelMap[nama].total += Number(n.nilai || 0);
      mapelMap[nama].count += 1;
    });
    setNilaiPerMapel(
      Object.entries(mapelMap).map(([nama, v]) => ({
        nama,
        rataRata: Math.round(v.total / v.count * 10) / 10,
      })).sort((a, b) => b.rataRata - a.rataRata)
    );

    // Distribusi nilai
    const ranges = { "90-100": 0, "80-89": 0, "70-79": 0, "60-69": 0, "<60": 0 };
    diniyahNilai.forEach((n: any) => {
      const v = Number(n.nilai || 0);
      if (v >= 90) ranges["90-100"]++;
      else if (v >= 80) ranges["80-89"]++;
      else if (v >= 70) ranges["70-79"]++;
      else if (v >= 60) ranges["60-69"]++;
      else ranges["<60"]++;
    });
    setDistribusiNilai(Object.entries(ranges).map(([name, value]) => ({ name, value })));

    // Pembiasaan summary
    const pembiasaanCounts = { A: 0, B: 0, C: 0, D: 0 };
    (pembiasaanRes.data || []).forEach((p: any) => {
      if (p.nilai && pembiasaanCounts.hasOwnProperty(p.nilai)) {
        pembiasaanCounts[p.nilai as keyof typeof pembiasaanCounts]++;
      }
    });
    setPembiasaanSummary(Object.entries(pembiasaanCounts).map(([name, value]) => ({ name, value })));
  };

  const statCards = [
    { title: "Total Santri Aktif", value: stats.totalSantri, desc: "Santri terdaftar", icon: Users, color: "text-blue-500" },
    { title: "Mapel Diniyah", value: stats.totalMapel, desc: "Mapel agama aktif", icon: BookOpen, color: "text-green-500" },
    { title: "Data Nilai", value: stats.totalNilai, desc: "Nilai terinput", icon: Star, color: "text-orange-500" },
    { title: "Rata-rata Nilai", value: stats.avgNilai || "-", desc: "Semua mapel diniyah", icon: TrendingUp, color: "text-purple-500" },
    { title: "Data Pembiasaan", value: stats.totalPembiasaan, desc: "Record pembiasaan", icon: Heart, color: "text-pink-500" },
    { title: "Keterampilan Ibadah", value: stats.totalIbadah, desc: "Record ibadah", icon: ClipboardCheck, color: "text-cyan-500" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Diniyah</h1>
          <p className="text-muted-foreground text-sm mt-1">Ringkasan data penilaian mata pelajaran keagamaan</p>
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
              <CardTitle className="text-base">Rata-rata Nilai per Mapel Diniyah</CardTitle>
            </CardHeader>
            <CardContent>
              {nilaiPerMapel.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={nilaiPerMapel} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="nama" width={140} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="rataRata" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">Belum ada data nilai diniyah</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribusi Nilai Diniyah</CardTitle>
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
            <CardTitle className="text-base">Distribusi Nilai Pembiasaan</CardTitle>
          </CardHeader>
          <CardContent>
            {pembiasaanSummary.some(p => p.value > 0) ? (
              <div className="grid grid-cols-4 gap-4">
                {pembiasaanSummary.map((p) => (
                  <div key={p.name} className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-3xl font-bold text-primary">{p.value}</div>
                    <p className="text-sm text-muted-foreground mt-1">Predikat {p.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Belum ada data pembiasaan</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
