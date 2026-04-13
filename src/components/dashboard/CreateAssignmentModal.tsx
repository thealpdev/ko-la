"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Sparkles, 
  X,
  Calendar as CalendarIcon,
  Tag,
  Zap,
  BookOpen,
  FlaskConical,
  Binary,
  Languages,
  History,
  Globe,
  Compass
} from "lucide-react";
import { Priority as PrismaPriority } from "@prisma/client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { createAssignment, updateAssignment } from "@/app/actions/assignment";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Fallback enums in case Prisma Client is stale/not generated
const Priority = (PrismaPriority || { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH" }) as any;

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId?: string;
  initialData?: any;
}

const subjects = ["Matematik", "Fizik", "Kimya", "Biyoloji", "Türkçe", "Tarih", "Coğrafya", "Geometri", "Felsefe", "Din Kültürü", "Genel"];

const priorities = [
  { value: Priority.LOW, label: "Normal", color: "oklch(70% 0.15 250)" },
  { value: Priority.MEDIUM, label: "Önemli", color: "oklch(75% 0.2 60)" },
  { value: Priority.HIGH, label: "Kritik", color: "oklch(65% 0.25 20)" },
];

export function CreateAssignmentModal({ isOpen, onClose, studentId, initialData }: CreateAssignmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<any>(Priority.MEDIUM);
  const [selectedSubject, setSelectedSubject] = useState("Genel");

  useEffect(() => {
    if (initialData) {
      setSelectedPriority(initialData.priority);
      setSelectedSubject(initialData.subject);
    } else {
      setSelectedPriority(Priority.MEDIUM);
      setSelectedSubject("Genel");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      publisher: formData.get("publisher") as string,
      bookName: formData.get("bookName") as string,
      description: formData.get("description") as string,
      dueDate: new Date(formData.get("dueDate") as string),
      subject: selectedSubject,
      priority: selectedPriority,
      studentId,
    };

    const result = initialData 
      ? await updateAssignment(initialData.id, data)
      : await createAssignment(data);
      
    setLoading(false);

    if (result.success) {
      toast.success(initialData ? "Ödev güncellendi!" : "Yeni ödev başarıyla atandı!");
      onClose();
    } else {
      toast.error("Hata: " + result.error);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-black/60 backdrop-blur-3xl border-white/10 p-0 overflow-hidden rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="relative z-10 p-10">
          <DialogHeader className="flex flex-row items-center justify-between mb-8 space-y-0">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                   <Plus size={24} />
                </div>
                <div>
                   <DialogTitle className="text-2xl font-black text-white tracking-tighter">
                     {initialData ? "Görevi Düzenle" : "Yeni Görev Atama"}
                   </DialogTitle>
                   <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Stratejik Planlama Ünitesi</DialogDescription>
                </div>
             </div>
             <button type="button" onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                <X size={20} />
             </button>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Yayın / Kaynak</Label>
                <div className="relative group">
                   <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-primary" />
                   <Input 
                     name="publisher" 
                     placeholder="Örn: Bilgi Sarmal" 
                     required 
                     defaultValue={initialData?.publisher}
                     className="pl-12 bg-white/[0.03] border-white/5 rounded-2xl h-14 text-sm font-bold focus:bg-white/[0.05] focus:border-primary/30 transition-all placeholder:text-zinc-700" 
                   />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Konu Başlığı</Label>
                <div className="relative group">
                   <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-primary" />
                   <Input 
                     name="bookName" 
                     placeholder="Örn: Trigonometri" 
                     required 
                     defaultValue={initialData?.bookName}
                     className="pl-12 bg-white/[0.03] border-white/5 rounded-2xl h-14 text-sm font-bold focus:bg-white/[0.05] focus:border-primary/30 transition-all placeholder:text-zinc-700" 
                   />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Ders Seçimi</Label>
              <div className="flex flex-wrap gap-2">
                 {subjects.map(subject => (
                   <button
                     key={subject}
                     type="button"
                     onClick={() => setSelectedSubject(subject)}
                     className={cn(
                       "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                       selectedSubject === subject 
                         ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]" 
                         : "bg-white/5 border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10"
                     )}
                   >
                     {subject}
                   </button>
                 ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Görev Önceliği</Label>
              <div className="grid grid-cols-3 gap-3">
                {priorities.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setSelectedPriority(p.value)}
                    className={cn(
                      "flex items-center justify-center gap-2 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                      selectedPriority === p.value
                        ? "shadow-2xl scale-[1.02]"
                        : "bg-white/5 border-white/5 text-zinc-500 opacity-60 hover:opacity-100"
                    )}
                    style={{ 
                      borderColor: selectedPriority === p.value ? p.color : "transparent",
                      backgroundColor: selectedPriority === p.value ? `${p.color}10` : "",
                      color: selectedPriority === p.value ? p.color : ""
                    }}
                  >
                    <Zap size={14} className={selectedPriority === p.value ? "animate-pulse" : ""} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Ödev Detayları</Label>
              <Input 
                name="description" 
                placeholder="Örn: Test 1-5 arası çözülecek ve yanlışlar kontrol edilecek" 
                required 
                defaultValue={initialData?.description}
                className="bg-white/[0.03] border-white/5 rounded-2xl h-14 text-sm font-bold focus:bg-white/[0.05] focus:border-primary/30 transition-all placeholder:text-zinc-700" 
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Son Teslim Tarihi</Label>
              <div className="relative group">
                 <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-primary" />
                 <Input 
                   name="dueDate" 
                   type="date" 
                   required 
                   defaultValue={initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} 
                   className="pl-12 bg-white/[0.03] border-white/5 rounded-2xl h-14 text-sm font-bold focus:bg-white/[0.05] focus:border-primary/30 transition-all [color-scheme:dark]" 
                 />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-10 sm:justify-start">
            <Button 
               type="submit" 
               disabled={loading}
               className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all active:scale-95 text-xs flex items-center justify-center gap-3"
            >
              {loading ? (
                <Sparkles className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <Zap size={18} />
                  <span>{initialData ? "Değişiklikleri Kaydet" : "Ödevi Öğrenciye Gönder"}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
