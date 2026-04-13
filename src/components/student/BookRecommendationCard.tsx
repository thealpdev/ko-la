"use client";

import React from "react";
import { Sparkles, Book, User, Quote, ArrowRight, Bookmark, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { deleteRecommendation } from "@/app/actions/recommendations";
import { createBookFromRecommendation } from "@/app/actions/books";
import { toast } from "sonner";

interface Recommendation {
  id: string;
  title: string;
  author: string;
  imageUrl?: string;
  reason?: string;
  createdAt: Date;
}

interface BookRecommendationCardProps {
  recommendation: Recommendation;
}

export function BookRecommendationCard({ recommendation }: BookRecommendationCardProps) {
  const [loading, setLoading] = React.useState(false);

  const handleDismiss = async () => {
    const result = await deleteRecommendation(recommendation.id);
    if (result.success) {
      toast.success("Öneri gizlendi.");
    }
  };

  const handleAddToLibrary = async () => {
    setLoading(true);
    const result = await createBookFromRecommendation({
      title: recommendation.title,
      author: recommendation.author,
      publisher: "Önerilen Kitap"
    });
    setLoading(false);

    if (result.success) {
      toast.success("Kitaplığına eklendi!", {
        description: "Artık ilerlemeni buradan takip edebilirsin."
      });
      // Öneriyi otomatik gizle
      await deleteRecommendation(recommendation.id);
    } else {
      toast.error("Hata: " + result.error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-primary/20 transition-all duration-700"
    >
      {/* Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors duration-1000" />

      <div className="p-10 relative z-10 flex flex-col md:flex-row gap-10">
        {/* Book Cover Placeholder/Image */}
        <div className="relative shrink-0 mx-auto md:mx-0">
          <div className="w-48 h-64 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl relative group-hover:scale-105 transition-transform duration-700">
            {recommendation.imageUrl ? (
              <img 
                src={recommendation.imageUrl} 
                alt={recommendation.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-zinc-700 bg-gradient-to-b from-white/5 to-white/[0.02]">
                <Book size={48} className="opacity-20" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Kapak Fotoğrafı Yok</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
               <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">Elite Book Series</span>
            </div>
          </div>
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/40 neon-border z-20">
            <Sparkles size={20} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em] neon-border">
                Koç'un Seçimi
              </span>
              <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">
                {new Date(recommendation.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter leading-none italic">
              {recommendation.title}
            </h3>
            <p className="flex items-center gap-2 text-zinc-400 font-bold text-sm">
              <User size={14} className="text-primary/60" />
              {recommendation.author}
            </p>
          </div>

          <div className="relative p-6 bg-white/[0.03] rounded-3xl border border-white/5 group-hover:bg-white/[0.05] transition-all">
            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10" />
            <p className="text-sm text-zinc-300 font-medium leading-relaxed italic relative z-10">
              "{recommendation.reason}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
             <button 
               onClick={handleAddToLibrary}
               disabled={loading}
               className="flex items-center gap-3 px-8 h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all group/btn active:scale-95 disabled:opacity-50"
             >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (
                  <>
                    <span>Kitaplığıma Ekle</span>
                    <Bookmark size={16} className="group-hover/btn:translate-y--1 transition-transform" />
                  </>
                )}
             </button>
             <button 
               onClick={handleDismiss}
               className="flex items-center gap-3 px-8 h-14 bg-white/5 text-zinc-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/5 hover:border-white/10 transition-all active:scale-95"
             >
                Gizle
             </button>
          </div>
        </div>
      </div>

      {/* Side Label */}
      <div className="absolute top-0 right-0 h-full w-12 bg-white/[0.02] border-l border-white/5 flex flex-col items-center justify-center gap-12 group-hover:bg-primary/5 transition-colors">
         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800 rotate-90 whitespace-nowrap">RECOMMENDATION</span>
      </div>
    </motion.div>
  );
}
