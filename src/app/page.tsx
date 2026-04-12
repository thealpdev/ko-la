import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Next-Gen Coaching Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Initial project scaffolding complete. Ready to build the future of academic tracking.
          </p>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Prisma Initialized
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Tailwind CSS Configured
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
