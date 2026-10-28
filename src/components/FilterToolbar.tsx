import React from 'react';
import { 
  Search, 
  X, 
  LayoutList, 
  LayoutGrid, 
  ArrowUpDown, 
  RotateCcw,
  SlidersHorizontal 
} from 'lucide-react';
import { FilterState, ViewMode } from '../types/student';
import { DAFTAR_KELAS, DAFTAR_JURUSAN } from '../data/initialStudents';

interface FilterToolbarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onResetFilters: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onResetFilters
}) => {
  const isFiltered = 
    Boolean(filters.search) || 
    filters.kelas !== 'ALL' || 
    filters.jurusan !== 'ALL' || 
    filters.status !== 'ALL' || 
    filters.jenisKelamin !== 'ALL';

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3.5 space-y-3 no-print">
      {/* Top row: Live Search + View Mode + Quick Reset */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Cari berdasarkan Nama, NIS, NISN, atau Nama Wali..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Bersihkan pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Switcher & Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="bg-transparent border-none text-xs text-slate-700 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="nama">Urut: Nama</option>
              <option value="nis">Urut: NIS</option>
              <option value="kelas">Urut: Kelas</option>
              <option value="nilaiRataRata">Urut: Nilai Rapor</option>
              <option value="kehadiran">Urut: Kehadiran</option>
            </select>
            <button
              onClick={() => onFilterChange({ 
                ...filters, 
                sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' 
              })}
              title={filters.sortDirection === 'asc' ? 'Arah: Menaik (A-Z / Rendah ke Tinggi)' : 'Arah: Menurun (Z-A / Tinggi ke Rendah)'}
              className="px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-200/80 rounded transition-colors"
            >
              {filters.sortDirection === 'asc' ? 'ASC' : 'DESC'}
            </button>
          </div>

          {/* View Mode Toggle: Segmented control */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Tabel Data"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Kartu Siswa"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-700">
        <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider flex items-center gap-1 mr-1">
          <SlidersHorizontal className="w-3 h-3" />
          Filter:
        </span>

        {/* Filter Kelas */}
        <select
          value={filters.kelas}
          onChange={(e) => onFilterChange({ ...filters, kelas: e.target.value })}
          className={`px-2.5 py-1.5 rounded-md border text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
            filters.kelas !== 'ALL'
              ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <option value="ALL">Semua Kelas</option>
          {DAFTAR_KELAS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        {/* Filter Jurusan */}
        <select
          value={filters.jurusan}
          onChange={(e) => onFilterChange({ ...filters, jurusan: e.target.value })}
          className={`px-2.5 py-1.5 rounded-md border text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
            filters.jurusan !== 'ALL'
              ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <option value="ALL">Semua Jurusan</option>
          {DAFTAR_JURUSAN.map((j) => (
            <option key={j.value} value={j.value}>
              {j.label}
            </option>
          ))}
        </select>

        {/* Filter Status Siswa */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className={`px-2.5 py-1.5 rounded-md border text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
            filters.status !== 'ALL'
              ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <option value="ALL">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Cuti">Cuti</option>
          <option value="Pindah">Pindah</option>
          <option value="Lulus">Lulus</option>
        </select>

        {/* Filter Jenis Kelamin */}
        <select
          value={filters.jenisKelamin}
          onChange={(e) => onFilterChange({ ...filters, jenisKelamin: e.target.value })}
          className={`px-2.5 py-1.5 rounded-md border text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
            filters.jenisKelamin !== 'ALL'
              ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <option value="ALL">Semua Gender</option>
          <option value="L">Laki-laki (L)</option>
          <option value="P">Perempuan (P)</option>
        </select>

        {/* Reset filter action */}
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>
    </div>
  );
};
