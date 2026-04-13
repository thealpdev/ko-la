"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Zap,
  ChevronRight,
  GraduationCap,
  Sparkles,
  CalendarDays
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@supabase/ssr";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function NavItem({ icon, label, href, active = false }: NavItemProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
        active 
          ? "bg-primary/10 text-primary border border-primary/20 neon-border" 
          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]"
      )}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full shadow-[0_0_10px_oklch(60%_0.2_300)]" />
      )}
      <span className={cn(
        "transition-transform duration-300 group-hover:scale-110",
        active ? "text-primary drop-shadow-[0_0_8px_oklch(60%_0.2_300/_0.4)]" : "text-zinc-500 group-hover:text-zinc-300"
      )}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      );
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();
  }, []);


  const role = user?.user_metadata?.role || "STUDENT";
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Kullanıcı";

  return (
    <aside className="w-72 border-r border-white/5 flex flex-col bg-background/50 backdrop-blur-3xl z-40">
      <div className="p-8">
        <Link href={role === "COACH" ? "/dashboard" : "/student"} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center neon-border">
            <Zap className="w-6 h-6 text-primary drop-shadow-[0_0_8px_oklch(60%_0.2_300)]" />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-glow">Koçla</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Navigasyon</p>
        </div>
        {role === "COACH" ? (
          <>
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Kontrol Paneli" 
              href="/dashboard"
              active={pathname === "/dashboard"} 
            />
            <NavItem 
              icon={<Users size={20} />} 
              label="Öğrencilerim" 
              href="/dashboard" 
              active={pathname.startsWith("/dashboard/students")}
            />
            <NavItem 
              icon={<CalendarDays size={20} />} 
              label="Şahsi Programım" 
              href="/dashboard/schedule"
              active={pathname === "/dashboard/schedule"} 
            />
            <NavItem 
              icon={<BarChart3 size={20} />} 
              label="Genel Analizler" 
              href="/dashboard/analytics"
              active={pathname === "/dashboard/analytics"} 
            />
          </>
        ) : (
          <NavItem 
            icon={<Zap size={20} />} 
            label="Odak Modu" 
            href="/student"
            active={pathname === "/student"} 
          />
        )}
        
        <NavItem 
          icon={<Settings size={20} />} 
          label="Sistem Ayarları" 
          href="/settings"
          active={pathname === "/settings"} 
        />
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 transition-all cursor-pointer group hover:bg-white/[0.05]">
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_oklch(60%_0.2_300/_0.2)]">
            {role === "COACH" ? <Sparkles size={24} /> : <GraduationCap size={24} />}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-bold truncate tracking-tight">{fullName}</span>
            <span className="text-[9px] text-primary font-black uppercase tracking-widest opacity-80">
              {role === "COACH" ? "Eğitmen" : "Öğrenci"}
            </span>
          </div>
        </div>
        
        <form action={signOut} className="w-full">
          <button 
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400/80 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all group"
          >
            <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
            Oturumu Kapat
          </button>
        </form>
      </div>
    </aside>
  );
}

