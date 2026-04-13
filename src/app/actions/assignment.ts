"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { AssignmentStatus as PrismaAssignmentStatus, Priority as PrismaPriority } from "@prisma/client";

// Fallback enums in case Prisma Client is stale/not generated
const AssignmentStatus = (PrismaAssignmentStatus || { TODO: "TODO", IN_PROGRESS: "IN_PROGRESS", DONE: "DONE" }) as any;
const Priority = (PrismaPriority || { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH" }) as any;

export async function getAssignments() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return [];

    return await prisma.assignment.findMany({
      where: { studentId: session.user.id },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
}

export async function getAssignmentsByStudentId(studentId: string) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return [];

    // Koçun kendi öğrencisi mi doğrula
    const isMyStudent = await prisma.profile.findFirst({
      where: { id: studentId, coachId: session.user.id }
    });

    if (!isMyStudent) return [];

    return await prisma.assignment.findMany({
      where: { studentId },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Öğrenci ödevleri getirilemedi:", error);
    return [];
  }
}

export async function updateAssignmentStatus(id: string, newStatus: string) {
  try {
    const status = newStatus as PrismaAssignmentStatus;
    
    const assignment = await prisma.assignment.update({
      where: { id },
      data: { 
        status,
      },
      select: { studentId: true }
    });
    
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/students/${assignment.studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Error updating assignment:", error);
    return { success: false, error: "Failed to update assignment" };
  }
}

export async function createAssignment(data: {
  publisher: string;
  bookName: string;
  subject?: string;
  description: string;
  dueDate: Date;
  priority?: string;
  studentId?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return { success: false, error: "Unauthorized" };

    const targetStudentId = data.studentId || session.user.id;
    const priority = (data.priority as PrismaPriority) || Priority.MEDIUM;

    await prisma.assignment.create({
      data: {
        publisher: data.publisher,
        bookName: data.bookName,
        subject: data.subject || "Genel",
        description: data.description,
        dueDate: data.dueDate,
        status: AssignmentStatus.TODO,
        priority,
        studentId: targetStudentId,
      },
    });
    
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/students/${targetStudentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Error creating assignment:", error);
    return { success: false, error: "Failed to create assignment" };
  }
}
export async function deleteAssignment(id: string) {
  try {
    const assignment = await prisma.assignment.delete({
      where: { id },
      select: { studentId: true }
    });
    
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/students/${assignment.studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return { success: false, error: "Failed to delete assignment" };
  }
}

export async function updateAssignment(id: string, data: {
  publisher?: string;
  bookName?: string;
  subject?: string;
  description?: string;
  dueDate?: Date;
  priority?: string;
  status?: string;
}) {
  try {
    const updateData: any = { ...data };
    if (data.priority) updateData.priority = data.priority as PrismaPriority;
    if (data.status) updateData.status = data.status as PrismaAssignmentStatus;

    const assignment = await prisma.assignment.update({
      where: { id },
      data: updateData,
      select: { studentId: true }
    });
    
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/students/${assignment.studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Error updating assignment:", error);
    return { success: false, error: "Failed to update assignment" };
  }
}
