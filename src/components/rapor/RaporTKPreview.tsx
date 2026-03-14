import kopSuratImis from "@/assets/kop-surat-imis.png";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface RaporTKData {
  identitas: {
    nama: string;
    noInduk: string;
    kelompok: string;
    semester: string;
    tahunPelajaran: string;
  };
  aspekPerkembangan: {
    aspek: string;
    indikator: string;
    capaian: "BB" | "MB" | "BSH" | "BSB";
    narasi: string;
  }[];
  ketidakhadiran: { sakit: number; ijin: number; tanpaKeterangan: number };
  catatan: string;
  waliKelas: string;
  kepalaSekolah: string;
  tanggalRapor: string;
  tempatRapor: string;
}

const capaianLabel: Record<string, string> = {
  BB: "Belum Berkembang",
  MB: "Mulai Berkembang",
  BSH: "Berkembang Sesuai Harapan",
  BSB: "Berkembang Sangat Baik",
};

interface Props {
  data: RaporTKData;
}

export function RaporTKPreview({ data }: Props) {
  // Group by aspek
  const grouped = data.aspekPerkembangan.reduce((acc, item) => {
    if (!acc[item.aspek]) acc[item.aspek] = [];
    acc[item.aspek].push(item);
    return acc;
  }, {} as Record<string, typeof data.aspekPerkembangan>);

  return (
    <div id="rapor-tk-content" className="bg-white text-black p-6 max-w-4xl mx-auto text-sm print:text-xs">
      <div className="mb-4">
        <img src={kopSuratImis} alt="Kop Surat IMIS" className="w-full h-auto" />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-lg font-bold uppercase">Laporan Perkembangan Anak Didik</h1>
        <p className="text-sm">Semester {data.identitas.semester}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 mb-6 text-sm">
        <div className="space-y-1">
          <div className="flex"><span className="w-28">Nama</span><span className="mr-2">:</span><span className="font-semibold">{data.identitas.nama}</span></div>
          <div className="flex"><span className="w-28">No. Induk</span><span className="mr-2">:</span><span>{data.identitas.noInduk}</span></div>
        </div>
        <div className="space-y-1">
          <div className="flex"><span className="w-32">Kelompok</span><span className="mr-2">:</span><span>{data.identitas.kelompok}</span></div>
          <div className="flex"><span className="w-32">Tahun Pelajaran</span><span className="mr-2">:</span><span>{data.identitas.tahunPelajaran}</span></div>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 p-3 border border-gray-300 rounded text-xs">
        <p className="font-semibold mb-1">KETERANGAN CAPAIAN:</p>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(capaianLabel).map(([k, v]) => (<span key={k}>{k} = {v}</span>))}
        </div>
      </div>

      {/* Aspek Perkembangan */}
      {Object.entries(grouped).map(([aspek, items], aIdx) => (
        <div key={aspek} className="mb-6">
          <h2 className="font-bold mb-2">{aIdx + 1}. {aspek}</h2>
          {items.map((item, iIdx) => (
            <div key={iIdx} className="mb-4 ml-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{item.indikator}</span>
                <span className="ml-auto">
                  {(["BB", "MB", "BSH", "BSB"] as const).map((c) => (
                    <span key={c} className={`inline-block w-10 h-6 text-center text-xs leading-6 border mx-0.5 ${item.capaian === c ? "bg-gray-800 text-white" : "border-gray-400"}`}>
                      {item.capaian === c ? "✓" : c}
                    </span>
                  ))}
                </span>
              </div>
              <div className="bg-gray-50 p-2 rounded text-xs italic border-l-2 border-gray-300">
                {item.narasi}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Catatan */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">Catatan Guru</h2>
        <div className="border border-gray-300 rounded p-3 min-h-[60px] text-sm">{data.catatan}</div>
      </div>

      {/* Ketidakhadiran */}
      <div className="mb-8">
        <h2 className="font-bold mb-2">Ketidakhadiran</h2>
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

// Mock data for TK rapor
export const mockRaporTK: RaporTKData = {
  identitas: {
    nama: "Aisyah Putri",
    noInduk: "016",
    kelompok: "KBTK A",
    semester: "I (Satu)",
    tahunPelajaran: "2025/2026",
  },
  aspekPerkembangan: [
    { aspek: "Nilai Agama dan Moral", indikator: "Mengenal agama yang dianut", capaian: "BSH", narasi: "Ananda sudah mampu menyebutkan agama yang dianut dan mulai mengenal ciptaan Tuhan dengan baik. Ananda rajin berdoa sebelum dan sesudah kegiatan." },
    { aspek: "Nilai Agama dan Moral", indikator: "Menghafal surat-surat pendek", capaian: "BSB", narasi: "Alhamdulillah ananda sudah hafal surat Al-Fatihah, An-Nas, Al-Falaq, dan Al-Ikhlas dengan lancar dan fasih." },
    { aspek: "Motorik", indikator: "Gerakan motorik halus", capaian: "BSH", narasi: "Ananda sudah mampu memegang pensil dengan benar, mewarnai dengan rapi, dan menggunting mengikuti garis." },
    { aspek: "Motorik", indikator: "Gerakan motorik kasar", capaian: "MB", narasi: "Ananda mulai berkembang dalam melakukan gerakan melompat dan berlari seimbang. Perlu latihan lebih untuk kegiatan keseimbangan." },
    { aspek: "Kognitif", indikator: "Mengenal konsep bilangan", capaian: "BSH", narasi: "Ananda mampu menghitung 1-20, mengenal konsep lebih banyak dan lebih sedikit, serta mencocokkan jumlah dengan lambang bilangan." },
    { aspek: "Kognitif", indikator: "Mengenal bentuk geometri", capaian: "BSB", narasi: "Ananda sangat baik dalam mengenal bentuk-bentuk geometri (lingkaran, segitiga, persegi) dan mampu mengelompokkannya." },
    { aspek: "Bahasa", indikator: "Kemampuan berkomunikasi", capaian: "BSH", narasi: "Ananda sudah mampu bercerita tentang pengalaman sehari-hari dengan kalimat sederhana dan menjawab pertanyaan guru." },
    { aspek: "Sosial Emosional", indikator: "Kemampuan bersosialisasi", capaian: "BSH", narasi: "Ananda mampu bermain bersama teman, berbagi mainan, dan menunjukkan empati ketika temannya sedih." },
    { aspek: "Sosial Emosional", indikator: "Kemandirian", capaian: "MB", narasi: "Ananda mulai belajar untuk mandiri dalam kegiatan makan, memakai sepatu, dan merapikan mainan. Masih perlu bimbingan." },
    { aspek: "Seni", indikator: "Kemampuan seni rupa", capaian: "BSB", narasi: "Ananda sangat kreatif dalam menggambar dan mewarnai. Karya ananda menunjukkan imajinasi dan kreativitas yang tinggi." },
  ],
  ketidakhadiran: { sakit: 2, ijin: 1, tanpaKeterangan: 0 },
  catatan: "Aisyah adalah anak yang ceria dan antusias dalam belajar. Terus semangat ya Nak! Perlu lebih banyak latihan motorik kasar dan kemandirian di rumah.",
  waliKelas: "Ustadzah Siti Aminah, S.Pd",
  kepalaSekolah: "Nanang Kosim, S.Si.",
  tanggalRapor: "20 Desember 2025",
  tempatRapor: "Sidoarjo",
};
