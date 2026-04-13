"use server";

import { createClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateDailyGoal(studentId: string, goalQuestions: number, date: Date = new Date()) {
  try {
    // Set hours to 0 to compare dates correctly
    date.setHours(0, 0, 0, 0);

    const stat = await prisma.dailyStat.upsert({
      where: {
        studentId_date: { studentId, date }
      },
      update: { goalQuestions },
      create: { studentId, date, goalQuestions }
    });

    revalidatePath(`/dashboard/students/${studentId}`);
    return { success: true, data: stat };
  } catch (error) {
    console.error("Hedef güncellenemedi:", error);
    return { error: "İşlem başarısız." };
  }
}

export async function getDailyStats(studentId: string) {
  try {
    return await prisma.dailyStat.findMany({
      where: { studentId },
      orderBy: { date: "desc" },
      take: 7
    });
  } catch (error) {
    console.error("İstatistikler getirilemedi:", error);
    return [];
  }
}

export async function getDashboardSummary() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const students = await prisma.profile.findMany({
      where: { coachId: session.user.id },
      include: {
        dailyStats: {
          orderBy: { date: "desc" },
          take: 1
        }
      }
    });

    const totalStudents = students.length;
    let totalQuestionsToday = 0;
    let avgGoalCompletion = 0;

    students.forEach(student => {
      const today = student.dailyStats[0];
      if (today) {
        totalQuestionsToday += today.solvedQuestions;
        if (today.goalQuestions > 0) {
          avgGoalCompletion += (today.solvedQuestions / today.goalQuestions);
        }
      }
    });

    const finalAvg = totalStudents > 0 ? Math.round((avgGoalCompletion / totalStudents) * 100) : 0;

    return {
      totalStudents,
      totalQuestionsToday,
      avgGoalCompletion: finalAvg
    };
  } catch (error) {
    console.error("Dashboard özeti alınamadı:", error);
    return null;
  }
}
