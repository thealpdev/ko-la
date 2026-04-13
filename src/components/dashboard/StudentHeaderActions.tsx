"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Zap } from "lucide-react";
import { RecommendBookModal } from "./RecommendBookModal";

interface StudentHeaderActionsProps {
  studentId: string;
}

export function StudentHeaderActions({ studentId }: StudentHeaderActionsProps) {
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4">
        <Button 
          onClick={() => setIsRecommendModalOpen(true)}
          variant="outline" 
          className="rounded-2xl gap-3 border-primary/20 bg-primary/5 hover:bg-primary/10 h-12 px-6 font-bold uppercase tracking-widest text-[10px] text-primary neon-border"
        >
          <BookOpen size={18} />
          Kitap Öner
        </Button>
        <Button variant="outline" className="rounded-2xl gap-3 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] h-12 px-6 font-bold uppercase tracking-widest text-[10px] text-white">
          <MessageSquare size={18} />
          İletişime Geç
        </Button>
        <Button className="rounded-2xl gap-3 bg-primary text-white hover:bg-primary/90 h-12 px-6 font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 neon-border">
          <Zap size={18} />
          Analiz Raporu
        </Button>
      </div>

      <RecommendBookModal 
        isOpen={isRecommendModalOpen} 
        onClose={() => setIsRecommendModalOpen(false)} 
        studentId={studentId} 
      />
    </>
  );
}
