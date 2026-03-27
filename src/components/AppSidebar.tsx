import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
  FileText,
  ClipboardCheck,
  Heart,
  Star,
  Trophy,
  Users,
  BookMarked,
  GraduationCap,
  UserCog,
  Megaphone,
  Settings,
  LogOut,
  Award,
  FileSpreadsheet,
  School,
  BookOpenCheck,
  Import,
  User,
  Target,
  PenTool,
  Globe,
  
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type MenuItem = {
  title: string;
  url?: string;
  icon: any;
  children?: MenuItem[];
};

const setoranItems: MenuItem[] = [
  { title: "Setoran Harian", url: "/setoran", icon: BookOpen },
  { title: "Drill Hafalan", url: "/drill", icon: Target },
  { title: "Laporan", url: "/laporan", icon: FileText },
];

const penilaianItems: MenuItem[] = [
  {
    title: "Ujian Tahfidz",
    icon: Award,
    children: [
      { title: "Ujian Tasmi' 1 Juz & 5 Juz", url: "/ujian-tasmi", icon: Award },
      { title: "Ujian Tahfidz Semester", url: "/ujian-tahfidz", icon: GraduationCap },
    ],
  },
  {
    title: "Ujian Tilawah",
    icon: BookOpenCheck,
    children: [
      { title: "Ujian Kenaikan Jilid", url: "/tilawah/ujian", icon: Award },
      { title: "Ujian Tilawah Semester", url: "/tilawah/ujian-semester", icon: ClipboardCheck },
    ],
  },
  { title: "Sertifikat Tasmi'", url: "/sertifikat-tasmi", icon: Award },
  { title: "Rapor Tahfidz", url: "/rapor", icon: FileSpreadsheet },
];

const akademikItems: MenuItem[] = [
  { title: "Dashboard Akademik", url: "/akademik/dashboard", icon: GraduationCap },
  { title: "Input Nilai", url: "/akademik/input-nilai", icon: PenTool },
  { title: "Kehadiran", url: "/akademik/kehadiran", icon: ClipboardCheck },
  { title: "Ekstrakurikuler", url: "/akademik/ekskul", icon: Trophy },
  { title: "Profil P5", url: "/akademik/p5", icon: Award },
];

const diniyahItems: MenuItem[] = [
  { title: "Dashboard Diniyah", url: "/diniyah/dashboard", icon: BookMarked },
  { title: "Input Nilai Diniyah", url: "/diniyah/input-nilai", icon: PenTool },
  { title: "Pembiasaan", url: "/akademik/pembiasaan", icon: Heart },
  { title: "Keterampilan Ibadah", url: "/akademik/ibadah", icon: Star },
];

const rekapRaporItems: MenuItem[] = [
  { title: "Rekap & Peringkat", url: "/akademik/rekap", icon: FileText },
  { title: "Rapor Akademik", url: "/akademik/rapor", icon: FileSpreadsheet },
  { title: "Rapor Diniyah", url: "/akademik/rapor-diniyah", icon: FileSpreadsheet },
  { title: "Generate Rapor (AI)", url: "/akademik/rapor-generate", icon: FileSpreadsheet },
];

const masterAkademikItems: MenuItem[] = [
  { title: "Kurikulum & Mapel", url: "/akademik/kurikulum", icon: BookMarked },
  { title: "Komponen Penilaian", url: "/akademik/komponen", icon: ClipboardCheck },
  { title: "Jenis Komponen", url: "/akademik/jenis-komponen", icon: FileText },
  { title: "Impor Data Nilai", url: "/akademik/impor", icon: Import },
];

const masterDataItems: MenuItem[] = [
  { title: "Data Santri", url: "/santri", icon: Users },
  { title: "Data Halaqoh", url: "/halaqoh", icon: BookMarked },
  { title: "Data Kelas", url: "/kelas", icon: School },
  { title: "Data Ustadz", url: "/ustadz", icon: GraduationCap },
  { title: "Akun Pengguna", url: "/users", icon: UserCog },
  { title: "Pengumuman", url: "/pengumuman", icon: Megaphone },
];

function isItemActive(item: MenuItem, pathname: string): boolean {
  if (item.url && pathname === item.url.split("?")[0]) return true;
  if (item.children) return item.children.some((c) => isItemActive(c, pathname));
  return false;
}

function SidebarNestedMenu({
  label,
  icon: Icon,
  items,
}: {
  label: string;
  icon: any;
  items: MenuItem[];
}) {
  const location = useLocation();
  const [open, setOpen] = useState(
    items.some((i) => isItemActive(i, location.pathname))
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => setOpen(!open)}>
          <Icon className="w-4 h-4" />
          <span className="flex-1">{label}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>

      {open &&
        items.map((item) =>
          item.children ? (
            <SidebarSubDropdown key={item.title} item={item} />
          ) : (
            <SidebarMenuItem key={item.url} className="ml-6">
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.url?.split("?")[0]}
              >
                <NavLink to={item.url!}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
    </SidebarMenu>
  );
}

function SidebarSubDropdown({ item }: { item: MenuItem }) {
  const location = useLocation();
  const [open, setOpen] = useState(
    item.children?.some((c) => isItemActive(c, location.pathname)) ?? false
  );

  return (
    <>
      <SidebarMenuItem className="ml-6">
        <SidebarMenuButton onClick={() => setOpen(!open)}>
          <item.icon className="w-4 h-4" />
          <span className="flex-1">{item.title}</span>
          <ChevronDown
            className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
      {open &&
        item.children?.map((child) => (
          <SidebarMenuItem key={child.url} className="ml-12">
            <SidebarMenuButton
              asChild
              isActive={location.pathname === child.url?.split("?")[0]}
            >
              <NavLink to={child.url!}>
                <child.icon className="w-4 h-4" />
                <span>{child.title}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </>
  );
}

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Gagal logout");
    } else {
      toast.success("Berhasil logout");
      navigate("/auth");
    }
  };

  return (
    <Sidebar className="border-r border-border/60 bg-card/95 backdrop-blur-sm">
      <SidebarContent>
        {/* Header */}
        <div className="px-4 py-4" style={{ background: 'linear-gradient(135deg, #015504, #027a07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center shadow-md">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            {open && (
              <div>
                <h2 className="font-bold text-lg text-primary-foreground">Mantaf IMIS</h2>
                <p className="text-xs text-primary-foreground/70">Manajemen Tahfidz</p>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                  <NavLink to="/dashboard">
                    <BookOpen className="w-4 h-4" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Setoran */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNestedMenu label="Setoran" icon={BookOpen} items={setoranItems} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Penilaian */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNestedMenu label="Penilaian" icon={PenTool} items={penilaianItems} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Akademik */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNestedMenu label="Akademik" icon={GraduationCap} items={akademikItems} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Diniyah */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNestedMenu label="Diniyah" icon={BookMarked} items={diniyahItems} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Rekap Nilai & Rapor */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNestedMenu label="Rekap Nilai & Rapor" icon={FileSpreadsheet} items={rekapRaporItems} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Master Data Akademik */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNestedMenu label="Master Akademik" icon={Settings} items={masterAkademikItems} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Master Data */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarNestedMenu label="Master Data" icon={Users} items={masterDataItems} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Profil & Pengaturan */}
        <SidebarGroup>
          <SidebarGroupLabel>Profil & Pengaturan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/profil")}>
                  <NavLink to="/profil">
                    <User className="w-4 h-4" />
                    <span>Profil Saya</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/pengaturan")}>
                  <NavLink to="/pengaturan">
                    <Settings className="w-4 h-4" />
                    <span>Pengaturan</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")}>
                  <NavLink to="/">
                    <Globe className="w-4 h-4" />
                    <span>Landing Page</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
