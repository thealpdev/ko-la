"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function getExams() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return [];

    return await prisma.examResult.findMany({
      where: { studentId: session.user.id },
      orderBy: {
        date: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return [];
  }
}

export async function createExam(data: {
  title: string;
  date: Date;
  turkishNet: number;
  mathNet: number;
  socialNet: number;
  scienceNet: number;
  studentId?: string; // Optinal studentId added
}) {
  try {
    const totalNet = 
      data.turkishNet + 
      data.mathNet + 
      data.socialNet + 
      data.scienceNet;

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return { success: false, error: "Unauthorized" };

    const targetStudentId = data.studentId || session.user.id;

    await prisma.examResult.create({
      data: {
        title: data.title,
        date: data.date,
        turkishNet: data.turkishNet,
        mathNet: data.mathNet,
        socialNet: data.socialNet,
        scienceNet: data.scienceNet,
        totalNet: totalNet,
        studentId: targetStudentId,
      },
    });

    revalidatePath("/dashboard/analytics");
    revalidatePath(`/dashboard/students/${targetStudentId}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating exam result:", error);
    return { success: false, error: "Failed to save exam result" };
  }
}

export async function getExamsByStudentId(studentId: string) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return [];

    // Koçun kendi öğrencisi olduğunu doğrula
    const student = await prisma.profile.findFirst({
      where: {
        id: studentId,
        coachId: session.user.id
      }
    });

    if (!student) return [];

    return await prisma.examResult.findMany({
      where: { studentId },
      orderBy: { date: "asc" }
    });
  } catch (error) {
    console.error("Öğrenci sınavları getirilemedi:", error);
    return [];
  }
}
