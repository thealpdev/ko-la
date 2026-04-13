"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Target, Sparkles, Loader2 } from "lucide-react";
import { logStudySession } from "@/app/actions/sessions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type TimerMode = "WORK" | "BREAK";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>("WORK");

  const switchMode = useCallback(() => {
    const newMode = mode === "WORK" ? "BREAK" : "WORK";
    setMode(newMode);
    setTimeLeft(newMode === "WORK" ? WORK_TIME : BREAK_TIME);
    setIsActive(false);
    
    toast.success(
      newMode === "WORK" ? "Odaklanma zamanı!" : "Mola vaktin geldi!",
      {
        description: newMode === "WORK" ? "Derin çalışma moduna giriyoruz." : "Zihnin dinlensin, sen bunu hak ettin.",
      }
    );
  }, [mode]);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      
      // Oturumu kaydet
      const saveSession = async () => {
        setIsSaving(true);
        const duration = mode === "WORK" ? 25 : 5;
        await logStudySession(duration, mode);
        setIsSaving(false);
        switchMode();
      };
      
      saveSession();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, switchMode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "WORK" ? WORK_TIME : BREAK_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] bg-black/40 backdrop-blur-2xl border border-white/5 shadow-[0_20px_100px_rgba(0,0,0,0.8)] relative overflow-hidden w-full max-w-[340px] md:max-w-md mx-auto"
    >
      {/* Decorative Glow */}
      <div className={cn(
        "absolute -top-20 -left-20 w-64 h-64 blur-[100px] opacity-20 transition-colors duration-1000",
        mode === "WORK" ? "bg-primary" : "bg-emerald-500"
      )} />

      <div className="flex items-center gap-3 mb-8 md:mb-12 px-4 md:px-6 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
        <AnimatePresence mode="wait">
          {mode === "WORK" ? (
            <motion.div 
              key="work-mode"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2"
            >
              <Target className="w-3 md:w-4 h-3 md:h-4 text-primary drop-shadow-[0_0_5px_oklch(60%_0.2_300)]" />
              <span className="text-primary tracking-widest text-glow">Deep Work</span>
            </motion.div>
          ) : (
            <motion.div 
              key="break-mode"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2"
            >
              <Coffee className="w-3 md:w-4 h-3 md:h-4 text-emerald-400" />
              <span className="text-emerald-400 tracking-widest">Chill Break</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        key={mode}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "text-6xl md:text-9xl font-black tabular-nums tracking-tighter transition-all duration-700 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]",
          mode === "WORK" ? "text-primary text-glow" : "text-emerald-500 shadow-emerald-500/20"
        )}
      >
        {formatTime(timeLeft)}
      </motion.div>

      <div className="flex items-center gap-6 md:gap-8 mt-12 md:mt-16">
        <button
          onClick={resetTimer}
          className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 text-zinc-500 hover:text-white transition-all active:scale-95"
          title="Sıfırla"
        >
          <RotateCcw className="w-5 md:w-6 h-5 md:h-6" />
        </button>

        <button
          onClick={toggleTimer}
          className={cn(
            "w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl transition-all active:scale-90 flex items-center justify-center border-4 border-black/50 group",
            mode === "WORK" 
              ? "bg-primary text-white shadow-primary/20 hover:shadow-primary/40" 
              : "bg-emerald-500 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40"
          )}
        >
          {isActive ? (
            <Pause className="w-8 h-8 md:w-10 md:h-10 fill-current transition-transform group-hover:scale-110" />
          ) : (
            <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1 transition-transform group-hover:scale-110" />
          )}
        </button>

        <button
          onClick={switchMode}
          className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 text-zinc-500 hover:text-white transition-all active:scale-95"
          title="Mod Değiştir"
        >
          {mode === "WORK" ? <Coffee className="w-5 md:w-6 h-5 md:h-6" /> : <Target className="w-5 md:w-6 h-5 md:h-6" />}
        </button>
      </div>

      <div className="mt-8 md:mt-12 flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-500",
                i <= 2 ? "bg-primary shadow-[0_0_5px_oklch(60%_0.2_300)]" : "bg-white/10"
              )}
            />
          ))}
        </div>
        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600 ml-2">
          {isSaving ? (
            <span className="flex items-center gap-2 text-primary animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              Oturum Kaydediliyor...
            </span>
          ) : isActive ? "Flow State Active" : "Ready to focus"}
        </span>
      </div>
    </motion.div>
  );
}

