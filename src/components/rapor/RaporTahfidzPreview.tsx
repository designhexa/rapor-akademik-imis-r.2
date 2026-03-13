import { RaporTahfidz, getPredikat } from "@/lib/rapor-tahfidz-types";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import kopSuratImis from "@/assets/kop-surat-imis.png";

interface RaporTahfidzPreviewProps {
  data: RaporTahfidz;
}

export const RaporTahfidzPreview = ({ data }: RaporTahfidzPreviewProps) => {
  return (
    <div className="bg-white text-black p-6 space-y-6 text-sm" id="rapor-content">
      {/* Kop Surat Header */}
      <div className="border-b-2 border-[#1a5632] pb-4 mb-4">
        <img 
          src={kopSuratImis} 
          alt="Kop Surat IMIS" 
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Judul Rapor */}
      <div className="text-center pb-4">
        <h2 className="font-bold text-lg uppercase">Laporan Hasil Belajar Tilawah & Tahfidzul Qur'an</h2>
      </div>

      {/* Header Identitas */}
      <div className="grid grid-cols-2 gap-4 border-b pb-4">
        <div className="space-y-1">
          <div className="flex gap-2">
            <span className="w-24">Nama</span>
            <span>: {data.identitas.nama}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24">No. Induk</span>
            <span>: {data.identitas.nis}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24">NISN</span>
            <span>: {data.identitas.nisn}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex gap-2">
            <span className="w-28">Kelas</span>
            <span>: {data.identitas.kelas}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28">Semester</span>
            <span>: {data.identitas.semester === "Ganjil" ? "I (Satu)" : "II (Dua)"}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28">Tahun Pelajaran</span>
            <span>: {data.identitas.tahunAjaran}</span>
          </div>
        </div>
      </div>

      {/* A. Laporan Capaian Hafalan Baru */}
      <div>
        <h3 className="font-bold mb-2">A. Laporan Capaian Hafalan Baru</h3>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border text-center text-black w-12">No</TableHead>
              <TableHead className="border text-center text-black">Bulan</TableHead>
              <TableHead className="border text-center text-black" colSpan={2}>Surat : Ayat</TableHead>
              <TableHead className="border text-center text-black" colSpan={2}>Pencapaian Baris</TableHead>
              <TableHead className="border text-center text-black">Keterangan</TableHead>
            </TableRow>
            <TableRow className="bg-gray-50">
              <TableHead className="border"></TableHead>
              <TableHead className="border"></TableHead>
              <TableHead className="border text-center text-black text-xs">Awal</TableHead>
              <TableHead className="border text-center text-black text-xs">Akhir</TableHead>
              <TableHead className="border text-center text-black text-xs">Bulanan</TableHead>
              <TableHead className="border text-center text-black text-xs">Jumlah</TableHead>
              <TableHead className="border"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.capaianHafalanBaru.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="border text-center">{index + 1}</TableCell>
                <TableCell className="border text-center">{item.bulan}</TableCell>
                <TableCell className="border text-center text-xs">{item.suratAyatAwal}</TableCell>
                <TableCell className="border text-center text-xs">{item.suratAyatAkhir}</TableCell>
                <TableCell className="border text-center">{item.pencapaianBaris}</TableCell>
                <TableCell className="border text-center">{item.jumlahAkumulasi}</TableCell>
                <TableCell className="border text-xs">{item.keterangan}</TableCell>
              </TableRow>
            ))}
            {data.capaianHafalanBaru.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="border text-center text-gray-500 py-4">
                  Belum ada data capaian hafalan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Aspek Penilaian */}
      <div>
        <h4 className="font-semibold mb-2">Aspek Penilaian</h4>
        <div className="grid grid-cols-3 gap-4">
          {/* Adab dalam Halaqah */}
          <Card className="p-3 border">
            <h5 className="font-medium text-xs mb-2 text-center bg-gray-100 py-1">Adab dalam Halaqah</h5>
            <div className="text-center space-y-1">
              <div className="text-xs">Nilai: <span className="font-bold">{data.penilaianAdab.nilai}</span></div>
              <div className="text-xs">Predikat: <span className="font-bold">{data.penilaianAdab.predikat}</span></div>
            </div>
          </Card>
          
          {/* Pencapaian Target Hafalan Baru */}
          <Card className="p-3 border">
            <h5 className="font-medium text-xs mb-2 text-center bg-gray-100 py-1">Pencapaian Target Hafalan Baru</h5>
            <div className="space-y-1 text-xs">
              <div>Target: <span className="font-bold">{data.penilaianTarget.targetSemester}</span></div>
              <div>Pencapaian: <span className="font-bold">{data.penilaianTarget.pencapaian}</span></div>
              <div>Keterangan: <span className="font-bold">{data.penilaianTarget.keterangan}</span></div>
            </div>
          </Card>
          
          {/* Muraja'ah Hafalan */}
          <Card className="p-3 border">
            <h5 className="font-medium text-xs mb-2 text-center bg-gray-100 py-1">Muraja'ah Hafalan</h5>
            <div className="space-y-1 text-xs">
              <div>Nilai: <span className="font-bold">{data.penilaianMurajaah.nilai}</span></div>
              <div>Predikat: <span className="font-bold">{data.penilaianMurajaah.predikat}</span></div>
              <div className="text-xs">Juz/Surat: {data.penilaianMurajaah.juzSuratAyat}</div>
            </div>
          </Card>
        </div>
      </div>

      {/* B. Nilai Ujian Kenaikan Jilid */}
      <div>
        <h3 className="font-bold mb-2">B. Nilai Ujian Kenaikan Jilid</h3>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border text-center text-black">Tanggal Ujian</TableHead>
              <TableHead className="border text-center text-black">Jilid / Tingkat</TableHead>
              <TableHead className="border text-center text-black">Fashohah</TableHead>
              <TableHead className="border text-center text-black">Tajwid</TableHead>
              <TableHead className="border text-center text-black">Kelancaran</TableHead>
              <TableHead className="border text-center text-black">Rata-Rata</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.ujianKenaikanJilid.length > 0 ? (
              data.ujianKenaikanJilid.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="border text-center">{item.tanggal}</TableCell>
                  <TableCell className="border text-center">{item.jilidTingkat}</TableCell>
                  <TableCell className="border text-center">{item.fashohah ?? "-"}</TableCell>
                  <TableCell className="border text-center">{item.tajwid ?? "-"}</TableCell>
                  <TableCell className="border text-center">{item.kelancaran ?? "-"}</TableCell>
                  <TableCell className="border text-center">{item.rataRata ?? "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="border text-center">-</TableCell>
                <TableCell className="border text-center">-</TableCell>
                <TableCell className="border text-center">-</TableCell>
                <TableCell className="border text-center">-</TableCell>
                <TableCell className="border text-center">-</TableCell>
                <TableCell className="border text-center">-</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* C. Nilai Ujian Akhir Tilawah & Tahfidzul Qur'an */}
      <div>
        <h3 className="font-bold mb-2">C. Nilai Ujian Akhir Tilawah & Tahfidzul Qur'an</h3>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border text-center text-black" colSpan={2}>Tilawah Jilid / Al Qur'an</TableHead>
              <TableHead className="border text-center text-black" colSpan={2}>Tahfidzul Qur'an</TableHead>
              <TableHead className="border text-center text-black">Keterangan</TableHead>
            </TableRow>
            <TableRow className="bg-gray-50">
              <TableHead className="border text-center text-black text-xs">Materi</TableHead>
              <TableHead className="border text-center text-black text-xs">Nilai / Predikat</TableHead>
              <TableHead className="border text-center text-black text-xs">Materi</TableHead>
              <TableHead className="border text-center text-black text-xs">Nilai / Predikat</TableHead>
              <TableHead className="border"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border text-center text-xs">{data.ujianAkhir.tilawah.materi || "-"}</TableCell>
              <TableCell className="border text-center text-xs">
                {data.ujianAkhir.tilawah.nilai ? `${data.ujianAkhir.tilawah.nilai} / ${data.ujianAkhir.tilawah.predikat}` : "-"}
              </TableCell>
              <TableCell className="border text-center text-xs">{data.ujianAkhir.tahfidz.materi || "-"}</TableCell>
              <TableCell className="border text-center text-xs">
                {data.ujianAkhir.tahfidz.nilai ? `${data.ujianAkhir.tahfidz.nilai} / ${data.ujianAkhir.tahfidz.predikat}` : "-"}
              </TableCell>
              <TableCell className="border text-xs">{data.ujianAkhir.keterangan}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* D. Prestasi Peserta Didik */}
      <div>
        <h3 className="font-bold mb-2">D. Prestasi Peserta Didik</h3>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="border text-center text-black w-12">No</TableHead>
              <TableHead className="border text-center text-black">Prestasi</TableHead>
              <TableHead className="border text-center text-black w-20">Nilai</TableHead>
              <TableHead className="border text-center text-black w-28">Predikat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => {
              const prestasi = data.prestasi[index];
              return (
                <TableRow key={index}>
                  <TableCell className="border text-center">{index + 1}</TableCell>
                  <TableCell className="border">{prestasi?.prestasi || "-"}</TableCell>
                  <TableCell className="border text-center">{prestasi?.nilai ?? "-"}</TableCell>
                  <TableCell className="border text-center">{prestasi?.predikat || "-"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Target dan Keterangan Predikat */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold mb-2 text-xs">Target Pencapaian Tahfidz</h4>
          <Table className="border text-xs">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="border text-center text-black">Kelas</TableHead>
                <TableHead className="border text-center text-black">Semester</TableHead>
                <TableHead className="border text-center text-black">Materi Surat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="border text-center" rowSpan={2}>VII</TableCell>
                <TableCell className="border text-center">Ganjil</TableCell>
                <TableCell className="border text-center">1 juz</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border text-center">Genap</TableCell>
                <TableCell className="border text-center">1 juz</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border text-center" rowSpan={2}>VIII</TableCell>
                <TableCell className="border text-center">Ganjil</TableCell>
                <TableCell className="border text-center">1 juz</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border text-center">Genap</TableCell>
                <TableCell className="border text-center">1 juz</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border text-center" rowSpan={2}>IX</TableCell>
                <TableCell className="border text-center">Ganjil</TableCell>
                <TableCell className="border text-center">1 juz</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="border text-center">Genap</TableCell>
                <TableCell className="border text-center">1 juz</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2 text-xs">Keterangan Predikat</h4>
          <div className="space-y-1 text-xs border p-3">
            <div>Nilai 93-100 = Mumtaz Murtafi'</div>
            <div>Nilai 86-92 = Mumtaz</div>
            <div>Nilai 78-85 = Jayyid Jiddan</div>
            <div>Nilai 70-77 = Jayyid</div>
            <div>Nilai &lt; 70 = Maqbul</div>
          </div>
        </div>
      </div>

      {/* Tanda Tangan */}
      <div className="grid grid-cols-2 gap-8 pt-8">
        <div className="text-center">
          <p className="mb-16">Orang Tua / Wali</p>
          <p className="border-b border-black inline-block px-16">( ........................... )</p>
        </div>
        <div className="text-center">
          <p className="mb-2">Sidoarjo, {data.tanggalCetak}</p>
          <p className="mb-14">Wali Kelas</p>
          <p className="border-b border-black inline-block px-4">({data.waliKelas})</p>
        </div>
      </div>
      
      <div className="text-center pt-4">
        <p className="mb-2">Mengetahui,</p>
        <p className="mb-14">Kepala Sekolah</p>
        <p className="border-b border-black inline-block px-4">({data.kepalaSekolah})</p>
      </div>
    </div>
  );
};
