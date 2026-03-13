
-- =============================================
-- SISTEM AKADEMIK UMUM - SKEMA DATABASE FASE 1
-- =============================================

-- Enum untuk jenjang
CREATE TYPE public.jenjang_sekolah AS ENUM ('TK', 'SD', 'SMP');

-- Enum untuk semester
CREATE TYPE public.semester_type AS ENUM ('Ganjil', 'Genap');

-- Enum untuk jenis penilaian
CREATE TYPE public.jenis_penilaian AS ENUM ('Tugas Harian', 'Ujian Lisan', 'Ujian Tulis', 'Praktikum', 'Proyek', 'PAS', 'PTS');

-- Enum untuk predikat pembiasaan
CREATE TYPE public.predikat_pembiasaan AS ENUM ('A', 'B', 'C', 'D');

-- Enum untuk predikat P5
CREATE TYPE public.predikat_p5 AS ENUM ('MB', 'SB', 'BSH', 'SAB');

-- Enum untuk kategori mapel
CREATE TYPE public.kategori_mapel AS ENUM ('Umum', 'Agama', 'Muatan Lokal', 'Pemberdayaan', 'Keterampilan');

-- 1. Tahun Ajaran
CREATE TABLE public.tahun_ajaran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL, -- e.g. "2025/2026"
  semester semester_type NOT NULL DEFAULT 'Ganjil',
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  aktif BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.tahun_ajaran ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view tahun_ajaran" ON public.tahun_ajaran FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage tahun_ajaran" ON public.tahun_ajaran FOR ALL TO authenticated USING (has_role(auth.uid(), 'Admin') OR has_role(auth.uid(), 'Koordinator'));

-- 2. Mata Pelajaran
CREATE TABLE public.mata_pelajaran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  kode TEXT,
  jenjang jenjang_sekolah NOT NULL DEFAULT 'SMP',
  kategori kategori_mapel NOT NULL DEFAULT 'Umum',
  kkm INTEGER DEFAULT 70,
  urutan INTEGER DEFAULT 0,
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.mata_pelajaran ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view mata_pelajaran" ON public.mata_pelajaran FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage mata_pelajaran" ON public.mata_pelajaran FOR ALL TO authenticated USING (has_role(auth.uid(), 'Admin') OR has_role(auth.uid(), 'Koordinator'));

-- 3. Materi per mapel per kelas
CREATE TABLE public.materi_pelajaran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_mapel UUID NOT NULL REFERENCES public.mata_pelajaran(id) ON DELETE CASCADE,
  kelas TEXT NOT NULL, -- e.g. "7", "8", "9"
  id_tahun_ajaran UUID REFERENCES public.tahun_ajaran(id),
  deskripsi_materi TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.materi_pelajaran ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view materi_pelajaran" ON public.materi_pelajaran FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage materi_pelajaran" ON public.materi_pelajaran FOR ALL TO authenticated USING (has_role(auth.uid(), 'Admin') OR has_role(auth.uid(), 'Koordinator'));

-- 4. Komponen Nilai (configurable per mapel per tahun ajaran)
CREATE TABLE public.komponen_nilai (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_mapel UUID NOT NULL REFERENCES public.mata_pelajaran(id) ON DELETE CASCADE,
  id_tahun_ajaran UUID REFERENCES public.tahun_ajaran(id),
  nama_komponen TEXT NOT NULL, -- e.g. "Tugas Harian 1"
  jenis jenis_penilaian NOT NULL DEFAULT 'Tugas Harian',
  bobot NUMERIC(5,2) DEFAULT 1,
  urutan INTEGER DEFAULT 0,
  kelas TEXT, -- jika komponen berbeda per kelas
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.komponen_nilai ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view komponen_nilai" ON public.komponen_nilai FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage komponen_nilai" ON public.komponen_nilai FOR ALL TO authenticated USING (has_role(auth.uid(), 'Admin') OR has_role(auth.uid(), 'Koordinator') OR has_role(auth.uid(), 'Asatidz'));

-- 5. Nilai Akademik (per siswa per komponen)
CREATE TABLE public.nilai_akademik (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_santri UUID NOT NULL REFERENCES public.santri(id) ON DELETE CASCADE,
  id_komponen UUID NOT NULL REFERENCES public.komponen_nilai(id) ON DELETE CASCADE,
  id_tahun_ajaran UUID REFERENCES public.tahun_ajaran(id),
  nilai NUMERIC(6,2),
  catatan TEXT,
  id_guru UUID, -- who input the grade
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(id_santri, id_komponen, id_tahun_ajaran)
);
ALTER TABLE public.nilai_akademik ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view nilai_akademik" ON public.nilai_akademik FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Guru can manage nilai_akademik" ON public.nilai_akademik FOR ALL TO authenticated USING (has_role(auth.uid(), 'Admin') OR has_role(auth.uid(), 'Koordinator') OR has_role(auth.uid(), 'Asatidz'));

-- 6. Kehadiran Akademik (per siswa per bulan)
CREATE TABLE public.kehadiran_akademik (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_santri UUID NOT NULL REFERENCES public.santri(id) ON DELETE CASCADE,
  id_tahun_ajaran UUID REFERENCES public.tahun_ajaran(id),
  bulan INTEGER NOT NULL, -- 1-12
  tahun INTEGER NOT NULL,
  sakit INTEGER DEFAULT 0,
  izin INTEGER DEFAULT 0,
  alpha INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(id_santri, id_tahun_ajaran, bulan, tahun)
);
ALTER TABLE public.kehadiran_akademik ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view kehadiran_akademik" ON public.kehadiran_akademik FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Guru can manage kehadiran_akademik" ON public.kehadiran_akademik FOR ALL TO authenticated USING (has_role(auth.uid(), 'Admin') OR has_role(auth.uid(), 'Koordinator') OR has_role(auth.uid(), 'Asatidz'));

-- 7. Pembiasaan
CREATE TABLE public.pembiasaan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_santri UUID NOT NULL REFERENCES public.santri(id) ON DELETE CASCADE,
  id_tahun_ajaran UUID REFERENCES public.tahun_ajaran(id),
  lokasi TEXT NOT NULL, -- 'sekolah' or 'rumah'
  nomor INTEGER NOT NULL, -- 1-12
  nilai predikat_pembiasaan DEFAULT 'A',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(id_santri, id_tahun_ajaran, lokasi, nomor)
);
ALTER TABLE public.pembiasaan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view pembiasaan" ON public.pembiasaan FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Guru can manage pembiasaan" ON public.pembiasaan FOR ALL TO authenticated USING (has_role(auth.uid(), 'Admin') OR has_role(auth.uid(), 'Koordinator') OR has_role(auth.uid(), 'Asatidz'));

-- 8. Keterampilan Ibadah
CREATE TABLE public.keterampilan_ibadah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_santri UUID NOT NULL REFERENCES public.santri(id) ON DELETE CASCADE,
  id_tahun_ajaran UUID REFERENCES public.tahun_ajaran(id),
  jenis TEXT NOT NULL, -- 'Wudhu', 'Sholat', 'Dzikir Setelah Sholat', 'Dzikir Pagi Petang'
  kkm INTEGER DEFAULT 70,
  nilai NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(id_santri, id_tahun_ajaran, jenis)
);
ALTER TABLE public.keterampilan_ibadah ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view keterampilan_ibadah" ON public.keterampilan_ibadah FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Guru can manage keterampilan_ibadah" ON public.keterampilan_ibadah FOR ALL TO authenticated USING (has_role(auth.uid(), 'Admin') OR has_role(auth.uid(), 'Koordinator') OR has_role(auth.uid(), 'Asatidz'));

-- 9. Ekstrakurikuler Master
CREATE TABLE public.ekstrakurikuler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ekstrakurikuler ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view ekstrakurikuler" ON public.ekstrakurikuler FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage ekstrakurikuler" ON public.ekstrakurikuler FOR ALL TO authenticated USING (has_role(auth.uid(), 'Admin') OR has_role(auth.uid(), 'Koordinator'));

-- 10. Nilai Ekstrakurikuler per siswa
CREATE TABLE public.nilai_ekskul (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_santri UUID NOT NULL REFERENCES public.santri(id) ON DELETE CASCADE,
  id_ekskul UUID NOT NULL REFERENCES public.ekstrakurikuler(id) ON DELETE CASCADE,
  id_tahun_ajaran UUID REFERENCES public.tahun_ajaran(id),
  rekap_kehadiran INTEGER DEFAULT 0,
  konversi_nilai NUMERIC(5,2) DEFAULT 0,
  nilai_praktik NUMERIC(5,2) DEFAULT 0,
  hasil_akhir NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(id_santri, id_ekskul, id_tahun_ajaran)
);
ALTER TABLE public.nilai_ekskul ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view nilai_ekskul" ON public.nilai_ekskul FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Guru can manage nilai_ekskul" ON public.nilai_ekskul FOR ALL TO authenticated USING (has_role(auth.uid(), 'Admin') OR has_role(auth.uid(), 'Koordinator') OR has_role(auth.uid(), 'Asatidz'));

-- 11. Profil Pelajar Pancasila (P5)
CREATE TABLE public.profil_p5 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_santri UUID NOT NULL REFERENCES public.santri(id) ON DELETE CASCADE,
  id_tahun_ajaran UUID REFERENCES public.tahun_ajaran(id),
  dimensi TEXT NOT NULL, -- 'Beriman', 'Bergotong Royong', 'Mandiri', 'Bernalar Kritis', 'Kreatif'
  elemen TEXT NOT NULL,
  deskripsi_elemen TEXT,
  nilai predikat_p5 DEFAULT 'BSH',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(id_santri, id_tahun_ajaran, dimensi, elemen)
);
ALTER TABLE public.profil_p5 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view profil_p5" ON public.profil_p5 FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Guru can manage profil_p5" ON public.profil_p5 FOR ALL TO authenticated USING (has_role(auth.uid(), 'Admin') OR has_role(auth.uid(), 'Koordinator') OR has_role(auth.uid(), 'Asatidz'));

-- 12. Capaian Kompetensi (deskripsi rapor per mapel per siswa)
CREATE TABLE public.capaian_kompetensi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_santri UUID NOT NULL REFERENCES public.santri(id) ON DELETE CASCADE,
  id_mapel UUID NOT NULL REFERENCES public.mata_pelajaran(id) ON DELETE CASCADE,
  id_tahun_ajaran UUID REFERENCES public.tahun_ajaran(id),
  nilai_akhir NUMERIC(6,2),
  predikat TEXT, -- A, B, C, D
  deskripsi TEXT, -- "Ananda baik dalam menguasai materi..."
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(id_santri, id_mapel, id_tahun_ajaran)
);
ALTER TABLE public.capaian_kompetensi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view capaian_kompetensi" ON public.capaian_kompetensi FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Guru can manage capaian_kompetensi" ON public.capaian_kompetensi FOR ALL TO authenticated USING (has_role(auth.uid(), 'Admin') OR has_role(auth.uid(), 'Koordinator') OR has_role(auth.uid(), 'Asatidz'));

-- Add NISN column to santri table if not exists
ALTER TABLE public.santri ADD COLUMN IF NOT EXISTS nisn TEXT;

-- Add jenjang column to kelas table
ALTER TABLE public.kelas ADD COLUMN IF NOT EXISTS jenjang jenjang_sekolah DEFAULT 'SMP';

-- Trigger for updated_at
CREATE TRIGGER update_tahun_ajaran_updated_at BEFORE UPDATE ON public.tahun_ajaran FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mata_pelajaran_updated_at BEFORE UPDATE ON public.mata_pelajaran FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nilai_akademik_updated_at BEFORE UPDATE ON public.nilai_akademik FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_capaian_kompetensi_updated_at BEFORE UPDATE ON public.capaian_kompetensi FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
