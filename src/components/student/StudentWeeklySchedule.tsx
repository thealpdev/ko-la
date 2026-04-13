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
import { 
  CheckCircle2, 
  Circle, 
  Calendar,
  Clock,
  Sparkles
} from "lucide-react";
import { toggleWeeklyScheduleStatus } from "@/app/actions/schedule";
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

interface StudentWeeklyScheduleProps {
  studentId: string;
  initialEntries: ScheduleEntry[];
}

export function StudentWeeklySchedule({ studentId, initialEntries }: StudentWeeklyScheduleProps) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleToggle(id: string) {
    setLoading(id);
    const result = await toggleWeeklyScheduleStatus(id, studentId);
    setLoading(null);
    if (result.error) toast.error(result.error);
    else toast.success("Durum güncellendi!");
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
      <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-[1.5rem] flex items-center justify-center border border-primary/20 neon-border shadow-2xl shadow-primary/5">
            <Calendar size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-white uppercase">Haftalık Yol Haritam</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
               Koçun Tarafından Planlanan Strateji
               <Sparkles size={12} className="text-primary animate-pulse" />
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="w-[180px] font-black text-zinc-600 text-[10px] uppercase tracking-[0.2em] py-8 pl-10">Gün / Zaman</TableHead>
              <TableHead className="font-black text-zinc-600 text-[10px] uppercase tracking-[0.2em]">Ders</TableHead>
              <TableHead className="font-black text-zinc-600 text-[10px] uppercase tracking-[0.2em]">Hedef Konu</TableHead>
              <TableHead className="font-black text-zinc-600 text-[10px] uppercase tracking-[0.2em]">Zaman Dilimi</TableHead>
              <TableHead className="w-[140px] text-center font-black text-zinc-600 text-[10px] uppercase tracking-[0.2em]">Tamamlandı</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialEntries.length > 0 ? (
              initialEntries.map((item) => (
                <TableRow key={item.id} className="group border-white/5 hover:bg-white/[0.02] transition-colors">
                  <TableCell className="font-black text-zinc-300 text-sm py-8 pl-10">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_oklch(60%_0.2_300)]" />
                      {item.day}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                       <span className="px-3 py-1 bg-white/[0.05] rounded-lg border border-white/5 text-zinc-300 font-bold text-xs uppercase tracking-tight">
                         {item.lesson}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-zinc-500 font-medium text-sm leading-relaxed max-w-[300px]">
                      {item.targetTopic}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5 border border-primary/20 px-4 py-2 rounded-2xl w-fit">
                      <Clock size={14} />
                      {item.studyHours}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <button 
                      onClick={() => handleToggle(item.id)}
                      disabled={!!loading}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-2xl transition-all active:scale-90 disabled:opacity-50 border group-hover:scale-110",
                        item.status === "Yapıldı" 
                          ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(oklch(60%_0.2_300)_/_0.4)]" 
                          : "bg-white/[0.03] text-zinc-600 border-white/5 hover:border-primary/50 hover:text-primary transition-all duration-300"
                      )}
                    >
                      {item.status === "Yapıldı" ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 opacity-40">
                    <Calendar size={48} className="text-zinc-700" />
                    <p className="text-zinc-700 font-black uppercase tracking-[0.4em] text-[12px] italic">
                      Henüz Program Hazırlanmadı
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
