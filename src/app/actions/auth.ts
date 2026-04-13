"use server";

import { createClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * Supabase Auth kullanıcısını Prisma Profile tablosuyla senkronize eder
 * ve rol bilgisini Auth metadata üzerine yazar (Middleware erişimi için).
 */
async function syncProfile(user: any) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const isCoach = user.email === adminEmail;
  const role = isCoach ? "COACH" : "STUDENT";

  // 1. Prisma Kaydı
  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    update: {
      email: user.email,
      role: isCoach ? "COACH" : undefined,
    },
    create: {
      id: user.id,
      email: user.email,
      role: role,
    },
  });

  // 2. Supabase Auth Metadata Güncelleme (Middleware için kritik)
  const supabase = await createClient();
  await supabase.auth.updateUser({
    data: { role: profile.role }
  });

  return profile;
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const profile = await syncProfile(data.user);
    
    revalidatePath("/", "layout");
    
    if (profile.role === "COACH") {
      redirect("/dashboard");
    } else {
      redirect("/student");
    }
  }
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await syncProfile(data.user);
  }

  return { success: "Kaydı tamamlamak için e-postanı kontrol et!" };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
