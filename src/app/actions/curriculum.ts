"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTopics() {
  return await prisma.topic.findMany({
    orderBy: [
      { category: "asc" },
      { subject: "asc" },
      { name: "asc" }
    ]
  });
}

export async function getStudentTopicProgress(studentId: string) {
  return await prisma.studentTopicProgress.findMany({
    where: { studentId },
    include: { topic: true }
  });
}

export async function updateTopicProgress(studentId: string, topicId: string, status: string) {
  try {
    await prisma.studentTopicProgress.upsert({
      where: {
        studentId_topicId: { studentId, topicId }
      },
      update: { status },
      create: { studentId, topicId, status }
    });
    revalidatePath(`/dashboard/students/${studentId}`);
    return { success: true };
  } catch (error) {
    console.error("Müfredat ilerlemesi güncellenemedi:", error);
    return { error: "Güncelleme başarısız." };
  }
}

export async function seedCurriculum() {
  const topics = [
    // TYT Matematik
    { name: "Temel Kavramlar", category: "TYT", subject: "Matematik" },
    { name: "Sayı Basamakları", category: "TYT", subject: "Matematik" },
    { name: "Bölme ve Bölünebilme", category: "TYT", subject: "Matematik" },
    { name: "EBOB-EKOK", category: "TYT", subject: "Matematik" },
    { name: "Rasyonel Sayılar", category: "TYT", subject: "Matematik" },
    { name: "Basit Eşitsizlikler", category: "TYT", subject: "Matematik" },
    { name: "Mutlak Değer", category: "TYT", subject: "Matematik" },
    { name: "Üslü Sayılar", category: "TYT", subject: "Matematik" },
    { name: "Köklü Sayılar", category: "TYT", subject: "Matematik" },
    { name: "Çarpanlara Ayırma", category: "TYT", subject: "Matematik" },
    { name: "Oran-Orantı", category: "TYT", subject: "Matematik" },
    { name: "Denklem Çözme", category: "TYT", subject: "Matematik" },
    { name: "Problemler", category: "TYT", subject: "Matematik" },
    { name: "Kümeler", category: "TYT", subject: "Matematik" },
    { name: "Fonksiyonlar", category: "TYT", subject: "Matematik" },
    { name: "Permütasyon-Kombinasyon", category: "TYT", subject: "Matematik" },
    { name: "Binom ve Olasılık", category: "TYT", subject: "Matematik" },
    { name: "Veri-İstatistik", category: "TYT", subject: "Matematik" },
    { name: "Polinomlar", category: "TYT", subject: "Matematik" },
    { name: "2. Dereceden Denklemler", category: "TYT", subject: "Matematik" },

    // TYT Geometri
    { name: "Açılar ve Üçgenler", category: "TYT", subject: "Geometri" },
    { name: "Özel Üçgenler", category: "TYT", subject: "Geometri" },
    { name: "Üçgende Alan ve Benzerlik", category: "TYT", subject: "Geometri" },
    { name: "Çokgenler ve Dörtgenler", category: "TYT", subject: "Geometri" },
    { name: "Çember ve Daire", category: "TYT", subject: "Geometri" },
    { name: "Analitik Geometri", category: "TYT", subject: "Geometri" },
    { name: "Katı Cisimler", category: "TYT", subject: "Geometri" },

    // TYT Türkçe
    { name: "Sözcükte Anlam", category: "TYT", subject: "Türkçe" },
    { name: "Cümlede Anlam", category: "TYT", subject: "Türkçe" },
    { name: "Paragrafta Anlam", category: "TYT", subject: "Türkçe" },
    { name: "Ses Bilgisi", category: "TYT", subject: "Türkçe" },
    { name: "Yazım Kuralları", category: "TYT", subject: "Türkçe" },
    { name: "Noktalama İşaretleri", category: "TYT", subject: "Türkçe" },
    { name: "Sözcük Türleri", category: "TYT", subject: "Türkçe" },
    { name: "Cümlenin Ögeleri", category: "TYT", subject: "Türkçe" },
    { name: "Fiiller ve Fiilimsiler", category: "TYT", subject: "Türkçe" },
    { name: "Anlatım Bozuklukları", category: "TYT", subject: "Türkçe" },

    // TYT Fizik
    { name: "Fizik Bilimine Giriş", category: "TYT", subject: "Fizik" },
    { name: "Madde ve Özellikleri", category: "TYT", subject: "Fizik" },
    { name: "Hareket ve Kuvvet", category: "TYT", subject: "Fizik" },
    { name: "Enerji", category: "TYT", subject: "Fizik" },
    { name: "Isı ve Sıcaklık", category: "TYT", subject: "Fizik" },
    { name: "Elektrik ve Manyetizma", category: "TYT", subject: "Fizik" },
    { name: "Basınç ve Kaldırma Kuvveti", category: "TYT", subject: "Fizik" },
    { name: "Dalgalar ve Optik", category: "TYT", subject: "Fizik" },

    // TYT Kimya
    { name: "Kimya Bilimi", category: "TYT", subject: "Kimya" },
    { name: "Atom ve Periyodik Sistem", category: "TYT", subject: "Kimya" },
    { name: "Kimyasal Türler Arası Etkileşimler", category: "TYT", subject: "Kimya" },
    { name: "Maddenin Halleri", category: "TYT", subject: "Kimya" },
    { name: "Kimyanın Temel Kanunları", category: "TYT", subject: "Kimya" },
    { name: "Asitler, Bazlar ve Tuzlar", category: "TYT", subject: "Kimya" },
    { name: "Karışımlar", category: "TYT", subject: "Kimya" },
    { name: "Kimya Her Yerde", category: "TYT", subject: "Kimya" },

    // TYT Biyoloji
    { name: "Canlıların Ortak Özellikleri", category: "TYT", subject: "Biyoloji" },
    { name: "Hücre ve Organeller", category: "TYT", subject: "Biyoloji" },
    { name: "Canlılar Dünyası", category: "TYT", subject: "Biyoloji" },
    { name: "Hücre Bölünmeleri", category: "TYT", subject: "Biyoloji" },
    { name: "Kalıtım", category: "TYT", subject: "Biyoloji" },
    { name: "Ekosistem Ekolojisi", category: "TYT", subject: "Biyoloji" },

    // 11. Sınıf Sayısal - Matematik
    { name: "Trigonometri", category: "11. Sınıf", subject: "Matematik" },
    { name: "Analitik Geometri (11)", category: "11. Sınıf", subject: "Matematik" },
    { name: "Fonksiyonlarda Uygulamalar (11)", category: "11. Sınıf", subject: "Matematik" },
    { name: "Denklem ve Eşitsizlik Sistemleri", category: "11. Sınıf", subject: "Matematik" },
    { name: "Çember ve Daire", category: "11. Sınıf", subject: "Matematik" },
    { name: "Uzay Geometri", category: "11. Sınıf", subject: "Matematik" },
    { name: "Olasılık (11)", category: "11. Sınıf", subject: "Matematik" },

    // 11. Sınıf Sayısal - Fizik
    { name: "Kuvvet ve Hareket", category: "11. Sınıf", subject: "Fizik" },
    { name: "Tork ve Denge", category: "11. Sınıf", subject: "Fizik" },
    { name: "Basit Makineler", category: "11. Sınıf", subject: "Fizik" },
    { name: "Elektriksel Kuvvet ve Alan", category: "11. Sınıf", subject: "Fizik" },
    { name: "Manyetizma ve İndükleme", category: "11. Sınıf", subject: "Fizik" },
    { name: "Alternatif Akım", category: "11. Sınıf", subject: "Fizik" },

    // 11. Sınıf Sayısal - Kimya
    { name: "Modern Atom Teorisi", category: "11. Sınıf", subject: "Kimya" },
    { name: "Gazlar (11)", category: "11. Sınıf", subject: "Kimya" },
    { name: "Sıvı Çözeltiler ve Çözünürlük", category: "11. Sınıf", subject: "Kimya" },
    { name: "Kimyasal Tepkimelerde Enerji", category: "11. Sınıf", subject: "Kimya" },
    { name: "Kimyasal Tepkimelerde Hız", category: "11. Sınıf", subject: "Kimya" },
    { name: "Kimyasal Tepkimelerde Denge", category: "11. Sınıf", subject: "Kimya" },

    // 11. Sınıf Sayısal - Biyoloji
    { name: "İnsan Fizyolojisi (Tüm Sistemler)", category: "11. Sınıf", subject: "Biyoloji" },
    { name: "Sinir Sistemi ve Duyu Organları", category: "11. Sınıf", subject: "Biyoloji" },
    { name: "Destek ve Hareket Sistemi", category: "11. Sınıf", subject: "Biyoloji" },
    { name: "Sindirim ve Dolaşım Sistemi", category: "11. Sınıf", subject: "Biyoloji" },
    { name: "Solunum ve Boşaltım Sistemi", category: "11. Sınıf", subject: "Biyoloji" },
    { name: "Komünite ve Popülasyon Ekolojisi", category: "11. Sınıf", subject: "Biyoloji" },

    // TYT Sosyal
    { name: "Tarih Bilimi ve İlk Uygarlıklar", category: "TYT", subject: "Tarih" },
    { name: "Osmanlı Tarihi", category: "TYT", subject: "Tarih" },
    { name: "Milli Mücadele Dönemi", category: "TYT", subject: "Tarih" },
    { name: "Coğrafi Konum ve Harita", category: "TYT", subject: "Coğrafya" },
    { name: "İklim Bilgisi", category: "TYT", subject: "Coğrafya" },
    { name: "Nüfus ve Yerleşme", category: "TYT", subject: "Coğrafya" },
    { name: "Felsefeyi Tanıma", category: "TYT", subject: "Felsefe" },
    { name: "İnanç ve İbadet", category: "TYT", subject: "Din" }
  ];

  for (const topic of topics) {
    const id = `preset_${topic.category}_${topic.subject}_${topic.name.replace(/\s/g, "_")}`;
    await prisma.topic.upsert({
      where: { id },
      update: {},
      create: { id, ...topic }
    });
  }

  return { success: true };
}
