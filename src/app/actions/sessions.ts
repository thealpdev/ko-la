"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function logStudySession(duration: number, type: "WORK" | "BREAK") {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { error: "Oturum bulunamadı." };

    const studentId = session.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Create the detailed session record
    await prisma.studySession.create({
      data: {
        studentId,
        duration,
        type,
        date: new Date()
      }
    });

    // 2. Update the DailyStat aggregate (only for WORK sessions)
    if (type === "WORK") {
      await prisma.dailyStat.upsert({
        where: {
          studentId_date: { studentId, date: today }
        },
        update: {
          studyMinutes: { increment: duration }
        },
        create: {
          studentId,
          date: today,
          studyMinutes: duration,
          goalQuestions: 0,
          solvedQuestions: 0
        }
      });
    }

    revalidatePath("/student");
    revalidatePath(`/dashboard/students/${studentId}`);
    return { success: true };
  } catch (error) {
    console.error("Oturum kaydedilemedi:", error);
    return { error: "İşlem başarısız." };
  }
}

export async function getStudyAnalytics(studentId: string) {
  try {
    const stats = await prisma.dailyStat.findMany({
      where: { studentId },
      orderBy: { date: "asc" },
      take: 7
    });

    // Formatting for Recharts
    return stats.map(stat => ({
      date: new Date(stat.date).toLocaleDateString("tr-TR", { weekday: "short" }),
      minutes: stat.studyMinutes,
      questions: stat.solvedQuestions
    }));
  } catch (error) {
    console.error("Analizler getirilemedi:", error);
    return [];
  }
}
