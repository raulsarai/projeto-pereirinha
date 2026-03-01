"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getUnreadLeadsCount } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  Timer,
  FolderOpen,
  Megaphone,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Sliders,
  HelpCircle,
  Quote,
  Building,
  PlayCircle,
  Image as ImageIcon,
  CreditCard,
  LayoutPanelTop,
  CircleDollarSign,
  CalendarCheck,
  ArrowDownUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users, showBadge: true },
  { href: "/admin/inscricoes", label: "Inscrições", icon: Users },
  { href: "/admin/vagas", label: "Vagas", icon: Settings },
  { href: "/admin/contador", label: "Contador", icon: Timer },
  { href: "/admin/categorias", label: "Categorias", icon: FolderOpen },
  { href: "/admin/comunicados", label: "Comunicados", icon: Megaphone },
  { href: "/admin/configuracoes", label: "Configurações", icon: Sliders },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: Quote },
  { href: "/admin/parceiros", label: "Parceiros", icon: Building },
  { href: "/admin/video", label: "Vídeo Promocional", icon: PlayCircle },
  { href: "/admin/galeria", label: "Galeria de Fotos", icon: ImageIcon },
  { href: "/admin/pagamento", label: "Pagamento", icon: CreditCard },
  { href: "/admin/popup", label: "Pop-up de Captura", icon: LayoutPanelTop },
  { href: "/admin/pricing", label: "Preços", icon: CircleDollarSign },
  { href: "/admin/agendamento", label: "Agendamento", icon: CalendarCheck },
  { href: "/admin/ordenacao", label: "Ordenação", icon: ArrowDownUp },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchCount = async () => {
    try {
      const count = await getUnreadLeadsCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Erro ao buscar contagem de leads:", error);
    }
  };

  useEffect(() => {
    fetchCount();
    // Verifica novos leads a cada 30 segundos
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-card transition-all duration-200 sticky top-0",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-lg shadow-accent/20">
          <Trophy className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-black uppercase tracking-tight text-foreground">
              Pereirinha
            </span>
            <span className="truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              White Label Admin
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-md shadow-accent/10"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive && "text-accent-foreground")} />
                  
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}

                  {/* Badge de Notificação Integrado */}
                  {item.showBadge && unreadCount > 0 && (
                    <span className={cn(
                      "flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white animate-pulse shadow-lg shadow-red-500/20",
                      collapsed ? "absolute -top-1 -right-1 border-2 border-card" : "ml-auto"
                    )}>
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-4 space-y-2">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive",
          )}
          title={collapsed ? "Sair da Conta" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sair da Conta</span>}
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-10 rounded-xl hover:bg-muted"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Recolher</span>
            </div>
          )}
        </Button>
      </div>
    </aside>
  );
}