"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  Circle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  addWeeklyScheduleEntry, 
  toggleWeeklyScheduleStatus, 
  deleteWeeklyScheduleEntry 
} from "@/app/actions/schedule";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ScheduleEntry {
  id: string;
  day: string;
  lesson: string;
  targetTopic: string;
  studyHours: string;
  status: string;
}

interface WeeklyCalendarProps {
  studentId: string;
  initialEntries: ScheduleEntry[];
  isCoach?: boolean;
}

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export function WeeklyCalendar({ studentId, initialEntries, isCoach = false }: WeeklyCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [loading, setLoading] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function handleAddEntry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      day: selectedDay,
      lesson: formData.get("lesson") as string,
      targetTopic: formData.get("targetTopic") as string,
      studyHours: formData.get("studyHours") as string,
    };

    const result = await addWeeklyScheduleEntry(studentId, data);
    setActionLoading(false);

    if (result.success) {
      setIsOpen(false);
      toast.success("Haftalık programa eklendi!");
    } else {
      toast.error(result.error || "Bir hata oluştu.");
    }
  }

  async function handleToggle(id: string) {
    setLoading(id);
    const result = await toggleWeeklyScheduleStatus(id, studentId);
    setLoading(null);
    if (result.error) toast.error(result.error);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    setLoading(id);
    const result = await deleteWeeklyScheduleEntry(id, studentId);
    setLoading(null);
    if (result.error) toast.error(result.error);
    else toast.success("Kayıt silindi.");
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[11px]">
             <CalendarIcon className="w-5 h-5" />
             <span>Stratejik Zaman Planlayıcı</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">Haftalık Yol Haritası</h2>
          <p className="text-sm text-zinc-500 font-medium max-w-sm leading-relaxed">
            {isCoach ? "Öğrenci için optimize edilmiş haftalık çalışma düzenini yönet." : "Kendi çalışma düzenini oluştur ve koçunla senkronize ol."}
          </p>
        </div>

        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-[1.2rem] gap-3 bg-primary text-white hover:bg-primary/90 h-14 px-8 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 neon-border group transition-all duration-500"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          Planıma Ekle
        </Button>
      </div>

      {/* 7-Day Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        {DAYS.map((day, idx) => {
          const dayEntries = initialEntries.filter(e => e.day === day);
          
          return (
            <motion.div 
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/5 group hover:border-primary/20 transition-all">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">
                  {day}
                </span>
                <button 
                  onClick={() => {
                    setSelectedDay(day);
                    setIsOpen(true);
                  }}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-600 hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="space-y-4 min-h-[200px]">
                {dayEntries.length > 0 ? (
                  dayEntries.map((entry) => (
                    <div 
                      key={entry.id}
                      className={cn(
                        "p-6 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden",
                        entry.status === "Yapıldı"
                          ? "bg-emerald-500/[0.03] border-emerald-500/20 shadow-xl shadow-emerald-500/5 opacity-60"
                          : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04] shadow-2xl"
                      )}
                    >
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-start justify-between">
                           <div 
                             className={cn(
                               "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                               entry.status === "Yapıldı" 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                : "bg-primary/10 border-primary/20 text-primary"
                             )}
                           >
                             {entry.lesson}
                           </div>
                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleToggle(entry.id)}
                                disabled={loading === entry.id}
                                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 hover:bg-emerald-500 hover:text-white transition-all"
                              >
                                {entry.status === "Yapıldı" ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                              </button>
                              <button 
                                onClick={() => handleDelete(entry.id)}
                                disabled={loading === entry.id}
                                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                           </div>
                        </div>

                        <div>
                           <h4 className={cn(
                             "text-sm font-bold leading-snug tracking-tight",
                             entry.status === "Yapıldı" ? "text-zinc-500 line-through" : "text-zinc-200"
                           )}>
                             {entry.targetTopic}
                           </h4>
                           <div className="flex items-center gap-2 mt-3 text-zinc-500">
                              <Clock size={12} className="text-primary/60" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{entry.studyHours}</span>
                           </div>
                        </div>
                      </div>

                      {/* Animated Glow Fixer for Active Items */}
                      {entry.status !== "Yapıldı" && (
                        <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="h-full border border-dashed border-white/5 rounded-[2rem] flex items-center justify-center p-8 opacity-20 group hover:opacity-40 transition-opacity cursor-pointer" onClick={() => { setSelectedDay(day); setIsOpen(true); }}>
                     <div className="text-center space-y-2">
                        <Zap size={20} className="mx-auto" />
                        <span className="text-[9px] font-black uppercase tracking-widest block">Boş Slot</span>
                     </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Entry Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[480px] bg-[#0c0c0c] border-white/5 rounded-[2.5rem] p-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -z-10" />
          <form onSubmit={handleAddEntry} className="space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                <Sparkles className="text-primary" />
                Ders Programı Girişi
              </DialogTitle>
              <DialogDescription className="text-zinc-500 font-medium text-sm">
                {selectedDay} günü için yeni bir çalışma oturumu planla.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Gün Seçimi</Label>
                <div className="flex flex-wrap gap-2">
                   {DAYS.map(day => (
                     <button
                       key={day}
                       type="button"
                       onClick={() => setSelectedDay(day)}
                       className={cn(
                         "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                         selectedDay === day 
                          ? "bg-primary text-white" 
                          : "bg-white/5 text-zinc-500 hover:text-white"
                       )}
                     >
                       {day.substring(0, 3)}
                     </button>
                   ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lesson" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ders / Disiplin</Label>
                <Input id="lesson" name="lesson" className="bg-white/[0.03] border-white/5 rounded-xl h-12 focus:ring-primary focus:border-primary text-sm font-medium" placeholder="Örn: Matematik" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="targetTopic" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Hedef Konu</Label>
                <Input id="targetTopic" name="targetTopic" className="bg-white/[0.03] border-white/5 rounded-xl h-12 focus:ring-primary focus:border-primary text-sm font-medium" placeholder="Örn: Türev Süreklilik" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="studyHours" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Zaman Aralığı</Label>
                <Input id="studyHours" name="studyHours" className="bg-white/[0.03] border-white/5 rounded-xl h-12 focus:ring-primary focus:border-primary text-sm font-medium" placeholder="Örn: 16:00 - 18:00" required />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20" disabled={actionLoading}>
                {actionLoading ? "Planlanıyor..." : "Haftalık Programa Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
