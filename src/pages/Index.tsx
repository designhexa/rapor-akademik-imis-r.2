import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ClipboardCheck, BarChart3, Star, ChevronRight, Sparkles, Headphones, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Setoran Hafalan",
      description: "Catat dan pantau progress hafalan santri secara real-time dengan kalender interaktif",
    },
    {
      icon: Headphones,
      title: "Program Tilawah",
      description: "Kelola pembelajaran tilawah, absensi, dan ujian tilawati secara terstruktur",
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Admin, Asatidz, Wali Santri, dan Yayasan dalam satu sistem terintegrasi",
    },
    {
      icon: ClipboardCheck,
      title: "Absensi & Penilaian",
      description: "Kelola kehadiran dan evaluasi santri untuk hafalan maupun tilawah",
    },
    {
      icon: FileText,
      title: "Ujian & Sertifikasi",
      description: "Ujian tasmi', ujian tilawati semester, dan sertifikasi hafalan dalam satu platform",
    },
    {
      icon: BarChart3,
      title: "Laporan Lengkap",
      description: "Dashboard statistik hafalan & tilawah serta laporan komprehensif untuk evaluasi berkala",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ornamental Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large geometric circle top-right */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border-[40px] border-primary/5" />
        {/* Small circle left */}
        <div className="absolute top-1/3 -left-16 w-[300px] h-[300px] rounded-full bg-secondary/5" />
        {/* Dot pattern */}
        <div className="absolute top-20 left-1/4 w-2 h-2 rounded-full bg-primary/20" />
        <div className="absolute top-32 left-[28%] w-1.5 h-1.5 rounded-full bg-primary/15" />
        <div className="absolute top-24 left-[32%] w-1 h-1 rounded-full bg-primary/25" />
        {/* Islamic-inspired geometric lines */}
        <svg className="absolute bottom-0 left-0 w-full h-40 opacity-[0.03]" viewBox="0 0 1440 160" preserveAspectRatio="none">
          <path d="M0,64 C360,128 720,0 1080,96 C1260,128 1440,64 1440,64 L1440,160 L0,160 Z" fill="currentColor" className="text-primary" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-32 opacity-[0.02]" viewBox="0 0 1440 128" preserveAspectRatio="none">
          <path d="M0,96 C480,32 960,128 1440,48 L1440,128 L0,128 Z" fill="currentColor" className="text-secondary" />
        </svg>
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Nav */}
        <nav className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">Mantaf IMIS</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="hidden sm:inline-flex">
            Login
          </Button>
        </nav>

        {/* Hero */}
        <section className="container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent border border-border text-sm text-accent-foreground">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem Manajemen Tahfidz & Tilawah Modern</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight">
              Kelola Hafalan & Tilawah
              <br />
              <span className="text-primary">Lebih Mudah</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Platform digital untuk pencatatan setoran hafalan, drill,
              <br />
              ujian tasmi', program tilawah dan laporan progress santri
              <br />
              yang terintegrasi.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-base px-8 shadow-lg shadow-primary/20">
                Mulai Sekarang
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-base px-8">
                Login
              </Button>
            </div>

            {/* Trust indicator */}
            <div className="flex items-center justify-center gap-1.5 pt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
              ))}
              <span className="text-sm text-muted-foreground ml-2">Dipercaya oleh lembaga tahfidz & tilawah</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 pb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center mb-5 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 pb-24">
          <div className="max-w-4xl mx-auto rounded-2xl bg-primary/5 border border-primary/10 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "30", label: "Juz Al-Qur'an" },
                { value: "114", label: "Surah" },
                { value: "604", label: "Halaman Mushaf" },
                { value: "∞", label: "Keberkahan" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mantaf IMIS — Manajemen Tahfidz & Tilawah Terintegrasi
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
