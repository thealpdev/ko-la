"use client";

import React, { useState } from "react";
import { 
  Library, 
  Plus, 
  BookOpen, 
  Trash2, 
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  ChevronRight,
  ChevronDown,
  Trophy,
  Target
} from "lucide-react";
import { 
  addStudentBook, 
  updateBookStatus, 
  deleteBook, 
  addBookChapter, 
  updateChapterProgress, 
  deleteChapter 
} from "@/app/actions/books";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Chapter {
  id: string;
  name: string;
  isCompleted: boolean;
  completedTests: number;
  totalTests: number;
}

interface Book {
  id: string;
  publisher: string;
  bookName: string;
  subject: string;
  status: string;
  chapters: Chapter[];
}

interface BookTrackerProps {
  studentId: string;
  books: Book[];
}

export function BookTracker({ studentId, books }: BookTrackerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  const [newChapterName, setNewChapterName] = useState("");

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setLoadingId("new");
    const result = await addStudentBook(studentId, formData);
    setLoadingId(null);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Kitap eklendi.");
      setIsAdding(false);
    }
  }

  async function handleAddChapter(bookId: string) {
    if (!newChapterName.trim()) return;
    setLoadingId(`chapter-${bookId}`);
    const result = await addBookChapter(bookId, newChapterName);
    setLoadingId(null);
    if (result.success) {
      setNewChapterName("");
      toast.success("Bölüm eklendi.");
    } else {
      toast.error(result.error);
    }
  }

  async function handleToggleChapter(chapterId: string, current: boolean) {
    setLoadingId(chapterId);
    await updateChapterProgress(chapterId, { isCompleted: !current });
    setLoadingId(null);
  }

  async function handleUpdateTests(chapterId: string, completed: number, total: number) {
    setLoadingId(chapterId);
    await updateChapterProgress(chapterId, { completedTests: completed, totalTests: total });
    setLoadingId(null);
  }

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[11px]">
             <Library className="w-5 h-5" />
             <span>Kaynak & Yayın Stratejisi</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">Kitaplık & İlerleme</h2>
          <p className="text-sm text-zinc-500 font-medium max-w-sm leading-relaxed">
            Marketten alınan kitapların konu ve test bazlı detaylı takibini buradan yapabilirsin.
          </p>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-[1.2rem] gap-3 bg-primary text-white hover:bg-primary/90 h-14 px-8 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 neon-border group transition-all duration-500"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          Yeni Yayın Ekle
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd} 
            className="bg-white/[0.03] border border-white/5 p-10 rounded-[3rem] grid grid-cols-1 md:grid-cols-4 gap-8 overflow-hidden"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Yayın Evi</label>
              <input required name="publisher" placeholder="Örn: 345 Yayınları" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Kitap Adı</label>
              <input required name="bookName" placeholder="Örn: TYT Mat Soru Bankası" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Branş</label>
              <input required name="subject" placeholder="Örn: Matematik" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-primary outline-none transition-all" />
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={loadingId === "new"}
                className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
              >
                {loadingId === "new" ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                Kütüphaneye Ekle
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-8">
        {books.map((book) => {
          const totalChapters = book.chapters.length;
          const completedChapters = book.chapters.filter(c => c.isCompleted).length;
          const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
          const isExpanded = expandedBookId === book.id;

          return (
            <div key={book.id} className="group bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden hover:bg-white/[0.04] transition-all duration-700 shadow-2xl">
              <div 
                className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 cursor-pointer"
                onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
              >
                <div className="flex items-center gap-8">
                  <div className={cn(
                    "w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 neon-border shadow-2xl",
                    book.status === "FINISHED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5" : "bg-primary/10 text-primary border-primary/20 shadow-primary/5"
                  )}>
                    {book.status === "FINISHED" ? <Trophy size={36} /> : <BookOpen size={36} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{book.publisher}</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">{book.subject}</span>
                    </div>
                    <h4 className="text-3xl font-black text-white tracking-tight leading-none uppercase italic">{book.bookName}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                   <div className="space-y-3 w-48 hidden md:block">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                         <span>İlerleme Oranı</span>
                         <span className="text-white">{Math.round(overallProgress)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${overallProgress}%` }}
                           className={cn(
                             "h-full shadow-[0_0_10px_currentColor]",
                             overallProgress === 100 ? "bg-emerald-500 text-emerald-500" : "bg-primary text-primary"
                           )} 
                         />
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-4">
                      <div className="text-right">
                         <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Tamamlanan Konu</div>
                         <div className="text-xl font-black text-white">{completedChapters} / {totalChapters}</div>
                      </div>
                      <div className={cn(
                        "w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white transition-all",
                        isExpanded && "rotate-180 bg-primary/10 text-primary"
                      )}>
                        <ChevronDown size={24} />
                      </div>
                   </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/5 bg-black/20"
                  >
                    <div className="p-10 space-y-10">
                       {/* Add Chapter Form */}
                       <div className="flex gap-4">
                          <input 
                            value={newChapterName}
                            onChange={(e) => setNewChapterName(e.target.value)}
                            placeholder="Yeni Konu/Bölüm Adı..." 
                            className="flex-1 bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-primary transition-all"
                            onKeyDown={(e) => e.key === "Enter" && handleAddChapter(book.id)}
                          />
                          <button 
                            onClick={() => handleAddChapter(book.id)}
                            disabled={loadingId === `chapter-${book.id}`}
                            className="px-8 bg-white/5 hover:bg-white/10 border border-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3"
                          >
                            {loadingId === `chapter-${book.id}` ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                            Ekle
                          </button>
                       </div>

                       {/* Chapters List */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {book.chapters.map((chapter) => (
                            <div 
                              key={chapter.id}
                              className={cn(
                                "p-6 rounded-3xl border transition-all duration-500 group/item flex items-center justify-between",
                                chapter.isCompleted 
                                  ? "bg-emerald-500/[0.03] border-emerald-500/20" 
                                  : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                              )}
                            >
                               <div className="flex items-center gap-6">
                                  <button 
                                    onClick={() => handleToggleChapter(chapter.id, chapter.isCompleted)}
                                    className={cn(
                                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                      chapter.isCompleted 
                                        ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" 
                                        : "bg-white/5 text-zinc-600 hover:text-white border border-white/5"
                                    )}
                                  >
                                    <CheckCircle2 size={24} />
                                  </button>
                                  <div>
                                     <h5 className={cn(
                                       "font-bold tracking-tight",
                                       chapter.isCompleted ? "text-zinc-500 line-through" : "text-zinc-200"
                                     )}>
                                       {chapter.name}
                                     </h5>
                                     <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                           <Target size={12} className="text-primary" />
                                           Test: {chapter.completedTests} / {chapter.totalTests}
                                        </div>
                                     </div>
                                  </div>
                               </div>

                               <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => handleUpdateTests(chapter.id, Math.max(0, chapter.completedTests - 1), chapter.totalTests)}
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
                                  >
                                    -
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateTests(chapter.id, chapter.completedTests + 1, chapter.totalTests)}
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
                                  >
                                    +
                                  </button>
                               </div>
                            </div>
                          ))}
                       </div>

                       {book.chapters.length === 0 && (
                         <div className="py-20 text-center space-y-4 opacity-20">
                            <BookOpen size={48} className="mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Henüz Konu Eklenmedi</p>
                         </div>
                       )}

                       <div className="pt-8 border-t border-white/5 flex justify-end">
                          <button 
                            onClick={async () => {
                              if (confirm("Bu kitabı bütün verileriyle birlikte silmek istediğine emin misin?")) {
                                await deleteBook(book.id, studentId);
                                toast.success("Kitap silindi.");
                              }
                            }}
                            className="flex items-center gap-3 text-red-500/50 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all px-6 py-3 rounded-xl hover:bg-red-500/10"
                          >
                             <Trash2 size={16} />
                             Kitabı Kütüphaneden Kaldır
                          </button>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {books.length === 0 && (
          <div className="py-32 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem] text-center space-y-6">
             <div className="w-24 h-24 bg-white/[0.02] rounded-[2.5rem] flex items-center justify-center mx-auto text-zinc-800">
                <Library size={48} />
             </div>
             <div>
                <h4 className="text-white font-black uppercase tracking-widest">Kütüphane Henüz Boş</h4>
                <p className="text-xs text-zinc-600 font-medium mt-2">Çalıştığın yayınları ekleyerek detaylı takibe başla.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
