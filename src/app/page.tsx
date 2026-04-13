"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Zap,
  Target,
  ShieldCheck,
  MousePointerClick,
  LayoutDashboard,
  Clock,
  BarChart3,
  Moon,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white overflow-x-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10 mesh-gradient opacity-40" />
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center neon-border">
              <Zap className="w-6 h-6 text-primary drop-shadow-[0_0_8px_oklch(60%_0.2_300)]" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-glow">Koçla</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <a href="#features" className="text-zinc-400 hover:text-primary transition-colors">Özellikler</a>
            <a href="#how-it-works" className="text-zinc-400 hover:text-primary transition-colors">Yöntemimiz</a>
            <Link href="/dashboard" className="px-6 py-2.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all font-semibold text-primary neon-border">
              Giriş Yap
            </Link>
          </div>
        </div>
      </motion.nav>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative px-6 pt-32 pb-24 lg:pt-48 lg:pb-52">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <motion.div 
              {...fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest neon-border"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>YKS 2026 Erken Erişim</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.9] lg:leading-[0.85]"
            >
              Başarıyı <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-primary via-primary to-primary/50 text-glow">Veriyle Yönet</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl lg:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Geleneksel koçluğu unutanlar için tasarlandı. <br className="hidden md:block" />
              Pürüzsüz analizler ve pürüzsüz bir odak deneyimi.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
            >
              <Link href="/dashboard">
                <Button size="lg" className="h-16 px-10 text-xl rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-[0_0_40px_rgba(oklch(60%_0.2_300)_/_0.3)] hover:scale-105 transition-all duration-300 font-bold">
                  Sistemi Keşfet
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              <FeatureCard 
                icon={<LayoutDashboard className="w-7 h-7" />}
                title="Akıllı Kanban"
                description="Haftalık görevlerini sürükle-bırak kolaylığıyla yönet, koçunla anlık senkronize kal."
              />
              <FeatureCard 
                icon={<Clock className="w-7 h-7" />}
                title="Neon Focus Mode"
                description="Derin odaklanma için optimize edilmiş Pomodoro motoruyla verimini ikiye katla."
              />
              <FeatureCard 
                icon={<BarChart3 className="w-7 h-7" />}
                title="Derin Analitik"
                description="Netlerini sadece kaydetme, onları birer büyüme fırsatına dönüştüren analizleri incele."
              />
            </motion.div>
          </div>
        </section>

        {/* Steps Section */}
        <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl lg:text-6xl font-black mb-6">Mükemmellik <br/> Süreci</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-16 relative">
              <Step 
                number="01" 
                icon={<Target className="w-8 h-8" />}
                title="Strateji" 
                description="Koçunla hedeflerini belirle ve başarı yol haritanı dijital olarak oluştur." 
              />
              <Step 
                number="02" 
                icon={<MousePointerClick className="w-8 h-8" />}
                title="İcraat" 
                description="Görevlerini tamamla, odak modunu kullan ve her saniyeni değerlendir." 
              />
              <Step 
                number="03" 
                icon={<ShieldCheck className="w-8 h-8" />}
                title="Gelişim" 
                description="Sürekli analizlerle eksiklerini kapat ve sınav gününe hazır ol." 
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto rounded-[3.5rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 px-8 py-20 text-center space-y-10 relative overflow-hidden glass-dark shadow-[0_0_100px_rgba(oklch(60%_0.2_300)_/_0.1)]"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -z-10" />
            
            <h2 className="text-4xl lg:text-7xl font-black tracking-tight text-glow">
              Zirve Seni Bekliyor
            </h2>
            <p className="text-zinc-400 text-xl lg:text-2xl max-w-2xl mx-auto font-medium">
              Sıradan bir dashboard değil, senin başarı terminalin. <br /> Hemen bugün başla.
            </p>
            <Link href="/dashboard" className="inline-block">
              <Button size="lg" className="h-16 px-14 text-xl rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all font-bold">
                Üye Ol ve Başla
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3">
            <span className="font-bold text-3xl text-glow tracking-tighter">Koçla</span>
            <span className="text-zinc-600 font-mono text-xs">v2.0.0 PREMIUM</span>
          </div>
          <div className="flex items-center gap-12 text-sm font-bold text-zinc-500 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Term</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      variants={fadeInUp}
      className="p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500 group shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 text-primary group-hover:scale-110 transition-transform duration-500 neon-border">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-zinc-400 leading-relaxed font-medium">
        {description}
      </p>
    </motion.div>
  );
}

function Step({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8 flex flex-col items-center text-center group"
    >
      <div className="relative">
        <div className="w-28 h-28 rounded-[2.5rem] bg-zinc-950 border border-white/10 flex items-center justify-center shadow-2xl group-hover:border-primary/40 transition-all duration-500 group-hover:scale-105">
          <div className="text-primary drop-shadow-[0_0_10px_rgba(oklch(60%_0.2_300)_/_0.4)]">
            {icon}
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_rgba(oklch(60%_0.2_300)_/_0.5)]">
          {number}
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-zinc-500 font-medium leading-relaxed max-w-[200px]">{description}</p>
      </div>
    </motion.div>
  );
}
