"use client";

import React, { useState, useEffect } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  { text: "Zorluklar, başarının değerini artıran süslerdir.", author: "Moliere" },
  { text: "Gelecek, bugünden ona hazırlananlara aittir.", author: "Malcolm X" },
  { text: "Başarı, her gün tekrarlanan küçük çabaların toplamıdır.", author: "Robert Collier" },
  { text: "Nereye gittiğini bilen kişiye yol vermek için dünya kenara çekilir.", author: "David Starr Jordan" },
  { text: "Planladığın şey değil, yaptığın şey fark yaratır.", author: "Anonim" },
  { text: "En büyük zafer hiç düşmemek değil, her düştüğünde kalkabilmektir.", author: "Konfüçyüs" },
  { text: "Zeka, değişime uyum sağlayabilme yeteneğidir.", author: "Stephen Hawking" }
];

export function MotivationalQuote() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Pick a random quote on mount
    setIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  const nextQuote = () => {
    setIndex((prev) => (prev + 1) % quotes.length);
  };

  return (
    <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
            <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
               <Quote size={20} />
            </div>
            <button 
              onClick={nextQuote}
              className="p-2 text-zinc-600 hover:text-white transition-colors"
            >
              <RefreshCw size={16} />
            </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <p className="text-xl font-bold text-zinc-200 leading-relaxed tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">
              "{quotes[index].text}"
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
              — {quotes[index].author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
