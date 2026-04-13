"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, UserPlus } from "lucide-react";
import { createStudent } from "@/app/actions/student";
import { toast } from "sonner";

export function AddStudentModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await createStudent(formData);

    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Mürettebat Üyesi Eklendi!", {
        description: "Artık gelişim yolculuğuna başlayabilir.",
      });
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 bg-primary text-white rounded-2xl gap-3 shadow-2xl shadow-primary/20 transition-all active:scale-95 px-6 font-black uppercase tracking-widest text-[10px] neon-border">
          <UserPlus size={18} />
          <span>Sisteme Üye Ekle</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2.5rem] border-white/5 bg-black/60 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,1)]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(60%_0.2_300)]" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Yönetim</p>
          </div>
          <DialogTitle className="text-3xl font-black tracking-tighter text-white">Yeni Deha Kaydı</DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium">
            Öğrenciyi ekosisteme dahil edin. <br /> Bu işlem onu doğrudan sizin portföyünüze bağlar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 pl-1">Kimlik Tanımı</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Tam Ad" 
              required 
              className="rounded-2xl h-12 bg-white/[0.03] border-white/5 focus:border-primary/30 transition-all font-medium placeholder:text-zinc-700"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 pl-1">Dijital Erişim</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="E-posta" 
              required 
              className="rounded-2xl h-12 bg-white/[0.03] border-white/5 focus:border-primary/30 transition-all font-medium placeholder:text-zinc-700"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 pl-1">Kod Anahtarı</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Şifre" 
              required 
              className="rounded-2xl h-12 bg-white/[0.03] border-white/5 focus:border-primary/30 transition-all font-medium placeholder:text-zinc-700"
            />
            <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-tighter pl-1">
              * İlk oturum açılışında bu anahtar kullanılacaktır.
            </p>
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-primary text-white rounded-[1.5rem] shadow-2xl shadow-primary/20 font-black uppercase tracking-widest text-xs neon-border"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-4 animate-spin" />
                  Sisteme İşleniyor...
                </>
              ) : (
                "Kaydı Onayla"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

