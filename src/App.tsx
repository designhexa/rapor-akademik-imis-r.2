import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SetoranHafalan from "./pages/SetoranHafalan";
import DrillHafalan from "./pages/DrillHafalan";
import LaporanHafalan from "./pages/LaporanHafalan";
import UjianTasmi from "./pages/UjianTasmi";
import UjianTahfidz from "./pages/UjianTahfidz";
import RaporSemester from "./pages/RaporSemester";
import DataSantri from "./pages/DataSantri";
import DataHalaqoh from "./pages/DataHalaqoh";
import DataKelas from "./pages/DataKelas";
import DataUstadz from "./pages/DataUstadz";
import DataUsers from "./pages/DataUsers";
import PengumumanPage from "./pages/Pengumuman";
import NotFound from "./pages/NotFound";
// Tilawah pages
import TilawahDashboard from "./pages/TilawahDashboard";
import TilawahAbsensi from "./pages/TilawahAbsensi";
// TilawahLaporan is now integrated into LaporanHafalan
import TilawahUjian from "./pages/TilawahUjian";

// Akademik pages
import AkademikDashboard from "./pages/AkademikDashboard";
import AkademikKurikulum from "./pages/AkademikKurikulum";
import AkademikInputNilai from "./pages/AkademikInputNilai";
import AkademikKehadiran from "./pages/AkademikKehadiran";
import AkademikRekap from "./pages/AkademikRekap";
import AkademikImpor from "./pages/AkademikImpor";
import AkademikRapor from "./pages/AkademikRapor";
import AkademikRaporDiniyah from "./pages/AkademikRaporDiniyah";
import AkademikPembiasaan from "./pages/AkademikPembiasaan";
import AkademikIbadah from "./pages/AkademikIbadah";
import AkademikEkskul from "./pages/AkademikEkskul";
import AkademikP5 from "./pages/AkademikP5";
import AkademikRaporGenerate from "./pages/AkademikRaporGenerate";
import TilawahUjianSemester from "./pages/TilawahUjianSemester";
import DetailSantri from "./pages/DetailSantri";
// import TambahDrill from "./pages/TambahDrill";
import TambahSetoran from "./pages/TambahSetoran";
import SertifikatTasmi from "./pages/SertifikatTasmi";
// Profil & Pengaturan
import Profil from "./pages/Profil";
import Pengaturan from "./pages/Pengaturan";
import DiniyahDashboard from "./pages/DiniyahDashboard";
import DiniyahInputNilai from "./pages/DiniyahInputNilai";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/setoran" element={<SetoranHafalan />} />
            <Route path="/drill" element={<DrillHafalan />} />
            {/* <Route path="/tambah-drill" element={<TambahDrill />} /> */}
            <Route path="/laporan" element={<LaporanHafalan />} />
            <Route path="/ujian-tasmi" element={<UjianTasmi />} />
            <Route path="/ujian-tahfidz" element={<UjianTahfidz />} />
            <Route path="/sertifikat-tasmi" element={<SertifikatTasmi />} />
            <Route path="/rapor" element={<RaporSemester />} />
            <Route path="/santri" element={<DataSantri />} />
            <Route path="/santri/:id" element={<DetailSantri />} />
            <Route path="/halaqoh" element={<DataHalaqoh />} />
            <Route path="/kelas" element={<DataKelas />} />
            <Route path="/ustadz" element={<DataUstadz />} />
            <Route path="/users" element={<DataUsers />} />
            <Route path="/pengumuman" element={<PengumumanPage />} />
            {/* Tilawah Routes */}
            <Route path="/tilawah/dashboard" element={<TilawahDashboard />} />
            <Route path="/tilawah/absensi" element={<TilawahAbsensi />} />
            {/* Tilawah Laporan now integrated into /laporan */}
            <Route path="/tilawah/ujian" element={<TilawahUjian />} />
            <Route path="/tilawah/ujian-semester" element={<TilawahUjianSemester />} />
            
            {/* Akademik Routes */}
            <Route path="/akademik/dashboard" element={<AkademikDashboard />} />
            <Route path="/akademik/kurikulum" element={<AkademikKurikulum />} />
            <Route path="/akademik/input-nilai" element={<AkademikInputNilai />} />
            <Route path="/akademik/kehadiran" element={<AkademikKehadiran />} />
            <Route path="/akademik/rekap" element={<AkademikRekap />} />
            <Route path="/akademik/impor" element={<AkademikImpor />} />
            <Route path="/akademik/rapor" element={<AkademikRapor />} />
            <Route path="/akademik/rapor-diniyah" element={<AkademikRaporDiniyah />} />
            <Route path="/akademik/pembiasaan" element={<AkademikPembiasaan />} />
            <Route path="/akademik/ibadah" element={<AkademikIbadah />} />
            <Route path="/akademik/ekskul" element={<AkademikEkskul />} />
            <Route path="/akademik/p5" element={<AkademikP5 />} />
            <Route path="/akademik/rapor-generate" element={<AkademikRaporGenerate />} />
            {/* Profil & Pengaturan */}
            <Route path="/profil" element={<Profil />} />
            <Route path="/pengaturan" element={<Pengaturan />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
