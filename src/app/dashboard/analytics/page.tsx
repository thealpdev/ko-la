import { DynamicExamAnalytics } from "@/components/dashboard/DynamicExamAnalytics";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getExams } from "@/app/actions/exam";
import { 
  BarChart3, 
  Bell,
  Search,
  Sparkles,
  TrendingUp,
  Target,
  Users
} from "lucide-react";

export default async function AnalyticsPage() {
  const exams = await getExams();

  const totalExams = exams.length;
  const avgNet = totalExams > 0 ? (exams.reduce((acc, curr) => acc + (curr.totalNet || 0), 0) / totalExams).toFixed(1) : 0;

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
                placeholder="Veri Madenciliği..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-white/[0.05] transition-all outline-none placeholder:text-zinc-600 font-medium"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/[0.05] border border-white/5 text-zinc-500 hover:text-primary transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_oklch(60%_0.2_300)]" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide relative z-10">
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_oklch(60%_0.2_300)]" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Stratejik İstihbarat</p>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Akademik Analitik</h1>
            <p className="text-zinc-500 font-medium">Bütünsel gelişim verileri ve sınav sonuç matrisi.</p>
          </div>

          {/* Analytics Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-slide-up">
             <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <BarChart3 size={20} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Toplam Sınav</span>
                </div>
                <div className="text-4xl font-black text-white">{totalExams}</div>
             </div>

             <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                      <TrendingUp size={20} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Ortalama Net</span>
                </div>
                <div className="text-4xl font-black text-white">{avgNet} <span className="text-sm font-medium text-zinc-600 tracking-normal italic">Net</span></div>
             </div>

             <div className="bg-primary/10 border border-primary/20 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl shadow-primary/5">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-primary/20 rounded-xl text-primary">
                      <Sparkles size={20} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Sistem Sağlığı</span>
                </div>
                <div className="text-4xl font-black text-white uppercase tracking-tighter">OPTİMİZE</div>
             </div>
          </div>

          <div className="animate-scale-in">
            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-10 shadow-2xl overflow-hidden">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-1.5 h-8 bg-primary rounded-full" />
                  <h2 className="text-2xl font-black text-white tracking-tighter">İnteraktif Sınav Grafiği</h2>
               </div>
               <DynamicExamAnalytics exams={exams} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



