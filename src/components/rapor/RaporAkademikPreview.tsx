import { RaporAkademik, keteranganPredikatP3 } from "@/lib/rapor-akademik-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import kopSuratImis from "@/assets/kop-surat-imis.png";

interface RaporAkademikPreviewProps {
  data: RaporAkademik;
}

export function RaporAkademikPreview({ data }: RaporAkademikPreviewProps) {
  // Group P3 by dimensi
  const groupedP3 = data.profilPelajarPancasila.reduce((acc, item) => {
    if (!acc[item.dimensi]) {
      acc[item.dimensi] = [];
    }
    acc[item.dimensi].push(item);
    return acc;
  }, {} as Record<string, typeof data.profilPelajarPancasila>);

  return (
    <div id="rapor-akademik-content" className="bg-white text-black p-6 max-w-4xl mx-auto text-sm print:text-xs">
      {/* Kop Surat */}
      <div className="mb-4">
        <img src={kopSuratImis} alt="Kop Surat IMIS" className="w-full h-auto" />
      </div>

      {/* Judul Rapor */}
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold uppercase">Laporan Hasil Belajar Semester {data.identitas.semester}</h1>
      </div>

      {/* Identitas Siswa */}
      <div className="grid grid-cols-2 gap-x-8 mb-6 text-sm">
        <div className="space-y-1">
          <div className="flex">
            <span className="w-28">Nama</span>
            <span className="mr-2">:</span>
            <span className="font-semibold">{data.identitas.nama}</span>
          </div>
          <div className="flex">
            <span className="w-28">No. Induk</span>
            <span className="mr-2">:</span>
            <span>{data.identitas.noInduk}</span>
          </div>
          <div className="flex">
            <span className="w-28">NISN</span>
            <span className="mr-2">:</span>
            <span>{data.identitas.nisn}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex">
            <span className="w-32">Kelas</span>
            <span className="mr-2">:</span>
            <span>{data.identitas.kelas}</span>
          </div>
          <div className="flex">
            <span className="w-32">Semester</span>
            <span className="mr-2">:</span>
            <span>{data.identitas.semester}</span>
          </div>
          <div className="flex">
            <span className="w-32">Tahun Pelajaran</span>
            <span className="mr-2">:</span>
            <span>{data.identitas.tahunPelajaran}</span>
          </div>
        </div>
      </div>

      {/* Predikat Nilai Legend */}
      <div className="mb-4 p-3 border border-gray-300 rounded text-xs">
        <p className="font-semibold mb-1">PREDIKAT NILAI:</p>
        <div className="grid grid-cols-4 gap-2">
          <span>90 - 100 = A (sangat baik)</span>
          <span>80 - 89 = B (baik)</span>
          <span>70 - 79 = C (cukup baik)</span>
          <span>0 - 69 = D (perlu bimbingan)</span>
        </div>
      </div>

      {/* A. Kompetensi */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">A. Kompetensi</h2>
        <Table className="border border-gray-400">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border border-gray-400 text-center w-10 text-black">No</TableHead>
              <TableHead className="border border-gray-400 text-black">Mata Pelajaran</TableHead>
              <TableHead className="border border-gray-400 text-center w-20 text-black">Nilai Akhir</TableHead>
              <TableHead className="border border-gray-400 text-black">Capaian Kompetensi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Kelompok Mata Pelajaran Umum */}
            <TableRow>
              <TableCell colSpan={4} className="border border-gray-400 font-semibold bg-gray-50">
                Kelompok Mata Pelajaran Umum
              </TableCell>
            </TableRow>
            
            {/* 1. PAI dan Budi Pekerti */}
            <TableRow>
              <TableCell className="border border-gray-400 text-center align-top">1</TableCell>
              <TableCell colSpan={3} className="border border-gray-400 font-medium">
                Pendidikan Agama Islam dan Budi Pekerti
              </TableCell>
            </TableRow>
            {data.kompetensi.paiDanBudiPekerti.map((mapel, idx) => (
              <TableRow key={`pai-${idx}`}>
                <TableCell className="border border-gray-400"></TableCell>
                <TableCell className="border border-gray-400 pl-8">
                  {String.fromCharCode(97 + idx)}. {mapel.nama}
                </TableCell>
                <TableCell className="border border-gray-400 text-center font-semibold">{mapel.nilai}</TableCell>
                <TableCell className="border border-gray-400 text-xs">{mapel.deskripsi}</TableCell>
              </TableRow>
            ))}

            {/* Mapel Umum */}
            {data.kompetensi.mapelUmum.map((mapel, idx) => (
              <TableRow key={`umum-${idx}`}>
                <TableCell className="border border-gray-400 text-center">{idx + 2}</TableCell>
                <TableCell className="border border-gray-400">{mapel.nama}</TableCell>
                <TableCell className="border border-gray-400 text-center font-semibold">{mapel.nilai}</TableCell>
                <TableCell className="border border-gray-400 text-xs">{mapel.deskripsi}</TableCell>
              </TableRow>
            ))}

            {/* Muatan Lokal */}
            <TableRow>
              <TableCell className="border border-gray-400 text-center align-top">{data.kompetensi.mapelUmum.length + 2}</TableCell>
              <TableCell colSpan={3} className="border border-gray-400 font-medium">
                Muatan Lokal
              </TableCell>
            </TableRow>
            {data.kompetensi.muatanLokal.map((mapel, idx) => (
              <TableRow key={`lokal-${idx}`}>
                <TableCell className="border border-gray-400"></TableCell>
                <TableCell className="border border-gray-400 pl-8">
                  {String.fromCharCode(97 + idx)}. {mapel.nama}
                </TableCell>
                <TableCell className="border border-gray-400 text-center font-semibold">{mapel.nilai}</TableCell>
                <TableCell className="border border-gray-400 text-xs">{mapel.deskripsi}</TableCell>
              </TableRow>
            ))}

            {/* Muatan Pemberdayaan dan Keterampilan */}
            <TableRow>
              <TableCell colSpan={4} className="border border-gray-400 font-semibold bg-gray-50">
                Muatan Pemberdayaan dan Keterampilan Berbasis Profil Pelajar Pancasila
              </TableCell>
            </TableRow>
            {data.kompetensi.muatanPemberdayaan.map((mapel, idx) => (
              <TableRow key={`pemberdayaan-${idx}`}>
                <TableCell className="border border-gray-400 text-center">{idx + 1}</TableCell>
                <TableCell className="border border-gray-400">{mapel.nama}</TableCell>
                <TableCell className="border border-gray-400 text-center font-semibold">{mapel.nilai}</TableCell>
                <TableCell className="border border-gray-400 text-xs">{mapel.deskripsi}</TableCell>
              </TableRow>
            ))}

            {/* Jumlah dan Rata-rata */}
            <TableRow className="bg-gray-50">
              <TableCell colSpan={2} className="border border-gray-400 text-right font-semibold">Jumlah</TableCell>
              <TableCell className="border border-gray-400 text-center font-bold">{data.kompetensi.jumlah}</TableCell>
              <TableCell className="border border-gray-400"></TableCell>
            </TableRow>
            <TableRow className="bg-gray-50">
              <TableCell colSpan={2} className="border border-gray-400 text-right font-semibold">Rata - Rata</TableCell>
              <TableCell className="border border-gray-400 text-center font-bold">{data.kompetensi.rataRata.toFixed(2)}</TableCell>
              <TableCell className="border border-gray-400"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* B. Keterampilan Ibadah */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">B. Keterampilan Ibadah</h2>
        <Table className="border border-gray-400">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border border-gray-400 text-center w-10 text-black">No</TableHead>
              <TableHead className="border border-gray-400 text-black">Mata Pelajaran</TableHead>
              <TableHead className="border border-gray-400 text-center w-14 text-black">KKM</TableHead>
              <TableHead className="border border-gray-400 text-center w-14 text-black">Nilai</TableHead>
              <TableHead className="border border-gray-400 text-center w-20 text-black">Predikat</TableHead>
              <TableHead className="border border-gray-400 text-black">Deskripsi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.keterampilanIbadah.map((item, idx) => (
              <TableRow key={`ibadah-${idx}`}>
                <TableCell className="border border-gray-400 text-center">{idx + 1}</TableCell>
                <TableCell className="border border-gray-400">{item.nama}</TableCell>
                <TableCell className="border border-gray-400 text-center">{item.kkm}</TableCell>
                <TableCell className="border border-gray-400 text-center font-semibold">{item.nilai}</TableCell>
                <TableCell className="border border-gray-400 text-center font-semibold">{item.predikat}</TableCell>
                <TableCell className="border border-gray-400 text-xs">{item.deskripsi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* C. Pembiasaan Peserta Didik */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">C. Pembiasaan Peserta Didik</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Pembiasaan di Sekolah */}
          <div>
            <h3 className="font-semibold mb-1 text-xs">a. Pembiasaan di Sekolah</h3>
            <Table className="border border-gray-400">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center w-8 text-black text-xs">No</TableHead>
                  <TableHead className="border border-gray-400 text-black text-xs">Kegiatan</TableHead>
                  <TableHead className="border border-gray-400 text-center w-12 text-black text-xs">Nilai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.pembiasaan.sekolah.map((item, idx) => (
                  <TableRow key={`sekolah-${idx}`}>
                    <TableCell className="border border-gray-400 text-center text-xs py-1">{idx + 1}</TableCell>
                    <TableCell className="border border-gray-400 text-xs py-1">{item.nama}</TableCell>
                    <TableCell className="border border-gray-400 text-center font-semibold text-xs py-1">{item.nilai}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pembiasaan di Rumah */}
          <div>
            <h3 className="font-semibold mb-1 text-xs">b. Pembiasaan di Rumah</h3>
            <Table className="border border-gray-400">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="border border-gray-400 text-center w-8 text-black text-xs">No</TableHead>
                  <TableHead className="border border-gray-400 text-black text-xs">Kegiatan</TableHead>
                  <TableHead className="border border-gray-400 text-center w-12 text-black text-xs">Nilai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.pembiasaan.rumah.map((item, idx) => (
                  <TableRow key={`rumah-${idx}`}>
                    <TableCell className="border border-gray-400 text-center text-xs py-1">{idx + 1}</TableCell>
                    <TableCell className="border border-gray-400 text-xs py-1">{item.nama}</TableCell>
                    <TableCell className="border border-gray-400 text-center font-semibold text-xs py-1">{item.nilai}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* D. Capaian Dimensi Profil Pelajar Pancasila */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">D. Capaian Dimensi Profil Pelajar Pancasila pada Muatan Pemberdayaan dan Keterampilan</h2>
        
        {/* Legend */}
        <div className="mb-2 text-xs flex gap-4">
          <span className="font-semibold">Keterangan:</span>
          {Object.entries(keteranganPredikatP3).map(([key, value]) => (
            <span key={key}>{key} = {value}</span>
          ))}
        </div>

        <Table className="border border-gray-400">
          <TableBody>
            {Object.entries(groupedP3).map(([dimensi, items]) => (
              <>
                {/* Dimensi Header */}
                <TableRow key={`dimensi-${dimensi}`} className="bg-gray-100">
                  <TableCell colSpan={5} className="border border-gray-400 font-semibold">
                    Dimensi {dimensi}
                  </TableCell>
                  <TableCell className="border border-gray-400 text-center font-semibold text-xs">Penilaian</TableCell>
                </TableRow>
                
                {/* Elemen rows */}
                {items.map((item, idx) => (
                  <TableRow key={`p3-${dimensi}-${idx}`}>
                    <TableCell colSpan={2} className="border border-gray-400 pl-4 text-xs font-medium">
                      {item.elemen}
                    </TableCell>
                    <TableCell colSpan={3} className="border border-gray-400 text-xs">
                      {item.deskripsi}
                    </TableCell>
                    <TableCell className="border border-gray-400">
                      <div className="flex justify-center gap-1 text-xs">
                        {(['MB', 'SB', 'BSH', 'SAB'] as const).map((predikat) => (
                          <div 
                            key={predikat} 
                            className={`w-8 h-6 border flex items-center justify-center ${
                              item.nilai === predikat ? 'bg-gray-800 text-white' : 'border-gray-400'
                            }`}
                          >
                            {item.nilai === predikat ? '✓' : predikat}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* E. Pengembangan Diri */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">E. Pengembangan Diri</h2>
        <Table className="border border-gray-400">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border border-gray-400 text-center w-10 text-black">No</TableHead>
              <TableHead className="border border-gray-400 text-black">Jenis Kegiatan</TableHead>
              <TableHead className="border border-gray-400 text-center w-20 text-black">Nilai</TableHead>
              <TableHead className="border border-gray-400 text-black">Keterangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pengembanganDiri.map((item, idx) => (
              <TableRow key={`pengembangan-${idx}`}>
                <TableCell className="border border-gray-400 text-center">{idx + 1}</TableCell>
                <TableCell className="border border-gray-400">{item.jenis}</TableCell>
                <TableCell className="border border-gray-400 text-center">{item.nilai}</TableCell>
                <TableCell className="border border-gray-400">{item.keterangan}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* F. Ketidakhadiran */}
      <div className="mb-8">
        <h2 className="font-bold mb-2">F. Ketidakhadiran</h2>
        <Table className="border border-gray-400 w-64">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border border-gray-400 text-black">Absensi</TableHead>
              <TableHead className="border border-gray-400 text-center text-black">Jumlah Hari</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border border-gray-400">Ijin</TableCell>
              <TableCell className="border border-gray-400 text-center">{data.ketidakhadiran.ijin}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border border-gray-400">Sakit</TableCell>
              <TableCell className="border border-gray-400 text-center">{data.ketidakhadiran.sakit}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border border-gray-400">Tanpa Keterangan</TableCell>
              <TableCell className="border border-gray-400 text-center">{data.ketidakhadiran.tanpaKeterangan || '-'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Tanda Tangan */}
      <div className="mt-8">
        <div className="text-right mb-8">
          <p>{data.tempatRapor}, {data.tanggalRapor}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="mb-16">Orang Tua / Wali</p>
            <p className="border-b border-black mx-8 pb-1">( ............................ )</p>
          </div>
          <div></div>
          <div>
            <p className="mb-16">Wali Kelas</p>
            <p className="border-b border-black mx-8 pb-1">({data.waliKelas})</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="mb-2">Mengetahui,</p>
          <p className="mb-16">Kepala Sekolah</p>
          <p className="border-b border-black mx-auto w-64 pb-1">({data.kepalaSekolah})</p>
        </div>
      </div>
    </div>
  );
}
