import React from 'react';
import { 
  X, 
  Trash2, 
  Download, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { StatusSiswa } from '../types/student';

interface BatchActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBatchStatusChange: (status: StatusSiswa) => void;
  onBatchDelete: () => void;
  onBatchExport: () => void;
  onBatchPrintCards: () => void;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onBatchStatusChange,
  onBatchDelete,
  onBatchExport,
  onBatchPrintCards
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-4 text-xs animate-in slide-in-from-bottom-4 duration-200 no-print">
      {/* Count & Clear */}
      <div className="flex items-center gap-2 border-r border-slate-700 pr-3">
        <span className="font-semibold text-indigo-300 tabular-nums">
          {selectedCount} Siswa
        </span>
        <span className="text-slate-400">terpilih</span>
        <button
          onClick={onClearSelection}
          className="text-slate-400 hover:text-white p-0.5 ml-1 rounded hover:bg-slate-800"
          title="Batal seleksi"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Batch Status Change */}
      <div className="flex items-center gap-1.5">
        <span className="text-slate-400 text-[11px] hidden sm:inline">Set Status:</span>
        <button
          onClick={() => onBatchStatusChange('Aktif')}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600/80 text-emerald-300 hover:text-white transition-colors text-[11px] font-medium"
        >
          Aktif
        </button>
        <button
          onClick={() => onBatchStatusChange('Cuti')}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-600/80 text-amber-300 hover:text-white transition-colors text-[11px] font-medium"
        >
          Cuti
        </button>
        <button
          onClick={() => onBatchStatusChange('Lulus')}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-blue-600/80 text-blue-300 hover:text-white transition-colors text-[11px] font-medium"
        >
          Lulus
        </button>
      </div>

      {/* Actions: Export & Delete */}
      <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
        <button
          onClick={onBatchExport}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition-colors"
          title="Export data siswa terpilih ke CSV"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">Export</span>
        </button>

        <button
          onClick={onBatchPrintCards}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition-colors"
          title="Pratinjau kartu pelajar terpilih"
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Kartu</span>
        </button>

        <button
          onClick={onBatchDelete}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-900/60 hover:bg-rose-700 text-rose-200 rounded transition-colors"
          title="Hapus siswa terpilih"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      </div>
    </div>
  );
};
