// Types untuk Rapor Akademik IMIS

export interface RaporIdentitasAkademik {
  nama: string;
  noInduk: string;
  nisn: string;
  kelas: string;
  semester: string;
  tahunPelajaran: string;
}

export interface NilaiMapel {
  nama: string;
  nilai: number;
  deskripsi: string;
  subMapel?: NilaiMapel[];
}

export interface NilaiIbadah {
  nama: string;
  kkm: number;
  nilai: number;
  predikat: string;
  deskripsi: string;
}

export interface Pembiasaan {
  nama: string;
  nilai: string; // A, B, C, D
}

export interface PembiasaanData {
  sekolah: Pembiasaan[];
  rumah: Pembiasaan[];
}

export interface ProfilPelajarPancasila {
  dimensi: string;
  elemen: string;
  deskripsi: string;
  nilai: 'MB' | 'SB' | 'BSH' | 'SAB'; // Mulai Berkembang, Sudah Berkembang, Berkembang Sesuai Harapan, Sangat Berkembang
}

export interface PengembanganDiri {
  jenis: string;
  nilai: string;
  keterangan: string;
}

export interface Ketidakhadiran {
  ijin: number;
  sakit: number;
  tanpaKeterangan: number;
}

export interface RaporAkademik {
  identitas: RaporIdentitasAkademik;
  kompetensi: {
    paiDanBudiPekerti: NilaiMapel[];
    mapelUmum: NilaiMapel[];
    muatanLokal: NilaiMapel[];
    muatanPemberdayaan: NilaiMapel[];
    jumlah: number;
    rataRata: number;
  };
  keterampilanIbadah: NilaiIbadah[];
  pembiasaan: PembiasaanData;
  profilPelajarPancasila: ProfilPelajarPancasila[];
  pengembanganDiri: PengembanganDiri[];
  ketidakhadiran: Ketidakhadiran;
  waliKelas: string;
  kepalaSekolah: string;
  tanggalRapor: string;
  tempatRapor: string;
}

// Fungsi untuk mendapatkan predikat dari nilai
export function getPredikatNilai(nilai: number): { predikat: string; prefix: string } {
  if (nilai >= 90) return { predikat: 'A', prefix: 'sangat baik' };
  if (nilai >= 80) return { predikat: 'B', prefix: 'baik' };
  if (nilai >= 70) return { predikat: 'C', prefix: 'cukup baik' };
  return { predikat: 'D', prefix: 'perlu belajar lebih giat lagi' };
}

// Mock data santri untuk rapor akademik - derived from centralized data
import { MOCK_SANTRI, getKelasNama } from "@/lib/mock-data";

const statusNilaiOptions = ["Lengkap", "Sebagian", "Belum Ada"];
const statusRaporOptions = ["Sudah Generate", "Belum Generate"];

export const mockSantriAkademik = MOCK_SANTRI.map((s, i) => ({
  id: s.id,
  nis: s.nis,
  nisn: s.nisn,
  nama: s.nama,
  kelas: getKelasNama(s.idKelas),
  statusNilai: statusNilaiOptions[i % 3],
  statusRapor: statusRaporOptions[i % 2],
}));

// Mock data rapor akademik lengkap
export const mockRaporAkademik: RaporAkademik = {
  identitas: {
    nama: "Qurrata 'Ayun",
    noInduk: "261",
    nisn: "0113806416",
    kelas: "8 (Delapan)",
    semester: "I (Satu)",
    tahunPelajaran: "2025/2026"
  },
  kompetensi: {
    paiDanBudiPekerti: [
      { nama: "Tauhid", nilai: 94, deskripsi: "Ananda sangat baik menguasai materi iman kepada kitab Allah, keistimewaan Al Quran, penyimpangan kitab-kitab terdahulu dan manfaat beriman kepada kitab Allah, tobat dan tawakal, hasad, namimah dan ghibah" },
      { nama: "Al Quran dan Hadits", nilai: 80, deskripsi: "Ananda baik dalam menguasai materi surat Al Ikhlash, Al Lahab, An Nasr dan Al Kafirun, menyeru kepada kalimat tauhid, berbakti kepada kedua orang tua" },
      { nama: "Fiqih", nilai: 84, deskripsi: "Ananda baik dalam menguasai materi shalat sunah rawatib, dhuha, witir, Jumat, adab pada hari jumat, sholat Id, tahajjud dan sholat dalam berbagai keadaan" },
      { nama: "Sirah", nilai: 84, deskripsi: "Ananda baik dalam menguasai materi karakteristik Yahudi Madinah, perang Banu Nadhir, perang Banu Qainuqa', perang Banu Quraizhah, bai'atur Ridhwan, perjanjian Hudaibiyyah." },
      { nama: "Nahwu", nilai: 84, deskripsi: "Ananda baik dalam menguasai materi al-Kalam dan pembagiannya, Isim ditinjau dari bangunannya, Isim ditinjau dari jumlahnya, Isim ditinjau dari jenisnya, Isim ditinjau dari kejelasan maknanya, dhomir (kata ganti), isim isyaroh (kata tunjuk)" }
    ],
    mapelUmum: [
      { nama: "Pendidikan Pancasila & Kewarganegaraan", nilai: 85, deskripsi: "Ananda baik dalam menguasai materi pancasila dalam kehidupan bangsa, pedoman negaraku" },
      { nama: "Bahasa Indonesia", nilai: 88, deskripsi: "Ananda baik dalam menguasai materi mengenal teks laporan hasil observasi, topik dan gagasan utama, paragraf deskripsi dan observasi" },
      { nama: "Bahasa Inggris", nilai: 70, deskripsi: "Ananda cukup baik menguasai materi my life my adventure, kindness brings happiness, lovely Indonesia" },
      { nama: "Matematika", nilai: 75, deskripsi: "Ananda cukup baik menguasai materi bilangan berpangkat, teorema pythagoras, persamaan dan pertidaksamaan linear satu variabel" },
      { nama: "Ilmu Pengetahuan Alam", nilai: 87, deskripsi: "Ananda baik dalam menguasai materi sistem pernafasan, pencernaan, ekskresi manusia, peredaran darah manusia, energi dan daya" },
      { nama: "Ilmu Pengetahuan Sosial", nilai: 78, deskripsi: "Ananda cukup baik menguasai materi kondisi geografis dan pelestarian sumber daya alam, kemajemukan masyarkat indonesia" },
      { nama: "Pendidikan Jasmani Olahraga & Kesehatan", nilai: 75, deskripsi: "Ananda cukup baik menguasai materi invasi (bola tangan), gerak lokomotor" },
      { nama: "Seni Budaya", nilai: 89, deskripsi: "Ananda baik dalam menguasai materi menggambar poster, seni suara murottal Quran, merancang dan pementasan pantomin" }
    ],
    muatanLokal: [
      { nama: "Bahasa Arab", nilai: 86, deskripsi: "Ananda baik dalam menguasai materi penguatan mufrodat (kosakata), kompetensi hiwar (percakapan), mendengar (fahm al-masmu'), mengenal bunyi huruf hijaiyah, merangkai kalimat, kompetensi qira'ah (membaca teks)" },
      { nama: "Tajwid", nilai: 81, deskripsi: "Ananda baik dalam menguasai materi nun dan mim bertasydid, nun sukun dan tanwin, mim sukun, Idgham dan hukum lam sakinah" }
    ],
    muatanPemberdayaan: [
      { nama: "Pemberdayaan", nilai: 91, deskripsi: "Ananda sangat baik menguasai materi PBB (peraturan baris-berbaris) & Public speaking" },
      { nama: "Keterampilan", nilai: 88, deskripsi: "Ananda baik dalam menguasai materi membuat kerajinan dari kardus bekas" }
    ],
    jumlah: 1183,
    rataRata: 84.48
  },
  keterampilanIbadah: [
    { nama: "Praktek Wudhu", kkm: 70, nilai: 99, predikat: "A", deskripsi: "Alhamdulillah ananda sangat baik dalam mengaplikasikan tata cara wudhu sesuai sifat wudhu Nabi" },
    { nama: "Praktek Shalat", kkm: 70, nilai: 87, predikat: "B", deskripsi: "Alhamdulillah ananda baik dalam mengaplikasikan tata cara sholat sesuai sifat sholat Nabi" },
    { nama: "Dzikir Setelah Shalat", kkm: 70, nilai: 76, predikat: "C", deskripsi: "Alhamdulillah ananda cukup baik dalam mengaplikasikan dzikir setelah sholat sesuai Al Quran dan As Sunnah" },
    { nama: "Dzikir Pagi Petang", kkm: 70, nilai: 55, predikat: "D", deskripsi: "Ananda perlu belajar lebih giat lagi materi dzikir pagi petang sesuai Al Quran dan As Sunnah" }
  ],
  pembiasaan: {
    sekolah: [
      { nama: "Datang tepat waktu", nilai: "B" },
      { nama: "Berpakaian bersih dan rapi", nilai: "A" },
      { nama: "Murojaah sebelum mulai belajar", nilai: "A" },
      { nama: "Mengucapkan salam ketika bertemu", nilai: "A" },
      { nama: "Sholat Dhuha", nilai: "C" },
      { nama: "Tertib belajar", nilai: "A" },
      { nama: "Menerapkan adab makan dan minum", nilai: "A" },
      { nama: "Menjaga kebersihan sekolah", nilai: "A" },
      { nama: "Bersikap ramah dan sopan", nilai: "A" },
      { nama: "Membuang sampah pada tempatnya", nilai: "A" },
      { nama: "Rajin Puasa sunnah", nilai: "C" },
      { nama: "Tidak meninggalkan barang bawaan", nilai: "A" }
    ],
    rumah: [
      { nama: "Sholat Shubuh", nilai: "A" },
      { nama: "Sholat Dhuhur", nilai: "A" },
      { nama: "Sholat Ashar", nilai: "A" },
      { nama: "Sholat Maghrib", nilai: "A" },
      { nama: "Sholat Isya'", nilai: "A" },
      { nama: "Sholat sunnah rawatib", nilai: "C" },
      { nama: "Membaca/murojaah Al Quran", nilai: "B" },
      { nama: "Belajar/mengerjakan tugas", nilai: "A" },
      { nama: "Membantu orang tua di rumah", nilai: "A" },
      { nama: "Melaksanakan dzikir pagi", nilai: "C" },
      { nama: "Melaksanakan dzikir petang", nilai: "C" },
      { nama: "Menerapkan adab sehari-hari", nilai: "A" }
    ]
  },
  profilPelajarPancasila: [
    { dimensi: "Beriman, Bertaqwa kepada Tuhan Yang Maha Esa, dan Berakhlak Mulia", elemen: "Elemen akhlak beragama", deskripsi: "Terbiasa melaksanakan ibadah wajib sesuai tuntunan agama/kepercayaannya.", nilai: "BSH" },
    { dimensi: "Beriman, Bertaqwa kepada Tuhan Yang Maha Esa, dan Berakhlak Mulia", elemen: "Elemen akhlak pribadi", deskripsi: "Mulai membiasakan diri untuk disiplin, rapi, membersihkan dan merawat tubuh, menjaga tingkah laku dan perkataan dalam semua aktivitas kesehariannya.", nilai: "BSH" },
    { dimensi: "Beriman, Bertaqwa kepada Tuhan Yang Maha Esa, dan Berakhlak Mulia", elemen: "Elemen akhlak kepada alam", deskripsi: "Terbiasa memahami tindakan-tindakan yang ramah dan tidak ramah lingkungan serta membiasakan diri untuk berperilaku ramah lingkungan.", nilai: "BSH" },
    { dimensi: "Bergotong Royong", elemen: "Elemen kolaborasi", deskripsi: "Menyadari bahwa setiap orang membutuhkan orang lain dalam memenuhi kebutuhannya dan perlunya saling membantu", nilai: "SAB" },
    { dimensi: "Mandiri", elemen: "Elemen pemahaman diri dan situasi yang dihadapi", deskripsi: "Mengidentifikasi kemampuan, prestasi, dan ketertarikannya serta tantangan yang dihadapi berdasarkan kejadian-kejadian yang dialaminya dalam kehidupan sehari-hari.", nilai: "BSH" },
    { dimensi: "Mandiri", elemen: "Elemen regulasi diri", deskripsi: "Menjelaskan pentingnya mengatur diri secara mandiri dan mulai menjalankan kegiatan dan tugas yang telah sepakati secara mandiri.", nilai: "BSH" },
    { dimensi: "Mandiri", elemen: "Elemen regulasi diri", deskripsi: "Tetap bertahan mengerjakan tugas ketika dihadapkan dengan tantangan dan berusaha menyesuaikan strateginya ketika upaya sebelumnya tidak berhasil.", nilai: "BSH" },
    { dimensi: "Bernalar Kritis", elemen: "Elemen memperoleh dan memproses informasi dan gagasan", deskripsi: "Mengajukan pertanyaan untuk mengidentifikasi suatu permasalahan dan mengkonfirmasi pemahaman terhadap suatu permasalahan mengenai dirinya dan lingkungan sekitarnya.", nilai: "BSH" },
    { dimensi: "Bernalar Kritis", elemen: "Elemen refleksi pemikiran dan proses berpikir", deskripsi: "Menyampaikan apa yang sedang dipikirkan dan menjelaskan alasan dari hal yang dipikirkan.", nilai: "BSH" },
    { dimensi: "Kreatif", elemen: "Elemen menghasilkan karya dan tindakan yang orisinal", deskripsi: "Mengeksplorasi dan mengekspresikan pikiran dan/atau perasaannya sesuai dengan minat dan kesukaannya dalam bentuk karya dan/atau tindakan serta mengapresiasi karya dan tindakan yang dihasilkan.", nilai: "SAB" }
  ],
  pengembanganDiri: [
    { jenis: "Panahan", nilai: "-", keterangan: "-" },
    { jenis: "-", nilai: "-", keterangan: "-" },
    { jenis: "-", nilai: "-", keterangan: "-" }
  ],
  ketidakhadiran: {
    ijin: 3,
    sakit: 1,
    tanpaKeterangan: 0
  },
  waliKelas: "Qurrotu Aini, S.Si, M.T.",
  kepalaSekolah: "Nanang Kosim, S.Si.",
  tanggalRapor: "20 Desember 2025",
  tempatRapor: "Sidoarjo"
};

// Keterangan predikat P3
export const keteranganPredikatP3 = {
  MB: "Mulai Berkembang",
  SB: "Sudah Berkembang", 
  BSH: "Berkembang Sesuai Harapan",
  SAB: "Sangat Berkembang"
};
