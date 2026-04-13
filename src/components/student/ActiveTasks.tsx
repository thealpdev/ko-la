"use client";

import React, { useOptimistic, useTransition } from "react";
import { CheckCircle2, Book, Bookmark, Sparkles, Plus, Trash2 } from "lucide-react";
import { updateAssignmentStatus, deleteAssignment } from "@/app/actions/assignment";
import { CreateAssignmentModal } from "@/components/dashboard/CreateAssignmentModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { TaskStatus } from "@/components/dashboard/TaskCard";

interface Assignment {
  id: string;
  publisher: string;
  bookName: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
}

interface ActiveTasksProps {
  initialAssignments: Assignment[];
}

export default function ActiveTasks({ initialAssignments }: ActiveTasksProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticAssignments, addOptimisticAssignment] = useOptimistic(
    initialAssignments,
    (state, action: { type: 'complete' | 'delete', id: string }) => {
      if (action.type === 'complete' || action.type === 'delete') {
        return state.filter((item) => item.id !== action.id);
      }
      return state;
    }
  );

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [studentId, setStudentId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    // In a real app we'd get this from a hook or prop, 
    // but for now we'll fetch it if needed or just use current session.
  }, []);

  const handleComplete = async (id: string) => {
    startTransition(async () => {
      addOptimisticAssignment({ type: 'complete', id });
      const result = await updateAssignmentStatus(id, "DONE");
      if (result.success) {
        toast.success("Görev Tamamlandı", {
          description: "Mükemmel! Bir adım daha yaklaştın.",
          className: "bg-black border-white/10 text-white"
        });
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu görevi silmek istediğine emin misin?")) return;
    
    startTransition(async () => {
      addOptimisticAssignment({ type: 'delete', id });
      const result = await deleteAssignment(id);
      if (result.success) {
        toast.success("Görev Silindi");
      }
    });
  };

  if (optimisticAssignments.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-16 text-center bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-dashed border-white/5"
      >
        <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-6 neon-border">
          <Sparkles className="w-10 h-10 text-primary drop-shadow-[0_0_8px_oklch(60%_0.2_300)]" />
        </div>
        <h3 className="text-xl font-black tracking-tight text-white mb-2 uppercase">Vakit Senin!</h3>
        <p className="text-sm text-zinc-500 max-w-[200px] leading-relaxed font-medium">
          Tüm hedeflere ulaşıldı. <br /> Şimdi derin bir nefes al.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">Kritik Hedefler</h2>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary neon-border">
            {optimisticAssignments.length} AKTİF
          </span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all neon-border shadow-lg"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {optimisticAssignments.map((task) => (
            <motion.div
              layout
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/[0.03] items-center justify-center text-zinc-500 group-hover:text-primary transition-all group-hover:bg-primary/5 neon-border group-hover:scale-105 border border-white/5">
                    <Book className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-zinc-100 leading-tight tracking-tight group-hover:text-white transition-colors truncate">
                      {task.bookName}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
                        {task.publisher}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] text-zinc-500 font-medium truncate">
                        {task.description}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(task.id)}
                    disabled={isPending}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => handleComplete(task.id)}
                    disabled={isPending}
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500",
                      "bg-primary/10 text-primary hover:bg-primary hover:text-white active:scale-90 disabled:opacity-50",
                      "border border-primary/20 hover:border-primary shadow-[0_0_20px_rgba(oklch(60%_0.2_300)_/_0.1)] hover:shadow-[0_0_30px_rgba(oklch(60%_0.2_300)_/_0.4)]"
                    )}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CreateAssignmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

