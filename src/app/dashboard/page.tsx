import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  Plus
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-white dark:bg-black overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-950/20">
        <div className="p-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100">Koçla</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Users size={20} />} label="Öğrenciler" />
          <NavItem icon={<BookOpen size={20} />} label="Müfredat" />
          <NavItem icon={<BarChart3 size={20} />} label="Analizler" />
          <NavItem icon={<Settings size={20} />} label="Ayarlar" />
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Admin Koç</span>
              <span className="text-xs text-zinc-500">Öğretmen Hesabı</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-8 bg-white dark:bg-black">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Öğrenci veya görev ara..."
                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 transition-colors">
              <Bell size={20} />
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              <Plus size={18} />
              <span>Yeni Ödev</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Ödev Atama Paneli</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Öğrencinin haftalık çalışma planını buradan yönetebilirsin.</p>
          </div>

          <div className="flex-1 min-h-0">
            <KanbanBoard />
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`
      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group
      ${active 
        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" 
        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"}
    `}>
      <span className={active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"}>
        {icon}
      </span>
      {label}
    </div>
  );
}
