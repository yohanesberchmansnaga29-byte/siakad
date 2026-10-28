import React from 'react';
import { 
  Users, 
  BarChart3, 
  CreditCard, 
  CalendarCheck, 
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  School
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/initialStudents';

export type ActiveTab = 'directory' | 'analytics' | 'idcard' | 'attendance' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  totalStudents: number;
  activeCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  totalStudents,
  activeCount
}) => {
  const schoolLogo = '/src/assets/images/school_badge_logo_1793177980050.jpg';

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'directory',
      label: 'Daftar Siswa',
      icon: <Users className="w-4 h-4 shrink-0" />,
      badge: totalStudents
    },
    {
      id: 'analytics',
      label: 'Statistik & Analisis',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />
    },
    {
      id: 'idcard',
      label: 'Cetak Kartu Pelajar',
      icon: <CreditCard className="w-4 h-4 shrink-0" />
    },
    {
      id: 'attendance',
      label: 'Presensi Harian',
      icon: <CalendarCheck className="w-4 h-4 shrink-0" />
    },
    {
      id: 'settings',
      label: 'Kelola & Backup',
      icon: <SlidersHorizontal className="w-4 h-4 shrink-0" />
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between min-h-screen select-none no-print">
      <div>
        {/* School Brand Wordmark Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 border border-slate-700/80 shrink-0 flex items-center justify-center shadow-inner">
              <img 
                src={schoolLogo} 
                alt="Logo Sekolah" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <School className="w-5 h-5 text-amber-400 hidden only:block" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold tracking-tight text-white whitespace-nowrap truncate">
                {SCHOOL_INFO.namaSekolah}
              </h1>
              <p className="text-xs text-slate-400 whitespace-nowrap truncate">
                Buku Induk & SIAKAD
              </p>
            </div>
          </div>
        </div>

        {/* Academic Period Info Banner */}
        <div className="mx-3 my-3 px-3 py-2 bg-slate-800/60 rounded-md border border-slate-700/50 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">T.A. {SCHOOL_INFO.tahunAjaran}</span>
            <span className="font-medium text-amber-300/90">Sem. {SCHOOL_INFO.semester}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-slate-400 text-[11px]">
            <span>NPSN: <span className="tabular-nums font-mono text-slate-300">{SCHOOL_INFO.npsn}</span></span>
            <span className="text-emerald-400 font-medium">Akreditasi {SCHOOL_INFO.akreditasi.split(' ')[0]}</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-2">
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[11px] tabular-nums font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-indigo-700/80 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info & Quick Stats */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Status Aktif</span>
          <span className="tabular-nums font-medium text-emerald-400">{activeCount} Siswa</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
            style={{ width: `${totalStudents > 0 ? (activeCount / totalStudents) * 100 : 0}%` }}
          />
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="truncate">{SCHOOL_INFO.kota.split(',')[0]}</span>
          <span className="text-slate-400">v2.4</span>
        </div>
      </div>
    </aside>
  );
};
