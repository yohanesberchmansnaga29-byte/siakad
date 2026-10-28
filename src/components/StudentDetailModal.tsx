import React, { useState } from 'react';
import { 
  X, 
  User, 
  BookOpen, 
  Users, 
  Award, 
  FileText, 
  Printer, 
  Edit3, 
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Student } from '../types/student';
import { formatTanggalIndonesia, getAvatarColor, getInitials, formatWhatsAppUrl } from '../utils/studentHelpers';
import { SCHOOL_INFO } from '../data/initialStudents';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onPrintCard: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onEdit,
  onPrintCard
}) => {
  const [activeTab, setActiveTab] = useState<'biodata' | 'wali' | 'akademik'>('biodata');

  if (!student) return null;

  const avatarColor = getAvatarColor(student.nama);
  const initials = getInitials(student.nama);

  const handlePrintBiodata = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-6 relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-16 h-16 rounded-2xl border-2 border-white/20 flex items-center justify-center font-bold text-xl shadow-lg shrink-0 ${avatarColor.bg}`}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-medium">
                  Kelas {student.kelas}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                  student.status === 'Aktif' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}>
                  Status: {student.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1 truncate">
                {student.nama}
              </h2>
              <div className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                <span>NIS: <strong className="font-mono tabular-nums text-white">{student.nis}</strong></span>
                <span aria-hidden="true">·</span>
                <span>NISN: <strong className="font-mono tabular-nums text-white">{student.nisn}</strong></span>
              </div>
            </div>
          </div>

          {/* Modal Tab Switcher */}
          <div className="flex items-center gap-2 mt-6 border-b border-slate-800 -mb-6">
            <button
              onClick={() => setActiveTab('biodata')}
              className={`pb-3 px-3 text-xs font-medium transition-colors border-b-2 ${
                activeTab === 'biodata'
                  ? 'border-indigo-400 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Biodata Pribadi
            </button>
            <button
              onClick={() => setActiveTab('wali')}
              className={`pb-3 px-3 text-xs font-medium transition-colors border-b-2 ${
                activeTab === 'wali'
                  ? 'border-indigo-400 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Data Orang Tua / Wali
            </button>
            <button
              onClick={() => setActiveTab('akademik')}
              className={`pb-3 px-3 text-xs font-medium transition-colors border-b-2 ${
                activeTab === 'akademik'
                  ? 'border-indigo-400 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Catatan Akademik & Prestasi
            </button>
          </div>
        </div>

        {/* Modal Body / Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1">
          {activeTab === 'biodata' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Jenis Kelamin</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Agama</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {student.agama}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Tempat, Tanggal Lahir</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {student.tempatLahir}, {formatTanggalIndonesia(student.tanggalLahir)}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium">Tanggal Masuk / Terdaftar</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {formatTanggalIndonesia(student.tanggalMasuk)}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Alamat Lengkap Tinggal
                </div>
                <div className="font-medium text-slate-800 mt-1">
                  {student.alamat}
                </div>
                <div className="text-slate-500 mt-0.5">
                  Kota / Wilayah: {student.kota}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[11px] text-slate-400 font-medium">Program Jurusan & Tingkat</div>
                <div className="font-medium text-slate-800 mt-0.5">
                  {student.jurusan} (Kelas Tingkat {student.tingkat}) - Ruang {student.kelas}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wali' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400">Nama Lengkap Wali</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{student.namaWali}</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded font-medium text-slate-700">
                    Hubungan: {student.hubunganWali}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      Nomor Telepon / WA
                    </div>
                    <div className="font-mono tabular-nums font-semibold text-slate-800 mt-0.5">
                      {student.teleponWali}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-indigo-600" />
                      Email Kontak
                    </div>
                    <div className="font-medium text-slate-800 mt-0.5 truncate">
                      {student.emailWali || 'Tidak tercatat'}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={formatWhatsAppUrl(student.teleponWali, student.nama)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-xs shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Kirim Pesan WhatsApp Langsung</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'akademik' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center">
                  <div className="text-[11px] font-medium text-indigo-700 uppercase tracking-wide">Rata-rata Nilai Rapor</div>
                  <div className="font-mono tabular-nums text-2xl font-extrabold text-indigo-950 mt-1">
                    {student.nilaiRataRata.toFixed(1)}
                  </div>
                  <div className="text-[11px] text-indigo-600 mt-1">Skala 0 - 100</div>
                </div>
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
                  <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wide">Persentase Presensi</div>
                  <div className="font-mono tabular-nums text-2xl font-extrabold text-emerald-950 mt-1">
                    {student.kehadiran.toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-emerald-600 mt-1">Semester Ganjil 2026/2027</div>
                </div>
              </div>

              {student.catatanPrestasi && (
                <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-[11px] font-semibold text-amber-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    Rekam Prestasi & Penghargaan
                  </div>
                  <p className="mt-1 text-slate-700">
                    {student.catatanPrestasi}
                  </p>
                </div>
              )}

              {student.catatanDisiplin ? (
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    Catatan Kedisiplinan & Bimbingan Konseling (BK)
                  </div>
                  <p className="mt-1 text-slate-600">
                    {student.catatanDisiplin}
                  </p>
                </div>
              ) : (
                <div className="p-3 text-slate-500 italic text-center bg-slate-50 rounded-lg">
                  Tidak ada catatan pelanggaran disiplin. Catatan perilaku: Baik.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintCard(student)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cetak Kartu Pelajar</span>
            </button>
            <button
              onClick={handlePrintBiodata}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak Biodata Lengkap</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Data Siswa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
