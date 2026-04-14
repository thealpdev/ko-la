"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  Circle,
  Calendar as CalendarIcon,
  Sparkles,
  Zap,
  Edit3,
  MoreHorizontal
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
  deleteWeeklyScheduleEntry,
  updateWeeklyScheduleEntry
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
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [loading, setLoading] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    lesson: "",
    targetTopic: "",
    studyHours: ""
  });

  const handleOpenAdd = (day?: string) => {
    setEditingEntry(null);
    setSelectedDay(day || DAYS[0]);
    setFormData({ lesson: "", targetTopic: "", studyHours: "" });
    setIsOpen(true);
  };

  const handleOpenEdit = (entry: ScheduleEntry) => {
    setEditingEntry(entry);
    setSelectedDay(entry.day);
    setFormData({
      lesson: entry.lesson,
      targetTopic: entry.targetTopic,
      studyHours: entry.studyHours
    });
    setIsOpen(true);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setActionLoading(true);

    const data = {
      day: selectedDay,
      lesson: formData.lesson,
      targetTopic: formData.targetTopic,
      studyHours: formData.studyHours,
    };

    let result;
    if (editingEntry) {
      result = await updateWeeklyScheduleEntry(editingEntry.id, studentId, data);
    } else {
      result = await addWeeklyScheduleEntry(studentId, data);
    }

    setActionLoading(false);

    if (result.success) {
      setIsOpen(false);
      toast.success(editingEntry ? "Kayıt güncellendi!" : "Haftalık programa eklendi!");
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
    <div className="space-y-12 animate-fade-in pb-20">
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
          onClick={() => handleOpenAdd()}
          className="rounded-[1.2rem] gap-3 bg-primary text-white hover:bg-primary/90 h-14 px-8 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 neon-border group transition-all duration-500"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          Yeni Plan Ekle
        </Button>
      </div>

      {/* Grouped Table View */}
      <div className="space-y-16">
        {DAYS.map((day, idx) => {
          const dayEntries = initialEntries.filter(e => e.day === day);
          
          return (
            <motion.div 
              key={day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="space-y-6"
            >
              {/* Day Header */}
              <div className="flex items-center gap-6 group">
                <div className={cn(
                  "px-6 py-2 rounded-full border text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                  dayEntries.length > 0 
                  ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]" 
                  : "bg-white/5 border-white/10 text-zinc-500"
                )}>
                  {day}
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                <button 
                  onClick={() => handleOpenAdd(day)}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Table Structure */}
              <div className="overflow-hidden bg-white/[0.01] backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 w-16">Durum</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Ders / Disiplin</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Hedef Konu</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Zaman Aralığı</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Eylem</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence mode="popLayout">
                        {dayEntries.length > 0 ? (
                          dayEntries.map((entry) => (
                            <motion.tr 
                              key={entry.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className={cn(
                                "group border-b border-white/[0.03] last:border-0 transition-colors duration-500",
                                entry.status === "Yapıldı" ? "bg-emerald-500/[0.01] opacity-60" : "hover:bg-white/[0.02]"
                              )}
                            >
                              <td className="px-8 py-6">
                                <button 
                                  onClick={() => handleToggle(entry.id)}
                                  disabled={loading === entry.id}
                                  className={cn(
                                    "w-6 h-6 rounded-md flex items-center justify-center transition-all duration-500",
                                    entry.status === "Yapıldı" 
                                    ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                                    : "bg-white/5 text-zinc-600 hover:border-primary/50 border border-white/10"
                                  )}
                                >
                                  {entry.status === "Yapıldı" ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                </button>
                              </td>
                              <td className="px-8 py-6">
                                <span className={cn(
                                  "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all duration-500",
                                  entry.status === "Yapıldı" 
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                  : "bg-primary/10 border-primary/20 text-primary"
                                )}>
                                  {entry.lesson}
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <span className={cn(
                                  "text-sm font-bold tracking-tight transition-all duration-500",
                                  entry.status === "Yapıldı" ? "text-zinc-500 line-through" : "text-white"
                                )}>
                                  {entry.targetTopic}
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                  <Clock size={12} className="text-primary/60" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{entry.studyHours}</span>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleOpenEdit(entry)}
                                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 hover:bg-white/10 hover:text-white transition-all"
                                  >
                                    <Edit3 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(entry.id)}
                                    disabled={loading === entry.id}
                                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 hover:bg-red-500/20 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-8 py-12 text-center">
                              <div 
                                onClick={() => handleOpenAdd(day)}
                                className="flex flex-col items-center gap-3 opacity-20 hover:opacity-100 transition-all cursor-pointer group/empty"
                              >
                                <Zap size={24} className="group-hover/empty:text-primary transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Bu gün için henüz bir plan yok</span>
                                <Button variant="outline" size="sm" className="mt-2 rounded-full border-dashed">Plan Oluştur</Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Entry Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[480px] bg-[#0c0c0c] border-white/5 rounded-[2.5rem] p-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -z-10" />
          <form onSubmit={handleSubmit} className="space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                <Sparkles className="text-primary" />
                {editingEntry ? "Planı Düzenle" : "Ders Programı Girişi"}
              </DialogTitle>
              <DialogDescription className="text-zinc-500 font-medium text-sm">
                {selectedDay} günü için çalışma oturumunu {editingEntry ? "güncelle" : "planla"}.
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
                <Input 
                  id="lesson" 
                  value={formData.lesson}
                  onChange={(e) => setFormData({...formData, lesson: e.target.value})}
                  className="bg-white/[0.03] border-white/5 rounded-xl h-12 focus:ring-primary focus:border-primary text-sm font-medium" 
                  placeholder="Örn: Matematik" 
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="targetTopic" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Hedef Konu</Label>
                <Input 
                  id="targetTopic" 
                  value={formData.targetTopic}
                  onChange={(e) => setFormData({...formData, targetTopic: e.target.value})}
                  className="bg-white/[0.03] border-white/5 rounded-xl h-12 focus:ring-primary focus:border-primary text-sm font-medium" 
                  placeholder="Örn: Türev Süreklilik" 
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="studyHours" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Zaman Aralığı</Label>
                <Input 
                  id="studyHours" 
                  value={formData.studyHours}
                  onChange={(e) => setFormData({...formData, studyHours: e.target.value})}
                  className="bg-white/[0.03] border-white/5 rounded-xl h-12 focus:ring-primary focus:border-primary text-sm font-medium" 
                  placeholder="Örn: 16:00 - 18:00" 
                  required 
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20" disabled={actionLoading}>
                {actionLoading ? "İşleniyor..." : editingEntry ? "Planı Güncelle" : "Haftalık Programa Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
