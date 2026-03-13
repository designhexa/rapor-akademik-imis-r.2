import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { BottomNav } from "./BottomNav";
import { useTheme } from "next-themes";
import { Moon, Sun, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  // TODO: Replace with actual role check from auth context
  // For now, show bottom nav on mobile for all users
  const showBottomNav = isMobile;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-x-hidden relative">
        {/* Subtle ornamental background matching home */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full border-[30px] border-primary/[0.03]" />
          <div className="absolute bottom-0 -left-16 w-[250px] h-[250px] rounded-full bg-secondary/[0.03]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.01] rounded-full blur-3xl" />
        </div>

        {/* Sidebar only visible on desktop */}
        {!isMobile && <AppSidebar />}

        <div className="flex-1 flex flex-col overflow-x-hidden relative z-[1]">
          {/* Header */}
          <header className="h-14 md:h-16 border-b border-border/60 bg-card/80 backdrop-blur-sm px-3 md:px-4 flex items-center justify-between sticky top-0 z-10">
            {!isMobile && <SidebarTrigger />}
            
            {isMobile && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="text-lg font-bold text-primary">
                  Mantaf IMIS
                </h1>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </header>

          {/* Main Content */}
          <main className={`flex-1 p-4 md:p-6 overflow-x-hidden ${showBottomNav ? "pb-20" : ""}`}>
            {children}
          </main>
        </div>
      </div>

      {showBottomNav && <BottomNav />}
    </SidebarProvider>
  );
}