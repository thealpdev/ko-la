"use client";

import React, { useState, useMemo } from "react";
import { 
  CheckCircle2, 
  Circle, 
  BookOpen,
  Binary,
  Zap,
  Target,
  ArrowLeft
} from "lucide-react";
import { updateTopicProgress } from "@/app/actions/curriculum";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SubjectProgressCard } from "./SubjectProgressCard";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Topic {
  id: string;
  name: string;
  category: string;
  subject: string;
}

interface Progress {
  topicId: string;
  status: string;
}

interface CurriculumTrackerProps {
  studentId: string;
  topics: Topic[];
  initialProgress: Progress[];
}

const subjectColors: Record<string, string> = {
  "Matematik": "oklch(60% 0.2 300)", // Violet
  "Türkçe": "oklch(65% 0.15 250)",    // Blue
  "Fizik": "oklch(60% 0.2 150)",      // Green
  "Kimya": "oklch(60% 0.2 200)",      // Cyan
  "Biyoloji": "oklch(60% 0.2 100)",   // Lime
};

export function CurriculumTracker({ studentId, topics, initialProgress }: CurriculumTrackerProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("TÜMÜ");

  const categories = ["TÜMÜ", "TYT", "11. Sınıf"];

  const filteredTopics = useMemo(() => 
    activeCategory === "TÜMÜ" 
      ? topics 
      : topics.filter(t => t.category === activeCategory),
  [activeCategory, topics]);

  const subjects = useMemo(() => 
    Array.from(new Set(filteredTopics.map(t => t.subject))),
  [filteredTopics]);

  async function handleToggle(topicId: string, currentStatus: string) {
    const nextStatus = currentStatus === "COMPLETED" ? "NOT_STARTED" : "COMPLETED";
    setLoading(topicId);
    
    const result = await updateTopicProgress(studentId, topicId, nextStatus);
    setLoading(null);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Müfredat güncellendi.");
    }
  }

  const getStatus = (topicId: string) => {
    return initialProgress.find(p => p.topicId === topicId)?.status || "NOT_STARTED";
  };

  const getStats = (subject: string) => {
    const subjectTopics = filteredTopics.filter(t => t.subject === subject);
    const completed = subjectTopics.filter(t => getStatus(t.id) === "COMPLETED").length;
    return {
      total: subjectTopics.length,
      completed,
      percent: subjectTopics.length > 0 ? Math.round((completed / subjectTopics.length) * 100) : 0
    };
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
         <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[11px]">
               <Target className="w-5 h-5" />
               <span>Akademik Takip Sistemi</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter italic">Müfredat İlerlemesi</h2>
            <p className="text-sm text-zinc-500 font-medium max-w-sm">
               Ders bazlı konu hakimiyetini ölç ve eksiklerini stratejik olarak tamamla.
            </p>
         </div>
         
         <div className="bg-white/[0.03] backdrop-blur-3xl p-2 rounded-2xl border border-white/5 flex gap-2 shadow-2xl">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setExpandedSubject(null);
                }}
                className={cn(
                  "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  activeCategory === cat 
                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                {cat}
              </button>
            ))}
         </div>
      </div>

      <AnimatePresence mode="wait">
        {!expandedSubject ? (
          /* Grid View */
          <motion.div 
            key="grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {subjects.map(subject => {
              const stats = getStats(subject);
              return (
                <SubjectProgressCard 
                  key={subject}
                  subject={subject}
                  totalTopics={stats.total}
                  completedTopics={stats.completed}
                  progress={stats.percent}
                  color={subjectColors[subject]}
                  onClick={() => setExpandedSubject(subject)}
                />
              );
            })}
          </motion.div>
        ) : (
          /* Detail View */
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="flex items-center justify-between bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl">
               <div className="flex items-center gap-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => setExpandedSubject(null)}
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-white p-0"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase">{expandedSubject}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">
                      {getStats(expandedSubject).completed} / {getStats(expandedSubject).total} KONU TAMAMLANDI
                    </p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                     <span className="text-2xl font-black text-white block">%{getStats(expandedSubject).percent}</span>
                     <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Başarı Oranı</span>
                  </div>
                  <div className="w-16 h-16 rounded-2xl border border-primary/20 bg-primary/10 flex items-center justify-center text-primary shadow-2xl shadow-primary/5">
                     <BookOpen size={32} />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {filteredTopics.filter(t => t.subject === expandedSubject).map((topic, idx) => {
                const status = getStatus(topic.id);
                const isCompleted = status === "COMPLETED";

                return (
                  <motion.div 
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "flex items-center justify-between p-8 rounded-[2rem] border transition-all duration-500 group/topic",
                      isCompleted 
                        ? "bg-emerald-500/[0.03] border-emerald-500/20 shadow-xl shadow-emerald-500/5" 
                        : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-center gap-6">
                       <div className={cn(
                         "w-3 h-3 rounded-full transition-all duration-700",
                         isCompleted ? "bg-emerald-500 shadow-[0_0_15px_#10b981] scale-110" : "bg-zinc-800"
                       )} />
                       <div>
                          <span className={cn(
                            "text-lg font-bold block transition-all duration-500 tracking-tight",
                            isCompleted ? "text-zinc-500 line-through" : "text-zinc-200 group-hover/topic:text-white"
                          )}>
                            {topic.name}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-1 block tracking-[0.2em]">{topic.category}</span>
                       </div>
                    </div>
                    <button
                      onClick={() => handleToggle(topic.id, status)}
                      disabled={loading === topic.id}
                      className={cn(
                        "w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-500 active:scale-90",
                        isCompleted 
                          ? "bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 rotate-[360deg]" 
                          : "bg-white/5 text-zinc-700 hover:text-zinc-400 hover:bg-white/[0.08]"
                      )}
                    >
                      {isCompleted ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

