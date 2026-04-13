import { getMyStudents } from "@/app/actions/student";
import { getDashboardSummary } from "@/app/actions/stats";
import { 
  Plus, 
  Users, 
  ChevronRight, 
  BookOpen, 
  BarChart3, 
  Search,
  Bell,
  GraduationCap,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Activity
} from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { AddStudentModal } from "@/components/dashboard/AddStudentModal";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const [students, summary] = await Promise.all([
    getMyStudents(),
    getDashboardSummary()
  ]);

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
                placeholder="Evrensel Arama..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-white/[0.05] transition-all outline-none placeholder:text-zinc-600 font-medium"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/[0.05] border border-white/5 text-zinc-500 hover:text-primary transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_oklch(60%_0.2_300)]" />
            </button>
            <div className="h-8 w-px bg-white/5 mx-2" />
            <AddStudentModal />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide relative z-10">
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_oklch(60%_0.2_300)]" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Filo Komutası</p>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Genel Bakış</h1>
            <p className="text-zinc-500 font-medium">Portföyünüzdeki tüm öğrencilerin anlık performans verileri.</p>
          </div>

          {/* Global Telemetry Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-slide-up">
             <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <Users size={20} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Aktif Dehalar</span>
                </div>
                <div className="text-5xl font-black text-white">{summary?.totalStudents || 0}</div>
             </div>

             <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                      <Zap size={20} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bugün Çözülen</span>
                </div>
                <div className="text-5xl font-black text-white">{summary?.totalQuestionsToday || 0}</div>
             </div>

             <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                      <TrendingUp size={20} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Haftalık Ortalama</span>
                </div>
                <div className="text-5xl font-black text-white">%{summary?.avgGoalCompletion || 0}</div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-scale-in">
            {students.length > 0 ? (
              students.map((student) => (
                <Link key={student.id} href={`/dashboard/students/${student.id}`}>
                  <Card className="group relative border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500 cursor-pointer rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] active:scale-[0.98]">
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Sparkles className="w-6 h-6 text-primary drop-shadow-[0_0_8px_oklch(60%_0.2_300)]" />
                    </div>
                    
                    <CardContent className="p-10">
                      <div className="flex items-center gap-6 mb-10">
                        <div className="w-20 h-20 rounded-[2.2rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-500 shadow-xl shadow-primary/5 neon-border relative">
                          <GraduationCap size={40} />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center">
                             <Activity size={10} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-2xl text-zinc-100 group-hover:text-white transition-colors truncate tracking-tighter">
                            {student.fullName || student.email.split('@')[0]}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                             <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest opacity-60">Elit Üye</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6 pt-10 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Günlük Kota</p>
                            <div className="flex items-center gap-2">
                               <span className="text-xl font-black text-white">450</span>
                               <span className="text-xs text-zinc-600">/ 500</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-zinc-500 group-hover:text-primary transition-all group-hover:scale-110 group-hover:rotate-12">
                             <Target size={20} />
                          </div>
                        </div>
                        
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                           <div className="w-3/4 h-full bg-primary shadow-[0_0_10px_oklch(60%_0.2_300)] transition-all duration-1000" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-32 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-32 h-32 rounded-[3.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center text-zinc-800 mb-8 shadow-inner">
                  <Users size={64} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white tracking-tight">Portföyünüzde Henüz Kimse Yok</h3>
                  <p className="text-zinc-500 max-w-xs font-medium leading-relaxed">İlk öğrencinizi ekleyerek sisteme dahil edin ve gelişimini izlemeye başlayın.</p>
                  <div className="pt-6">
                    <AddStudentModal />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


