import React, { useState } from 'react';
import { 
  RotateCcw, 
  Download, 
  Upload, 
  School, 
  ShieldCheck, 
  Check, 
  AlertTriangle,
  Database
} from 'lucide-react';
import { Student } from '../types/student';
import { SCHOOL_INFO } from '../data/initialStudents';

interface SettingsBackupProps {
  students: Student[];
  onResetToDemo: () => void;
  onRestoreBackup: (students: Student[]) => void;
}

export const SettingsBackup: React.FC<SettingsBackupProps> = ({
  students,
  onResetToDemo,
  onRestoreBackup
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string>('');

  const handleDownloadJsonBackup = () => {
    const backupData = {
      appName: 'SIAKAD Buku Induk Siswa',
      schoolInfo: SCHOOL_INFO,
      backupDate: new Date().toISOString(),
      studentCount: students.length,
      students: students
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-siakad-siswa-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSuccessNotice('Cadangan berkas JSON berhasil diunduh.');
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  const handleUploadJsonBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.students)) {
          onRestoreBackup(parsed.students);
          setSuccessNotice(`Berhasil memulihkan ${parsed.students.length} data siswa dari berkas backup.`);
        } else if (Array.isArray(parsed)) {
          onRestoreBackup(parsed);
          setSuccessNotice(`Berhasil memulihkan ${parsed.length} data siswa dari berkas backup.`);
        } else {
          alert('Format cadangan JSON tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON cadangan.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 overflow-y-auto max-w-4xl mx-auto">
      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* School Profile Information */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <School className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Identitas Sekolah & Pengesahan
            </h2>
            <p className="text-xs text-slate-500">
              Data referensi resmi yang tertera pada Kartu Pelajar dan Buku Induk.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 text-[11px]">Nama Satuan Pendidikan</span>
            <div className="font-bold text-slate-900 mt-0.5">{SCHOOL_INFO.namaSekolah}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 text-[11px]">NPSN & Akreditasi</span>
            <div className="font-mono tabular-nums font-semibold text-slate-900 mt-0.5">
              {SCHOOL_INFO.npsn} ({SCHOOL_INFO.akreditasi})
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 text-[11px]">Kepala Sekolah</span>
            <div className="font-semibold text-slate-900 mt-0.5">{SCHOOL_INFO.kepalaSekolah}</div>
            <div className="font-mono tabular-nums text-slate-500 text-[11px]">NIP: {SCHOOL_INFO.nipKepalaSekolah}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 text-[11px]">Alamat & Kontak Sekolah</span>
            <div className="text-slate-800 mt-0.5">{SCHOOL_INFO.alamat}</div>
            <div className="text-slate-500 text-[11px]">{SCHOOL_INFO.telepon} · {SCHOOL_INFO.website}</div>
          </div>
        </div>
      </div>

      {/* Database Backup & Restore */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Database className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Cadangan & Pemulihan Database (Backup JSON)
            </h2>
            <p className="text-xs text-slate-500">
              Amankan salinan lengkap database siswa atau pulihkan dari file cadangan sebelumnya.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-800">Unduh Salinan JSON</h3>
            <p className="text-[11px] text-slate-500">
              Menyimpan seluruh {students.length} rekaman siswa dalam satu file JSON terstruktur.
            </p>
            <button
              onClick={handleDownloadJsonBackup}
              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-300" />
              <span>Download File Cadangan (.json)</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-800">Pulihkan dari JSON</h3>
            <p className="text-[11px] text-slate-500">
              Memulihkan database dari file cadangan JSON yang sebelumnya diexport.
            </p>
            <label className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-medium rounded-lg text-xs transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Pilih File Backup (.json)</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleUploadJsonBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Reset to Demo Data */}
      <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-rose-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Reset ke Data Awal Demo
            </h2>
            <p className="text-xs text-slate-500">
              Mengembalikan seluruh data ke 24 siswa teladan awal SMA Negeri Excellentia.
            </p>
          </div>
        </div>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
          >
            Reset Database ke Data Demo
          </button>
        ) : (
          <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 text-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Konfirmasi Reset Database</span>
            </div>
            <p className="text-rose-800 text-[11px]">
              Tindakan ini akan menimpa data siswa saat ini dengan dataset demo bawaan. Apakah Anda yakin?
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onResetToDemo();
                  setShowResetConfirm(false);
                  setSuccessNotice('Database berhasil direset ke data demo bawaan.');
                  setTimeout(() => setSuccessNotice(''), 3000);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-md transition-colors"
              >
                Ya, Reset Sekarang
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-md transition-colors"
              >
                Batalkan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
