import React from 'react';
import { 
  Users, 
  Award, 
  GraduationCap, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  PieChart, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Student } from '../types/student';
import { DAFTAR_KELAS } from '../data/initialStudents';
import { getAvatarColor, getInitials } from '../utils/studentHelpers';

interface StatsAnalyticsProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
}

export const StatsAnalytics: React.FC<StatsAnalyticsProps> = ({
  students,
  onViewStudent
}) => {
  const total = students.length;
  const activeStudents = students.filter((s) => s.status === 'Aktif');
  const cutiStudents = students.filter((s) => s.status === 'Cuti');
  const pindahStudents = students.filter((s) => s.status === 'Pindah');
  const lulusStudents = students.filter((s) => s.status === 'Lulus');

  const maleCount = students.filter((s) => s.jenisKelamin === 'L').length;
  const femaleCount = students.filter((s) => s.jenisKelamin === 'P').length;

  const avgGpa = total > 0 ? students.reduce((acc, s) => acc + s.nilaiRataRata, 0) / total : 0;
  const avgAttendance = total > 0 ? students.reduce((acc, s) => acc + s.kehadiran, 0) / total : 0;

  // Major breakdown
  const mipaCount = students.filter((s) => s.jurusan === 'MIPA').length;
  const ipsCount = students.filter((s) => s.jurusan === 'IPS').length;
  const bahasaCount = students.filter((s) => s.jurusan === 'Bahasa').length;

  // Class breakdown
  const classBreakdown = DAFTAR_KELAS.map((kelas) => {
    const count = students.filter((s) => s.kelas === kelas).length;
    return {
      kelas,
      count,
      pct: total > 0 ? (count / total) * 100 : 0
    };
  });

  // Top 5 Highest Performing Students
  const topStudents = [...students].sort((a, b) => b.nilaiRataRata - a.nilaiRataRata).slice(0, 5);

  // Attendance alerts (< 90%)
  const lowAttendanceStudents = students.filter((s) => s.kehadiran < 90 && s.status === 'Aktif');

  return (
    <div className="p-6 space-y-6 bg-slate-50 overflow-y-auto max-w-7xl mx-auto">
      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Siswa Terdaftar</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-900 mt-2">
            {total} <span className="text-xs font-normal text-slate-500">Orang</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-600 font-medium">{activeStudents.length} Aktif</span>
            <span aria-hidden="true">·</span>
            <span>{cutiStudents.length} Cuti</span>
            <span aria-hidden="true">·</span>
            <span>{lulusStudents.length} Lulus</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rata-rata Nilai Rapor</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-900 mt-2">
            {avgGpa.toFixed(1)}
            <span className="text-xs font-normal text-slate-400 ml-1">/ 100</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Kategori Mutu Akademik: <strong className="text-emerald-700">Sangat Baik (A)</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rata-rata Presensi</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-900 mt-2">
            {avgAttendance.toFixed(1)}%
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Target Kehadiran Minimum: 85.0%
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Komposisi Gender</span>
            <PieChart className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-mono tabular-nums text-2xl font-bold text-slate-900 mt-2">
            {maleCount} <span className="text-xs font-normal text-slate-400">L</span> : {femaleCount} <span className="text-xs font-normal text-slate-400">P</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {total > 0 ? ((maleCount / total) * 100).toFixed(0) : 0}% Laki-laki · {total > 0 ? ((femaleCount / total) * 100).toFixed(0) : 0}% Perempuan
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Distribution Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Distribusi Siswa Per Kelas
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Jumlah siswa per rombongan belajar</p>
            </div>
            <span className="text-xs font-medium text-slate-400">{DAFTAR_KELAS.length} Kelas</span>
          </div>

          <div className="space-y-2.5">
            {classBreakdown.map((item) => (
              <div key={item.kelas} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{item.kelas}</span>
                  <span className="font-mono tabular-nums text-slate-600 font-medium">
                    {item.count} Siswa ({item.pct.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(item.pct, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Major Distribution & Honors List */}
        <div className="space-y-6">
          {/* Major breakdown card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Distribusi Peminatan / Jurusan
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
                <div className="text-[11px] font-medium text-blue-700">MIPA</div>
                <div className="font-mono tabular-nums text-xl font-bold text-blue-950 mt-1">{mipaCount}</div>
                <div className="text-[10px] text-blue-600 mt-0.5">{total > 0 ? ((mipaCount / total) * 100).toFixed(0) : 0}%</div>
              </div>
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg">
                <div className="text-[11px] font-medium text-emerald-700">IPS</div>
                <div className="font-mono tabular-nums text-xl font-bold text-emerald-950 mt-1">{ipsCount}</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">{total > 0 ? ((ipsCount / total) * 100).toFixed(0) : 0}%</div>
              </div>
              <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-lg">
                <div className="text-[11px] font-medium text-purple-700">Bahasa</div>
                <div className="font-mono tabular-nums text-xl font-bold text-purple-950 mt-1">{bahasaCount}</div>
                <div className="text-[10px] text-purple-600 mt-0.5">{total > 0 ? ((bahasaCount / total) * 100).toFixed(0) : 0}%</div>
              </div>
            </div>
          </div>

          {/* Top 5 Honor Students */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Top 5 Siswa Berprestasi Akademik
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Semester Ini</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {topStudents.map((st, idx) => (
                <div 
                  key={st.id} 
                  onClick={() => onViewStudent(st)}
                  className="py-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer rounded px-2 -mx-2 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      idx === 0 ? 'bg-amber-100 text-amber-800' :
                      idx === 1 ? 'bg-slate-200 text-slate-700' :
                      idx === 2 ? 'bg-amber-800/10 text-amber-900' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 group-hover:text-indigo-600 truncate">
                        {st.nama}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {st.kelas} · NIS: <span className="font-mono tabular-nums">{st.nis}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono tabular-nums font-bold text-indigo-700 text-sm">
                      {st.nilaiRataRata.toFixed(1)}
                    </span>
                    <div className="text-[10px] text-slate-400">Nilai Rapor</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Alert Section */}
      {lowAttendanceStudents.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Pemberitahuan: Siswa dengan Presensi Di Bawah 90% (Perlu Monitoring Guru BK)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {lowAttendanceStudents.map((st) => (
              <div 
                key={st.id}
                onClick={() => onViewStudent(st)}
                className="bg-white p-3 rounded-lg border border-amber-200/80 hover:border-amber-400 cursor-pointer shadow-2xs transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900">{st.nama}</div>
                  <div className="text-[11px] text-slate-500">{st.kelas} · Wali: {st.namaWali}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono tabular-nums font-bold text-rose-600">
                    {st.kehadiran.toFixed(1)}%
                  </span>
                  <div className="text-[10px] text-slate-400">Kehadiran</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
