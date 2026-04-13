"use client";

import React, { useState, useMemo } from "react";
import { 
  Target, 
  Flag, 
  TrendingUp, 
  Calendar,
  Settings2,
  Trophy,
  Loader2,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { updateDailyGoal } from "@/app/actions/stats";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

interface Stat {
  date: Date | string;
  solvedQuestions: number;
  goalQuestions: number;
}

interface QuestionGoalTrackerProps {
  studentId: string;
  stats: Stat[];
}

export function QuestionGoalTracker({ studentId, stats }: QuestionGoalTrackerProps) {
  const [goalValue, setGoalValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const todayStat = useMemo(() => stats[0] || { solvedQuestions: 0, goalQuestions: 0 }, [stats]);
  const currentGoal = todayStat.goalQuestions || 0;
  const solvedCount = todayStat.solvedQuestions || 0;
  const progressPercent = currentGoal > 0 ? Math.min(Math.round((solvedCount / currentGoal) * 100), 100) : 0;

  // Prepare chart data
  const chartData = useMemo(() => {
    return stats.slice(0, 7).reverse().map(s => ({
      name: new Date(s.date).toLocaleDateString('tr-TR', { weekday: 'short' }),
      solved: s.solvedQuestions,
      goal: s.goalQuestions,
      fullDate: new Date(s.date).toLocaleDateString('tr-TR'),
      percent: s.goalQuestions > 0 ? Math.round((s.solvedQuestions / s.goalQuestions) * 100) : 0
    }));
  }, [stats]);

  async function handleSetGoal() {
    const goal = parseInt(goalValue);
    if (isNaN(goal) || goal <= 0) {
      toast.error("Geçerli bir sayı girin.");
      return;
    }

    setIsLoading(true);
    const result = await updateDailyGoal(studentId, goal);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Günlük hedef güncellendi.");
      setGoalValue("");
    }
  }

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Today's Goal Card */}
        <div className="lg:col-span-8 bg-primary/10 border border-primary/20 rounded-[3.5rem] p-12 relative overflow-hidden group shadow-[0_30px_100px_rgba(oklch(60%_0.2_300)_/_0.1)]">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] group-hover:bg-primary/20 transition-all duration-1000" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/20 rounded-[1.5rem] text-primary neon-border shadow-2xl">
                  <Target size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Günlük Hedef Analizi</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Canlı Performans Telemetrisi</p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-3xl px-6 py-3 rounded-2xl border border-white/5">
                 <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Durum: </span>
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">İvme Kazanıyor</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-10">
              <div className="space-y-1">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-8xl font-extrabold tracking-tighter text-white text-glow leading-none"
                >
                  {solvedCount}
                </motion.span>
                <span className="text-3xl font-black text-zinc-600 ml-4">/ {currentGoal || "--"}</span>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-3 mb-2">
                   {progressPercent >= 100 ? <Trophy className="text-yellow-500 animate-bounce" size={24} /> : <TrendingUp className="text-primary" size={24} />}
                   <p className="text-5xl font-black text-white text-glow">%{progressPercent}</p>
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Hedef Tamamlanma Oranı</p>
              </div>
            </div>

            <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full rounded-full shadow-[0_0_25px_oklch(60%_0.2_300)]" 
                style={{ 
                  backgroundColor: 'oklch(60% 0.2 300)',
                  backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-1.5 h-6 bg-primary rounded-full" />
               <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Soru Kotası</h4>
            </div>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">Öğrencinin potansiyeline göre bugünkü soru çözüm hedefini belirleyin.</p>
          </div>
          
          <div className="space-y-6 relative z-10 pt-10">
            <div className="relative group">
              <input 
                type="number"
                placeholder="000"
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 px-8 text-center text-4xl font-black text-white placeholder:text-zinc-800 focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-700 tracking-widest uppercase pointer-events-none">SORU</div>
            </div>

            <button 
              onClick={handleSetGoal}
              disabled={isLoading}
              className="group/btn w-full h-16 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 hover:shadow-[0_0_40px_rgba(oklch(60%_0.2_300)_/_0.4)] transition-all active:scale-[0.98] neon-border"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Flag className="group-hover/btn:translate-x-1 transition-transform" size={20} />}
              Hedefi Güncelle
            </button>
          </div>
        </div>
      </div>

      {/* Analytics History */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-12 relative overflow-hidden shadow-2xl group/analytics">
        <div className="flex items-center justify-between mb-12 relative z-10">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/[0.05] rounded-xl border border-white/5 text-zinc-400">
                <TrendingUp size={20} />
             </div>
             <div>
                <h4 className="text-xl font-black text-white tracking-tight">Haftalık Performans Trendi</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-0.5">Son 7 günlük karşılaştırmalı veri</p>
             </div>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] rounded-xl border border-white/5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Çözülen Soru</span>
             </div>
          </div>
        </div>

        <div className="h-[350px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(60% 0.2 300)" stopOpacity={1} />
                  <stop offset="100%" stopColor="oklch(60% 0.2 300)" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#52525b', fontSize: 11, fontWeight: 900 }}
                dy={15}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.02)', radius: 12 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-zinc-900/90 backdrop-blur-3xl border border-white/10 p-5 rounded-2xl shadow-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">{data.fullDate}</p>
                        <div className="flex items-center gap-4">
                           <div className="space-y-1">
                              <p className="text-2xl font-black text-white">{data.solved}</p>
                              <p className="text-[9px] font-black uppercase text-primary/60">Çözülen</p>
                           </div>
                           <div className="w-px h-8 bg-white/5 mx-2" />
                           <div className="space-y-1">
                              <p className="text-2xl font-black text-zinc-400">{data.goal}</p>
                              <p className="text-[9px] font-black uppercase text-zinc-600">Hedef</p>
                           </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5">
                           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mastery: </span>
                           <span className={cn(
                             "text-[10px] font-black tracking-widest uppercase",
                             data.percent >= 100 ? "text-emerald-500" : "text-primary"
                           )}>%{data.percent}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="solved" 
                radius={[12, 12, 12, 12]} 
                barSize={50}
                animationDuration={2000}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === chartData.length - 1 ? "url(#barGradient)" : "rgba(255,255,255,0.05)"}
                    stroke={index === chartData.length - 1 ? "oklch(60% 0.2 300 / 0.5)" : "rgba(255,255,255,0.05)"}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
