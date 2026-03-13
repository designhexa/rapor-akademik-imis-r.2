export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      absensi: {
        Row: {
          created_at: string | null
          id: string
          id_santri: string
          keterangan: string | null
          status_kehadiran: string | null
          tanggal: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          id_santri: string
          keterangan?: string | null
          status_kehadiran?: string | null
          tanggal?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          id_santri?: string
          keterangan?: string | null
          status_kehadiran?: string | null
          tanggal?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "absensi_id_santri_fkey"
            columns: ["id_santri"]
            isOneToOne: false
            referencedRelation: "santri"
            referencedColumns: ["id"]
          },
        ]
      }
      capaian_kompetensi: {
        Row: {
          ai_generated: boolean | null
          created_at: string | null
          deskripsi: string | null
          id: string
          id_mapel: string
          id_santri: string
          id_tahun_ajaran: string | null
          nilai_akhir: number | null
          predikat: string | null
          updated_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          id_mapel: string
          id_santri: string
          id_tahun_ajaran?: string | null
          nilai_akhir?: number | null
          predikat?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          id_mapel?: string
          id_santri?: string
          id_tahun_ajaran?: string | null
          nilai_akhir?: number | null
          predikat?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "capaian_kompetensi_id_mapel_fkey"
            columns: ["id_mapel"]
            isOneToOne: false
            referencedRelation: "mata_pelajaran"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capaian_kompetensi_id_santri_fkey"
            columns: ["id_santri"]
            isOneToOne: false
            referencedRelation: "santri"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capaian_kompetensi_id_tahun_ajaran_fkey"
            columns: ["id_tahun_ajaran"]
            isOneToOne: false
            referencedRelation: "tahun_ajaran"
            referencedColumns: ["id"]
          },
        ]
      }
      ekstrakurikuler: {
        Row: {
          aktif: boolean | null
          created_at: string | null
          id: string
          nama: string
        }
        Insert: {
          aktif?: boolean | null
          created_at?: string | null
          id?: string
          nama: string
        }
        Update: {
          aktif?: boolean | null
          created_at?: string | null
          id?: string
          nama?: string
        }
        Relationships: []
      }
      halaqoh: {
        Row: {
          created_at: string | null
          id: string
          id_asatidz: string | null
          jumlah_santri: number | null
          nama_halaqoh: string
          tingkat: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          id_asatidz?: string | null
          jumlah_santri?: number | null
          nama_halaqoh: string
          tingkat?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          id_asatidz?: string | null
          jumlah_santri?: number | null
          nama_halaqoh?: string
          tingkat?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kehadiran_akademik: {
        Row: {
          alpha: number | null
          bulan: number
          created_at: string | null
          id: string
          id_santri: string
          id_tahun_ajaran: string | null
          izin: number | null
          sakit: number | null
          tahun: number
        }
        Insert: {
          alpha?: number | null
          bulan: number
          created_at?: string | null
          id?: string
          id_santri: string
          id_tahun_ajaran?: string | null
          izin?: number | null
          sakit?: number | null
          tahun: number
        }
        Update: {
          alpha?: number | null
          bulan?: number
          created_at?: string | null
          id?: string
          id_santri?: string
          id_tahun_ajaran?: string | null
          izin?: number | null
          sakit?: number | null
          tahun?: number
        }
        Relationships: [
          {
            foreignKeyName: "kehadiran_akademik_id_santri_fkey"
            columns: ["id_santri"]
            isOneToOne: false
            referencedRelation: "santri"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kehadiran_akademik_id_tahun_ajaran_fkey"
            columns: ["id_tahun_ajaran"]
            isOneToOne: false
            referencedRelation: "tahun_ajaran"
            referencedColumns: ["id"]
          },
        ]
      }
      kelas: {
        Row: {
          created_at: string
          deskripsi: string | null
          id: string
          id_wali_kelas: string | null
          jenjang: Database["public"]["Enums"]["jenjang_sekolah"] | null
          nama_kelas: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          id?: string
          id_wali_kelas?: string | null
          jenjang?: Database["public"]["Enums"]["jenjang_sekolah"] | null
          nama_kelas: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          id?: string
          id_wali_kelas?: string | null
          jenjang?: Database["public"]["Enums"]["jenjang_sekolah"] | null
          nama_kelas?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kelas_id_wali_kelas_fkey"
            columns: ["id_wali_kelas"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      keterampilan_ibadah: {
        Row: {
          created_at: string | null
          id: string
          id_santri: string
          id_tahun_ajaran: string | null
          jenis: string
          kkm: number | null
          nilai: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          id_santri: string
          id_tahun_ajaran?: string | null
          jenis: string
          kkm?: number | null
          nilai?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          id_santri?: string
          id_tahun_ajaran?: string | null
          jenis?: string
          kkm?: number | null
          nilai?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "keterampilan_ibadah_id_santri_fkey"
            columns: ["id_santri"]
            isOneToOne: false
            referencedRelation: "santri"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "keterampilan_ibadah_id_tahun_ajaran_fkey"
            columns: ["id_tahun_ajaran"]
            isOneToOne: false
            referencedRelation: "tahun_ajaran"
            referencedColumns: ["id"]
          },
        ]
      }
      komponen_nilai: {
        Row: {
          bobot: number | null
          created_at: string | null
          id: string
          id_mapel: string
          id_tahun_ajaran: string | null
          jenis: Database["public"]["Enums"]["jenis_penilaian"]
          kelas: string | null
          nama_komponen: string
          urutan: number | null
        }
        Insert: {
          bobot?: number | null
          created_at?: string | null
          id?: string
          id_mapel: string
          id_tahun_ajaran?: string | null
          jenis?: Database["public"]["Enums"]["jenis_penilaian"]
          kelas?: string | null
          nama_komponen: string
          urutan?: number | null
        }
        Update: {
          bobot?: number | null
          created_at?: string | null
          id?: string
          id_mapel?: string
          id_tahun_ajaran?: string | null
          jenis?: Database["public"]["Enums"]["jenis_penilaian"]
          kelas?: string | null
          nama_komponen?: string
          urutan?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "komponen_nilai_id_mapel_fkey"
            columns: ["id_mapel"]
            isOneToOne: false
            referencedRelation: "mata_pelajaran"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "komponen_nilai_id_tahun_ajaran_fkey"
            columns: ["id_tahun_ajaran"]
            isOneToOne: false
            referencedRelation: "tahun_ajaran"
            referencedColumns: ["id"]
          },
        ]
      }
      log_aktivitas: {
        Row: {
          aksi: string
          id: string
          id_user: string | null
          waktu: string | null
        }
        Insert: {
          aksi: string
          id?: string
          id_user?: string | null
          waktu?: string | null
        }
        Update: {
          aksi?: string
          id?: string
          id_user?: string | null
          waktu?: string | null
        }
        Relationships: []
      }
      mata_pelajaran: {
        Row: {
          aktif: boolean | null
          created_at: string | null
          id: string
          jenjang: Database["public"]["Enums"]["jenjang_sekolah"]
          kategori: Database["public"]["Enums"]["kategori_mapel"]
          kkm: number | null
          kode: string | null
          nama: string
          updated_at: string | null
          urutan: number | null
        }
        Insert: {
          aktif?: boolean | null
          created_at?: string | null
          id?: string
          jenjang?: Database["public"]["Enums"]["jenjang_sekolah"]
          kategori?: Database["public"]["Enums"]["kategori_mapel"]
          kkm?: number | null
          kode?: string | null
          nama: string
          updated_at?: string | null
          urutan?: number | null
        }
        Update: {
          aktif?: boolean | null
          created_at?: string | null
          id?: string
          jenjang?: Database["public"]["Enums"]["jenjang_sekolah"]
          kategori?: Database["public"]["Enums"]["kategori_mapel"]
          kkm?: number | null
          kode?: string | null
          nama?: string
          updated_at?: string | null
          urutan?: number | null
        }
        Relationships: []
      }
      materi_pelajaran: {
        Row: {
          created_at: string | null
          deskripsi_materi: string | null
          id: string
          id_mapel: string
          id_tahun_ajaran: string | null
          kelas: string
        }
        Insert: {
          created_at?: string | null
          deskripsi_materi?: string | null
          id?: string
          id_mapel: string
          id_tahun_ajaran?: string | null
          kelas: string
        }
        Update: {
          created_at?: string | null
          deskripsi_materi?: string | null
          id?: string
          id_mapel?: string
          id_tahun_ajaran?: string | null
          kelas?: string
        }
        Relationships: [
          {
            foreignKeyName: "materi_pelajaran_id_mapel_fkey"
            columns: ["id_mapel"]
            isOneToOne: false
            referencedRelation: "mata_pelajaran"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materi_pelajaran_id_tahun_ajaran_fkey"
            columns: ["id_tahun_ajaran"]
            isOneToOne: false
            referencedRelation: "tahun_ajaran"
            referencedColumns: ["id"]
          },
        ]
      }
      nilai_akademik: {
        Row: {
          catatan: string | null
          created_at: string | null
          id: string
          id_guru: string | null
          id_komponen: string
          id_santri: string
          id_tahun_ajaran: string | null
          nilai: number | null
          updated_at: string | null
        }
        Insert: {
          catatan?: string | null
          created_at?: string | null
          id?: string
          id_guru?: string | null
          id_komponen: string
          id_santri: string
          id_tahun_ajaran?: string | null
          nilai?: number | null
          updated_at?: string | null
        }
        Update: {
          catatan?: string | null
          created_at?: string | null
          id?: string
          id_guru?: string | null
          id_komponen?: string
          id_santri?: string
          id_tahun_ajaran?: string | null
          nilai?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nilai_akademik_id_komponen_fkey"
            columns: ["id_komponen"]
            isOneToOne: false
            referencedRelation: "komponen_nilai"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nilai_akademik_id_santri_fkey"
            columns: ["id_santri"]
            isOneToOne: false
            referencedRelation: "santri"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nilai_akademik_id_tahun_ajaran_fkey"
            columns: ["id_tahun_ajaran"]
            isOneToOne: false
            referencedRelation: "tahun_ajaran"
            referencedColumns: ["id"]
          },
        ]
      }
      nilai_ekskul: {
        Row: {
          created_at: string | null
          hasil_akhir: number | null
          id: string
          id_ekskul: string
          id_santri: string
          id_tahun_ajaran: string | null
          konversi_nilai: number | null
          nilai_praktik: number | null
          rekap_kehadiran: number | null
        }
        Insert: {
          created_at?: string | null
          hasil_akhir?: number | null
          id?: string
          id_ekskul: string
          id_santri: string
          id_tahun_ajaran?: string | null
          konversi_nilai?: number | null
          nilai_praktik?: number | null
          rekap_kehadiran?: number | null
        }
        Update: {
          created_at?: string | null
          hasil_akhir?: number | null
          id?: string
          id_ekskul?: string
          id_santri?: string
          id_tahun_ajaran?: string | null
          konversi_nilai?: number | null
          nilai_praktik?: number | null
          rekap_kehadiran?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nilai_ekskul_id_ekskul_fkey"
            columns: ["id_ekskul"]
            isOneToOne: false
            referencedRelation: "ekstrakurikuler"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nilai_ekskul_id_santri_fkey"
            columns: ["id_santri"]
            isOneToOne: false
            referencedRelation: "santri"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nilai_ekskul_id_tahun_ajaran_fkey"
            columns: ["id_tahun_ajaran"]
            isOneToOne: false
            referencedRelation: "tahun_ajaran"
            referencedColumns: ["id"]
          },
        ]
      }
      pembiasaan: {
        Row: {
          created_at: string | null
          id: string
          id_santri: string
          id_tahun_ajaran: string | null
          lokasi: string
          nilai: Database["public"]["Enums"]["predikat_pembiasaan"] | null
          nomor: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          id_santri: string
          id_tahun_ajaran?: string | null
          lokasi: string
          nilai?: Database["public"]["Enums"]["predikat_pembiasaan"] | null
          nomor: number
        }
        Update: {
          created_at?: string | null
          id?: string
          id_santri?: string
          id_tahun_ajaran?: string | null
          lokasi?: string
          nilai?: Database["public"]["Enums"]["predikat_pembiasaan"] | null
          nomor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pembiasaan_id_santri_fkey"
            columns: ["id_santri"]
            isOneToOne: false
            referencedRelation: "santri"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pembiasaan_id_tahun_ajaran_fkey"
            columns: ["id_tahun_ajaran"]
            isOneToOne: false
            referencedRelation: "tahun_ajaran"
            referencedColumns: ["id"]
          },
        ]
      }
      pengumuman: {
        Row: {
          created_at: string | null
          dibuat_oleh: string
          id: string
          isi: string
          judul: string
          kategori: string | null
          tanggal_post: string | null
        }
        Insert: {
          created_at?: string | null
          dibuat_oleh: string
          id?: string
          isi: string
          judul: string
          kategori?: string | null
          tanggal_post?: string | null
        }
        Update: {
          created_at?: string | null
          dibuat_oleh?: string
          id?: string
          isi?: string
          judul?: string
          kategori?: string | null
          tanggal_post?: string | null
        }
        Relationships: []
      }
      penilaian: {
        Row: {
          catatan: string | null
          created_at: string | null
          id: string
          id_asatidz: string
          id_santri: string
          kelancaran: number | null
          makharij: number | null
          tajwid: number | null
          tanggal_penilaian: string | null
        }
        Insert: {
          catatan?: string | null
          created_at?: string | null
          id?: string
          id_asatidz: string
          id_santri: string
          kelancaran?: number | null
          makharij?: number | null
          tajwid?: number | null
          tanggal_penilaian?: string | null
        }
        Update: {
          catatan?: string | null
          created_at?: string | null
          id?: string
          id_asatidz?: string
          id_santri?: string
          kelancaran?: number | null
          makharij?: number | null
          tajwid?: number | null
          tanggal_penilaian?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "penilaian_id_santri_fkey"
            columns: ["id_santri"]
            isOneToOne: false
            referencedRelation: "santri"
            referencedColumns: ["id"]
          },
        ]
      }
      profil_p5: {
        Row: {
          created_at: string | null
          deskripsi_elemen: string | null
          dimensi: string
          elemen: string
          id: string
          id_santri: string
          id_tahun_ajaran: string | null
          nilai: Database["public"]["Enums"]["predikat_p5"] | null
        }
        Insert: {
          created_at?: string | null
          deskripsi_elemen?: string | null
          dimensi: string
          elemen: string
          id?: string
          id_santri: string
          id_tahun_ajaran?: string | null
          nilai?: Database["public"]["Enums"]["predikat_p5"] | null
        }
        Update: {
          created_at?: string | null
          deskripsi_elemen?: string | null
          dimensi?: string
          elemen?: string
          id?: string
          id_santri?: string
          id_tahun_ajaran?: string | null
          nilai?: Database["public"]["Enums"]["predikat_p5"] | null
        }
        Relationships: [
          {
            foreignKeyName: "profil_p5_id_santri_fkey"
            columns: ["id_santri"]
            isOneToOne: false
            referencedRelation: "santri"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profil_p5_id_tahun_ajaran_fkey"
            columns: ["id_tahun_ajaran"]
            isOneToOne: false
            referencedRelation: "tahun_ajaran"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aktif: boolean | null
          created_at: string | null
          email: string | null
          id: string
          nama_lengkap: string
          no_hp: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          aktif?: boolean | null
          created_at?: string | null
          email?: string | null
          id: string
          nama_lengkap: string
          no_hp?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          aktif?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          nama_lengkap?: string
          no_hp?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      santri: {
        Row: {
          created_at: string | null
          id: string
          id_halaqoh: string | null
          id_kelas: string | null
          id_wali: string | null
          nama_santri: string
          nis: string
          nisn: string | null
          status: string | null
          tanggal_masuk: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          id_halaqoh?: string | null
          id_kelas?: string | null
          id_wali?: string | null
          nama_santri: string
          nis: string
          nisn?: string | null
          status?: string | null
          tanggal_masuk?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          id_halaqoh?: string | null
          id_kelas?: string | null
          id_wali?: string | null
          nama_santri?: string
          nis?: string
          nisn?: string | null
          status?: string | null
          tanggal_masuk?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "santri_id_halaqoh_fkey"
            columns: ["id_halaqoh"]
            isOneToOne: false
            referencedRelation: "halaqoh"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "santri_id_kelas_fkey"
            columns: ["id_kelas"]
            isOneToOne: false
            referencedRelation: "kelas"
            referencedColumns: ["id"]
          },
        ]
      }
      setoran: {
        Row: {
          ayat_dari: number
          ayat_sampai: number
          catatan: string | null
          created_at: string | null
          id: string
          id_asatidz: string
          id_santri: string
          juz: number
          nilai_kelancaran: number | null
          status: string | null
          tanggal_setoran: string | null
        }
        Insert: {
          ayat_dari: number
          ayat_sampai: number
          catatan?: string | null
          created_at?: string | null
          id?: string
          id_asatidz: string
          id_santri: string
          juz: number
          nilai_kelancaran?: number | null
          status?: string | null
          tanggal_setoran?: string | null
        }
        Update: {
          ayat_dari?: number
          ayat_sampai?: number
          catatan?: string | null
          created_at?: string | null
          id?: string
          id_asatidz?: string
          id_santri?: string
          juz?: number
          nilai_kelancaran?: number | null
          status?: string | null
          tanggal_setoran?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setoran_id_santri_fkey"
            columns: ["id_santri"]
            isOneToOne: false
            referencedRelation: "santri"
            referencedColumns: ["id"]
          },
        ]
      }
      tahun_ajaran: {
        Row: {
          aktif: boolean | null
          created_at: string | null
          id: string
          nama: string
          semester: Database["public"]["Enums"]["semester_type"]
          tanggal_mulai: string | null
          tanggal_selesai: string | null
          updated_at: string | null
        }
        Insert: {
          aktif?: boolean | null
          created_at?: string | null
          id?: string
          nama: string
          semester?: Database["public"]["Enums"]["semester_type"]
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          updated_at?: string | null
        }
        Update: {
          aktif?: boolean | null
          created_at?: string | null
          id?: string
          nama?: string
          semester?: Database["public"]["Enums"]["semester_type"]
          tanggal_mulai?: string | null
          tanggal_selesai?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "Admin" | "Koordinator" | "Asatidz" | "WaliSantri" | "Yayasan"
      jenis_penilaian:
        | "Tugas Harian"
        | "Ujian Lisan"
        | "Ujian Tulis"
        | "Praktikum"
        | "Proyek"
        | "PAS"
        | "PTS"
      jenjang_sekolah: "TK" | "SD" | "SMP"
      kategori_mapel:
        | "Umum"
        | "Agama"
        | "Muatan Lokal"
        | "Pemberdayaan"
        | "Keterampilan"
      predikat_p5: "MB" | "SB" | "BSH" | "SAB"
      predikat_pembiasaan: "A" | "B" | "C" | "D"
      semester_type: "Ganjil" | "Genap"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["Admin", "Koordinator", "Asatidz", "WaliSantri", "Yayasan"],
      jenis_penilaian: [
        "Tugas Harian",
        "Ujian Lisan",
        "Ujian Tulis",
        "Praktikum",
        "Proyek",
        "PAS",
        "PTS",
      ],
      jenjang_sekolah: ["TK", "SD", "SMP"],
      kategori_mapel: [
        "Umum",
        "Agama",
        "Muatan Lokal",
        "Pemberdayaan",
        "Keterampilan",
      ],
      predikat_p5: ["MB", "SB", "BSH", "SAB"],
      predikat_pembiasaan: ["A", "B", "C", "D"],
      semester_type: ["Ganjil", "Genap"],
    },
  },
} as const
