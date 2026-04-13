"use client";

import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar,
  Clock,
  BookOpen,
  Target
} from "lucide-react";
import { 
  addWeeklyScheduleEntry, 
  toggleWeeklyScheduleStatus, 
  deleteWeeklyScheduleEntry 
} from "@/app/actions/schedule";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ScheduleEntry {
  id: string;
  day: string;
  lesson: string;
  targetTopic: string;
  studyHours: string;
  status: string;
}

interface WeeklyScheduleProps {
  studentId: string;
  initialEntries: ScheduleEntry[];
}

export function WeeklySchedule({ studentId, initialEntries }: WeeklyScheduleProps) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleToggle(id: string) {
    setLoading(id);
    const result = await toggleWeeklyScheduleStatus(id, studentId);
    setLoading(null);
    if (result.error) toast.error(result.error);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu program girişini silmek istediğinize emin misiniz?")) return;
    const result = await deleteWeeklyScheduleEntry(id, studentId);
    if (result.error) toast.error(result.error);
    else toast.success("Kayıt silindi.");
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl neon-border">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white uppercase">Master Program</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Haftalık Stratejik Hedefler</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-[1.2rem] gap-2 border-white/5 bg-white/[0.03] hover:bg-white/[0.06] font-bold uppercase tracking-widest text-[10px] h-10 px-6"
          onClick={() => toast.info("Yeni satır ekleme özelliği yakında gelecek!")}
        >
          <Plus size={16} />
          <span>Yeni Hedef</span>
        </Button>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="w-[140px] font-black text-zinc-600 text-[10px] uppercase tracking-[0.2em] py-6 pl-8">Zaman Dilimi</TableHead>
              <TableHead className="font-black text-zinc-600 text-[10px] uppercase tracking-[0.2em]">Disiplin</TableHead>
              <TableHead className="font-black text-zinc-600 text-[10px] uppercase tracking-[0.2em]">Kritik Konu</TableHead>
              <TableHead className="font-black text-zinc-600 text-[10px] uppercase tracking-[0.2em]">Efor</TableHead>
              <TableHead className="w-[120px] text-center font-black text-zinc-600 text-[10px] uppercase tracking-[0.2em]">Durum</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialEntries.length > 0 ? (
              initialEntries.map((item) => (
                <TableRow key={item.id} className="group border-white/5 hover:bg-white/[0.02] transition-colors">
                  <TableCell className="font-black text-zinc-300 text-xs py-5 pl-8">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(60%_0.2_300)]" />
                      {item.day}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-tight">
                      {item.lesson}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-zinc-500 font-medium text-xs">
                      {item.targetTopic}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5 border border-primary/20 px-3 py-1 rounded-full w-fit">
                      <Clock size={12} />
                      {item.studyHours}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <button 
                      onClick={() => handleToggle(item.id)}
                      disabled={!!loading}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 disabled:opacity-50 border",
                        item.status === "Yapıldı" 
                          ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(oklch(60%_0.2_300)_/_0.3)]" 
                          : "bg-white/[0.03] text-zinc-600 border-white/5 hover:border-white/10"
                      )}
                    >
                      {item.status === "Yapıldı" ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="w-8 h-8 flex items-center justify-center text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="h-48 text-center text-zinc-700 font-black uppercase tracking-[0.3em] text-[10px] italic">
                  Sistem Analiz Bekliyor
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

