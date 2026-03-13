// Centralized mock data - sinkronisasi data santri, ustadz, kelas, halaqoh, dan users

// ============ KELAS ============
export interface MockKelas {
  id: string;
  nama_kelas: string;
  deskripsi: string;
}

export const MOCK_KELAS: MockKelas[] = [
  { id: "ka", nama_kelas: "KBTK A", deskripsi: "Kelompok Bermain TK A" },
  { id: "kb", nama_kelas: "KBTK B", deskripsi: "Kelompok Bermain TK B" },
  { id: "k1", nama_kelas: "Paket A Kelas 1", deskripsi: "Paket A setara SD Kelas 1" },
  { id: "k2", nama_kelas: "Paket A Kelas 2", deskripsi: "Paket A setara SD Kelas 2" },
  { id: "k3", nama_kelas: "Paket A Kelas 3", deskripsi: "Paket A setara SD Kelas 3" },
  { id: "k4", nama_kelas: "Paket A Kelas 4", deskripsi: "Paket A setara SD Kelas 4" },
  { id: "k5", nama_kelas: "Paket A Kelas 5", deskripsi: "Paket A setara SD Kelas 5" },
  { id: "k6", nama_kelas: "Paket A Kelas 6", deskripsi: "Paket A setara SD Kelas 6" },
  { id: "k7", nama_kelas: "Paket B Kelas 7", deskripsi: "Paket B setara SMP Kelas 7" },
  { id: "k8", nama_kelas: "Paket B Kelas 8", deskripsi: "Paket B setara SMP Kelas 8" },
  { id: "k9", nama_kelas: "Paket B Kelas 9", deskripsi: "Paket B setara SMP Kelas 9" },
];

// ============ USTADZ ============
export interface MockUstadz {
  id: string;
  nama: string;
  email: string;
  phone: string;
  status: string;
}

export const MOCK_USTADZ: MockUstadz[] = [
  { id: "u1", nama: "Ustadz Ahmad Fauzi, S.Pd.I", email: "ahmad@imis.sch.id", phone: "081234567891", status: "Aktif" },
  { id: "u2", nama: "Ustadz Budi Santoso, Lc.", email: "budi@imis.sch.id", phone: "081234567892", status: "Aktif" },
  { id: "u3", nama: "Ustadz Muhammad Yusuf, S.Ag", email: "yusuf@imis.sch.id", phone: "081234567893", status: "Aktif" },
  { id: "u4", nama: "Ustadzah Siti Aminah, S.Pd", email: "aminah@imis.sch.id", phone: "081234567894", status: "Aktif" },
  { id: "u5", nama: "Ustadz Hasan Basri, S.Pd.I", email: "hasan@imis.sch.id", phone: "081234567895", status: "Aktif" },
];

// ============ HALAQOH ============
export interface MockHalaqoh {
  id: string;
  nama: string;
  idUstadz: string;
  tingkat: string;
  jumlahSantri: number;
}

export const MOCK_HALAQOH: MockHalaqoh[] = [
  { id: "h1", nama: "Halaqoh Al-Fatih", idUstadz: "u1", tingkat: "Pemula", jumlahSantri: 7 },
  { id: "h2", nama: "Halaqoh An-Nur", idUstadz: "u2", tingkat: "Menengah", jumlahSantri: 7 },
  { id: "h3", nama: "Halaqoh Al-Furqon", idUstadz: "u3", tingkat: "Lanjutan", jumlahSantri: 6 },
  { id: "h4", nama: "Halaqoh Al-Hidayah", idUstadz: "u4", tingkat: "Pemula", jumlahSantri: 4 },
  { id: "h5", nama: "Halaqoh As-Salam", idUstadz: "u5", tingkat: "Menengah", jumlahSantri: 6 },
];

// ============ SANTRI ============
export interface MockSantri {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  idKelas: string;
  idHalaqoh: string;
  tanggalMasuk: string;
  status: string;
  // Tilawah
  jilidSaatIni: number;
  halamanSaatIni: number;
  // Hafalan
  posisiHafalanJuz: number;
  posisiHafalanSurah: string;
  pencapaianHafalan: string; // e.g. "1 Juz" or "2.5 Juz"
}

export const MOCK_SANTRI: MockSantri[] = [
  // KBTK A - Jilid 1-2
  { id: "s16", nis: "016", nisn: "0120001001", nama: "Aisyah Putri", idKelas: "ka", idHalaqoh: "h5", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 1, halamanSaatIni: 12, posisiHafalanJuz: 30, posisiHafalanSurah: "An-Nas", pencapaianHafalan: "Juz 30 (1 surat)" },
  { id: "s17", nis: "017", nisn: "0120001002", nama: "Ahmad Faris", idKelas: "ka", idHalaqoh: "h5", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 1, halamanSaatIni: 8, posisiHafalanJuz: 30, posisiHafalanSurah: "Al-Falaq", pencapaianHafalan: "Juz 30 (2 surat)" },
  
  // KBTK B - Jilid 1-2
  { id: "s18", nis: "018", nisn: "0120001003", nama: "Hafidz Ramadhan", idKelas: "kb", idHalaqoh: "h5", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 2, halamanSaatIni: 5, posisiHafalanJuz: 30, posisiHafalanSurah: "Al-Ikhlas", pencapaianHafalan: "Juz 30 (3 surat)" },
  { id: "s19", nis: "019", nisn: "0120001004", nama: "Zahra Amelia", idKelas: "kb", idHalaqoh: "h5", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 2, halamanSaatIni: 15, posisiHafalanJuz: 30, posisiHafalanSurah: "Al-Lahab", pencapaianHafalan: "Juz 30 (4 surat)" },
  
  // Kelas 1 Paket A - Jilid 2-3, target Juz 30
  { id: "s20", nis: "020", nisn: "0120001005", nama: "Muhammad Haikal", idKelas: "k1", idHalaqoh: "h1", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 2, halamanSaatIni: 28, posisiHafalanJuz: 30, posisiHafalanSurah: "An-Naba", pencapaianHafalan: "1 Juz" },
  { id: "s21", nis: "021", nisn: "0120001006", nama: "Khadijah Nur", idKelas: "k1", idHalaqoh: "h1", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 3, halamanSaatIni: 10, posisiHafalanJuz: 30, posisiHafalanSurah: "Al-Muthaffifin", pencapaianHafalan: "1 Juz" },
  { id: "s22", nis: "022", nisn: "0120001007", nama: "Yusuf Abdillah", idKelas: "k1", idHalaqoh: "h1", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 2, halamanSaatIni: 35, posisiHafalanJuz: 30, posisiHafalanSurah: "At-Takwir", pencapaianHafalan: "0.5 Juz" },
  
  // Kelas 2 Paket A - Jilid 3-4, target Juz 29
  { id: "s23", nis: "023", nisn: "0120001008", nama: "Fatimah Az-Zahra", idKelas: "k2", idHalaqoh: "h2", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 3, halamanSaatIni: 22, posisiHafalanJuz: 29, posisiHafalanSurah: "Al-Mulk", pencapaianHafalan: "2 Juz" },
  { id: "s24", nis: "024", nisn: "0120001009", nama: "Abdullah Fauzan", idKelas: "k2", idHalaqoh: "h2", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 4, halamanSaatIni: 8, posisiHafalanJuz: 29, posisiHafalanSurah: "Al-Mulk", pencapaianHafalan: "2 Juz" },
  { id: "s13", nis: "013", nisn: "0112960174", nama: "Fatimah Zahra", idKelas: "k3", idHalaqoh: "h5", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 3, halamanSaatIni: 20, posisiHafalanJuz: 28, posisiHafalanSurah: "Al-Mujadilah", pencapaianHafalan: "3 Juz" },
  
  // Kelas 3 Paket A - Jilid 4-5, target Juz 28
  { id: "s15", nis: "015", nisn: "0111138392", nama: "Muhammad Rizki", idKelas: "k3", idHalaqoh: "h1", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 4, halamanSaatIni: 35, posisiHafalanJuz: 28, posisiHafalanSurah: "Al-Mujadilah", pencapaianHafalan: "3 Juz" },
  { id: "s25", nis: "025", nisn: "0120001010", nama: "Hafshah Salsabila", idKelas: "k3", idHalaqoh: "h1", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 4, halamanSaatIni: 28, posisiHafalanJuz: 28, posisiHafalanSurah: "Ar-Rahman", pencapaianHafalan: "3 Juz" },
  
  // Kelas 4 Paket A - Jilid 5-6 / Al-Qur'an, target Juz 27
  { id: "s14", nis: "014", nisn: "0112049283", nama: "Ali Akbar", idKelas: "k4", idHalaqoh: "h5", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 5, halamanSaatIni: 8, posisiHafalanJuz: 27, posisiHafalanSurah: "Adz-Dzariyat", pencapaianHafalan: "4 Juz" },
  { id: "s26", nis: "026", nisn: "0120001011", nama: "Bilal Ahmad", idKelas: "k4", idHalaqoh: "h2", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 6, halamanSaatIni: 15, posisiHafalanJuz: 27, posisiHafalanSurah: "Qaf", pencapaianHafalan: "4 Juz" },
  
  // Kelas 5 Paket A - Al-Qur'an, target Juz 25-26
  { id: "s7", nis: "007", nisn: "0118374625", nama: "Muhammad Zidan Ar Rasyid", idKelas: "k5", idHalaqoh: "h2", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 38, posisiHafalanJuz: 26, posisiHafalanSurah: "Al-Ahqaf", pencapaianHafalan: "5 Juz" },
  { id: "s8", nis: "008", nisn: "0117463528", nama: "Hamzah Abdurrohman", idKelas: "k5", idHalaqoh: "h1", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 15, posisiHafalanJuz: 25, posisiHafalanSurah: "Fushshilat", pencapaianHafalan: "6 Juz" },
  { id: "s27", nis: "027", nisn: "0120001012", nama: "Aminah Safira", idKelas: "k5", idHalaqoh: "h3", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 25, posisiHafalanJuz: 26, posisiHafalanSurah: "Al-Jatsiyah", pencapaianHafalan: "5 Juz" },
  
  // Kelas 6 Paket A - Al-Qur'an, target surat pilihan
  { id: "s6", nis: "006", nisn: "0119283745", nama: "Khadijah Alesha W.", idKelas: "k6", idHalaqoh: "h1", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 17, posisiHafalanJuz: 24, posisiHafalanSurah: "Az-Zumar", pencapaianHafalan: "7 Juz" },
  { id: "s9", nis: "009", nisn: "0116584739", nama: "Fahimah Nadeen D.", idKelas: "k6", idHalaqoh: "h2", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 33, posisiHafalanJuz: 23, posisiHafalanSurah: "Yasin", pencapaianHafalan: "8 Juz" },
  
  // Kelas 7 Paket B - Al-Qur'an
  { id: "s12", nis: "112", nisn: "0113871065", nama: "Aisyah Mentari Azzahra", idKelas: "k7", idHalaqoh: "h4", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 10, posisiHafalanJuz: 22, posisiHafalanSurah: "Al-Ahzab", pencapaianHafalan: "9 Juz" },
  { id: "s28", nis: "028", nisn: "0120001013", nama: "Hasan Abdurrahman", idKelas: "k7", idHalaqoh: "h4", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 40, posisiHafalanJuz: 21, posisiHafalanSurah: "Al-Ankabut", pencapaianHafalan: "10 Juz" },
  
  // Kelas 8 Paket B - Al-Qur'an
  { id: "s1", nis: "161", nisn: "0113806416", nama: "Qurrata 'Ayun", idKelas: "k8", idHalaqoh: "h2", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 28, posisiHafalanJuz: 20, posisiHafalanSurah: "An-Naml", pencapaianHafalan: "11 Juz" },
  { id: "s2", nis: "124", nisn: "0137489265", nama: "Azzahra Zainab", idKelas: "k8", idHalaqoh: "h2", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 22, posisiHafalanJuz: 19, posisiHafalanSurah: "Al-Furqan", pencapaianHafalan: "12 Juz" },
  { id: "s3", nis: "128", nisn: "0116049771", nama: "Fayyadah Fayola", idKelas: "k8", idHalaqoh: "h3", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 12, posisiHafalanJuz: 18, posisiHafalanSurah: "Al-Mu'minun", pencapaianHafalan: "13 Juz" },
  { id: "s4", nis: "101", nisn: "2115038077", nama: "Dzaki Ash Shiddiq", idKelas: "k8", idHalaqoh: "h1", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 35, posisiHafalanJuz: 17, posisiHafalanSurah: "Al-Anbiya", pencapaianHafalan: "14 Juz" },
  { id: "s5", nis: "130", nisn: "0108552956", nama: "Salwah Lathifah Wasiso", idKelas: "k8", idHalaqoh: "h3", tanggalMasuk: "2024-07-15", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 40, posisiHafalanJuz: 16, posisiHafalanSurah: "Maryam", pencapaianHafalan: "15 Juz" },
  
  // Kelas 9 Paket B - Al-Qur'an (hafalan paling banyak)
  { id: "s10", nis: "110", nisn: "0115693847", nama: "Mazzayanun Nisa Z.A.M.", idKelas: "k9", idHalaqoh: "h3", tanggalMasuk: "2024-01-10", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 30, posisiHafalanJuz: 10, posisiHafalanSurah: "Yunus", pencapaianHafalan: "21 Juz" },
  { id: "s11", nis: "111", nisn: "0114782956", nama: "Umar Abdurrohman", idKelas: "k9", idHalaqoh: "h4", tanggalMasuk: "2024-01-10", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 20, posisiHafalanJuz: 5, posisiHafalanSurah: "An-Nisa", pencapaianHafalan: "26 Juz" },
  { id: "s29", nis: "029", nisn: "0120001014", nama: "Ibrahim Hafidz", idKelas: "k9", idHalaqoh: "h3", tanggalMasuk: "2024-01-10", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 45, posisiHafalanJuz: 3, posisiHafalanSurah: "Al-Imran", pencapaianHafalan: "28 Juz" },
  { id: "s30", nis: "030", nisn: "0120001015", nama: "Maryam Hafizah", idKelas: "k9", idHalaqoh: "h4", tanggalMasuk: "2024-01-10", status: "Aktif", jilidSaatIni: 7, halamanSaatIni: 50, posisiHafalanJuz: 1, posisiHafalanSurah: "Al-Baqarah", pencapaianHafalan: "30 Juz" },
];

// ============ USERS (akun pengguna) ============
export interface MockUser {
  id: string;
  nama: string;
  username: string;
  role: "Admin" | "Koordinator" | "Asatidz" | "WaliSantri" | "Yayasan";
  email: string;
  phone: string;
  status: string;
}

export const MOCK_USERS: MockUser[] = [
  { id: "usr1", nama: "Admin Utama", username: "admin", role: "Admin", email: "admin@imis.sch.id", phone: "081200000001", status: "Aktif" },
  { id: "usr2", nama: "Koordinator Tahfidz", username: "koordinator", role: "Koordinator", email: "koordinator@imis.sch.id", phone: "081200000002", status: "Aktif" },
  { id: "usr3", nama: "Ketua Yayasan", username: "yayasan", role: "Yayasan", email: "yayasan@imis.sch.id", phone: "081200000003", status: "Aktif" },
  // Ustadz accounts
  { id: "usr4", nama: MOCK_USTADZ[0].nama, username: "ahmad.fauzi", role: "Asatidz", email: MOCK_USTADZ[0].email, phone: MOCK_USTADZ[0].phone, status: "Aktif" },
  { id: "usr5", nama: MOCK_USTADZ[1].nama, username: "budi.santoso", role: "Asatidz", email: MOCK_USTADZ[1].email, phone: MOCK_USTADZ[1].phone, status: "Aktif" },
  { id: "usr6", nama: MOCK_USTADZ[2].nama, username: "m.yusuf", role: "Asatidz", email: MOCK_USTADZ[2].email, phone: MOCK_USTADZ[2].phone, status: "Aktif" },
  { id: "usr7", nama: MOCK_USTADZ[3].nama, username: "siti.aminah", role: "Asatidz", email: MOCK_USTADZ[3].email, phone: MOCK_USTADZ[3].phone, status: "Aktif" },
  { id: "usr8", nama: MOCK_USTADZ[4].nama, username: "hasan.basri", role: "Asatidz", email: MOCK_USTADZ[4].email, phone: MOCK_USTADZ[4].phone, status: "Aktif" },
  // Akun WaliSantri menggunakan nama santri langsung (untuk semua santri)
  ...MOCK_SANTRI.map((s, i) => ({
    id: `usr${9 + i}`,
    nama: s.nama,
    username: s.nama.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12),
    role: "WaliSantri" as const,
    email: `${s.nama.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}@wali.imis.sch.id`,
    phone: `08131${String(i + 1).padStart(7, '0')}`,
    status: "Aktif",
  })),
];

// ============ HELPERS ============
export const getKelasById = (id: string) => MOCK_KELAS.find(k => k.id === id);
export const getKelasNama = (id: string) => getKelasById(id)?.nama_kelas || "-";
export const getUstadzById = (id: string) => MOCK_USTADZ.find(u => u.id === id);
export const getUstadzNama = (id: string) => getUstadzById(id)?.nama || "-";
export const getHalaqohById = (id: string) => MOCK_HALAQOH.find(h => h.id === id);
export const getHalaqohNama = (id: string) => getHalaqohById(id)?.nama || "-";

export const getSantriByHalaqoh = (halaqohId: string) =>
  MOCK_SANTRI.filter(s => s.idHalaqoh === halaqohId && s.status === "Aktif");

export const getUstadzHalaqoh = (ustadzId: string) =>
  MOCK_HALAQOH.filter(h => h.idUstadz === ustadzId);

export const getSantriByNama = (nama: string) =>
  MOCK_SANTRI.find(s => s.nama.toLowerCase() === nama.toLowerCase());
