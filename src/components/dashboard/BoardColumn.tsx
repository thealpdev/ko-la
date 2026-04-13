import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task, TaskCard } from "./TaskCard";
import { 
  Plus, 
  Sparkles, 
  Circle, 
  Clock, 
  CheckCircle2, 
  Layout,
  LayoutGrid,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BoardColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask?: () => void;
  onEditTask?: (task: Task) => void;
}

const columnStyles: Record<string, { icon: any; color: string; emptyText: string; emptyIcon: any }> = {
  "TODO": { 
    icon: Circle, 
    color: "oklch(70% 0.15 250)", 
    emptyText: "Yeni görevler sizi bekliyor",
    emptyIcon: Plus
  },
  "IN_PROGRESS": { 
    icon: Zap, 
    color: "oklch(75% 0.2 60)", 
    emptyText: "Şu an odaklanılan görev yok",
    emptyIcon: Clock
  },
  "DONE": { 
    icon: CheckCircle2, 
    color: "oklch(65% 0.2 150)", 
    emptyText: "Henüz tamamlanan görev yok",
    emptyIcon: Sparkles
  },
};

export function BoardColumn({ id, title, tasks, onAddTask, onEditTask }: BoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  const style = columnStyles[id] || columnStyles["TODO"];
  const StatusIcon = style.icon;
  const EmptyIcon = style.emptyIcon;

  return (
    <div className="flex flex-col w-[350px] min-w-[350px] h-full group/column">
      {/* Premium Column Header */}
      <div className="flex items-center justify-between mb-8 px-6 py-4 bg-white/[0.01] rounded-[2rem] border border-white/5 group-hover/column:border-white/10 transition-all duration-500">
        <div className="flex items-center gap-4">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover/column:scale-110"
            style={{ 
              backgroundColor: `${style.color}10`,
              borderColor: `${style.color}20`,
              color: style.color
            }}
          >
            <StatusIcon size={20} />
          </div>
          <div>
            <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">
              {title}
            </h2>
            <p className="text-[10px] font-bold text-zinc-600 mt-1 uppercase tracking-tight">
              {tasks.length} AKTİF GÖREV
            </p>
          </div>
        </div>
        
        {id === "TODO" && (
          <button 
            onClick={onAddTask}
            className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary shadow-lg shadow-primary/20 hover:text-white transition-all transform hover:rotate-90"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 flex flex-col min-h-[400px] gap-2 p-4 rounded-[2.5rem] border border-transparent transition-all duration-700",
          "bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/[0.05]"
        )}
      >
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </SortableContext>
          
          {tasks.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center animate-pulse">
              <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center mb-6">
                 <EmptyIcon className="w-6 h-6 text-zinc-800" />
              </div>
              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-700 italic max-w-[120px]">
                {style.emptyText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

