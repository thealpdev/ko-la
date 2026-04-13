"use client";

import React from "react";
import { 
  BookOpen, 
  TrendingUp, 
  Zap,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SubjectProgressCardProps {
  subject: string;
  totalTopics: number;
  completedTopics: number;
  progress: number;
  color?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function SubjectProgressCard({ 
  subject, 
  totalTopics, 
  completedTopics, 
  progress,
  color = "oklch(60% 0.2 300)",
  onClick,
  isActive
}: SubjectProgressCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={cn(
        "bg-white/[0.02] backdrop-blur-3xl border rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl transition-all duration-500",
        onClick && "cursor-pointer active:scale-[0.98]",
        isActive 
          ? "border-primary/40 bg-white/[0.05] shadow-primary/10" 
          : "border-white/5 hover:border-white/10"
      )}
    >
      {/* Decorative Glow */}
      <div 
        className={cn(
          "absolute -right-12 -top-12 w-48 h-48 rounded-full blur-[80px] transition-all duration-700 opacity-20",
          isActive ? "opacity-40 scale-150" : "group-hover:opacity-40 group-hover:scale-125"
        )}
        style={{ backgroundColor: color }}
      />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div 
          className="p-4 rounded-2xl border flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform duration-500"
          style={{ 
            backgroundColor: `${color}10`, 
            borderColor: `${color}20`,
            color: color
          }}
        >
          <BookOpen size={24} />
        </div>
        <div className="text-right">
          <span className="text-4xl font-black text-white tracking-tighter block">{progress}%</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Tamamlanma</span>
        </div>
      </div>

      <div className="space-y-3 mb-8 relative z-10">
        <h3 className="text-2xl font-black text-white tracking-tighter italic group-hover:text-primary transition-colors">{subject}</h3>
        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
          {completedTopics} / {totalTopics} Konu Tamamlandı
        </p>
      </div>

      <div className="relative z-10">
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${progress}%` }}
             transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
             className="h-full shadow-[0_0_15px_oklch(60%_0.2_300)]"
             style={{ backgroundColor: color }}
           />
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-between relative z-10 pt-6 border-t border-white/5">
         <div className="flex items-center gap-2">
            <Zap size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {isActive ? "Seçili" : "İncele"}
            </span>
         </div>
         <ChevronRight size={18} className={cn(
           "text-zinc-600 transition-all duration-300",
           isActive ? "translate-x-1 text-primary" : "group-hover:translate-x-1"
         )} />
      </div>
    </motion.div>
  );
}

