import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  UserPlus, 
  UserCheck, 
  HelpCircle,
  AlertCircle 
} from 'lucide-react';
import { Student, JenisKelamin, StatusSiswa, Jurusan, Agama } from '../types/student';
import { DAFTAR_KELAS, DAFTAR_JURUSAN } from '../data/initialStudents';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  studentToEdit?: Student | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit
}) => {
  const isEditing = Boolean(studentToEdit);

  const [formData, setFormData] = useState<Partial<Student>>({
    nis: '',
    nisn: '',
    nama: '',
    jenisKelamin: 'L',
    tingkat: '10',
    kelas: 'X MIPA 1',
    jurusan: 'MIPA',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2008-01-01',
    agama: 'Islam',
    alamat: '',
    kota: 'Jakarta Selatan',
    namaWali: '',
    hubunganWali: 'Ayah',
    teleponWali: '',
    emailWali: '',
    status: 'Aktif',
    nilaiRataRata: 85.0,
    kehadiran: 98.0,
    catatanPrestasi: '',
    catatanDisiplin: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (studentToEdit) {
      setFormData(studentToEdit);
    } else {
      // Generate suggested NIS & NISN
      const randomNIS = '24' + Math.floor(1000 + Math.random() * 9000);
      const randomNISN = '008' + Math.floor(1000000 + Math.random() * 9000000);
      setFormData({
        nis: randomNIS,
        nisn: randomNISN,
        nama: '',
        jenisKelamin: 'L',
        tingkat: '10',
        kelas: 'X MIPA 1',
        jurusan: 'MIPA',
        tempatLahir: 'Jakarta',
        tanggalLahir: '2008-05-15',
        agama: 'Islam',
        alamat: '',
        kota: 'Jakarta Selatan',
        namaWali: '',
        hubunganWali: 'Ayah',
        teleponWali: '0812',
        emailWali: '',
        status: 'Aktif',
        nilaiRataRata: 85.0,
        kehadiran: 98.0,
        catatanPrestasi: '',
        catatanDisiplin: ''
      });
    }
    setErrors({});
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto-update tingkat and jurusan when class changes
  const handleClassChange = (selectedClass: string) => {
    let tingkat: '10' | '11' | '12' = '10';
    if (selectedClass.startsWith('XII') || selectedClass.startsWith('12')) tingkat = '12';
    else if (selectedClass.startsWith('XI') || selectedClass.startsWith('11')) tingkat = '11';

    let jurusan: Jurusan = 'MIPA';
    if (selectedClass.includes('IPS')) jurusan = 'IPS';
    else if (selectedClass.includes('Bahasa')) jurusan = 'Bahasa';

    setFormData((prev) => ({
      ...prev,
      kelas: selectedClass,
      tingkat,
      jurusan
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nama?.trim()) newErrors.nama = 'Nama lengkap wajib diisi';
    if (!formData.nis?.trim()) newErrors.nis = 'NIS wajib diisi';
    if (!formData.nisn?.trim()) newErrors.nisn = 'NISN 10-digit wajib diisi';
    else if (formData.nisn.length < 10) newErrors.nisn = 'NISN harus 10 digit angka';
    if (!formData.namaWali?.trim()) newErrors.namaWali = 'Nama orang tua/wali wajib diisi';
    if (!formData.teleponWali?.trim()) newErrors.teleponWali = 'Nomor telepon/WA wajib diisi';
    if (!formData.alamat?.trim()) newErrors.alamat = 'Alamat tempat tinggal wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const studentRecord: Student = {
      id: studentToEdit?.id || 'std-' + Date.now(),
      nis: formData.nis!.trim(),
      nisn: formData.nisn!.trim(),
      nama: formData.nama!.trim(),
      jenisKelamin: formData.jenisKelamin as JenisKelamin,
      tingkat: formData.tingkat as any,
      kelas: formData.kelas!,
      jurusan: formData.jurusan as Jurusan,
      tempatLahir: formData.tempatLahir!.trim(),
      tanggalLahir: formData.tanggalLahir!,
      agama: formData.agama as Agama,
      alamat: formData.alamat!.trim(),
      kota: formData.kota!.trim(),
      namaWali: formData.namaWali!.trim(),
      hubunganWali: formData.hubunganWali as any,
      teleponWali: formData.teleponWali!.trim(),
      emailWali: formData.emailWali?.trim() || '',
      status: (formData.status as StatusSiswa) || 'Aktif',
      nilaiRataRata: Number(formData.nilaiRataRata) || 85.0,
      kehadiran: Number(formData.kehadiran) || 95.0,
      catatanPrestasi: formData.catatanPrestasi?.trim() || '',
      catatanDisiplin: formData.catatanDisiplin?.trim() || '',
      tanggalMasuk: studentToEdit?.tanggalMasuk || new Date().toISOString().split('T')[0]
    };

    onSave(studentRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              {isEditing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-bold">
                {isEditing ? 'Perbarui Data Siswa' : 'Tambah Siswa Baru ke Buku Induk'}
              </h2>
              <p className="text-xs text-slate-400">
                Lengkapi formulir registrasi data kesiswaan secara akurat.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {/* Section 1: Data Identitas Pokok */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1.5 border-b border-slate-200">
              1. Identitas Pokok Siswa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Muhammad Bintang Pratama"
                  className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.nama ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
                {errors.nama && <p className="text-rose-500 text-[11px] mt-1">{errors.nama}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  NIS (Nomor Induk Siswa) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nis}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  placeholder="241001"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                {errors.nis && <p className="text-rose-500 text-[11px] mt-1">{errors.nis}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  NISN (10 Digit Nasional) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.nisn}
                  onChange={(e) => setFormData({ ...formData, nisn: e.target.value.replace(/[^0-9]/g, '') })}
                  placeholder="0081234567"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                {errors.nisn && <p className="text-rose-500 text-[11px] mt-1">{errors.nisn}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Jenis Kelamin</label>
                <select
                  value={formData.jenisKelamin}
                  onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as JenisKelamin })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Agama</label>
                <select
                  value={formData.agama}
                  onChange={(e) => setFormData({ ...formData, agama: e.target.value as Agama })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen Protestan">Kristen Protestan</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  value={formData.tempatLahir}
                  onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                  placeholder="Jakarta"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Penempatan Kelas & Status */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1.5 border-b border-slate-200">
              2. Penempatan Kelas & Status Akademik
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Kelas Ruang</label>
                <select
                  value={formData.kelas}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {DAFTAR_KELAS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Jurusan</label>
                <select
                  value={formData.jurusan}
                  onChange={(e) => setFormData({ ...formData, jurusan: e.target.value as Jurusan })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="MIPA">MIPA</option>
                  <option value="IPS">IPS</option>
                  <option value="Bahasa">Bahasa</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Status Keaktifan</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusSiswa })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Pindah">Pindah</option>
                  <option value="Lulus">Lulus</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Data Orang Tua / Wali & Domisili */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1.5 border-b border-slate-200">
              3. Data Orang Tua / Wali & Kontak
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Nama Lengkap Orang Tua / Wali <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaWali}
                  onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                  placeholder="Contoh: Ir. Bambang Hermanto"
                  className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.namaWali ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
                {errors.namaWali && <p className="text-rose-500 text-[11px] mt-1">{errors.namaWali}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Hubungan Keluarga</label>
                <select
                  value={formData.hubunganWali}
                  onChange={(e) => setFormData({ ...formData, hubunganWali: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Ayah">Ayah</option>
                  <option value="Ibu">Ibu</option>
                  <option value="Wali">Wali Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  No. Telepon / WhatsApp Wali <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.teleponWali}
                  onChange={(e) => setFormData({ ...formData, teleponWali: e.target.value })}
                  placeholder="081234567890"
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.teleponWali ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
                {errors.teleponWali && <p className="text-rose-500 text-[11px] mt-1">{errors.teleponWali}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email Wali (Opsional)</label>
                <input
                  type="email"
                  value={formData.emailWali}
                  onChange={(e) => setFormData({ ...formData, emailWali: e.target.value })}
                  placeholder="bambang@gmail.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">
                  Alamat Tempat Tinggal <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Jl. Melati No. 12, Kel. Menteng"
                  className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.alamat ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
                {errors.alamat && <p className="text-rose-500 text-[11px] mt-1">{errors.alamat}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  value={formData.kota}
                  onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                  placeholder="Jakarta Selatan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Nilai & Prestasi */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1.5 border-b border-slate-200">
              4. Data Akademik & Catatan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nilai Rata-rata Rapor (0-100)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.nilaiRataRata}
                  onChange={(e) => setFormData({ ...formData, nilaiRataRata: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Tingkat Kehadiran Presensi (%)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  value={formData.kehadiran}
                  onChange={(e) => setFormData({ ...formData, kehadiran: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Catatan Prestasi (Jika Ada)</label>
                <input
                  type="text"
                  value={formData.catatanPrestasi}
                  onChange={(e) => setFormData({ ...formData, catatanPrestasi: e.target.value })}
                  placeholder="Contoh: Juara 1 Lomba OSN Fisika Tingkat Kota"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Catatan Disiplin / Konseling</label>
                <input
                  type="text"
                  value={formData.catatanDisiplin}
                  onChange={(e) => setFormData({ ...formData, catatanDisiplin: e.target.value })}
                  placeholder="Catatan pendampingan jika ada"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan' : 'Daftarkan Siswa'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
