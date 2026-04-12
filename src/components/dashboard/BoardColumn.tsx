"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task, TaskCard } from "./TaskCard";
import { MoreHorizontal, Plus } from "lucide-react";

interface BoardColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

export function BoardColumn({ id, title, tasks }: BoardColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col w-80 min-w-[320px] h-full bg-zinc-50/50 dark:bg-zinc-950/20 rounded-2xl p-4 border border-zinc-200/50 dark:border-zinc-800/50">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">
            {title}
          </h2>
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors">
            <Plus className="w-4 h-4 text-zinc-500" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors">
            <MoreHorizontal className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 flex flex-col min-h-[150px]"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
            <p className="text-xs">Burada henüz bir görev yok</p>
          </div>
        )}
      </div>
    </div>
  );
}
