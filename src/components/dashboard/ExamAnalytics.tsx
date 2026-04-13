"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, TrendingUp, BarChart, Sparkles, ChevronRight, Zap, Calendar } from "lucide-react";
import { createExam } from "@/app/actions/exam";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExamResult {
  id: string;
  title: string;
  date: Date;
  turkishNet: number;
  mathNet: number;
  socialNet: number;
  scienceNet: number;
  totalNet: number;
}

interface ExamAnalyticsProps {
  exams: ExamResult[];
  studentId?: string;
}

export function ExamAnalytics({ exams, studentId }: ExamAnalyticsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const chartData = exams.map((exam) => ({
    ...exam,
    displayDate: new Date(exam.date).toLocaleDateString("tr-TR", {
      month: "short",
      day: "numeric",
    }),
  }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      date: new Date(formData.get("date") as string),
      turkishNet: parseFloat(formData.get("turkish") as string),
      mathNet: parseFloat(formData.get("math") as string),
      socialNet: parseFloat(formData.get("social") as string),
      scienceNet: parseFloat(formData.get("science") as string),
      studentId: studentId
    };

    const result = await createExam(data);
    setLoading(false);

    if (result.success) {
      setIsOpen(false);
      toast.success("Deneme sonucu kaydedildi!");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[11px]">
             <TrendingUp className="w-5 h-5" />
             <span>Stratejik Gelişim Eğrisi</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic">Performans Analitiği</h2>
          <p className="text-sm text-zinc-500 font-medium max-w-lg leading-relaxed">
            Girdiğin her deneme, yapay zeka tarafından analiz edilerek eksiklerini ve potansiyel net artışını belirlememize yardımcı olur.
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-[1.2rem] gap-3 bg-primary text-white hover:bg-primary/90 h-14 px-8 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 neon-border group transition-all duration-500">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              Yeni Deneme Kaydı
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] bg-[#0c0c0c] border-white/5 rounded-[2.5rem] p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -z-10" />
            <form onSubmit={handleSubmit} className="space-y-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                  <Sparkles className="text-primary" />
                  Deneme Verisi Girişi
                </DialogTitle>
                <DialogDescription className="text-zinc-500 font-medium text-sm">
                  Sistemimiz bu verileri kullanarak sana özel çalışma stratejileri üretecek.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Deneme Adı / Yayın</Label>
                  <Input id="title" name="title" className="bg-white/[0.03] border-white/5 rounded-xl h-12 focus:ring-primary focus:border-primary text-sm font-medium" placeholder="Örn: Limit TYT-2" required />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sınav Tarihi</Label>
                  <Input id="date" name="date" type="date" className="bg-white/[0.03] border-white/5 rounded-xl h-12 focus:ring-primary focus:border-primary text-sm font-medium" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="grid gap-2 text-primary">
                    <Label htmlFor="turkish" className="text-[10px] font-black uppercase tracking-widest opacity-80">Türkçe Net</Label>
                    <Input id="turkish" name="turkish" type="number" step="0.25" className="bg-primary/5 border-primary/20 rounded-xl h-12 text-center font-bold text-lg" placeholder="0" required />
                  </div>
                  <div className="grid gap-2 text-primary">
                    <Label htmlFor="math" className="text-[10px] font-black uppercase tracking-widest opacity-80">Matematik Net</Label>
                    <Input id="math" name="math" type="number" step="0.25" className="bg-primary/5 border-primary/20 rounded-xl h-12 text-center font-bold text-lg" placeholder="0" required />
                  </div>
                  <div className="grid gap-2 text-primary">
                    <Label htmlFor="social" className="text-[10px] font-black uppercase tracking-widest opacity-80">Sosyal Net</Label>
                    <Input id="social" name="social" type="number" step="0.25" className="bg-primary/5 border-primary/20 rounded-xl h-12 text-center font-bold text-lg" placeholder="0" required />
                  </div>
                  <div className="grid gap-2 text-primary">
                    <Label htmlFor="science" className="text-[10px] font-black uppercase tracking-widest opacity-80">Fen Net</Label>
                    <Input id="science" name="science" type="number" step="0.25" className="bg-primary/5 border-primary/20 rounded-xl h-12 text-center font-bold text-lg" placeholder="0" required />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20" disabled={loading}>
                  {loading ? "Analiz Ediliyor..." : "Verileri Kaydet ve Analiz Et"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors duration-1000" />
        
        <div className="flex items-center justify-between mb-12 relative z-10">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-2xl shadow-primary/5">
                 <Zap size={24} />
              </div>
              <div>
                 <h3 className="text-xl font-black tracking-tighter text-white uppercase italic">Anlık Net Grafiği</h3>
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Global Sıralama Tahmini: İlk 5.000</p>
              </div>
           </div>
        </div>

        <div className="h-[450px] w-full pt-4 relative z-10">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#52525b', fontWeight: 900 }}
                  dy={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#52525b', fontWeight: 900 }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    backgroundColor: '#0c0c0c',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    padding: '20px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '40px' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line
                  type="monotone"
                  dataKey="totalNet"
                  name="Toplam Net"
                  stroke="oklch(60% 0.2 300)"
                  strokeWidth={6}
                  dot={{ r: 8, fill: 'oklch(60% 0.2 300)', strokeWidth: 3, stroke: '#050505' }}
                  activeDot={{ r: 12, strokeWidth: 0, shadow: '0 0 20px oklch(60% 0.2 300)' }}
                />
                <Line type="monotone" dataKey="mathNet" name="Matematik" stroke="#06b6d4" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="turkishNet" name="Türkçe" stroke="#ec4899" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="socialNet" name="Sosyal" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="scienceNet" name="Fen" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-6">
              <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center border border-white/5">
                <BarChart className="w-10 h-10 opacity-20" />
              </div>
              <p className="font-black uppercase tracking-[0.3em] text-[10px] italic">Sistem Veri Girişi Bekliyor</p>
              <Button onClick={() => setIsOpen(true)} className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-xl px-10">Veri Gir</Button>
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      {exams.length > 0 && (
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="p-10 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white/[0.05] rounded-xl text-zinc-500 border border-white/5">
                 <Calendar size={20} />
               </div>
               <h3 className="text-xl font-black text-white tracking-tighter uppercase">Sınav Geçmişi</h3>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-zinc-600">Sınav Adı</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Tarih</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Tü</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Mat</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Sos</th>
                  <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Fen</th>
                  <th className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-primary text-right">Toplam Net</th>
                </tr>
              </thead>
              <tbody>
                {[...exams].reverse().map((exam) => (
                  <tr key={exam.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-6 px-10">
                      <div className="font-bold text-zinc-200 group-hover:text-white transition-colors">{exam.title}</div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="text-xs text-zinc-500 font-medium">
                        {new Date(exam.date).toLocaleDateString("tr-TR")}
                      </div>
                    </td>
                    <td className="py-6 px-4 font-bold text-xs text-zinc-400">{exam.turkishNet}</td>
                    <td className="py-6 px-4 font-bold text-xs text-zinc-400">{exam.mathNet}</td>
                    <td className="py-6 px-4 font-bold text-xs text-zinc-400">{exam.socialNet}</td>
                    <td className="py-6 px-4 font-bold text-xs text-zinc-400">{exam.scienceNet}</td>
                    <td className="py-6 px-10 text-right">
                      <span className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 text-primary font-black text-xs shadow-lg">
                        {exam.totalNet}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

