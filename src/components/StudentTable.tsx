import React from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  CreditCard, 
  Phone, 
  ExternalLink,
  ChevronDown,
  UserX,
  Award
} from 'lucide-react';
import { Student } from '../types/student';
import { getAvatarColor, getInitials, formatWhatsAppUrl } from '../utils/studentHelpers';

interface StudentTableProps {
  students: Student[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onPrintCard: (student: Student) => void;
  onResetFilters: () => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onPrintCard,
  onResetFilters
}) => {
  const allSelected = students.length > 0 && selectedIds.length === students.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < students.length;

  if (students.length === 0) {
    return (
      <div className="p-12 text-center bg-white">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <UserX className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Tidak ada data siswa yang cocok</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Tidak ditemukan siswa yang sesuai dengan kriteria pencarian atau filter yang diterapkan.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-4 px-3.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
        >
          Bersihkan Semua Filter
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold tracking-wide uppercase text-[11px]">
            <th className="py-3 px-4 w-10 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={onToggleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                aria-label="Pilih semua siswa di tabel"
              />
            </th>
            <th className="py-3 px-3">Identitas & Siswa</th>
            <th className="py-3 px-3">NIS / NISN</th>
            <th className="py-3 px-3">Kelas & Jurusan</th>
            <th className="py-3 px-3">Wali Murid & Kontak</th>
            <th className="py-3 px-3 text-right">Nilai Rapor</th>
            <th className="py-3 px-3 text-right">Presensi</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-4 text-center w-36">Tindakan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => {
            const isSelected = selectedIds.includes(student.id);
            const avatarColor = getAvatarColor(student.nama);
            const initials = getInitials(student.nama);

            // Clean status text rendering (Anti-slop zero pill rule)
            const getStatusColor = (status: string) => {
              switch (status) {
                case 'Aktif':
                  return 'text-emerald-700 font-medium';
                case 'Cuti':
                  return 'text-amber-700 font-medium';
                case 'Lulus':
                  return 'text-blue-700 font-medium';
                default:
                  return 'text-rose-700 font-medium';
              }
            };

            return (
              <tr
                key={student.id}
                className={`transition-colors hover:bg-slate-50/90 group ${
                  isSelected ? 'bg-indigo-50/40' : ''
                }`}
              >
                {/* Selection Checkbox */}
                <td className="py-3 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(student.id)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    aria-label={`Pilih ${student.nama}`}
                  />
                </td>

                {/* Name & Basic Info */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => onViewStudent(student)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer transition-transform group-hover:scale-105 ${avatarColor.bg}`}
                      title="Klik untuk detail"
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div 
                        onClick={() => onViewStudent(student)}
                        className="font-semibold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors flex items-center gap-1.5 truncate"
                      >
                        <span className="truncate">{student.nama}</span>
                        {student.catatanPrestasi && (
                          <span title={student.catatanPrestasi} className="text-amber-500 shrink-0">
                            <Award className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span>{student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{student.tempatLahir}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* NIS & NISN (Tabular figures) */}
                <td className="py-3 px-3">
                  <div className="font-mono tabular-nums text-slate-800 font-medium">
                    {student.nis}
                  </div>
                  <div className="font-mono tabular-nums text-[11px] text-slate-400">
                    {student.nisn}
                  </div>
                </td>

                {/* Kelas & Jurusan */}
                <td className="py-3 px-3">
                  <div className="font-medium text-slate-800">
                    {student.kelas}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {student.jurusan} · Tingkat {student.tingkat}
                  </div>
                </td>

                {/* Wali & Kontak */}
                <td className="py-3 px-3">
                  <div className="font-medium text-slate-800 truncate max-w-[150px]">
                    {student.namaWali}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-mono tabular-nums">{student.teleponWali}</span>
                    <a
                      href={formatWhatsAppUrl(student.teleponWali, student.nama)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 inline-flex items-center"
                      title="Kirim pesan WhatsApp ke Wali Murid"
                    >
                      <Phone className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </td>

                {/* Nilai Rapor (Numeric Right-aligned) */}
                <td className="py-3 px-3 text-right">
                  <span className={`font-mono tabular-nums font-semibold ${
                    student.nilaiRataRata >= 90 
                      ? 'text-indigo-600' 
                      : student.nilaiRataRata >= 85 
                      ? 'text-slate-800' 
                      : 'text-amber-700'
                  }`}>
                    {student.nilaiRataRata.toFixed(1)}
                  </span>
                  <div className="text-[10px] text-slate-400">Skala 100</div>
                </td>

                {/* Presensi Kehadiran */}
                <td className="py-3 px-3 text-right">
                  <span className={`font-mono tabular-nums font-medium ${
                    student.kehadiran >= 95 
                      ? 'text-emerald-600' 
                      : student.kehadiran >= 85 
                      ? 'text-slate-700' 
                      : 'text-rose-600 font-bold'
                  }`}>
                    {student.kehadiran.toFixed(1)}%
                  </span>
                  <div className="w-16 ml-auto bg-slate-100 h-1 rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full ${
                        student.kehadiran >= 95 
                          ? 'bg-emerald-500' 
                          : student.kehadiran >= 85 
                          ? 'bg-indigo-500' 
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(student.kehadiran, 100)}%` }}
                    />
                  </div>
                </td>

                {/* Status (Zero-pill clean typography rule) */}
                <td className="py-3 px-3">
                  <span className={getStatusColor(student.status)}>
                    {student.status}
                  </span>
                </td>

                {/* Actions per row */}
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onViewStudent(student)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                      title="Lihat Detail Profil Siswa"
                      aria-label={`Detail ${student.nama}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onPrintCard(student)}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors"
                      title="Cetak Kartu Tanda Pelajar"
                      aria-label={`Cetak Kartu ${student.nama}`}
                    >
                      <CreditCard className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditStudent(student)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                      title="Edit Data Siswa"
                      aria-label={`Edit ${student.nama}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteStudent(student)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Hapus Data Siswa"
                      aria-label={`Hapus ${student.nama}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
