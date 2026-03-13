 // Data struktur metode Tilawati
 // Total 6 jilid utama, masing-masing 44 halaman = 264 halaman total
 import { MOCK_SANTRI, getKelasNama, getHalaqohNama } from "@/lib/mock-data";
 
 export interface TilawatiJilid {
   jilid: number;
   nama: string;
   totalHalaman: number;
   halamanMulai: number;
   halamanAkhir: number;
   targetPencapaian: TargetPencapaian[];
   aspekPenilaian: AspekPenilaian;
 }
 
 export interface TargetPencapaian {
   halaman: string;
   materi: string;
 }
 
 export interface AspekPenilaian {
   tartil: boolean;
   fashohah: boolean;
   tajwidDasar: boolean;
   ghorib: boolean;
 }
 
 export interface KriteriaPenilaian {
   id: string;
   aspek: string;
   subAspek: string[];
   skorMaksimal: number;
 }
 
 export interface SetoranTilawah {
   id: string;
   idSantri: string;
   tanggal: string;
   jilid: number;
   halamanDari: number;
   halamanSampai: number;
   nilaiTartil?: number;
   nilaiFashohah?: number;
   nilaiTajwid?: number;
   nilaiGhorib?: number;
   nilaiRataRata?: number;
   catatan?: string;
   status: 'selesai' | 'lanjut' | 'ulang';
 }
 
 export interface UjianKenaikanJilid {
   id: string;
   idSantri: string;
   tanggal: string;
   jilidDari: number;
   jilidTujuan: number;
   nilaiTartil: NilaiTartil;
   nilaiFashohah: NilaiFashohah;
   nilaiTajwidDasar?: NilaiTajwidDasar;
   nilaiGhorib?: NilaiGhorib;
   totalNilai: number;
   status: 'lulus' | 'tidak_lulus';
   penguji: string;
   durasi: number; // dalam menit
 }
 
 export interface NilaiTartil {
   kesempurnaanTajwid: number;
   kesempurnaanKalimat: number;
   kelancaran: number;
   nafas: number;
   waqaf: number;
   total: number;
 }
 
 export interface NilaiFashohah {
   makhorijulHuruf: number;
   shifatulHuruf: number;
   harakatTidakImalah: number;
   suaraJelas: number;
   total: number;
 }
 
 export interface NilaiTajwidDasar {
   pahamHukum: number;
   mampuMenguraikan: number;
   total: number;
 }
 
 export interface NilaiGhorib {
   membacaGhorib: number;
   komentarGhorib: number;
   total: number;
 }
 
 // Konstanta halaman per jilid
 export const HALAMAN_PER_JILID = 44;
 export const TOTAL_JILID = 6;
 export const TOTAL_HALAMAN = HALAMAN_PER_JILID * TOTAL_JILID; // 264
 
 // Data jilid Tilawati
 export const TILAWATI_JILID: TilawatiJilid[] = [
   {
     jilid: 1,
     nama: "Tilawati Jilid 1",
     totalHalaman: 44,
     halamanMulai: 1,
     halamanAkhir: 44,
     targetPencapaian: [
       { halaman: "1-32", materi: "Pengenalan huruf hijaiyah berharakat fathah tidak sambung" },
       { halaman: "33-44", materi: "Membaca huruf hijaiyah berharakat fathah sambung" },
       { halaman: "1-31", materi: "Huruf hijaiyah asli" },
       { halaman: "13-36", materi: "Angka arab" },
       { halaman: "1-31", materi: "Pengenalan makhorijul huruf dan shifatul huruf secara talaqqi dari hamzah sampai ya'" },
     ],
     aspekPenilaian: { tartil: true, fashohah: true, tajwidDasar: false, ghorib: false },
   },
   {
     jilid: 2,
     nama: "Tilawati Jilid 2",
     totalHalaman: 44,
     halamanMulai: 45,
     halamanAkhir: 88,
     targetPencapaian: [
       { halaman: "1-8", materi: "Kalimat berharokat fathah kasroh dhommah" },
       { halaman: "9-18", materi: "Kalimat berharakat fathahtain, kasrahtain, dhommahtain" },
       { halaman: "18-19", materi: "Pengenalan jenis-jenis ta'" },
       { halaman: "20-27", materi: "Pengenalan mad Thabi'i" },
       { halaman: "28-41", materi: "Fathah panjang, kasroh panjang, dhommah panjang" },
       { halaman: "42-44", materi: "Dhommah diikuti wawu sukun ada alifnya, alifnya tidak dibaca" },
       { halaman: "1-44", materi: "Ketepatan bacaan panjang pendek" },
       { halaman: "1-31", materi: "Pengenalan makhorijul huruf dan shifatul huruf secara talaqqi" },
     ],
     aspekPenilaian: { tartil: true, fashohah: true, tajwidDasar: false, ghorib: false },
   },
   {
     jilid: 3,
     nama: "Tilawati Jilid 3",
     totalHalaman: 44,
     halamanMulai: 89,
     halamanAkhir: 132,
     targetPencapaian: [
       { halaman: "1", materi: "Huruf lam sukun" },
       { halaman: "2-4", materi: "Cara membaca alif lam ta'rif qamariyah" },
       { halaman: "5-14", materi: "Mim, Sin-syin, ra', hamzah, ta', 'ain sukun" },
       { halaman: "15", materi: "Fathah diikuti wawu sukun" },
       { halaman: "16", materi: "Fathah diikuti ya' sukun" },
       { halaman: "25", materi: "Fa'-dzal-dho' sukun" },
       { halaman: "26-34", materi: "Tsa – ha – kho' sukun" },
       { halaman: "35-44", materi: "Ghoin - za' – shod – kaf – ha'- dhod sukun" },
     ],
     aspekPenilaian: { tartil: true, fashohah: true, tajwidDasar: false, ghorib: false },
   },
   {
     jilid: 4,
     nama: "Tilawati Jilid 4",
     totalHalaman: 44,
     halamanMulai: 133,
     halamanAkhir: 176,
     targetPencapaian: [
       { halaman: "1", materi: "Huruf bertasydid" },
       { halaman: "6", materi: "Bacaan mad wajib dan mad jaiz" },
       { halaman: "9", materi: "Bacaan ghunnah nun dan mim syiddah" },
       { halaman: "12", materi: "Cara waqaf mad aridh lissukun, ha' dhommir" },
       { halaman: "14", materi: "Lafdzu jalalah" },
       { halaman: "16", materi: "Lam ta'rif syamsiyyah" },
       { halaman: "19", materi: "Bacaan dengung ikhfa' haqiqi" },
       { halaman: "20", materi: "Huruf muqotto'ah" },
       { halaman: "33", materi: "Idhgam bighunnah" },
     ],
     aspekPenilaian: { tartil: true, fashohah: true, tajwidDasar: true, ghorib: false },
   },
   {
     jilid: 5,
     nama: "Tilawati Jilid 5",
     totalHalaman: 44,
     halamanMulai: 177,
     halamanAkhir: 220,
     targetPencapaian: [
       { halaman: "1", materi: "Idhgom bighunnah" },
       { halaman: "5", materi: "Qalqalah" },
       { halaman: "8", materi: "Iqlab" },
       { halaman: "11", materi: "Idhgam mitslain/mimi, ikhfa' syafawi" },
       { halaman: "18", materi: "Idhgam bilaghunnah" },
       { halaman: "19", materi: "Lam sukun bertemu ro'" },
       { halaman: "20", materi: "Idzhar halqi" },
       { halaman: "34", materi: "Huruf muqhotto'ah" },
       { halaman: "41", materi: "Mad lazim mutsaqqol kalimi dan mukhoffaf harfi" },
       { halaman: "42", materi: "Tanda waqaf dan rumus waqaf" },
     ],
     aspekPenilaian: { tartil: true, fashohah: true, tajwidDasar: true, ghorib: false },
   },
   {
     jilid: 6,
     nama: "Tilawati Jilid 6",
     totalHalaman: 44,
     halamanMulai: 221,
     halamanAkhir: 264,
     targetPencapaian: [
       { halaman: "1-44", materi: "Surat-surat pendek" },
       { halaman: "1-44", materi: "Ayat pilihan" },
       { halaman: "1-44", materi: "Gharibul qira'ah" },
       { halaman: "1-44", materi: "Ketepatan bacaan panjang pendek dan fashohah makhorijul huruf" },
     ],
     aspekPenilaian: { tartil: true, fashohah: true, tajwidDasar: true, ghorib: true },
   },
 ];
 
 // Level Al-Quran setelah lulus Jilid 6
 export const LEVEL_ALQURAN = {
   nama: "Al-Qur'an",
   deskripsi: "Tartil dalam membaca, waqof dan ibtida' dengan benar, Fasih dalam melafalkan semua huruf sesuai dengan makhroj dan sifat, Faham teori ilmu tajwid dan gharib",
   mulaiDari: "Surat Al-Fatihah",
   aspekPenilaian: { tartil: true, fashohah: true, tajwidDasar: true, ghorib: true },
 };
 
// Kriteria penilaian ujian kenaikan jilid (Skor Maksimal per aspek: 10, Total: 40)
export const KRITERIA_PENILAIAN: KriteriaPenilaian[] = [
  {
    id: "tartil",
    aspek: "Tartil",
    subAspek: [
      "Kesempurnaan Tajwid",
      "Kesempurnaan Kalimat",
      "Kelancaran",
      "Nafas",
      "Waqaf",
    ],
    skorMaksimal: 10,
  },
  {
    id: "fashohah",
    aspek: "Fashohah",
    subAspek: [
      "Kesempurnaan makhorijul huruf",
      "Kesempurnaan Shifatul huruf",
      "Kesempurnaan Harakat tidak imalah",
      "Suara yang jelas",
    ],
    skorMaksimal: 10,
  },
  {
    id: "tajwid_dasar",
    aspek: "Tajwid Dasar",
    subAspek: [
      "Paham menguraikan hukum tajwid",
      "Mampu menguraikan hukum tajwid",
    ],
    skorMaksimal: 10,
  },
  {
    id: "ghorib",
    aspek: "Ghoribul Qur'an",
    subAspek: [
      "Membaca Ghorib",
      "Komentar Ghorib",
    ],
    skorMaksimal: 10,
  },
];

// Skor maksimal per sub-aspek
export const SKOR_SUB_ASPEK = {
  // Tartil (Total: 10)
  tartil: {
    kesempurnaanTajwid: 2,
    kesempurnaanKalimat: 2,
    kelancaran: 4,
    nafas: 1,
    waqaf: 1,
  },
  // Fashohah (Total: 10)
  fashohah: {
    makhorijulHuruf: 4,
    shifatulHuruf: 3,
    harakatTidakImalah: 2,
    suaraJelas: 1,
  },
  // Tajwid Dasar (Total: 10)
  tajwidDasar: {
    pahamHukum: 5,
    mampuMenguraikan: 5,
  },
  // Ghoribul Qur'an (Total: 10)
  ghorib: {
    membacaGhorib: 6,
    komentarGhorib: 4,
  },
};

// Skor total maksimal
export const SKOR_TOTAL_MAKSIMAL = 40;

// Kriteria kelulusan per jilid
export const KRITERIA_KELULUSAN: Record<number, string[]> = {
  1: ["fashohah", "tartil"], // Jilid 1-3: Fashohah & Tartil
  2: ["fashohah", "tartil"],
  3: ["fashohah", "tartil"],
  4: ["tartil", "fashohah", "tajwid_dasar"], // Jilid 4-5: Tartil, Fashohah & Tajwid Dasar
  5: ["tartil", "fashohah", "tajwid_dasar"],
  6: ["tartil", "fashohah", "tajwid_dasar", "ghorib"], // Jilid 6: Lengkap
};

// Durasi ujian standar (menit)
export const DURASI_UJIAN = 5;

// Nilai minimum untuk lulus (persentase dari skor maksimal yang berlaku)
export const NILAI_MINIMUM_LULUS = 70; // 70% dari skor maksimal

// Hitung skor maksimal berdasarkan jilid
export const getSkorMaksimalByJilid = (jilid: number): number => {
  const kriteria = KRITERIA_KELULUSAN[jilid] || ["tartil", "fashohah", "tajwid_dasar", "ghorib"];
  return kriteria.length * 10; // Setiap aspek maks 10
};

// Hitung nilai minimum lulus berdasarkan jilid
export const getNilaiMinimumLulusByJilid = (jilid: number): number => {
  const skorMaksimal = getSkorMaksimalByJilid(jilid);
  return Math.round((NILAI_MINIMUM_LULUS / 100) * skorMaksimal);
};
 
 // Helper functions
 export const getJilidByHalaman = (halamanTotal: number): number => {
   return Math.min(Math.ceil(halamanTotal / HALAMAN_PER_JILID), TOTAL_JILID);
 };
 
 export const getProgressJilid = (halamanSelesai: number, jilid: number): number => {
   const jilidData = TILAWATI_JILID.find(j => j.jilid === jilid);
   if (!jilidData) return 0;
   
   const halamanDalamJilid = halamanSelesai - jilidData.halamanMulai + 1;
   return Math.min(Math.max((halamanDalamJilid / jilidData.totalHalaman) * 100, 0), 100);
 };
 
 export const getAspekPenilaianByJilid = (jilid: number): string[] => {
   const kriteria = KRITERIA_KELULUSAN[jilid];
   if (!kriteria) return ["tartil", "fashohah", "tajwid_dasar", "ghorib"];
   return kriteria;
 };
 
 export const hitungNilaiRataRata = (
   nilaiTartil: number,
   nilaiFashohah: number,
   nilaiTajwid?: number,
   nilaiGhorib?: number,
   jilid?: number
 ): number => {
   const aspek = jilid ? getAspekPenilaianByJilid(jilid) : ["tartil", "fashohah", "tajwid_dasar", "ghorib"];
   let total = 0;
   let count = 0;
 
   if (aspek.includes("tartil")) { total += nilaiTartil; count++; }
   if (aspek.includes("fashohah")) { total += nilaiFashohah; count++; }
   if (aspek.includes("tajwid_dasar") && nilaiTajwid !== undefined) { total += nilaiTajwid; count++; }
   if (aspek.includes("ghorib") && nilaiGhorib !== undefined) { total += nilaiGhorib; count++; }
 
   return count > 0 ? Math.round(total / count) : 0;
 };
 
 // Mock data for dashboard - references MOCK_SANTRI from mock-data.ts

 export const MOCK_SETORAN_TILAWAH: SetoranTilawah[] = [
   {
     id: "1",
     idSantri: "s1",
     tanggal: new Date().toISOString().split('T')[0],
     jilid: 4,
     halamanDari: 26,
     halamanSampai: 28,
     nilaiTartil: 85,
     nilaiFashohah: 80,
     nilaiTajwid: 78,
     nilaiRataRata: 81,
     status: 'selesai',
   },
   {
     id: "2",
     idSantri: "s2",
     tanggal: new Date().toISOString().split('T')[0],
     jilid: 3,
     halamanDari: 20,
     halamanSampai: 22,
     nilaiTartil: 78,
     nilaiFashohah: 82,
     nilaiRataRata: 80,
     status: 'lanjut',
   },
   {
     id: "3",
     idSantri: "s3",
     tanggal: new Date().toISOString().split('T')[0],
     jilid: 5,
     halamanDari: 10,
     halamanSampai: 12,
     nilaiTartil: 90,
     nilaiFashohah: 88,
     nilaiTajwid: 85,
     nilaiRataRata: 88,
     status: 'selesai',
   },
   {
     id: "4",
     idSantri: "s4",
     tanggal: new Date().toISOString().split('T')[0],
     jilid: 4,
     halamanDari: 33,
     halamanSampai: 35,
     nilaiTartil: 75,
     nilaiFashohah: 78,
     nilaiTajwid: 72,
     nilaiRataRata: 75,
     status: 'lanjut',
   },
   {
     id: "5",
     idSantri: "s7",
     tanggal: new Date().toISOString().split('T')[0],
     jilid: 2,
     halamanDari: 36,
     halamanSampai: 38,
     nilaiTartil: 82,
     nilaiFashohah: 85,
     nilaiRataRata: 84,
     status: 'selesai',
   },
 ];
 
 // Santri tilawah view derived from centralized data
 export const MOCK_SANTRI_TILAWAH = MOCK_SANTRI.map(s => ({
   id: s.id,
   nama: s.nama,
   kelas: getKelasNama(s.idKelas),
   halaqoh: getHalaqohNama(s.idHalaqoh),
   jilidSaatIni: s.jilidSaatIni,
   halamanSaatIni: s.halamanSaatIni,
 }));
 
 // Statistik dashboard
 export const getDashboardStats = () => {
   const setoranHariIni = MOCK_SETORAN_TILAWAH.filter(
     s => s.tanggal === new Date().toISOString().split('T')[0]
   );
   
   const totalHalamanHariIni = setoranHariIni.reduce(
     (acc, s) => acc + (s.halamanSampai - s.halamanDari + 1), 0
   );
   
   const rataRataHalaman = setoranHariIni.length > 0 
     ? (totalHalamanHariIni / setoranHariIni.length).toFixed(1) 
     : "0";
   
   const totalSantri = MOCK_SANTRI_TILAWAH.length;
   const santriSetor = new Set(setoranHariIni.map(s => s.idSantri)).size;
   const persentaseSetoran = totalSantri > 0 
     ? Math.round((santriSetor / totalSantri) * 100) 
     : 0;
 
   return {
     totalSantri,
     totalSetoranHariIni: setoranHariIni.length,
     rataRataHalaman,
     persentaseSetoran,
   };
 };