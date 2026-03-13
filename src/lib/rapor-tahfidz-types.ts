// Types for Rapor Tahfidz

export interface RaporIdentitas {
  nama: string;
  nis: string;
  nisn: string;
  kelas: string;
  semester: "Ganjil" | "Genap";
  tahunAjaran: string;
}

export interface CatatanHafalanBulanan {
  bulan: string;
  suratAyatAwal: string;
  suratAyatAkhir: string;
  pencapaianBaris: number;
  jumlahAkumulasi: number;
  keterangan: string;
}

export interface PenilaianAdab {
  nilai: number;
  predikat: string;
}

export interface PenilaianTarget {
  targetSemester: string;
  pencapaian: string;
  keterangan: string;
}

export interface PenilaianMurajaah {
  nilai: number;
  predikat: string;
  juzSuratAyat: string;
}

export interface UjianKenaikanJilid {
  tanggal: string;
  jilidTingkat: string;
  fashohah: number | null;
  tajwid: number | null;
  kelancaran: number | null;
  rataRata: number | null;
}

export interface UjianAkhir {
  tilawah: {
    materi: string;
    nilai: number;
    predikat: string;
  };
  tahfidz: {
    materi: string;
    nilai: number;
    predikat: string;
  };
  keterangan: string;
}

export interface PrestasiPesertaDidik {
  no: number;
  prestasi: string;
  nilai: number | null;
  predikat: string;
}

export interface RaporTahfidz {
  identitas: RaporIdentitas;
  capaianHafalanBaru: CatatanHafalanBulanan[];
  penilaianAdab: PenilaianAdab;
  penilaianTarget: PenilaianTarget;
  penilaianMurajaah: PenilaianMurajaah;
  ujianKenaikanJilid: UjianKenaikanJilid[];
  ujianAkhir: UjianAkhir;
  prestasi: PrestasiPesertaDidik[];
  tanggalCetak: string;
  waliKelas: string;
  kepalaSekolah: string;
}

// Helper untuk menghitung predikat dari nilai
export const getPredikat = (nilai: number): string => {
  if (nilai >= 93) return "Mumtaz Murtafi'";
  if (nilai >= 86) return "Mumtaz";
  if (nilai >= 78) return "Jayyid Jiddan";
  if (nilai >= 70) return "Jayyid";
  return "Maqbul";
};

// Target per kelas per semester
export const TARGET_SEMESTER: Record<string, Record<string, string>> = {
  "7": { Ganjil: "1 juz", Genap: "1 juz" },
  "8": { Ganjil: "1 juz", Genap: "1 juz" },
  "9": { Ganjil: "1 juz", Genap: "1 juz" },
  "1": { Ganjil: "Juz 30", Genap: "Review Juz 30" },
  "2": { Ganjil: "Juz 29", Genap: "Review Juz 29" },
  "3": { Ganjil: "Juz 28", Genap: "Review Juz 28" },
  "4": { Ganjil: "Juz 27", Genap: "Review Juz 27" },
  "5": { Ganjil: "Juz 25-26", Genap: "Review Juz 25-26" },
  "6": { Ganjil: "Surat Pilihan", Genap: "Review Surat Pilihan" },
};

// Bulan semester
export const BULAN_SEMESTER: Record<string, string[]> = {
  Ganjil: ["Juli", "Agustus", "September", "Oktober", "November", "Desember"],
  Genap: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
};

// Mock data untuk demo
export const getMockRaporData = (santri: {
    id: string;
  nama: string;
  nis?: string;
  kelas?: string;
}): RaporTahfidz => ({
  identitas: {
    nama: santri.nama,
    nis: santri.nis || santri.id,
    nisn: "1020267157",
    kelas: santri.kelas || "-",
    semester: "Ganjil",
    tahunAjaran: "2025/2026",
  },
  capaianHafalanBaru: [
    {
      bulan: "Juli",
      suratAyatAwal: "An Nisa : 114",
      suratAyatAkhir: "An Nisa : 147",
      pencapaianBaris: 60,
      jumlahAkumulasi: 60,
      keterangan: "Ananda telah menghafal surat An Nisa : 114 - An Nisa : 147, dengan total baris yang dihafal di bulan ini adalah 60 baris",
    },
    {
      bulan: "Agustus",
      suratAyatAwal: "An Nisa : 147",
      suratAyatAkhir: "An Nisa : 170",
      pencapaianBaris: 46,
      jumlahAkumulasi: 106,
      keterangan: "Ananda telah menghafal surat An Nisa : 147 - An Nisa : 170, dengan total baris yang dihafal di bulan ini adalah 46 baris. Dan total akumulasi dengan hafalan sebelumnya adalah 106 baris",
    },
    {
      bulan: "September",
      suratAyatAwal: "An Nisa : 171",
      suratAyatAkhir: "Al Maidah : 15",
      pencapaianBaris: 65,
      jumlahAkumulasi: 171,
      keterangan: "Ananda telah menghafal surat An Nisa : 171 - Al Maidah : 15, dengan total baris yang dihafal di bulan ini adalah 65 baris. Dan total akumulasi dengan hafalan sebelumnya adalah 171 baris",
    },
    {
      bulan: "Oktober",
      suratAyatAwal: "Al Maidah : 16",
      suratAyatAkhir: "Al Maidah : 50",
      pencapaianBaris: 98,
      jumlahAkumulasi: 269,
      keterangan: "Ananda telah menghafal surat Al Maidah : 16 - Al Maidah : 50, dengan total baris yang dihafal di bulan ini adalah 98 baris. Dan total akumulasi dengan hafalan sebelumnya adalah 269 baris",
    },
    {
      bulan: "November",
      suratAyatAwal: "Al Maidah : 51",
      suratAyatAkhir: "Al Maidah : 64",
      pencapaianBaris: 30,
      jumlahAkumulasi: 299,
      keterangan: "Ananda telah menghafal surat Al Maidah : 51 - Al Maidah : 64, dengan total baris yang dihafal di bulan ini adalah 30 baris. Dan total akumulasi dengan hafalan sebelumnya adalah 299 baris",
    },
  ],
  penilaianAdab: {
    nilai: 88,
    predikat: "Mumtaz",
  },
  penilaianTarget: {
    targetSemester: "1 Juz",
    pencapaian: "Al Maidah : 64",
    keterangan: "Belum Mencapai Target",
  },
  penilaianMurajaah: {
    nilai: 85,
    predikat: "Jayyid Jiddan",
    juzSuratAyat: "Juz 26-30, Juz 1-5, Juz 6 hal 1-17",
  },
  ujianKenaikanJilid: [],
  ujianAkhir: {
    tilawah: {
      materi: "An Nahl : 34",
      nilai: 85,
      predikat: "Jayyid Jiddan",
    },
    tahfidz: {
      materi: "Juz 4 hal 18 - 20, juz 5, juz 6 hal 1-17",
      nilai: 81,
      predikat: "Jayyid Jiddan",
    },
    keterangan: "Ananda baik dalam membaca jilid Tilawah / Al Qur'an dan baik dalam kelancaran hafalan",
  },
  prestasi: [
    {
      no: 1,
      prestasi: "Tasmi' Juzziyah - 1 juz (Juz 5)",
      nilai: 75,
      predikat: "Jayyid",
    },
  ],
  tanggalCetak: "20 Desember 2025",
  waliKelas: "Qurrotu Aini, S.Si., MT.",
  kepalaSekolah: "Nanang Kosim, S.Si.",
});
