import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  RefreshCw, 
  CreditCard, 
  Sparkles, 
  QrCode, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  School
} from 'lucide-react';
import { Student } from '../types/student';
import { SCHOOL_INFO } from '../data/initialStudents';
import { formatTanggalIndonesia, getInitials, getAvatarColor } from '../utils/studentHelpers';

interface StudentIdCardModalProps {
  student: Student | null;
  students: Student[];
  onClose: () => void;
  onSelectStudent: (student: Student) => void;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  student,
  students,
  onClose,
  onSelectStudent
}) => {
  const [side, setSide] = useState<'front' | 'back'>('front');

  if (!student) return null;

  const schoolLogo = '/src/assets/images/school_badge_logo_1793177980050.jpg';
  const cardBgPattern = '/src/assets/images/student_card_bg_1793177979219.jpg';
  const initials = getInitials(student.nama);
  const avatarColor = getAvatarColor(student.nama);

  const currentIndex = students.findIndex((s) => s.id === student.id);
  const prevStudent = currentIndex > 0 ? students[currentIndex - 1] : null;
  const nextStudent = currentIndex < students.length - 1 ? students[currentIndex + 1] : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Pratinjau Kartu Tanda Pelajar (KTP Siswa)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Selector & Flipping Controls */}
        <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between gap-3 text-xs no-print">
          {/* Quick Prev / Next */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => prevStudent && onSelectStudent(prevStudent)}
              disabled={!prevStudent}
              className="p-1.5 rounded bg-white border border-slate-300 text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              title="Siswa Sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <select
              value={student.id}
              onChange={(e) => {
                const found = students.find((s) => s.id === e.target.value);
                if (found) onSelectStudent(found);
              }}
              className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-medium text-slate-800 max-w-[200px] truncate"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nis} - {s.nama} ({s.kelas})
                </option>
              ))}
            </select>
            <button
              onClick={() => nextStudent && onSelectStudent(nextStudent)}
              disabled={!nextStudent}
              className="p-1.5 rounded bg-white border border-slate-300 text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              title="Siswa Berikutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Flip Side Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSide(side === 'front' ? 'back' : 'front')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded font-medium text-slate-700 transition-colors shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
              <span>Balik ke Tampak {side === 'front' ? 'Belakang' : 'Depan'}</span>
            </button>
          </div>
        </div>

        {/* Card Display Area */}
        <div className="p-8 flex items-center justify-center bg-slate-200/80 min-h-[340px]">
          {/* Printable Card Container (Physical CR-80 standard card ratio 85.6mm x 53.98mm ~ 1.58 ratio) */}
          <div 
            id="student-id-card-print"
            className="w-[430px] h-[270px] rounded-xl overflow-hidden shadow-xl border border-slate-300 bg-white relative flex flex-col justify-between text-slate-900 select-none print:shadow-none print:border-slate-400"
            style={{
              backgroundImage: `url(${cardBgPattern})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {side === 'front' ? (
              /* FRONT SIDE */
              <div className="w-full h-full flex flex-col justify-between p-3.5 bg-white/92 backdrop-blur-[1px]">
                {/* School Header */}
                <div className="flex items-center gap-2.5 pb-2 border-b-2 border-indigo-900">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-slate-300 shrink-0 shadow-2xs">
                    <img 
                      src={schoolLogo} 
                      alt="Crest" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-center">
                    <div className="text-[8px] font-bold uppercase tracking-wider text-slate-600">
                      Pemerintah Provinsi DKI Jakarta · Dinas Pendidikan
                    </div>
                    <div className="text-[12px] font-black tracking-tight text-indigo-950 uppercase">
                      {SCHOOL_INFO.namaSekolah}
                    </div>
                    <div className="text-[7.5px] text-slate-500 truncate">
                      {SCHOOL_INFO.alamat} · Telp: {SCHOOL_INFO.telepon}
                    </div>
                  </div>
                  <div className="w-8 shrink-0 text-right">
                    <div className="text-[7px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1 py-0.5 inline-block">
                      AKREDITASI A
                    </div>
                  </div>
                </div>

                {/* Subtitle */}
                <div className="text-center my-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-900 bg-indigo-50/80 px-3 py-0.5 rounded border border-indigo-200">
                    KARTU TANDA PELAJAR
                  </span>
                </div>

                {/* Body: Photo & Student Data */}
                <div className="flex items-start gap-3 my-auto">
                  {/* Student Photo with formal Indonesian student badge */}
                  <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-indigo-900/60 shadow-sm shrink-0 flex flex-col bg-slate-100 relative">
                    <div className="h-full w-full bg-gradient-to-b from-blue-700 to-indigo-900 flex flex-col items-center justify-center text-white">
                      <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center font-bold text-sm bg-white/10 shadow-inner">
                        {initials}
                      </div>
                      <span className="text-[8px] font-bold mt-1 tracking-wider uppercase text-blue-100">
                        SMA
                      </span>
                    </div>

                    {/* Hologram metallic stamp simulation */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-300 via-rose-300 to-cyan-300 border border-amber-400 opacity-90 shadow-2xs flex items-center justify-center text-[7px] font-bold text-slate-800">
                      ✓
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="flex-1 min-w-0 space-y-1 text-[9.5px]">
                    <div className="grid grid-cols-[68px_1fr] gap-1 items-baseline">
                      <span className="text-slate-500 font-medium">Nama Lengkap</span>
                      <span className="font-bold text-slate-900 uppercase truncate">
                        : {student.nama}
                      </span>
                    </div>

                    <div className="grid grid-cols-[68px_1fr] gap-1 items-baseline">
                      <span className="text-slate-500 font-medium">NIS / NISN</span>
                      <span className="font-mono tabular-nums font-bold text-indigo-950">
                        : {student.nis} / {student.nisn}
                      </span>
                    </div>

                    <div className="grid grid-cols-[68px_1fr] gap-1 items-baseline">
                      <span className="text-slate-500 font-medium">Kelas / Jurusan</span>
                      <span className="font-semibold text-slate-800">
                        : {student.kelas} ({student.jurusan})
                      </span>
                    </div>

                    <div className="grid grid-cols-[68px_1fr] gap-1 items-baseline">
                      <span className="text-slate-500 font-medium">TTL</span>
                      <span className="text-slate-800 truncate">
                        : {student.tempatLahir}, {formatTanggalIndonesia(student.tanggalLahir)}
                      </span>
                    </div>

                    <div className="grid grid-cols-[68px_1fr] gap-1 items-baseline">
                      <span className="text-slate-500 font-medium">Alamat</span>
                      <span className="text-slate-700 truncate">
                        : {student.kota}
                      </span>
                    </div>

                    <div className="grid grid-cols-[68px_1fr] gap-1 items-baseline">
                      <span className="text-slate-500 font-medium">Berlaku s/d</span>
                      <span className="font-semibold text-emerald-800">
                        : Selama Menjadi Siswa
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer: Barcode simulation & Principal Signature Stamp */}
                <div className="flex items-end justify-between pt-1 border-t border-slate-200 mt-1">
                  {/* Simulated Code 128 Barcode */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-0.5 h-6">
                      {[4, 2, 5, 2, 6, 3, 2, 5, 2, 4, 6, 2, 3, 5, 4, 2, 6, 3, 2].map((w, idx) => (
                        <div 
                          key={idx} 
                          className="h-full bg-slate-900" 
                          style={{ width: `${w * 0.9}px` }} 
                        />
                      ))}
                    </div>
                    <span className="font-mono tabular-nums text-[8px] text-slate-500 tracking-wider">
                      *{student.nis}*
                    </span>
                  </div>

                  {/* Principal Stamp */}
                  <div className="text-right text-[8px] leading-tight">
                    <div className="text-slate-500">Jakarta, 15 Juli 2024</div>
                    <div className="font-medium text-slate-600">Kepala Sekolah,</div>
                    <div className="font-serif italic font-bold text-indigo-900 my-0.5 text-[9px] relative">
                      <span className="relative z-10">{SCHOOL_INFO.kepalaSekolah}</span>
                      {/* Stamp badge */}
                      <span className="absolute -top-1 -left-3 text-[14px] text-rose-500/30 font-bold -rotate-12 select-none pointer-events-none">
                        TERVERIFIKASI
                      </span>
                    </div>
                    <div className="font-mono tabular-nums text-[7px] text-slate-400">
                      NIP. {SCHOOL_INFO.nipKepalaSekolah}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* BACK SIDE */
              <div className="w-full h-full flex flex-col justify-between p-4 bg-slate-50/95 backdrop-blur-[1px] text-[9px]">
                {/* Magnetic Stripe simulation */}
                <div className="-mx-4 -mt-4 bg-slate-900 h-8 flex items-center justify-between px-4 text-white text-[8px] font-mono">
                  <span className="tracking-widest">SMA NEGERI EXCELLENTIA</span>
                  <span className="text-amber-300">SIAKAD INTEGRATED</span>
                </div>

                <div className="my-auto space-y-2 text-slate-700">
                  <h4 className="font-bold text-slate-900 uppercase text-[9.5px] border-b border-slate-200 pb-1">
                    Ketentuan & Tata Tertib Kartu Pelajar:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-[8.5px] leading-relaxed text-slate-600">
                    <li>Kartu ini adalah bukti identitas sah siswa resmi SMA Negeri Excellentia.</li>
                    <li>Wajib dibawa selama jam pelajaran dan kegiatan sekolah berlangsung.</li>
                    <li>Berlaku untuk peminjaman buku perpustakaan dan presensi digital.</li>
                    <li>Jika kartu hilang atau rusak, segera melapor ke Bagian Tata Usaha.</li>
                  </ol>
                </div>

                {/* Emergency Contact & Return Address */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-500">
                  <div>
                    <span className="font-semibold text-slate-700">Bila menemukan kartu ini harap hubungi:</span>
                    <div>Tata Usaha SMAN Excellentia · Telp: {SCHOOL_INFO.telepon}</div>
                  </div>
                  <div className="w-10 h-10 border border-slate-300 rounded p-1 bg-white flex items-center justify-center">
                    <QrCode className="w-full h-full text-slate-800" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-3 no-print">
          <p className="text-[11px] text-slate-500">
            Format cetak standar kartu identitas ISO/IEC 7810 ID-1.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kartu Fisik</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
