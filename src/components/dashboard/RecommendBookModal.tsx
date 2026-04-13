"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Sparkles, 
  X,
  Book,
  User,
  Image as ImageIcon,
  MessageSquare,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { recommendBook } from "@/app/actions/recommendations";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";

interface RecommendBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

export function RecommendBookModal({ isOpen, onClose, studentId }: RecommendBookModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      imageUrl: formData.get("imageUrl") as string,
      reason: formData.get("reason") as string,
      studentId,
    };

    const result = await recommendBook(data);
      
    setLoading(false);

    if (result.success) {
      toast.success("Kitap önerisi başarıyla gönderildi!");
      onClose();
    } else {
      toast.error("Hata: " + result.error);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-black/60 backdrop-blur-3xl border-white/10 p-0 overflow-hidden rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="relative z-10 p-10">
          <DialogHeader className="flex flex-row items-center justify-between mb-8 space-y-0">
             <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                   <Book size={24} />
                </div>
                <div>
                   <DialogTitle className="text-2xl font-black text-white tracking-tighter">
                     Kitap Önerisi Yap
                   </DialogTitle>
                   <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1 italic">Kişisel Gelişim & Kültür Köşesi</DialogDescription>
                </div>
             </div>
             <button type="button" onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                <X size={20} />
             </button>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Kitap Adı</Label>
              <div className="relative group">
                 <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-primary" />
                 <Input 
                   name="title" 
                   placeholder="Örn: Atomik Alışkanlıklar" 
                   required 
                   className="pl-12 bg-white/[0.03] border-white/5 rounded-2xl h-14 text-sm font-bold focus:bg-white/[0.05] focus:border-primary/30 transition-all placeholder:text-zinc-700" 
                 />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Yazar</Label>
              <div className="relative group">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-primary" />
                 <Input 
                   name="author" 
                   placeholder="Örn: James Clear" 
                   required 
                   className="pl-12 bg-white/[0.03] border-white/5 rounded-2xl h-14 text-sm font-bold focus:bg-white/[0.05] focus:border-primary/30 transition-all placeholder:text-zinc-700" 
                 />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Kitap Görseli (URL)</Label>
              <div className="relative group">
                 <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-primary" />
                 <Input 
                   name="imageUrl" 
                   placeholder="https://..." 
                   className="pl-12 bg-white/[0.03] border-white/5 rounded-2xl h-14 text-sm font-bold focus:bg-white/[0.05] focus:border-primary/30 transition-all placeholder:text-zinc-700" 
                 />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Neden Öneriyorsun?</Label>
              <div className="relative group">
                 <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-zinc-600 transition-colors group-focus-within:text-primary" />
                 <Textarea 
                   name="reason" 
                   placeholder="Örn: Bu kitap senin zaman yönetimi becerilerini harika bir seviyeye taşıyacak..." 
                   required 
                   className="pl-12 bg-white/[0.03] border-white/5 rounded-3xl min-h-[120px] text-sm font-bold focus:bg-white/[0.05] focus:border-primary/30 transition-all placeholder:text-zinc-700 p-4 pt-4" 
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
                  <span>Öneriyi Öğrenciye Gönder</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
