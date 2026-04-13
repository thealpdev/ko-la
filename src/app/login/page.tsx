"use client";

import React, { useState } from "react";
import { signIn, signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Zap, Loader2, AlertCircle, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = mode === "login" ? await signIn(formData) : await signUp(formData);

    if (result && 'error' in result) {
      setError(result.error as string);
      setIsLoading(false);
    } else if (result && 'success' in result) {
      setMessage(result.success as string);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 mesh-gradient opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md space-y-10 relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <Link href="/" className="flex items-center gap-4 mb-2 group">
            <div className="w-14 h-14 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center neon-border shadow-2xl shadow-primary/5 transition-transform group-hover:scale-110 duration-500">
              <Zap className="w-8 h-8 text-primary drop-shadow-[0_0_8px_oklch(60%_0.2_300)]" />
            </div>
            <div>
              <span className="font-black text-3xl tracking-tighter text-white text-glow block">Koçla</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 block">Universal Portal</span>
            </div>
          </Link>
        </div>

        <Card className="border-white/5 bg-black/40 backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-t border-white/10">
          <CardHeader className="space-y-3 pt-12 px-10 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <CardTitle className="text-3xl font-black tracking-tight text-white mb-2">
                  {mode === "login" ? "Tekrar Hoş Geldin" : "Yeni Bir Vizyon"}
                </CardTitle>
                <CardDescription className="text-zinc-500 font-medium text-sm">
                  {mode === "login" 
                    ? "Başarı yolculuğuna kaldığın yerden devam et." 
                    : "Liderlik koltuğuna oturmak için ilk adımını at."}
                </CardDescription>
              </motion.div>
            </AnimatePresence>
          </CardHeader>
          
          <CardContent className="px-10 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 pl-1">E-Posta Kimliği</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="ad@vizyon.com" 
                  required 
                  className="rounded-2xl h-14 bg-white/[0.03] border-white/5 focus:border-primary/40 focus:bg-white/[0.05] transition-all font-medium placeholder:text-zinc-700 outline-none"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 pl-1">Erişim Anahtarı</Label>
                  {mode === "login" && (
                    <Button variant="link" className="px-0 font-black uppercase tracking-widest text-[9px] text-primary/60 hover:text-primary transition-colors h-auto">
                      Sıfırla
                    </Button>
                  )}
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  className="rounded-2xl h-14 bg-white/[0.03] border-white/5 focus:border-primary/40 focus:bg-white/[0.05] transition-all font-medium outline-none"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-4 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}

                {message && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-4 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
                  >
                    <Sparkles className="w-5 h-5 shrink-0" />
                    <p>{message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-[1.5rem] bg-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50 neon-border"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Senkronize Ediliyor...
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    {mode === "login" ? "Sisteme Giriş" : "Kaydı Başlat"}
                    <Wand2 className="w-4 h-4 ml-1" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-6 pb-12 px-10">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
                <span className="bg-black/20 backdrop-blur-xl px-4 text-zinc-700">Alternatif Akış</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full h-14 rounded-[1.5rem] border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              disabled={isLoading}
            >
              {mode === "login" ? "Yeni Hesap Oluştur" : "Zaten Mevcut"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

