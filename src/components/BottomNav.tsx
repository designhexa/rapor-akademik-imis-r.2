import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  GraduationCap,
  Settings,
  User,
  ClipboardList,
  Award,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function BottomNav() {
  const location = useLocation();
  const [laporanOpen, setLaporanOpen] = useState(false);
  const [ujianOpen, setUjianOpen] = useState(false);
  const [pengaturanOpen, setPengaturanOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isLaporanActive = location.pathname === "/laporan" || location.pathname === "/rapor" || location.pathname === "/drill" || location.pathname === "/sertifikat-tasmi";
  const isUjianActive = ["/ujian-tasmi", "/ujian-tahfidz", "/tilawah/ujian", "/tilawah/ujian-semester"].some(
    (p) => location.pathname.startsWith(p)
  );
  const isPengaturanActive = location.pathname === "/pengaturan" || location.pathname === "/profil";

  const SheetMenu = ({
    open,
    onOpenChange,
    title,
    icon: Icon,
    label,
    active,
    items,
  }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    title: string;
    icon: React.ElementType;
    label: string;
    active: boolean;
    items: { title: string; url: string; icon?: React.ElementType }[];
  }) => (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          className={cn(
            "flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg transition-colors",
            active ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto max-h-[60vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          {items.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              onClick={() => onOpenChange(false)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                location.pathname === item.url
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
              )}
            >
              {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
              <span className="text-sm font-medium">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border/60 md:hidden">
      <div className="flex items-center justify-around h-16 px-1">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={cn(
            "flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg transition-colors",
            isActive("/dashboard") ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </NavLink>

        {/* Setoran */}
        <NavLink
          to="/setoran"
          className={cn(
            "flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg transition-colors",
            isActive("/setoran") ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium">Setoran</span>
        </NavLink>

        {/* Laporan - Sheet */}
        <SheetMenu
          open={laporanOpen}
          onOpenChange={setLaporanOpen}
          title="Laporan"
          icon={FileText}
          label="Laporan"
          active={isLaporanActive}
          items={[
            { title: "Laporan Harian", url: "/laporan", icon: ClipboardList },
            { title: "Riwayat Drill", url: "/drill", icon: Target },
            { title: "Sertifikat Tasmi'", url: "/sertifikat-tasmi", icon: Award },
            { title: "Rapor Tahfidz", url: "/rapor", icon: Award },
          ]}
        />

        {/* Ujian - Sheet */}
        <SheetMenu
          open={ujianOpen}
          onOpenChange={setUjianOpen}
          title="Ujian & Penilaian"
          icon={GraduationCap}
          label="Ujian"
          active={isUjianActive}
          items={[
            { title: "Ujian Tasmi'", url: "/ujian-tasmi", icon: GraduationCap },
            { title: "Ujian Tahfidz", url: "/ujian-tahfidz", icon: GraduationCap },
            { title: "Ujian Naik Jilid", url: "/tilawah/ujian", icon: GraduationCap },
            { title: "Ujian Tilawah", url: "/tilawah/ujian-semester", icon: GraduationCap },
          ]}
        />

        {/* Pengaturan - Sheet */}
        <SheetMenu
          open={pengaturanOpen}
          onOpenChange={setPengaturanOpen}
          title="Pengaturan"
          icon={Settings}
          label="Lainnya"
          active={isPengaturanActive}
          items={[
            { title: "Pengaturan", url: "/pengaturan", icon: Settings },
            { title: "Profil", url: "/profil", icon: User },
          ]}
        />
      </div>
    </nav>
  );
}
