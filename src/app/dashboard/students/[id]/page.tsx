import { getStudentById } from "@/app/actions/student";
import { getAssignmentsByStudentId } from "@/app/actions/assignment";
import { getExamsByStudentId } from "@/app/actions/exam";
import { getWeeklySchedule } from "@/app/actions/schedule";
import { getTopics, getStudentTopicProgress } from "@/app/actions/curriculum";
import { getDailyStats } from "@/app/actions/stats";
import { getStudentBooks } from "@/app/actions/books";
import { getStudyAnalytics } from "@/app/actions/sessions";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { WeeklyCalendar } from "@/components/dashboard/WeeklyCalendar";
import { DynamicExamAnalytics } from "@/components/dashboard/DynamicExamAnalytics";
import { CurriculumTracker } from "@/components/dashboard/CurriculumTracker";
import { QuestionGoalTracker } from "@/components/dashboard/QuestionGoalTracker";
import { BookTracker } from "@/components/dashboard/BookTracker";
import { StudyStats } from "@/components/dashboard/StudyStats";
import { StudentHeaderActions } from "@/components/dashboard/StudentHeaderActions";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  Mail, 
  MessageSquare,
  Trophy,
  Zap,
  BookOpen,
  Target,
  FlaskConical,
  Sparkles,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StudentDetailPageProps {
  params: { id: string };
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params;
  
  const student = await getStudentById(id);
  if (!student) notFound();

  const [
    assignments, 
    exams, 
    schedule, 
    topics, 
    topicProgress, 
    stats,
    books,
    studySessions
  ] = await Promise.all([
    getAssignmentsByStudentId(id),
    getExamsByStudentId(id),
    getWeeklySchedule(id),
    getTopics(),
    getStudentTopicProgress(id),
    getDailyStats(id),
    getStudentBooks(id),
    getStudyAnalytics(id)
  ]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="absolute inset-0 mesh-gradient opacity-10 pointer-events-none" />
        
        {/* Header */}
        <header className="p-10 pb-0 relative z-10">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-primary transition-all mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Portföye Dön
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/5 neon-border group-hover:scale-105 transition-transform">
                <GraduationCap size={48} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_oklch(60%_0.2_300)]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Öğrenci Profili</p>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white">
                  {student.fullName || student.email}
                </h1>
                <div className="flex items-center gap-6 text-sm text-zinc-500 font-medium">
                  <span className="flex items-center gap-2 leading-none">
                    <Mail size={14} className="text-primary/60" />
                    {student.email}
                  </span>
                  <span className="flex items-center gap-2 leading-none">
                    <Trophy size={14} className="text-primary/60" />
                    Elit Üye
                  </span>
                </div>
              </div>
            </div>

            <StudentHeaderActions studentId={id} />
          </div>
        </header>

        {/* Content Tabs */}
        <div className="px-10 py-8 flex-1 overflow-y-auto scrollbar-hide relative z-10">
          <Tabs defaultValue="overview" className="space-y-10">
            <TabsList className="bg-white/[0.02] backdrop-blur-xl p-1.5 rounded-[1.5rem] border border-white/5 w-full md:w-auto h-auto grid grid-cols-3 md:flex gap-1">
              <TabsTrigger value="overview" className="rounded-[1.2rem] py-3 px-8 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">Genel Bakış</TabsTrigger>
              <TabsTrigger value="curriculum" className="rounded-[1.2rem] py-3 px-8 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">Müfredat</TabsTrigger>
              <TabsTrigger value="targets" className="rounded-[1.2rem] py-3 px-8 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">Hedefler</TabsTrigger>
              <TabsTrigger value="tasks" className="rounded-[1.2rem] py-3 px-8 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">Görevler</TabsTrigger>
              <TabsTrigger value="library" className="rounded-[1.2rem] py-3 px-8 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">Kitaplık</TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-[1.2rem] py-3 px-8 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">Strateji</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-10 focus-visible:outline-none animate-slide-up">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                   {/* Strategic Insight Card */}
                   <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
                      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors duration-1000" />
                      <div className="flex items-start justify-between mb-10 relative z-10">
                         <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white tracking-tighter">Stratejik Analiz</h3>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Yapay Zeka Destekli Tahminler</p>
                         </div>
                         <div className="p-4 bg-primary/10 rounded-[1.5rem] text-primary border border-primary/20 shadow-2xl shadow-primary/5">
                            <Sparkles size={24} />
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                         <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 space-y-4">
                            <div className="flex items-center gap-3">
                               <TrendingUp size={18} className="text-emerald-500" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tahmini Net Artışı</span>
                            </div>
                            <div className="text-4xl font-black text-white">+8.5 <span className="text-sm font-medium text-zinc-600">Net / Ay</span></div>
                         </div>
                         <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 space-y-4">
                            <div className="flex items-center gap-3">
                               <Target size={18} className="text-primary" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Odaklanılması Gereken Ders</span>
                            </div>
                            <div className="text-2xl font-black text-white">Matematik-II</div>
                         </div>
                      </div>

                      <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10 relative z-10">
                         <p className="text-sm text-zinc-300 font-medium leading-relaxed italic">
                            "Bu öğrenci haftalık soru limitine ulaştığında deneme sonuçlarında belirgin bir ivme kazanıyor. Gelecek hafta AYT Fen odaklı bir program izlenmesi tavsiye edilir."
                         </p>
                      </div>
                   </div>

                   <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                    <WeeklyCalendar studentId={id} initialEntries={schedule} isCoach={true} />
                  </div>
                </div>
                
                <div className="lg:col-span-4 space-y-8">
                  {/* Quick Stats Summary */}
                  <div className="bg-primary/10 backdrop-blur-3xl rounded-[3rem] p-8 text-white border border-primary/20 shadow-2xl shadow-primary/5 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                    <h3 className="text-xs font-black mb-8 flex items-center gap-3 uppercase tracking-widest">
                       <CheckCircle2 size={18} className="text-primary" />
                       Haftalık Verimlilik
                    </h3>
                    <div className="space-y-6 relative z-10">
                       <div className="flex justify-between items-end">
                         <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Soru Hedefi</span>
                         <span className="text-4xl font-black tracking-tighter text-glow">
                           {stats[0]?.solvedQuestions || 0} / {stats[0]?.goalQuestions || 0}
                         </span>
                       </div>
                       <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                         <div 
                          className="bg-primary h-full shadow-[0_0_15px_oklch(60%_0.2_300)] transition-all duration-1000" 
                          style={{ width: `${stats[0]?.goalQuestions > 0 ? (stats[0].solvedQuestions / stats[0].goalQuestions) * 100 : 0}%` }}
                         />
                       </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-8 shadow-2xl hover:bg-white/[0.04] transition-all duration-500 group">
                    <h3 className="text-xs font-black text-white mb-8 uppercase tracking-widest flex items-center justify-between">
                       <span>Son Görevler</span>
                       <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <div className="space-y-6">
                      {assignments.length > 0 ? assignments.slice(0, 4).map((a) => (
                        <div key={a.id} className="flex gap-4 group/item">
                          <div className={cn(
                            "w-1.5 h-1.5 mt-2 rounded-full shrink-0 transition-all duration-500 group-hover/item:scale-150 shadow-[0_0_8px_currentColor]",
                            a.status === "DONE" ? "text-emerald-500 bg-emerald-500" : "text-primary bg-primary"
                          )} />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-zinc-200 leading-tight truncate group-hover/item:text-white transition-colors">{a.bookName}</p>
                            <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1.5">{a.publisher}</p>
                          </div>
                        </div>
                      )) : (
                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Henüz görev atanmadı.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="focus-visible:outline-none">
              <CurriculumTracker studentId={id} topics={topics} initialProgress={topicProgress} />
            </TabsContent>

            <TabsContent value="targets" className="focus-visible:outline-none">
              <QuestionGoalTracker studentId={id} stats={stats} />
            </TabsContent>

            <TabsContent value="tasks" className="focus-visible:outline-none">
              <KanbanBoard initialTasks={assignments} studentId={id} />
            </TabsContent>

            <TabsContent value="library" className="focus-visible:outline-none">
              <BookTracker studentId={id} books={books} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-10 focus-visible:outline-none animate-slide-up">
               <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                 <StudyStats data={studySessions} />
               </div>
               
               <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                 <DynamicExamAnalytics exams={exams} studentId={id} />
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}


