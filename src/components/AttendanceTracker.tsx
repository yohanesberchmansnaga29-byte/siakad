import React, { useState } from 'react';
import { 
  CalendarCheck, 
  CheckCheck, 
  Save, 
  UserCheck, 
  UserMinus, 
  Clock, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Student } from '../types/student';
import { DAFTAR_KELAS } from '../data/initialStudents';
import { getAvatarColor, getInitials } from '../utils/studentHelpers';

interface AttendanceTrackerProps {
  students: Student[];
  onUpdateStudents: (updated: Student[]) => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  students,
  onUpdateStudents
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('X MIPA 1');
  const [sessionDate, setSessionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'H' | 'S' | 'I' | 'A'>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filter students in this class
  const classStudents = students.filter(
    (s) => s.kelas === selectedClass && s.status === 'Aktif'
  );

  const getStatus = (studentId: string): 'H' | 'S' | 'I' | 'A' => {
    return attendanceMap[studentId] || 'H'; // Default to Hadir
  };

  const handleSetStatus = (studentId: string, status: 'H' | 'S' | 'I' | 'A') => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status
    }));
    setSavedSuccess(false);
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'H' | 'S' | 'I' | 'A'> = {};
    classStudents.forEach((s) => {
      updated[s.id] = 'H';
    });
    setAttendanceMap(updated);
    setSavedSuccess(false);
  };

  const handleSaveAttendance = () => {
    // Recalculate each student's attendance slightly based on status
    const updatedStudents = students.map((s) => {
      if (s.kelas !== selectedClass || s.status !== 'Aktif') return s;
      const status = getStatus(s.id);
      let newKehadiran = s.kehadiran;
      if (status === 'A') {
        newKehadiran = Math.max(50, s.kehadiran - 0.8);
      } else if (status === 'H') {
        newKehadiran = Math.min(100, s.kehadiran + 0.1);
      }
      return {
        ...s,
        kehadiran: Number(newKehadiran.toFixed(1))
      };
    });

    onUpdateStudents(updatedStudents);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Summary counts for this session
  const totalHadir = classStudents.filter((s) => getStatus(s.id) === 'H').length;
  const totalSakit = classStudents.filter((s) => getStatus(s.id) === 'S').length;
  const totalIzin = classStudents.filter((s) => getStatus(s.id) === 'I').length;
  const totalAlpa = classStudents.filter((s) => getStatus(s.id) === 'A').length;

  return (
    <div className="p-6 space-y-6 bg-slate-50 overflow-y-auto max-w-5xl mx-auto">
      {/* Top Controller */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Presensi & Absensi Harian Siswa
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih kelas dan tanggal pertemuan untuk mencatat daftar kehadiran.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hadirkan Semua</span>
            </button>
            <button
              onClick={handleSaveAttendance}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Presensi</span>
            </button>
          </div>
        </div>

        {/* Filters & Class Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Rombongan Belajar (Kelas)</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {DAFTAR_KELAS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Tanggal Pertemuan</label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-end">
            <div className="p-2 bg-slate-100 rounded-lg w-full flex items-center justify-between text-xs">
              <span className="text-slate-600">Total Siswa Aktif:</span>
              <span className="font-mono tabular-nums font-bold text-slate-900">{classStudents.length} Siswa</span>
            </div>
          </div>
        </div>

        {/* Live Session Counter */}
        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="text-[10px] uppercase font-bold text-emerald-800">Hadir (H)</div>
            <div className="font-mono tabular-nums font-bold text-emerald-900 text-lg mt-0.5">{totalHadir}</div>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-[10px] uppercase font-bold text-blue-800">Sakit (S)</div>
            <div className="font-mono tabular-nums font-bold text-blue-900 text-lg mt-0.5">{totalSakit}</div>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
            <div className="text-[10px] uppercase font-bold text-amber-800">Izin (I)</div>
            <div className="font-mono tabular-nums font-bold text-amber-900 text-lg mt-0.5">{totalIzin}</div>
          </div>
          <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
            <div className="text-[10px] uppercase font-bold text-rose-800">Alpa (A)</div>
            <div className="font-mono tabular-nums font-bold text-rose-900 text-lg mt-0.5">{totalAlpa}</div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-2.5 bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>Data presensi pertemuan kelas {selectedClass} berhasil disimpan ke sistem!</span>
          </div>
        )}
      </div>

      {/* Class Roll Call Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4">Nama Siswa & NIS</th>
              <th className="py-3 px-4 text-right">Persentase Sebelumnya</th>
              <th className="py-3 px-6 text-center w-64">Status Presensi Hari Ini</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classStudents.map((student, idx) => {
              const currentStatus = getStatus(student.id);
              const avatarColor = getAvatarColor(student.nama);
              const initials = getInitials(student.nama);

              return (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-[10px] shrink-0 ${avatarColor.bg}`}>
                        {initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{student.nama}</div>
                        <div className="text-[11px] font-mono tabular-nums text-slate-400">
                          NIS: {student.nis} · NISN: {student.nisn}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-mono tabular-nums font-semibold text-slate-700">
                      {student.kehadiran.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    {/* Segmented 4-way Radio Button */}
                    <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                      <button
                        onClick={() => handleSetStatus(student.id, 'H')}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                          currentStatus === 'H'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Hadir"
                      >
                        Hadir
                      </button>
                      <button
                        onClick={() => handleSetStatus(student.id, 'S')}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                          currentStatus === 'S'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Sakit"
                      >
                        Sakit
                      </button>
                      <button
                        onClick={() => handleSetStatus(student.id, 'I')}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                          currentStatus === 'I'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Izin"
                      >
                        Izin
                      </button>
                      <button
                        onClick={() => handleSetStatus(student.id, 'A')}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                          currentStatus === 'A'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Alpa / Tanpa Keterangan"
                      >
                        Alpa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {classStudents.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500">
            Tidak ada siswa aktif terdaftar di kelas {selectedClass}.
          </div>
        )}
      </div>
    </div>
  );
};
