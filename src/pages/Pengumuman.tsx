import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Megaphone, Heart } from "lucide-react";

const mockPengumuman = [
  {
    id: "1",
    judul: "Selamat Datang di Sistem Tahfidz Al-Quran",
    kategori: "Pengumuman",
    penulis: "Admin Utama",
    tanggal: "18 Desember 2025",
    isi: "Assalamualaikum warahmatullahi wabarakatuh. Alhamdulillah sistem manajemen tahfidz telah aktif dan siap digunakan. Mari bersama-sama kita tingkatkan hafalan Al-Quran dengan penuh semangat dan istiqomah. Barakallahu fiikum.",
  },
  {
    id: "2",
    judul: "Motivasi Menghafal Al-Quran",
    kategori: "Motivasi",
    penulis: "Admin Utama",
    tanggal: "18 Desember 2025",
    isi: "Bacalah Al-Quran, karena sesungguhnya ia akan datang pada hari kiamat sebagai pemberi syafaat bagi orang yang membacanya. (HR. Muslim)",
  },
];

const getCategoryBadge = (kategori: string) => {
  if (kategori === "Pengumuman") {
    return "bg-primary text-primary-foreground";
  }
  return "bg-pink-100 text-pink-600 hover:bg-pink-200";
};

const getCategoryIcon = (kategori: string) => {
  if (kategori === "Pengumuman") {
    return <Megaphone className="w-5 h-5 text-primary" />;
  }
  return <Heart className="w-5 h-5 text-pink-500" />;
};

export default function Pengumuman() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Pengumuman & Motivasi</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pengumuman
          </Button>
        </div>

        <div className="space-y-4">
          {mockPengumuman.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    {getCategoryIcon(item.kategori)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-primary">{item.judul}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.penulis} • {item.tanggal}
                        </p>
                      </div>
                      <Badge className={getCategoryBadge(item.kategori)}>
                        {item.kategori}
                      </Badge>
                    </div>
                    <p className="mt-3 text-foreground">{item.isi}</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
