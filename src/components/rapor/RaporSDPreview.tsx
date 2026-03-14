import kopSuratImis from "@/assets/kop-surat-imis.png";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface RaporSDData {
  identitas: {
    nama: string;
    noInduk: string;
    nisn: string;
    kelas: string;
    semester: string;
    tahunPelajaran: string;
  };
  kompetensi: {
    kategori: string;
    mapel: {
      nama: string;
      pengetahuan: { nilai: number; predikat: string; deskripsi: string };
      keterampilan: { nilai: number; predikat: string; deskripsi: string };
    }[];
  }[];
  sikap: {
    spiritual: { predikat: string; deskripsi: string };
    sosial: { predikat: string; deskripsi: string };
  };
  pembiasaan: {
    sekolah: { nama: string; nilai: string }[];
    rumah: { nama: string; nilai: string }[];
  };
  ekskul: { nama: string; predikat: string; keterangan: string }[];
  ketidakhadiran: { sakit: number; ijin: number; tanpaKeterangan: number };
  waliKelas: string;
  kepalaSekolah: string;
  tanggalRapor: string;
  tempatRapor: string;
}

function getPredikat(nilai: number): string {
  if (nilai >= 90) return "A";
  if (nilai >= 80) return "B";
  if (nilai >= 70) return "C";
  return "D";
}

interface Props {
  data: RaporSDData;
}

export function RaporSDPreview({ data }: Props) {
  return (
    <div id="rapor-sd-content" className="bg-white text-black p-6 max-w-4xl mx-auto text-sm print:text-xs">
      <div className="mb-4">
        <img src={kopSuratImis} alt="Kop Surat IMIS" className="w-full h-auto" />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-lg font-bold uppercase">Laporan Hasil Belajar Siswa</h1>
        <p className="text-sm">Semester {data.identitas.semester}</p>
      </div>

      {/* Identitas */}
      <div className="grid grid-cols-2 gap-x-8 mb-6 text-sm">
        <div className="space-y-1">
          <div className="flex"><span className="w-28">Nama</span><span className="mr-2">:</span><span className="font-semibold">{data.identitas.nama}</span></div>
          <div className="flex"><span className="w-28">No. Induk</span><span className="mr-2">:</span><span>{data.identitas.noInduk}</span></div>
          <div className="flex"><span className="w-28">NISN</span><span className="mr-2">:</span><span>{data.identitas.nisn}</span></div>
        </div>
        <div className="space-y-1">
          <div className="flex"><span className="w-32">Kelas</span><span className="mr-2">:</span><span>{data.identitas.kelas}</span></div>
          <div className="flex"><span className="w-32">Semester</span><span className="mr-2">:</span><span>{data.identitas.semester}</span></div>
          <div className="flex"><span className="w-32">Tahun Pelajaran</span><span className="mr-2">:</span><span>{data.identitas.tahunPelajaran}</span></div>
        </div>
      </div>

      {/* Sikap */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">A. Sikap</h2>
        <Table className="border border-gray-400">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border border-gray-400 w-10 text-black">No</TableHead>
              <TableHead className="border border-gray-400 text-black">Dimensi</TableHead>
              <TableHead className="border border-gray-400 text-center w-20 text-black">Predikat</TableHead>
              <TableHead className="border border-gray-400 text-black">Deskripsi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border border-gray-400 text-center">1</TableCell>
              <TableCell className="border border-gray-400">Sikap Spiritual</TableCell>
              <TableCell className="border border-gray-400 text-center font-semibold">{data.sikap.spiritual.predikat}</TableCell>
              <TableCell className="border border-gray-400 text-xs">{data.sikap.spiritual.deskripsi}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border border-gray-400 text-center">2</TableCell>
              <TableCell className="border border-gray-400">Sikap Sosial</TableCell>
              <TableCell className="border border-gray-400 text-center font-semibold">{data.sikap.sosial.predikat}</TableCell>
              <TableCell className="border border-gray-400 text-xs">{data.sikap.sosial.deskripsi}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Kompetensi */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">B. Pengetahuan dan Keterampilan</h2>
        <Table className="border border-gray-400">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border border-gray-400 w-8 text-black text-center">No</TableHead>
              <TableHead className="border border-gray-400 text-black">Mata Pelajaran</TableHead>
              <TableHead className="border border-gray-400 text-center w-14 text-black">Nilai P</TableHead>
              <TableHead className="border border-gray-400 text-center w-14 text-black">Pred P</TableHead>
              <TableHead className="border border-gray-400 text-black text-xs">Deskripsi Pengetahuan</TableHead>
              <TableHead className="border border-gray-400 text-center w-14 text-black">Nilai K</TableHead>
              <TableHead className="border border-gray-400 text-center w-14 text-black">Pred K</TableHead>
              <TableHead className="border border-gray-400 text-black text-xs">Deskripsi Keterampilan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.kompetensi.map((kat) => (
              <>
                <TableRow key={kat.kategori}>
                  <TableCell colSpan={8} className="border border-gray-400 font-semibold bg-gray-50">{kat.kategori}</TableCell>
                </TableRow>
                {kat.mapel.map((m, mIdx) => (
                  <TableRow key={`${kat.kategori}-${mIdx}`}>
                    <TableCell className="border border-gray-400 text-center">{mIdx + 1}</TableCell>
                    <TableCell className="border border-gray-400 text-xs">{m.nama}</TableCell>
                    <TableCell className="border border-gray-400 text-center font-semibold">{m.pengetahuan.nilai}</TableCell>
                    <TableCell className="border border-gray-400 text-center font-semibold">{m.pengetahuan.predikat}</TableCell>
                    <TableCell className="border border-gray-400 text-[10px]">{m.pengetahuan.deskripsi}</TableCell>
                    <TableCell className="border border-gray-400 text-center font-semibold">{m.keterampilan.nilai}</TableCell>
                    <TableCell className="border border-gray-400 text-center font-semibold">{m.keterampilan.predikat}</TableCell>
                    <TableCell className="border border-gray-400 text-[10px]">{m.keterampilan.deskripsi}</TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pembiasaan */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">C. Pembiasaan</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-1 text-xs">a. Di Sekolah</h3>
            <Table className="border border-gray-400">
              <TableBody>
                {data.pembiasaan.sekolah.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="border border-gray-400 text-center text-xs w-8">{i + 1}</TableCell>
                    <TableCell className="border border-gray-400 text-xs">{p.nama}</TableCell>
                    <TableCell className="border border-gray-400 text-center font-semibold text-xs w-10">{p.nilai}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-xs">b. Di Rumah</h3>
            <Table className="border border-gray-400">
              <TableBody>
                {data.pembiasaan.rumah.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="border border-gray-400 text-center text-xs w-8">{i + 1}</TableCell>
                    <TableCell className="border border-gray-400 text-xs">{p.nama}</TableCell>
                    <TableCell className="border border-gray-400 text-center font-semibold text-xs w-10">{p.nilai}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Ekskul */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">D. Ekstrakurikuler</h2>
        <Table className="border border-gray-400 w-96">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border border-gray-400 w-8 text-center text-black">No</TableHead>
              <TableHead className="border border-gray-400 text-black">Kegiatan</TableHead>
              <TableHead className="border border-gray-400 text-center w-16 text-black">Predikat</TableHead>
              <TableHead className="border border-gray-400 text-black">Keterangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.ekskul.map((e, i) => (
              <TableRow key={i}>
                <TableCell className="border border-gray-400 text-center">{i + 1}</TableCell>
                <TableCell className="border border-gray-400">{e.nama}</TableCell>
                <TableCell className="border border-gray-400 text-center font-semibold">{e.predikat}</TableCell>
                <TableCell className="border border-gray-400 text-xs">{e.keterangan}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Ketidakhadiran */}
      <div className="mb-8">
        <h2 className="font-bold mb-2">E. Ketidakhadiran</h2>
        <Table className="border border-gray-400 w-64">
          <TableBody>
            <TableRow><TableCell className="border border-gray-400">Sakit</TableCell><TableCell className="border border-gray-400 text-center">{data.ketidakhadiran.sakit}</TableCell></TableRow>
            <TableRow><TableCell className="border border-gray-400">Ijin</TableCell><TableCell className="border border-gray-400 text-center">{data.ketidakhadiran.ijin}</TableCell></TableRow>
            <TableRow><TableCell className="border border-gray-400">Tanpa Keterangan</TableCell><TableCell className="border border-gray-400 text-center">{data.ketidakhadiran.tanpaKeterangan || "-"}</TableCell></TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Signatures */}
      <div className="mt-8">
        <div className="text-right mb-8"><p>{data.tempatRapor}, {data.tanggalRapor}</p></div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="mb-16">Orang Tua / Wali</p><p className="border-t border-black pt-1">________________</p></div>
          <div><p className="mb-16">Wali Kelas</p><p className="border-t border-black pt-1 font-semibold">{data.waliKelas}</p></div>
          <div><p className="mb-16">Kepala Sekolah</p><p className="border-t border-black pt-1 font-semibold">{data.kepalaSekolah}</p></div>
        </div>
      </div>
    </div>
  );
}

// Mock data
export const mockRaporSD: RaporSDData = {
  identitas: {
    nama: "Muhammad Haikal",
    noInduk: "020",
    nisn: "0120001005",
    kelas: "Paket A Kelas 1",
    semester: "I (Satu)",
    tahunPelajaran: "2025/2026",
  },
  kompetensi: [
    {
      kategori: "Kelompok Mata Pelajaran Umum",
      mapel: [
        { nama: "Pendidikan Agama Islam", pengetahuan: { nilai: 88, predikat: "B", deskripsi: "Ananda baik dalam menguasai materi aqidah dan adab islami." }, keterampilan: { nilai: 90, predikat: "A", deskripsi: "Ananda sangat baik dalam praktek ibadah harian." } },
        { nama: "PPKn", pengetahuan: { nilai: 82, predikat: "B", deskripsi: "Ananda baik memahami simbol-simbol Pancasila." }, keterampilan: { nilai: 85, predikat: "B", deskripsi: "Ananda baik menerapkan nilai sila Pancasila." } },
        { nama: "Bahasa Indonesia", pengetahuan: { nilai: 85, predikat: "B", deskripsi: "Ananda baik dalam membaca dan menulis huruf." }, keterampilan: { nilai: 87, predikat: "B", deskripsi: "Ananda baik dalam bercerita dan menyampaikan pendapat." } },
        { nama: "Matematika", pengetahuan: { nilai: 78, predikat: "C", deskripsi: "Ananda cukup baik mengenal bilangan 1-100." }, keterampilan: { nilai: 80, predikat: "B", deskripsi: "Ananda baik dalam operasi penjumlahan sederhana." } },
        { nama: "PJOK", pengetahuan: { nilai: 80, predikat: "B", deskripsi: "Ananda baik memahami gerak dasar lokomotor." }, keterampilan: { nilai: 85, predikat: "B", deskripsi: "Ananda baik melakukan gerakan senam." } },
        { nama: "Seni Budaya", pengetahuan: { nilai: 92, predikat: "A", deskripsi: "Ananda sangat baik mengenal unsur seni rupa." }, keterampilan: { nilai: 94, predikat: "A", deskripsi: "Ananda sangat baik dalam berkarya seni." } },
      ],
    },
    {
      kategori: "Muatan Lokal",
      mapel: [
        { nama: "Bahasa Arab", pengetahuan: { nilai: 84, predikat: "B", deskripsi: "Ananda baik menguasai kosakata dasar bahasa Arab." }, keterampilan: { nilai: 82, predikat: "B", deskripsi: "Ananda baik dalam percakapan sederhana." } },
        { nama: "Tajwid", pengetahuan: { nilai: 86, predikat: "B", deskripsi: "Ananda baik mengenal hukum bacaan nun sukun." }, keterampilan: { nilai: 88, predikat: "B", deskripsi: "Ananda baik dalam praktek membaca Al-Quran." } },
      ],
    },
  ],
  sikap: {
    spiritual: { predikat: "A", deskripsi: "Ananda sangat baik dalam menjalankan ibadah, berdoa sebelum dan sesudah kegiatan, serta bersyukur atas nikmat Allah." },
    sosial: { predikat: "B", deskripsi: "Ananda baik dalam bergaul, jujur, disiplin, dan bertanggung jawab. Perlu lebih percaya diri dalam menyampaikan pendapat." },
  },
  pembiasaan: {
    sekolah: [
      { nama: "Datang tepat waktu", nilai: "A" },
      { nama: "Berpakaian bersih dan rapi", nilai: "A" },
      { nama: "Murojaah sebelum belajar", nilai: "B" },
      { nama: "Sholat Dhuha", nilai: "B" },
      { nama: "Tertib belajar", nilai: "A" },
      { nama: "Menjaga kebersihan", nilai: "A" },
    ],
    rumah: [
      { nama: "Sholat 5 waktu", nilai: "A" },
      { nama: "Membaca Al-Quran", nilai: "B" },
      { nama: "Belajar di rumah", nilai: "B" },
      { nama: "Membantu orang tua", nilai: "A" },
    ],
  },
  ekskul: [
    { nama: "Panahan", predikat: "B", keterangan: "Aktif dan menunjukkan kemajuan" },
  ],
  ketidakhadiran: { sakit: 2, ijin: 1, tanpaKeterangan: 0 },
  waliKelas: "Ustadz Ahmad Fauzi, S.Pd.I",
  kepalaSekolah: "Nanang Kosim, S.Si.",
  tanggalRapor: "20 Desember 2025",
  tempatRapor: "Sidoarjo",
};
