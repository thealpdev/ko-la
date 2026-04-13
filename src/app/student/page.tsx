import React from "react";
import { getAssignments } from "@/app/actions/assignment";
import { getTopics, getStudentTopicProgress } from "@/app/actions/curriculum";
import { getWeeklySchedule } from "@/app/actions/schedule";
import { getExams } from "@/app/actions/exam";
import { getStudentBooks } from "@/app/actions/books";
import { getStudyAnalytics } from "@/app/actions/sessions";
import { getRecommendations } from "@/app/actions/recommendations";
import { signOut } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase-server";
import PomodoroTimer from "@/components/student/PomodoroTimer";
import ActiveTasks from "@/components/student/ActiveTasks";
import { MotivationalQuote } from "@/components/student/MotivationalQuote";
import { CurriculumTracker } from "@/components/dashboard/CurriculumTracker";
import { WeeklyCalendar } from "@/components/dashboard/WeeklyCalendar";
import { BookTracker } from "@/components/dashboard/BookTracker";
import { StudyStats } from "@/components/dashboard/StudyStats";
import { BookRecommendationCard } from "@/components/student/BookRecommendationCard";
import { DynamicExamAnalytics } from "@/components/dashboard/DynamicExamAnalytics";
import { Coffee, Zap, Sparkles, Brain, LayoutDashboard, Target, BookOpen, Calendar, Rocket, TrendingUp, Library, LogOut } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Öğrenci Terminali | Koçla",
  description: "Kişisel çalışma merkeziniz ve haftalık programınız.",
};

export default async function StudentPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return null;
  const studentId = session.user.id;

  const [allAssignments, allTopics, topicProgress, schedule, exams, books, studySessions, recommendations] = await Promise.all([
    getAssignments(),
    getTopics(),
    getStudentTopicProgress(studentId),
    getWeeklySchedule(studentId),
    getExams(),
    getStudentBooks(studentId),
    getStudyAnalytics(studentId),
    getRecommendations(studentId)
  ]);
  
  const activeAssignments = allAssignments.filter((a: any) => a.status !== "DONE");
  const latestRecommendation = (recommendations as any)[0];

  return (
    <main className="min-h-screen bg-[#050505] text-foreground relative overflow-hidden selection:bg-primary/20">
      {/* Background Decor */}
      <div className="absolute inset-0 mesh-gradient opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[150px] rounded-full -z-10" />

      <div className="max-w-[1600px] mx-auto min-h-screen flex flex-col">
        {/* Header - Terminal Style */}
        <header className="px-6 md:px-10 py-8 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/20 border border-primary/30 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center neon-border shadow-2xl shadow-primary/5 group hover:scale-110 transition-all duration-500">
              <Rocket className="w-6 h-6 md:w-8 md:h-8 text-primary drop-shadow-[0_0_8px_oklch(60%_0.2_300)]" />
            </div>
            <div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-3xl md:text-4xl font-black tracking-tighter text-glow block">Koçla</span>
                <div className="px-2 md:px-3 py-0.5 md:py-1 bg-primary/10 border border-primary/20 rounded-lg">
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary">Öğrenci Paneli</span>
                </div>
              </div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2 mt-1">
                 Sürüm 3.0.0 Alpha 
                 <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sistem Durumu</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Bilişsel Senkronizasyon Tamam</span>
            </div>
            <div className="hidden sm:block h-12 w-[1px] bg-white/5 mx-2" />
            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border border-primary/20 neon-border shadow-lg cursor-default">
              11. Sınıf Modu
            </div>
            <form action={signOut}>
               <button 
                 type="submit"
                 className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all group"
               >
                 <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                 Çıkış Yap
               </button>
            </form>
          </div>
        </header>

        <div className="px-10 flex-1 relative z-10">
          <Tabs defaultValue="focus" className="space-y-12">
            <div className="flex justify-start w-full overflow-x-auto scrollbar-hide">
              <TabsList className="bg-white/[0.03] backdrop-blur-3xl p-1.5 md:p-2 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 h-auto gap-1 md:gap-2 min-w-max">
                <TabsTrigger value="focus" className="rounded-[1rem] md:rounded-[1.5rem] py-3 md:py-4 px-6 md:px-10 text-[9px] md:text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all flex items-center gap-2 md:gap-3 group">
                   <Zap size={14} className="group-data-[state=active]:animate-pulse" />
                   Odak
                </TabsTrigger>
                <TabsTrigger value="schedule" className="rounded-[1rem] md:rounded-[1.5rem] py-3 md:py-4 px-6 md:px-10 text-[9px] md:text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all flex items-center gap-2 md:gap-3">
                   <Calendar size={14} />
                   Program
                </TabsTrigger>
                <TabsTrigger value="exams" className="rounded-[1rem] md:rounded-[1.5rem] py-3 md:py-4 px-6 md:px-10 text-[9px] md:text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all flex items-center gap-2 md:gap-3">
                   <TrendingUp size={14} />
                   Deneme
                </TabsTrigger>
                <TabsTrigger value="progress" className="rounded-[1rem] md:rounded-[1.5rem] py-3 md:py-4 px-6 md:px-10 text-[9px] md:text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all flex items-center gap-2 md:gap-3">
                   <Target size={14} />
                   Müfredat
                </TabsTrigger>
                <TabsTrigger value="library" className="rounded-[1rem] md:rounded-[1.5rem] py-3 md:py-4 px-6 md:px-10 text-[9px] md:text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all flex items-center gap-2 md:gap-3">
                   <Library size={14} />
                   Kitaplık
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="focus" className="focus-visible:outline-none focus:outline-none outline-none">

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
                {/* Left Column - Focus Hub */}
                <div className="xl:col-span-8 space-y-16 animate-slide-up">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-10">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[12px]">
                             <Sparkles className="w-5 h-5" />
                             <span>Şimdi Odaklanma Zamanı</span>
                          </div>
                          <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-[0.85] text-white">
                            Zamanı Yönet, <br/>
                            <span className="text-primary text-glow">Geleceği Kur.</span>
                          </h1>
                        </div>
                        <MotivationalQuote />
                     </div>
                     <div className="flex items-center justify-center">
                        <PomodoroTimer />
                     </div>
                  </div>

                  <div className="pt-16 border-t border-white/5">
                    <StudyStats data={studySessions} />
                  </div>

                  {latestRecommendation && (
                    <div className="pt-16 border-t border-white/5">
                      <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-8">
                        <Sparkles className="w-4 h-4" />
                        <span>Haftalık Elite Öneri</span>
                      </div>
                      <BookRecommendationCard recommendation={latestRecommendation} />
                    </div>
                  )}

                  <div className="pt-16 border-t border-white/5">
                    <div className="flex items-center gap-8 p-12 bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/5 group hover:bg-white/[0.04] transition-all duration-700">
                      <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20 shadow-2xl group-hover:scale-110 transition-all duration-700 neon-border">
                        <Coffee className="w-10 h-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-black tracking-tight text-white uppercase italic">Zihinsel Tazeleme Önerisi</h4>
                        <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-xl">
                          Blok çalışmalardan sonra 5 dakikalık zihin tazelemesi %40 verim artırır. Derin nefes al ve bir sonraki oturum için hazırlan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Tasks */}
                <div className="xl:col-span-4 relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="sticky top-10">
                    <ActiveTasks initialAssignments={activeAssignments} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="focus-visible:outline-none animate-slide-up">
              <div className="space-y-10">
                <WeeklyCalendar studentId={studentId} initialEntries={schedule} />
              </div>
            </TabsContent>

            <TabsContent value="exams" className="focus-visible:outline-none animate-slide-up">
              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -z-10" />
                <DynamicExamAnalytics exams={exams} studentId={studentId} />
              </div>
            </TabsContent>

            <TabsContent value="progress" className="focus-visible:outline-none animate-slide-up">
              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-10 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-white/[0.05] rounded-2xl border border-white/5 text-zinc-500">
                         <LayoutDashboard size={24} />
                      </div>
                      <div>
                         <h2 className="text-3xl font-black text-white tracking-tighter">Müfredat İlerlemen</h2>
                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-1">Konu bazlı uzmanlık ve yetkinlik verileri</p>
                      </div>
                   </div>
                </div>
                <CurriculumTracker studentId={studentId} topics={allTopics} initialProgress={topicProgress} />
              </div>
            </TabsContent>

            <TabsContent value="library" className="focus-visible:outline-none animate-slide-up">
              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-10 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
                <BookTracker studentId={studentId} books={books} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Decoration */}
        <footer className="px-10 py-10 opacity-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-700 relative z-10">
          <span>Koçla High-Fidelity Ecosystem</span>
          <div className="flex gap-6">
            <span className="text-primary/40 underline underline-offset-4 cursor-pointer hover:text-primary transition-colors">Terminal Logları</span>
            <span>2024 © Digital Mindset</span>
          </div>
        </footer>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-50 blur-[1px]" />
    </main>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}


