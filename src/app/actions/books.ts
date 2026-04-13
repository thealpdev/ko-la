"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function addStudentBook(studentId: string, formData: FormData) {
  try {
    const publisher = formData.get("publisher") as string;
    const bookName = formData.get("bookName") as string;
    const subject = formData.get("subject") as string;

    await (prisma as any).studentBook.create({
      data: {
        studentId,
        publisher,
        bookName,
        subject,
        status: "START"
      }
    });

    revalidatePath(`/dashboard/students/${studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Kitap eklenemedi:", error);
    return { error: "İşlem başarısız." };
  }
}

export async function updateBookStatus(id: string, studentId: string, status: string) {
  try {
    await (prisma as any).studentBook.update({
      where: { id },
      data: { status }
    });
    revalidatePath(`/dashboard/students/${studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Kitap durumu güncellenemedi:", error);
    return { error: "İşlem başarısız." };
  }
}

export async function deleteBook(id: string, studentId: string) {
  try {
    await (prisma as any).studentBook.delete({ where: { id } });
    revalidatePath(`/dashboard/students/${studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Kitap silinemedi:", error);
    return { error: "İşlem başarısız." };
  }
}

export async function getStudentBooks(studentId: string) {
  try {
    return await (prisma as any).studentBook.findMany({
      where: { studentId },
      include: {
        chapters: {
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { updatedAt: "desc" }
    });
  } catch (error) {
    console.error("Kitaplar getirilemedi:", error);
    return [];
  }
}

export async function addBookChapter(bookId: string, name: string) {
  try {
    const book = await (prisma as any).studentBook.findUnique({ where: { id: bookId }, select: { studentId: true } });
    if (!book) return { error: "Kitap bulunamadı." };

    await (prisma as any).bookChapter.create({
      data: {
        bookId,
        name,
        totalTests: 1 // Default to 1 test
      }
    });

    revalidatePath(`/dashboard/students/${book.studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Bölüm eklenemedi:", error);
    return { error: "İşlem başarısız." };
  }
}

export async function updateChapterProgress(chapterId: string, data: { isCompleted?: boolean; completedTests?: number; totalTests?: number }) {
  try {
    const chapter = await (prisma as any).bookChapter.findUnique({ 
      where: { id: chapterId },
      include: { book: true }
    });
    if (!chapter) return { error: "Bölüm bulunamadı." };

    await (prisma as any).bookChapter.update({
      where: { id: chapterId },
      data
    });

    revalidatePath(`/dashboard/students/${chapter.book.studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Bölüm güncellenemedi:", error);
    return { error: "İşlem başarısız." };
  }
}

export async function deleteChapter(chapterId: string) {
  try {
    const chapter = await (prisma as any).bookChapter.findUnique({ 
      where: { id: chapterId },
      include: { book: true }
    });
    if (!chapter) return { error: "Bölüm bulunamadı." };

    await (prisma as any).bookChapter.delete({ where: { id: chapterId } });

    revalidatePath(`/dashboard/students/${chapter.book.studentId}`);
    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Bölüm silinemedi:", error);
    return { error: "İşlem başarısız." };
  }
}
export async function createBookFromRecommendation(data: { title: string; author: string; publisher: string }) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return { error: "Yetkisiz erişim." };

    await (prisma as any).studentBook.create({
      data: {
        studentId: session.user.id,
        bookName: data.title,
        publisher: data.publisher,
        subject: "Genel",
        status: "START"
      }
    });

    revalidatePath("/student");
    return { success: true };
  } catch (error) {
    console.error("Kitap öneriden eklenemedi:", error);
    return { error: "İşlem başarısız." };
  }
}
