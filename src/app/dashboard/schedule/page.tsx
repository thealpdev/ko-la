import { createClient } from "@/lib/supabase-server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { WeeklySchedule } from "@/components/dashboard/WeeklySchedule";
import { getWeeklySchedule } from "@/app/actions/schedule";
import { 
  Plus, 
  Calendar, 
  Bell, 
  Search,
  Sparkles
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function CoachSchedulePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;
  const schedule = await getWeeklySchedule(userId);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="absolute inset-0 mesh-gradient opacity-10 pointer-events-none" />
        
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-background/50 backdrop-blur-3xl z-30">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Takvimde Ara..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-white/[0.05] transition-all outline-none placeholder:text-zinc-600 font-medium"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/[0.05] border border-white/5 text-zinc-500 hover:text-primary transition-all">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide relative z-10">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_oklch(60%_0.2_300)]" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Zaman Yönetimi</p>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Şahsi Programım</h1>
            <p className="text-zinc-500 font-medium">Haftalık koçluk ve etüt planınızı buradan organize edin.</p>
          </div>

          <div className="max-w-6xl">
            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
               <WeeklySchedule studentId={userId} initialEntries={schedule} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
