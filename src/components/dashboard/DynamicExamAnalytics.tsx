"use client";

import dynamic from "next/dynamic";

const ModernExamAnalytics = dynamic(
  () => import("./ExamAnalytics").then((mod) => mod.ExamAnalytics),
  { 
    ssr: false, 
    loading: () => <div className="h-[400px] w-full animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-2xl" /> 
  }
);

export function DynamicExamAnalytics({ exams, studentId }: { exams: any[], studentId?: string }) {
  return <ModernExamAnalytics exams={exams} studentId={studentId} />;
}
