import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  FileText 
} from 'lucide-react';
import { Student } from '../types/student';
import { exportToCSV, parseCSV } from '../utils/studentHelpers';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onImportStudents: (newStudents: Student[]) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  students,
  onImportStudents
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [parsedPreview, setParsedPreview] = useState<Partial<Student>[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportAll = () => {
    exportToCSV(students, `data-siswa-lengkap-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleDownloadTemplate = () => {
    const templateRows = [
      'NIS,NISN,Nama Lengkap,L/P,Tingkat,Kelas,Jurusan,Tempat Lahir,Tanggal Lahir,Agama,Status,Nilai Rata-rata,Kehadiran (%),Nama Wali,Hubungan,Telepon Wali,Alamat,Kota',
      '241099,0081234599,"Budi Prakoso",L,10,"X MIPA 1",MIPA,Jakarta,2008-01-15,Islam,Aktif,88.5,96.0,"Santoso",Ayah,081234567890,"Jl. Melati No. 5",Jakarta Selatan'
    ];
    const blob = new Blob(['\uFEFF' + templateRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-import-siswa-siakad.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setErrorMsg('File CSV tidak memiliki data valid atau format kolom tidak sesuai.');
          setParsedPreview([]);
        } else {
          setParsedPreview(parsed);
        }
      } catch (err) {
        setErrorMsg('Gagal membaca isi file CSV.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedPreview.length === 0) return;
    onImportStudents(parsedPreview as Student[]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold">Export & Import Data Siswa (CSV)</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'export'
                ? 'border-indigo-600 text-indigo-700 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Export Data ke CSV
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'import'
                ? 'border-indigo-600 text-indigo-700 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Import File CSV Baru
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-start gap-3">
                <FileSpreadsheet className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-indigo-950 text-xs">
                    Unduh Seluruh Buku Induk Siswa
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    File CSV yang dihasilkan mencakup seluruh biodata {students.length} siswa, NIS, NISN, kelas, kontak wali, serta rekap nilai dan presensi. Kompatibel dengan Microsoft Excel, Google Sheets, dan LibreOffice Calc.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleExportAll}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File CSV ({students.length} Siswa)</span>
                </button>

                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Download Contoh Template</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File upload drop area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl bg-slate-50/70 hover:bg-indigo-50/20 transition-colors text-center cursor-pointer"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="font-semibold text-slate-800">
                  {fileName ? fileName : 'Pilih atau Tarik File CSV ke Sini'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Format berkas yang didukung: .csv dengan pemisah koma
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Preview parsed data */}
              {parsedPreview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Pratinjau Data: {parsedPreview.length} Siswa Terdeteksi</span>
                    <span className="text-emerald-600 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Siap Diimpor
                    </span>
                  </div>

                  <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 text-[11px]">
                    {parsedPreview.slice(0, 5).map((p, idx) => (
                      <div key={idx} className="p-2 flex items-center justify-between">
                        <span className="font-medium text-slate-800">{p.nama}</span>
                        <span className="text-slate-500 font-mono tabular-nums">
                          {p.nis} · {p.kelas}
                        </span>
                      </div>
                    ))}
                    {parsedPreview.length > 5 && (
                      <div className="p-2 text-center text-slate-400 italic">
                        + {parsedPreview.length - 5} siswa lainnya...
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleConfirmImport}
                    className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    Tambahkan {parsedPreview.length} Siswa ke Database
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
