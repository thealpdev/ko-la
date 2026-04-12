"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar, BookOpen } from "lucide-react";

export interface Task {
  id: string;
  publisher: string;
  bookName: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

interface TaskCardProps {
  task: Task;
}

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

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative flex flex-col p-4 mb-4 min-h-[120px] bg-zinc-100 dark:bg-zinc-800 border-2 border-primary/50 opacity-50 rounded-xl"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex flex-col p-4 mb-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-default touch-none"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
          {task.publisher}
        </span>
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1 leading-tight">
        {task.bookName}
      </h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">
        {task.description}
      </p>

      <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
          <BookOpen className="w-3 h-3" />
          <span>Ödev</span>
        </div>
      </div>
    </div>
  );
}
