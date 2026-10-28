import React from 'react';
import { Plus, Download, Upload, Menu, Search, Filter } from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenAddModal: () => void;
  onOpenImportExport: () => void;
  totalFiltered: number;
  totalAll: number;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenAddModal,
  onOpenImportExport,
  totalFiltered,
  totalAll,
  onToggleMobileMenu
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'directory':
        return {
          parent: 'Buku Induk Siswa',
          title: 'Daftar Siswa Terdaftar'
        };
      case 'analytics':
        return {
          parent: 'Akademik & Kesiswaan',
          title: 'Statistik & Analisis Data Siswa'
        };
      case 'idcard':
        return {
          parent: 'Administrasi',
          title: 'Cetak Kartu Tanda Pelajar (KTP Siswa)'
        };
      case 'attendance':
        return {
          parent: 'Presensi',
          title: 'Rekap Presensi Harian Kelas'
        };
      case 'settings':
        return {
          parent: 'Sistem',
          title: 'Cadangan & Pemulihan Data'
        };
    }
  };

  const { parent, title } = getTabTitle();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-6 shrink-0 z-20 no-print">
      {/* Zone 1: Breadcrumb and title */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button 
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>{parent}</span>
            <span aria-hidden="true" className="text-slate-400">/</span>
            <span className="text-slate-800 font-semibold truncate">{title}</span>
          </div>
          <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
            <span>Menampilkan <strong className="tabular-nums font-semibold text-slate-900">{totalFiltered}</strong> dari <strong className="tabular-nums font-semibold text-slate-900">{totalAll}</strong> siswa</span>
          </div>
        </div>
      </div>

      {/* Zone 3: Primary Action buttons */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenImportExport}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shadow-xs"
          title="Import / Export Data CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export / Import CSV</span>
        </button>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-xs focus:ring-2 focus:ring-indigo-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa</span>
        </button>
      </div>
    </header>
  );
};
