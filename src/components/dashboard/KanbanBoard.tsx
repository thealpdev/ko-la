"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { BoardColumn } from "./BoardColumn";
import { Task, TaskCard } from "./TaskCard";

// Mock Data
const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    publisher: "Bilgi Sarmal",
    bookName: "Trigonometri",
    description: "Test 1-3 arası çözülecek.",
    status: "TODO",
  },
  {
    id: "2",
    publisher: "MEB",
    bookName: "Fizik",
    description: "Vektörler Konu Anlatımı İzle.",
    status: "TODO",
  },
  {
    id: "3",
    publisher: "345 Yayınları",
    bookName: "Paragraf",
    description: "Günde 20 soru çözülecek.",
    status: "IN_PROGRESS",
  },
  {
    id: "4",
    publisher: "Aydın Yayınları",
    bookName: "Kimya",
    description: "Gazlar Karma Test 1.",
    status: "DONE",
  },
];

const COLUMNS = [
  { id: "TODO", title: "Yapılacaklar" },
  { id: "IN_PROGRESS", title: "Devam Edenler" },
  { id: "DONE", title: "Tamamlananlar" },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    // Immoveable tasks logic can be added here
    
    // Dropping over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            status: newTasks[overIndex].status,
          };
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dropping over a column
    const isOverAColumn = COLUMNS.some((col) => col.id === overId);

    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex] = {
          ...newTasks[activeIndex],
          status: overId as Task["status"],
        };
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      
      // If over index is -1, it means we dropped on a column (already handled in onDragOver but satisfying TS)
      if (overIndex === -1) return tasks;

      return arrayMove(tasks, activeIndex, overIndex);
    });
  };

  return (
    <div className="flex flex-col h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-8 h-full scrollbar-hide">
          {COLUMNS.map((col) => (
            <BoardColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasks.filter((t) => t.status === col.id)}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
