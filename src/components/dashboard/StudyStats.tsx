"use client";

import React from "react";
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
import { Clock, TrendingUp, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StudyStatsProps {
  data: {
    date: string;
    minutes: number;
    questions: number;
  }[];
}

export function StudyStats({ data }: StudyStatsProps) {
  const totalMinutes = data.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const avgMinutes = data.length > 0 ? Math.round(totalMinutes / data.length) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[10px]">
             <Clock className="w-4 h-4" />
             <span>Verimlilik Analizi</span>
          </div>
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Odaklanma Günlüğü</h3>
        </div>
        
        <div className="flex gap-4">
           <div className="px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Toplam Süre</span>
              <span className="text-xl font-black text-white">{totalHours} <span className="text-xs text-zinc-500">Saat</span></span>
           </div>
           <div className="px-6 py-4 bg-primary/10 border border-primary/20 rounded-2xl flex flex-col items-center justify-center min-w-[120px] neon-border">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Günlük Ort.</span>
              <span className="text-xl font-black text-white">{avgMinutes} <span className="text-xs text-zinc-500">Dk</span></span>
           </div>
        </div>
      </div>

      <div className="h-[300px] w-full bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={1} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#52525b", fontSize: 10, fontWeight: 900 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#52525b", fontSize: 10, fontWeight: 900 }}
              label={{ value: 'Dakika', angle: -90, position: 'insideLeft', fill: '#52525b', fontSize: 10, fontWeight: 900 }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">{payload[0].payload.date}</p>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_oklch(60%_0.2_300)]" />
                        <p className="text-sm font-black text-white">{payload[0].value} Dakika Odaklanma</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="minutes" 
              radius={[10, 10, 0, 0]}
              animationDuration={2000}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.minutes > avgMinutes ? "oklch(60% 0.2 300)" : "rgba(255,255,255,0.1)"} 
                  style={{ filter: entry.minutes > avgMinutes ? 'drop-shadow(0 0 10px oklch(60% 0.2 300 / 0.3))' : 'none' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-6 group hover:bg-white/[0.04] transition-all">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
               <TrendingUp size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Haftalık Artış</p>
               <p className="text-lg font-black text-white italic">+12% Daha Fazla Odak</p>
            </div>
         </div>
         <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-6 group hover:bg-white/[0.04] transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
               <Target size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Zirve Performans</p>
               <p className="text-lg font-black text-white italic">Salı Günü (4.5 Saat)</p>
            </div>
         </div>
      </div>
    </div>
  );
}
