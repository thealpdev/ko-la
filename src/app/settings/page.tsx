import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { createClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Lock, 
  Globe, 
  Eye, 
  Zap,
  LogOut,
  ChevronRight,
  Settings as SettingsIcon,
  Sparkles
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sistem Ayarları | Koçla",
  description: "Profilinizi yönetin ve sistem tercihlerini yapılandırın.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) redirect("/login");

  const user = await prisma.profile.findUnique({
    where: { id: session.user.id }
  });

  if (!user) redirect("/login");

  const isAdmin = user.role === "COACH";

  return (
    <div className="flex h-screen bg-[#050505] text-foreground overflow-hidden selection:bg-primary/20">
      {isAdmin && <Sidebar />}

      <main className="flex-1 flex flex-col min-w-0 relative overflow-y-auto scrollbar-hide">
        <div className="absolute inset-0 mesh-gradient opacity-10 pointer-events-none" />
        
        <header className="px-10 py-12 flex items-center justify-between relative z-10 border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-center neon-border shadow-2xl">
              <SettingsIcon className="w-8 h-8 text-zinc-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Sistem Ayarları</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-1">Konfigürasyon Paneli v3.0</p>
            </div>
          </div>
          
          {!isAdmin && (
            <Link href="/student" className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
               Terminal'e Dön
            </Link>
          )}
        </header>

        <div className="p-10 max-w-4xl space-y-12 relative z-10">
          {/* Profile Card */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[10px] ml-2">
               <User className="w-4 h-4" />
               <span>Kullanıcı Profili</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white/[0.04] transition-all">
                <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/5 neon-border">
                  <span className="text-3xl font-black">{user.fullName?.[0] || user.email[0].toUpperCase()}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-white">{user.fullName || "İsimsiz Kullanıcı"}</p>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{user.email}</p>
                  <div className="pt-2">
                    <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-widest neon-border">
                      {user.role} ERIŞIMI
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Hesap Durumu</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       Aktif
                    </span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Üyelik Tipi</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Elite Premium</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Katılım Tarihi</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                 </div>
              </div>
            </div>
          </section>

          {/* Settings Groups */}
          <section className="space-y-8">
             <div className="grid grid-cols-1 gap-4">
                <SettingsToggle 
                  icon={<Bell className="text-orange-500" />} 
                  title="Anlık Bildirimler" 
                  description="Görevler ve koç mesajları hakkında uyarı al."
                  enabled={true}
                />
                <SettingsToggle 
                  icon={<Eye className="text-blue-500" />} 
                  title="Gizli Mod" 
                  description="Aktiflik durumunu diğerlerinden gizle."
                  enabled={false}
                />
                <SettingsToggle 
                  icon={<Globe className="text-emerald-500" />} 
                  title="Otomatik Senkronizasyon" 
                  description="Verileri tüm cihazlarda anlık güncelle."
                  enabled={true}
                />
             </div>
          </section>

          {/* Danger Zone */}
          <section className="pt-12 border-t border-white/5 space-y-8 text-center md:text-left">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                   <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Oturumu Güvenli Kapat</h4>
                   <p className="text-sm text-zinc-600 font-medium">Mevcut cihazdaki bağlantını sonlandırmak üzeresin.</p>
                </div>
                <form action={signOut}>
                  <button 
                    type="submit"
                    className="flex items-center gap-3 px-10 py-5 rounded-[1.5rem] bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 text-xs font-black uppercase tracking-[0.2em] transition-all group"
                  >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Oturumu Sonlandır
                  </button>
                </form>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function SettingsToggle({ icon, title, description, enabled }: { icon: React.ReactNode, title: string, description: string, enabled: boolean }) {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
          <p className="text-[10px] text-zinc-600 font-medium">{description}</p>
        </div>
      </div>
      <div className={cn(
        "w-12 h-6 rounded-full relative transition-colors duration-500",
        enabled ? "bg-primary/40 border border-primary/40" : "bg-white/5 border border-white/10"
      )}>
        <div className={cn(
          "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-500",
          enabled ? "right-1 bg-primary shadow-[0_0_8px_oklch(60%_0.2_300)]" : "left-1 bg-zinc-700"
        )} />
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

import Link from "next/link";
