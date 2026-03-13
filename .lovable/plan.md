
# Userflow dan Business Rules - MANTAF-IMIS
## (Sistem Manajemen Tahfidz & Tilawah IMIS)

---

## 1. Gambaran Umum Sistem

MANTAF-IMIS adalah sistem manajemen pendidikan berbasis web yang mengelola tiga pilar utama:
- **Tahfidz** (Hafalan Al-Qur'an)
- **Tilawah** (Membaca Al-Qur'an dengan metode Tilawati)
- **Akademik** (Nilai mata pelajaran umum dan keagamaan)

---

## 2. Peran Pengguna (User Roles)

| Peran | Akses |
|-------|-------|
| **Admin** | Akses penuh ke seluruh sistem, kelola data master, pengguna |
| **Koordinator** | Monitoring keseluruhan, lihat laporan dan dashboard |
| **Asatidz (Ustadz/ah)** | Input setoran, penilaian ujian, kelola halaqoh yang diampu |
| **Wali Santri** | Lihat progres anak (read-only) |
| **Yayasan** | Monitoring tingkat tinggi, lihat laporan |

---

## 3. Modul Tahfidz

### 3.1 Alur Setoran Hafalan
```text
Santri setor hafalan ke Ustadz
        |
        v
Ustadz input di sistem:
  - Pilih santri & tanggal
  - Pilih juz/surah/ayat
  - Beri nilai (kelancaran, tajwid, makhraj)
        |
        v
Sistem catat progres harian
        |
        v
Data masuk ke Laporan & Dashboard
```

**Business Rules:**
- Setiap setoran dicatat per hari per santri
- Nilai mencakup aspek: kelancaran, tajwid, dan makhraj
- Progres dihitung berdasarkan akumulasi baris yang dihafal per bulan

### 3.2 Alur Drill (Latihan Berulang)
```text
Santri selesai hafal 1 juz
        |
        v
Masuk tahap Drill (latihan berulang)
        |
        v
Lulus Drill --> Eligible untuk Tasmi'
```

**Business Rules:**
- Santri harus menyelesaikan drill sebelum boleh ujian Tasmi'
- Eligibility Tasmi': minimal 1 juz selesai + lulus drill

### 3.3 Alur Ujian Tasmi' (per Juz)
```text
Santri eligible
        |
        v
Sistem generate 10 soal acak
  (dari surah dalam juz yang diujikan)
        |
        v
Penguji menilai bacaan santri
        |
        v
Hasil: Lulus / Tidak Lulus
```

**Business Rules:**
- 10 soal acak dari range juz yang diujikan
- Soal berupa titik awal bacaan (surah + ayat)
- Urutan juz: 30, 29, 28, 27, 26, lalu 1, 2, 3, dst.

### 3.4 Target Hafalan per Kelas

| Kelas | Target |
|-------|--------|
| 1 | Juz 30 |
| 2 | Juz 29 |
| 3 | Juz 28 |
| 4 | Juz 27 |
| 5 | Juz 25-26 |
| 6 | Surat Pilihan (Yasin, Al-Mulk, Al-Waqi'ah, Ar-Rahman) |

### 3.5 Rapor Tahfidz
**Business Rules:**
- Rapor per semester (Ganjil: Jul-Des, Genap: Jan-Jun)
- Predikat: Mumtaz Murtafi' (>=93), Mumtaz (>=86), Jayyid Jiddan (>=78), Jayyid (>=70), Maqbul (<70)
- Isi rapor: capaian hafalan bulanan, penilaian adab, pencapaian target, penilaian murajaah, ujian akhir, prestasi

---

## 4. Modul Tilawah (Metode Tilawati)

### 4.1 Struktur Jilid
- 6 jilid utama, masing-masing 44 halaman
- Total: 264 halaman
- Setelah lulus Jilid 6, santri naik ke level Al-Qur'an

### 4.2 Alur Setoran Tilawah Harian
```text
Santri baca halaman tilawati
        |
        v
Ustadz input setoran:
  - Jilid & halaman (dari-sampai)
  - Nilai per aspek sesuai jilid
  - Status: Selesai / Lanjut / Ulang
        |
        v
Sistem update progres halaman santri
```

### 4.3 Aspek Penilaian Dinamis per Jilid

| Jilid | Aspek yang Dinilai |
|-------|--------------------|
| 1-3 | Fashohah + Tartil |
| 4-5 | Fashohah + Tartil + Tajwid Dasar |
| 6 | Fashohah + Tartil + Tajwid Dasar + Ghoribul Qur'an |

### 4.4 Alur Ujian Kenaikan Jilid
```text
Santri selesai 44 halaman dalam jilid
        |
        v
Didaftarkan ujian kenaikan jilid
        |
        v
Penguji menilai per sub-aspek:
  Tartil (maks 10):
    - Kesempurnaan Tajwid: 2
    - Kesempurnaan Kalimat: 2
    - Kelancaran: 4
    - Nafas: 1
    - Waqaf: 1

  Fashohah (maks 10):
    - Makhorijul Huruf: 4
    - Shifatul Huruf: 3
    - Harakat tidak imalah: 2
    - Suara jelas: 1

  Tajwid Dasar (maks 10, jilid 4+):
    - Paham hukum tajwid: 5
    - Mampu menguraikan: 5

  Ghoribul Qur'an (maks 10, jilid 6):
    - Membaca Ghorib: 6
    - Komentar Ghorib: 4
        |
        v
Total Skor Maksimal: 40
Batas lulus: 70% dari skor aktif
        |
        v
   Lulus --> Naik jilid
   Tidak Lulus --> Status "Mengulang"
```

**Business Rules:**
- Durasi ujian: 5 menit per santri
- Skor maks per aspek: 10, total maks: 40
- Batas lulus: 70% dari skor maksimal yang berlaku untuk jilid tersebut
  - Jilid 1-3: 70% x 20 = 14
  - Jilid 4-5: 70% x 30 = 21
  - Jilid 6: 70% x 40 = 28

### 4.5 Alur Remedial
```text
Santri berstatus "Mengulang"
        |
        v
Tombol "Remedial" muncul di keterangan ujian
        |
        v
Penguji menilai ulang aspek yang kurang
        |
        v
Skor diperbarui --> Cek ulang batas lulus
        |
        v
   Lulus --> Naik jilid
   Tidak Lulus --> Tetap "Mengulang"
```

### 4.6 Alur Ujian Tilawah Semester
```text
Akhir semester
        |
        v
Sistem generate 5 soal acak
  (dari Jilid 1 s.d. halaman terakhir santri)
        |
        v
Penguji menilai bacaan
        |
        v
Hasil dicatat untuk rapor semester
```

**Business Rules:**
- 5 soal acak dari rentang halaman yang sudah diselesaikan
- Range: Jilid 1 halaman 1 sampai halaman setoran terakhir

### 4.7 Placement Test
- Peserta: kelas 3 SD - 9 SMP
- Tujuan: menentukan jilid awal Tilawati yang sesuai kemampuan
- Hasil placement test tercatat di data santri

---

## 5. Modul Akademik

### 5.1 Alur Impor Nilai
```text
Admin/Wali Kelas menyiapkan file Excel
  (format: sheet rekap berisi nilai per mapel)
        |
        v
Upload di halaman "Impor Data Nilai"
        |
        v
Sistem parsing dan mapping ke data santri
        |
        v
Data tersedia untuk generate rapor
```

### 5.2 Rapor Akademik
**Komponen Rapor:**
1. **Kompetensi Pengetahuan** (4 kelompok):
   - PAI & Budi Pekerti: Tauhid, Al-Quran Hadits, Fiqih, Sirah, Nahwu
   - Mapel Umum: PKn, B. Indonesia, B. Inggris, Matematika, IPA, IPS, PJOK, Seni Budaya
   - Muatan Lokal: B. Arab, Tajwid
   - Muatan Pemberdayaan: Pemberdayaan, Keterampilan

2. **Keterampilan Ibadah** (KKM: 70):
   - Praktek Wudhu, Shalat, Dzikir Setelah Shalat, Dzikir Pagi Petang

3. **Pembiasaan** (predikat A/B/C/D):
   - Di Sekolah: 12 aspek (tepat waktu, sholat dhuha, dll.)
   - Di Rumah: 12 aspek (5 waktu sholat, murojaah, dll.)

4. **Profil Pelajar Pancasila (P3)**:
   - Predikat: MB, SB, BSH, SAB

5. **Pengembangan Diri & Ketidakhadiran**

**Business Rules Predikat Nilai:**
- A (Sangat Baik): >= 90
- B (Baik): >= 80
- C (Cukup Baik): >= 70
- D (Perlu Belajar Lebih): < 70

### 5.3 Rapor Diniyah
- Fokus pada mata pelajaran keagamaan (di bawah kelompok PAI)
- Format cetak terpisah dari rapor akademik umum
- Menggunakan kop surat resmi lembaga

---

## 6. Modul Master Data

### 6.1 Data Santri
- Atribut: NIS, NISN, nama, kelas, halaqoh, wali santri, tanggal masuk, status
- Detail santri: progres tahfidz, progres tilawah, grafik pencapaian, placement test
- Navigasi ke halaman detail per santri

### 6.2 Data Halaqoh (Kelompok Belajar)
- Setiap halaqoh memiliki 1 ustadz pengampu
- Fitur: tambah halaqoh baru, edit (termasuk pindah ustadz pengampu)
- Tingkat: Pemula, Menengah, Lanjutan

### 6.3 Data Kelas
- 9 kelas: KBTK A, KBTK B, Paket A (Kelas 3-6), Paket B (Kelas 7-9)

### 6.4 Data Ustadz
- Atribut: nama, email, telepon, status

### 6.5 Akun Pengguna
- Kelola semua user: Admin, Koordinator, Asatidz, WaliSantri, Yayasan

### 6.6 Pengumuman
- Fitur pengumuman untuk seluruh pengguna

---

## 7. Alur Autentikasi
```text
Pengguna buka aplikasi
        |
        v
Belum login --> Halaman Auth (Login/Daftar)
        |
        v
Login: email + password
Daftar: nama, username, email, password
        |
        v
Berhasil --> Redirect ke Dashboard
        |
        v
Logout --> Kembali ke halaman Auth
```

**Business Rules:**
- Password minimal 6 karakter
- Email harus valid dan unik
- Username minimal 3 karakter

---

## 8. Detail Santri (Halaman Profil Individual)
```text
Klik santri di Data Santri
        |
        v
Halaman Detail Santri:
  - Identitas lengkap
  - Progres Tahfidz (jumlah juz, grafik bulanan)
  - Progres Tilawah (jilid saat ini, halaman, progress bar)
  - Riwayat Penilaian (tabel + grafik LineChart/BarChart)
  - Info Placement Test
```

---

## 9. Struktur Navigasi

```text
MANTAF-IMIS
|
+-- Tahfidz
|   +-- Dashboard (statistik target, calon tasmi')
|   +-- Setoran Hafalan
|   +-- Laporan Hafalan
|   +-- Ujian Tasmi'
|   +-- Ujian Tahfidz
|   +-- Rapor Tahfidz
|
+-- Tilawah
|   +-- Dashboard (statistik setoran harian)
|   +-- Setoran Tilawah
|   +-- Laporan Tilawah
|   +-- Ujian Kenaikan Jilid (+ Remedial)
|   +-- Ujian Tilawah Semester
|   +-- Rapor Tilawah
|
+-- Akademik
|   +-- Dashboard
|   +-- Impor Data Nilai
|   +-- Rapor Akademik
|   +-- Rapor Diniyah
|
+-- Master Data
|   +-- Data Santri (+ Detail per Santri)
|   +-- Data Halaqoh
|   +-- Data Kelas
|   +-- Data Ustadz
|   +-- Akun Pengguna
|   +-- Pengumuman
|
+-- Profil & Pengaturan
    +-- Profil Saya
    +-- Pengaturan
    +-- Keluar
```

---

## 10. Ringkasan Business Rules Kritis

| No | Rule | Detail |
|----|------|--------|
| 1 | Eligibility Tasmi' | Min. 1 juz selesai + lulus drill |
| 2 | Ujian Tasmi' | 10 soal acak dari juz target |
| 3 | Urutan Juz Hafalan | 30, 29, 28, 27, 26, lalu 1, 2, 3, dst. |
| 4 | Aspek Penilaian Tilawah | Dinamis per jilid (2/3/4 aspek) |
| 5 | Batas Lulus Kenaikan Jilid | 70% dari skor maks aktif |
| 6 | Remedial | Hanya untuk santri berstatus "Mengulang" |
| 7 | Ujian Semester Tilawah | 5 soal acak dari halaman yang sudah diselesaikan |
| 8 | Placement Test | Menentukan jilid awal (kelas 3-9) |
| 9 | Target Kelas | Setiap kelas punya target juz spesifik |
| 10 | Predikat Tahfidz | Mumtaz Murtafi' / Mumtaz / Jayyid Jiddan / Jayyid / Maqbul |
| 11 | Predikat Akademik | A (>=90) / B (>=80) / C (>=70) / D (<70) |
| 12 | Skor Ujian Tilawah | Maks 10 per aspek, total maks 40 |
