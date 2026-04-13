"use server";

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function createStudent(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.user) {
      return { error: "Oturum bulunamadı." };
    }

    // Mevcut kullanıcının KOÇ olduğunu doğrula
    const coachProfile = await prisma.profile.findUnique({
      where: { id: session.user.id }
    });

    if (coachProfile?.role !== "COACH") {
      return { error: "Bu işlem için yetkiniz yok." };
    }

    // 1. Supabase Auth üzerinde kullanıcı oluştur (Admin Yetkisiyle)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name }
    });

    if (authError) {
      return { error: `Auth Hatası: ${authError.message}` };
    }

    // 2. Prisma üzerinde Profil oluştur ve Koç'a bağla
    await prisma.profile.create({
      data: {
        id: authUser.user.id,
        email: email,
        fullName: name,
        role: "STUDENT",
        coachId: coachProfile.id
      }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Öğrenci oluşturma hatası:", error);
    return { error: "Beklenmedik bir hata oluştu." };
  }
}

export async function getMyStudents() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.user) return [];

    return await prisma.profile.findMany({
      where: { coachId: session.user.id },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Öğrenciler getirilirken hata:", error);
    return [];
  }
}

export async function getStudentById(id: string) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.user) return null;

    // Sadece kendi öğrencilerinin detayını görebilsin
    return await prisma.profile.findFirst({
      where: { 
        id,
        coachId: session.user.id
      },
      include: {
        assignments: true,
        examResults: true,
        weeklySchedules: true
      }
    });
  } catch (error) {
    console.error("Öğrenci detayı getirilirken hata:", error);
    return null;
  }
}
