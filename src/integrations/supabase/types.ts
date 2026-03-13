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
      kelas: {
        Row: {
          created_at: string
          deskripsi: string | null
          id: string
          id_wali_kelas: string | null
          nama_kelas: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          id?: string
          id_wali_kelas?: string | null
          nama_kelas: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          id?: string
          id_wali_kelas?: string | null
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
    },
  },
} as const
