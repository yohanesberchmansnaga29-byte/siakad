import React from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  CreditCard, 
  Phone, 
  MapPin, 
  Award,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Student } from '../types/student';
import { getAvatarColor, getInitials, formatWhatsAppUrl } from '../utils/studentHelpers';

interface StudentCardsProps {
  students: Student[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onPrintCard: (student: Student) => void;
}

export const StudentCards: React.FC<StudentCardsProps> = ({
  students,
  selectedIds,
  onToggleSelect,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onPrintCard
}) => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-slate-50">
      {students.map((student) => {
        const isSelected = selectedIds.includes(student.id);
        const avatarColor = getAvatarColor(student.nama);
        const initials = getInitials(student.nama);

        return (
          <div
            key={student.id}
            className={`bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between ${
              isSelected 
                ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/30' 
                : 'border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm'
            }`}
          >
            {/* Card Header & Identity */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => onViewStudent(student)}
                    className={`w-11 h-11 rounded-full border flex items-center justify-center font-bold text-sm shrink-0 cursor-pointer shadow-xs ${avatarColor.bg}`}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <h3 
                      onClick={() => onViewStudent(student)}
                      className="text-xs font-bold text-slate-900 truncate hover:text-indigo-600 cursor-pointer"
                      title={student.nama}
                    >
                      {student.nama}
                    </h3>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono tabular-nums">{student.nis}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-700">{student.kelas}</span>
                    </div>
                  </div>
                </div>

                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(student.id)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-1"
                  aria-label={`Pilih ${student.nama}`}
                />
              </div>

              {/* Student Academic & Attendance metrics */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Nilai Rapor</div>
                  <div className="font-mono tabular-nums font-bold text-slate-900 mt-0.5">
                    {student.nilaiRataRata.toFixed(1)}
                    <span className="text-[10px] font-normal text-slate-400 ml-1">/ 100</span>
                  </div>
                </div>
                <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Presensi</div>
                  <div className={`font-mono tabular-nums font-bold mt-0.5 ${
                    student.kehadiran >= 95 ? 'text-emerald-600' : 'text-slate-800'
                  }`}>
                    {student.kehadiran.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Status and Guardian Info */}
              <div className="mt-3 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status Siswa:</span>
                  <span className={`font-medium ${
                    student.status === 'Aktif' ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {student.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Wali:</span>
                  <span className="text-slate-700 truncate max-w-[130px]" title={student.namaWali}>
                    {student.namaWali}
                  </span>
                </div>
              </div>

              {/* Achievement note if any */}
              {student.catatanPrestasi && (
                <div className="mt-2.5 p-1.5 bg-amber-50/70 rounded text-[11px] text-amber-900/90 flex items-start gap-1.5 border border-amber-200/50">
                  <Award className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{student.catatanPrestasi}</span>
                </div>
              )}
            </div>

            {/* Card Footer Actions */}
            <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between gap-1">
              <a
                href={formatWhatsAppUrl(student.teleponWali, student.nama)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                title="Hubungi Wali Murid via WhatsApp"
              >
                <Phone className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => onPrintCard(student)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                  title="Cetak Kartu Tanda Pelajar"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onViewStudent(student)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                  title="Lihat Detail Profil Lengkap"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onEditStudent(student)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-colors"
                  title="Edit Data Siswa"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteStudent(student)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors"
                  title="Hapus Data Siswa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
