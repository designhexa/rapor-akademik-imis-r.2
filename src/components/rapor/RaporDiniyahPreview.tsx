import { Card } from "@/components/ui/card";
import { mockRaporAkademik, getPredikatNilai } from "@/lib/rapor-akademik-types";
import kopSuratImis from "@/assets/kop-surat-imis.png";

interface RaporDiniyahPreviewProps {
  santriId: string;
}

export function RaporDiniyahPreview({ santriId }: RaporDiniyahPreviewProps) {
  // Menggunakan mock data, akan diganti dengan data dari database
  const data = mockRaporAkademik;
  
  // Data PAI & Budi Pekerti (Diniyah)
  const mapelDiniyah = data.kompetensi.paiDanBudiPekerti;
  
  // Hitung jumlah dan rata-rata untuk mapel diniyah
  const jumlahNilai = mapelDiniyah.reduce((acc, m) => acc + m.nilai, 0);
  const rataRata = jumlahNilai / mapelDiniyah.length;

  return (
    <Card className="bg-white text-black p-0 shadow-lg print:shadow-none">
      <div className="p-6 space-y-4" style={{ fontFamily: 'Times New Roman, serif', fontSize: '11pt' }}>
        {/* Kop Surat */}
        <div className="flex justify-center mb-4">
          <img 
            src={kopSuratImis} 
            alt="Kop Surat IMIS" 
            className="w-full max-w-[700px] h-auto"
          />
        </div>

        {/* Judul */}
        <div className="text-center border-b-2 border-black pb-3 mb-4">
          <h1 className="text-lg font-bold uppercase tracking-wide">
            Laporan Hasil Belajar Diniyah
          </h1>
          <p className="text-sm text-gray-600 mt-1">PAI dan Budi Pekerti</p>
        </div>

        {/* Identitas Santri */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm mb-4 border border-black p-3">
          <div className="flex">
            <span className="w-32">Nama</span>
            <span className="mr-2">:</span>
            <span className="font-semibold">{data.identitas.nama}</span>
          </div>
          <div className="flex">
            <span className="w-32">Kelas</span>
            <span className="mr-2">:</span>
            <span className="font-semibold">{data.identitas.kelas}</span>
          </div>
          <div className="flex">
            <span className="w-32">No. Induk</span>
            <span className="mr-2">:</span>
            <span className="font-semibold">{data.identitas.noInduk}</span>
          </div>
          <div className="flex">
            <span className="w-32">Semester</span>
            <span className="mr-2">:</span>
            <span className="font-semibold">{data.identitas.semester}</span>
          </div>
          <div className="flex">
            <span className="w-32">NISN</span>
            <span className="mr-2">:</span>
            <span className="font-semibold">{data.identitas.nisn}</span>
          </div>
          <div className="flex">
            <span className="w-32">Tahun Pelajaran</span>
            <span className="mr-2">:</span>
            <span className="font-semibold">{data.identitas.tahunPelajaran}</span>
          </div>
        </div>

        {/* Tabel Nilai Diniyah */}
        <div className="border border-black">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-2 text-center w-10">No</th>
                <th className="border border-black p-2 text-left">Mata Pelajaran</th>
                <th className="border border-black p-2 text-center w-16">KKM</th>
                <th className="border border-black p-2 text-center w-16">Nilai</th>
                <th className="border border-black p-2 text-center w-20">Predikat</th>
                <th className="border border-black p-2 text-left">Deskripsi Capaian Kompetensi</th>
              </tr>
            </thead>
            <tbody>
              {mapelDiniyah.map((mapel, index) => {
                const { predikat, prefix } = getPredikatNilai(mapel.nilai);
                return (
                  <tr key={index}>
                    <td className="border border-black p-2 text-center">{index + 1}</td>
                    <td className="border border-black p-2 font-medium">{mapel.nama}</td>
                    <td className="border border-black p-2 text-center">70</td>
                    <td className="border border-black p-2 text-center font-bold">{mapel.nilai}</td>
                    <td className="border border-black p-2 text-center font-bold">{predikat}</td>
                    <td className="border border-black p-2 text-xs">{mapel.deskripsi}</td>
                  </tr>
                );
              })}
              {/* Baris Jumlah dan Rata-rata */}
              <tr className="bg-gray-100 font-bold">
                <td colSpan={3} className="border border-black p-2 text-right">Jumlah</td>
                <td className="border border-black p-2 text-center">{jumlahNilai}</td>
                <td colSpan={2} className="border border-black p-2"></td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={3} className="border border-black p-2 text-right">Rata-rata</td>
                <td className="border border-black p-2 text-center">{rataRata.toFixed(2)}</td>
                <td className="border border-black p-2 text-center">{getPredikatNilai(rataRata).predikat}</td>
                <td className="border border-black p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Keterangan Predikat */}
        <div className="text-xs border border-black p-3 mt-4">
          <p className="font-bold mb-1">Keterangan Predikat:</p>
          <div className="grid grid-cols-2 gap-1">
            <span>A = Sangat Baik (90-100)</span>
            <span>C = Cukup Baik (70-79)</span>
            <span>B = Baik (80-89)</span>
            <span>D = Perlu Bimbingan (&lt;70)</span>
          </div>
        </div>

        {/* Catatan */}
        <div className="border border-black p-3 mt-4">
          <p className="font-bold text-sm mb-2">Catatan Guru:</p>
          <div className="min-h-[60px] text-sm italic text-gray-600">
            Alhamdulillah, ananda menunjukkan perkembangan yang baik dalam pembelajaran mata pelajaran keagamaan.
            Terus tingkatkan semangat belajar dan pengamalan ilmu agama dalam kehidupan sehari-hari.
          </div>
        </div>

        {/* Tanda Tangan */}
        <div className="grid grid-cols-2 gap-8 mt-8 text-sm">
          <div className="text-center">
            <p>Mengetahui,</p>
            <p>Orang Tua/Wali</p>
            <div className="h-20"></div>
            <p className="border-t border-black pt-1">(...............................)</p>
          </div>
          <div className="text-center">
            <p>{data.tempatRapor}, {data.tanggalRapor}</p>
            <p>Guru Diniyah</p>
            <div className="h-20"></div>
            <p className="border-t border-black pt-1 font-semibold">{data.waliKelas}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
