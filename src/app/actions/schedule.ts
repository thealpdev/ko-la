"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWeeklySchedule(studentId: string) {
  try {
    return await prisma.weeklySchedule.findMany({
      where: { studentId },
      orderBy: { createdAt: "asc" }
    });
  } catch (error) {
    console.error("Haftalık program getirilemedi:", error);
    return [];
  }
}

export async function addWeeklyScheduleEntry(studentId: string, data: {
  day: string;
  lesson: string;
  targetTopic: string;
  studyHours: string;
}) {
  try {
    await prisma.weeklySchedule.create({
      data: {
        ...data,
        studentId,
        status: "Yapılmadı"
      }
    });
    revalidatePath(`/dashboard/students/${studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Program girişi eklenemedi:", error);
    return { error: "İşlem başarısız oldu." };
  }
}

export async function updateWeeklyScheduleEntry(id: string, studentId: string, data: {
  day?: string;
  lesson?: string;
  targetTopic?: string;
  studyHours?: string;
}) {
  try {
    await prisma.weeklySchedule.update({
      where: { id },
      data
    });
    revalidatePath(`/dashboard/students/${studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Program girişi güncellenemedi:", error);
    return { error: "İşlem başarısız oldu." };
  }
}

export async function toggleWeeklyScheduleStatus(id: string, studentId: string) {
  try {
    const entry = await prisma.weeklySchedule.findUnique({ where: { id } });
    if (!entry) return { error: "Kayıt bulunamadı." };

    await prisma.weeklySchedule.update({
      where: { id },
      data: { 
        status: entry.status === "Yapıldı" ? "Yapılmadı" : "Yapıldı" 
      }
    });

    revalidatePath(`/dashboard/students/${studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Durum güncellenemedi:", error);
    return { error: "Güncelleme başarısız." };
  }
}

export async function deleteWeeklyScheduleEntry(id: string, studentId: string) {
  try {
    await prisma.weeklySchedule.delete({ where: { id } });
    revalidatePath(`/dashboard/students/${studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Kayıt silinemedi:", error);
    return { error: "Silme işlemi başarısız." };
  }
}
