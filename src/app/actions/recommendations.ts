"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function recommendBook(data: {
  studentId: string;
  title: string;
  author: string;
  imageUrl?: string;
  reason?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return { success: false, error: "Yetkisiz erişim." };

    await (prisma as any).bookRecommendation.create({
      data: {
        studentId: data.studentId,
        coachId: session.user.id,
        title: data.title,
        author: data.author,
        imageUrl: data.imageUrl,
        reason: data.reason
      }
    });

    revalidatePath("/student");
    revalidatePath(`/dashboard/students/${data.studentId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Kitap önerisi kaydedilemedi:", error);
    return { success: false, error: "Veritabanı hatası." };
  }
}

export async function getRecommendations(studentId: string) {
  try {
    return await (prisma as any).bookRecommendation.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
      take: 5
    });
  } catch (error) {
    console.error("Öneriler getirilemedi:", error);
    return [];
  }
}

export async function deleteRecommendation(id: string) {
  try {
    const rec = await (prisma as any).bookRecommendation.delete({
      where: { id }
    });
    
    revalidatePath("/student");
    revalidatePath(`/dashboard/students/${rec.studentId}`);
    return { success: true };
  } catch (error) {
    console.error("Öneri silinemedi:", error);
    return { success: false };
  }
}
