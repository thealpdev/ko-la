"use client";

import React, { useState, useEffect } from "react";
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
import { Task, TaskCard, TaskStatus, TaskPriority } from "./TaskCard";
import { updateAssignmentStatus } from "@/app/actions/assignment";
import { AssignmentStatus as PrismaAssignmentStatus, Priority as PrismaPriority } from "@prisma/client";
import { CreateAssignmentModal } from "./CreateAssignmentModal";

// Fallback enums in case Prisma Client is stale/not generated
const AssignmentStatus = (PrismaAssignmentStatus || { TODO: "TODO", IN_PROGRESS: "IN_PROGRESS", DONE: "DONE" }) as any;
const Priority = (PrismaPriority || { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH" }) as any;

const COLUMNS = [
  { id: AssignmentStatus.TODO, title: "Yapılacaklar" },
  { id: AssignmentStatus.IN_PROGRESS, title: "Devam Edenler" },
  { id: AssignmentStatus.DONE, title: "Tamamlananlar" },
];

interface KanbanBoardProps {
  initialTasks: any[]; // Using any[] for simplicity to match Prisma model
  studentId?: string;
}

export function KanbanBoard({ initialTasks, studentId }: KanbanBoardProps) {
  // Map Prisma model to Task interface
  const mappedTasks: Task[] = initialTasks.map((t) => ({
    id: t.id,
    publisher: t.publisher,
    bookName: t.bookName,
    subject: t.subject,
    description: t.description,
    dueDate: new Date(t.dueDate),
    status: t.status as TaskStatus,
    priority: t.priority as TaskPriority,
  }));

  const [tasks, setTasks] = useState<Task[]>(mappedTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(mappedTasks);
  }, [initialTasks]);

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

    // Dropping over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            status: tasks[overIndex].status,
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
        
        const newStatus = overId as TaskStatus;
        if (newTasks[activeIndex].status !== newStatus) {
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            status: newStatus,
          };
        }
        
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const task = tasks.find((t) => t.id === activeId);
    if (task) {
      // Sync with database
      await updateAssignmentStatus(task.id, task.status);
    }

    if (activeId === overId) return;

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      
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
        <div className="flex gap-10 overflow-x-auto pb-12 h-full scrollbar-hide px-4">
          {COLUMNS.map((col) => (
            <BoardColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasks.filter((t) => t.status === col.id)}
              onAddTask={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
              }}
              onEditTask={(task) => {
                setTaskToEdit(task);
                setIsModalOpen(true);
              }}
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

      <CreateAssignmentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }} 
        studentId={studentId}
        initialData={taskToEdit}
      />
    </div>
  );
}
