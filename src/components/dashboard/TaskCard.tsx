"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, 
  Calendar, 
  BookOpen, 
  Sparkles,
  Zap,
  Clock,
  FlaskConical,
  Binary,
  Languages,
  History,
  Globe,
  Compass,
  CheckCircle2,
  MoreVertical,
  Trash2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { AssignmentStatus as PrismaAssignmentStatus, Priority as PrismaPriority } from "@prisma/client";
import { cn } from "@/lib/utils";
import { deleteAssignment } from "@/app/actions/assignment";
import { toast } from "sonner";

// Fallback enums in case Prisma Client is stale/not generated
const AssignmentStatus = (PrismaAssignmentStatus || { TODO: "TODO", IN_PROGRESS: "IN_PROGRESS", DONE: "DONE" }) as any;
const Priority = (PrismaPriority || { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH" }) as any;

export interface Task {
  id: string;
  publisher: string;
  bookName: string;
  subject?: string | null;
  description: string;
  dueDate: Date;
  status: AssignmentStatus;
  priority: Priority;
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

const subjectIconMap: Record<string, any> = {
  "Matematik": Binary,
  "Fizik": Zap,
  "Kimya": FlaskConical,
  "Biyoloji": Compass,
  "Türkçe": Languages,
  "Tarih": History,
  "Coğrafya": Globe,
  "Genel": BookOpen
};

const priorityMap: Record<Priority, { label: string; color: string; glow: string }> = {
  [Priority.HIGH]: { label: "Kritik", color: "oklch(65% 0.25 20)", glow: "shadow-[0_0_20px_rgba(255,50,50,0.3)]" },
  [Priority.MEDIUM]: { label: "Önemli", color: "oklch(75% 0.2 60)", glow: "shadow-[0_0_15px_rgba(255,165,0,0.2)]" },
  [Priority.LOW]: { label: "Normal", color: "oklch(70% 0.15 250)", glow: "shadow-[0_0_15px_rgba(0,120,255,0.2)]" },
};

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const SubjectIcon = subjectIconMap[task.subject || "Genel"] || BookOpen;
  const priorityInfo = priorityMap[task.priority];

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative flex flex-col p-6 mb-4 min-h-[160px] bg-primary/5 border border-primary/30 rounded-[2rem] opacity-40 neon-border scale-95 transition-all"
      />
    );
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Bu ödevi silmek istediğinizden emin misiniz?")) return;

    try {
      const result = await deleteAssignment(task.id);
      if (result.success) {
        toast.success("Ödev silindi");
      } else {
        toast.error("Ödev silinemedi");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col p-6 mb-4 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl hover:bg-white/[0.06] hover:border-white/10 hover:-translate-y-1 transition-all duration-500 active:scale-[0.98] cursor-default touch-none overflow-hidden",
        task.status === "DONE" && "opacity-60 grayscale-[0.3]"
      )}
    >
      {/* Action Menu (Top Right) */}
      <div className="absolute right-6 top-6 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/5"
          title="Düzenle"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-500/40 hover:text-red-500 transition-all border border-red-500/10"
          title="Sil"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Glow Based on Priority */}
      <div 
        className={cn(
          "absolute -right-8 -top-8 w-24 h-24 rounded-full blur-3xl transition-opacity duration-1000",
          priorityInfo.glow
        )}
        style={{ backgroundColor: `${priorityInfo.color}15` }}
      />
      
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2">
           <div 
             className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border"
             style={{ 
               color: priorityInfo.color,
               borderColor: `${priorityInfo.color}30`,
               backgroundColor: `${priorityInfo.color}05`
             }}
           >
             {priorityInfo.label}
           </div>
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors mr-10">
            {task.publisher}
          </span>
        </div>
        <div
          {...attributes}
          {...listeners}
          className="p-1.5 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-white/5 transition-all cursor-grab active:cursor-grabbing text-zinc-600 hover:text-white"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 relative z-10">
         <div 
           className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/5 bg-white/[0.02] shadow-xl"
           style={{ color: priorityInfo.color }}
         >
            <SubjectIcon size={20} />
         </div>
         <div>
            <h3 className="text-sm font-bold text-zinc-100 leading-tight tracking-tight group-hover:text-white transition-colors">
              {task.bookName}
            </h3>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              {task.subject || "Genel Müfredat"}
            </p>
         </div>
      </div>

      <p className="text-xs text-zinc-500 mb-6 line-clamp-2 leading-relaxed font-medium">
        {task.description}
      </p>

      <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true, locale: tr })}
          </span>
        </div>
        
        {task.status === "DONE" ? (
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
        )}
      </div>
    </div>
  );
}

