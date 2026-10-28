import { Student, FilterState } from '../types/student';
import { INITIAL_STUDENTS } from '../data/initialStudents';

const STORAGE_KEY = 'siakad_students_database_v1';

export function getStudentsFromStorage(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDENTS;
  } catch (e) {
    console.error('Failed to load from storage:', e);
    return INITIAL_STUDENTS;
  }
}

export function saveStudentsToStorage(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

export function resetStudentsToDefault(): Student[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
  } catch (e) {
    console.error('Failed to reset storage:', e);
  }
  return INITIAL_STUDENTS;
}

export function formatTanggalIndonesia(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatWhatsAppUrl(phoneNumber: string, studentName: string): string {
  let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '62' + cleanNumber.substring(1);
  }
  const message = encodeURIComponent(`Halo Bapak/Ibu Wali dari Ananda ${studentName}, kami dari pihak Tata Usaha & Kesiswaan SMA Negeri Excellentia ingin mengonfirmasikan...`);
  return `https://wa.me/${cleanNumber}?text=${message}`;
}

export function filterAndSortStudents(students: Student[], filters: FilterState): Student[] {
  return students
    .filter((student) => {
      // Search
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = student.nama.toLowerCase().includes(query);
        const matchesNIS = student.nis.toLowerCase().includes(query);
        const matchesNISN = student.nisn.toLowerCase().includes(query);
        const matchesWali = student.namaWali.toLowerCase().includes(query);
        const matchesKota = student.kota.toLowerCase().includes(query);
        if (!matchesName && !matchesNIS && !matchesNISN && !matchesWali && !matchesKota) {
          return false;
        }
      }

      // Kelas
      if (filters.kelas && filters.kelas !== 'ALL') {
        if (student.kelas !== filters.kelas) return false;
      }

      // Jurusan
      if (filters.jurusan && filters.jurusan !== 'ALL') {
        if (student.jurusan !== filters.jurusan) return false;
      }

      // Status
      if (filters.status && filters.status !== 'ALL') {
        if (student.status !== filters.status) return false;
      }

      // Jenis Kelamin
      if (filters.jenisKelamin && filters.jenisKelamin !== 'ALL') {
        if (student.jenisKelamin !== filters.jenisKelamin) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const dir = filters.sortDirection === 'asc' ? 1 : -1;
      switch (filters.sortBy) {
        case 'nama':
          return a.nama.localeCompare(b.nama) * dir;
        case 'nis':
          return a.nis.localeCompare(b.nis) * dir;
        case 'kelas':
          return a.kelas.localeCompare(b.kelas) * dir;
        case 'nilaiRataRata':
          return (a.nilaiRataRata - b.nilaiRataRata) * dir;
        case 'kehadiran':
          return (a.kehadiran - b.kehadiran) * dir;
        default:
          return 0;
      }
    });
}

export function exportToCSV(students: Student[], filename: string = 'daftar-siswa-sman-excellentia.csv'): void {
  const headers = [
    'NIS',
    'NISN',
    'Nama Lengkap',
    'L/P',
    'Tingkat',
    'Kelas',
    'Jurusan',
    'Tempat Lahir',
    'Tanggal Lahir',
    'Agama',
    'Status',
    'Nilai Rata-rata',
    'Kehadiran (%)',
    'Nama Wali',
    'Hubungan',
    'Telepon Wali',
    'Alamat',
    'Kota'
  ];

  const rows = students.map((s) => [
    `"${s.nis}"`,
    `"${s.nisn}"`,
    `"${s.nama.replace(/"/g, '""')}"`,
    `"${s.jenisKelamin}"`,
    `"${s.tingkat}"`,
    `"${s.kelas}"`,
    `"${s.jurusan}"`,
    `"${s.tempatLahir}"`,
    `"${s.tanggalLahir}"`,
    `"${s.agama}"`,
    `"${s.status}"`,
    s.nilaiRataRata.toString(),
    s.kehadiran.toString(),
    `"${s.namaWali.replace(/"/g, '""')}"`,
    `"${s.hubunganWali}"`,
    `"${s.teleponWali}"`,
    `"${s.alamat.replace(/"/g, '""')}"`,
    `"${s.kota}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCSV(csvText: string): Partial<Student>[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const results: Partial<Student>[] = [];
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Split by comma preserving quoted values
    const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^,]*))/g;
    const values: string[] = [];
    let match;
    while ((match = regex.exec(line))) {
      let val = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
      values.push(val?.trim() || '');
    }

    if (values.length >= 6) {
      const [nis, nisn, nama, jk, , kelas, jurusan, tempatLahir, tglLahir, agama, status, nilai, kehadiran, namaWali, hubunganWali, telp, alamat, kota] = values;
      
      results.push({
        id: 'std-' + Date.now() + '-' + i,
        nis: nis || '24' + Math.floor(1000 + Math.random() * 9000),
        nisn: nisn || '00' + Math.floor(10000000 + Math.random() * 90000000),
        nama: nama || 'Siswa Baru',
        jenisKelamin: jk === 'P' ? 'P' : 'L',
        tingkat: (kelas?.startsWith('12') || kelas?.startsWith('XII')) ? '12' : (kelas?.startsWith('11') || kelas?.startsWith('XI')) ? '11' : '10',
        kelas: kelas || 'X MIPA 1',
        jurusan: (jurusan as any) || 'MIPA',
        tempatLahir: tempatLahir || 'Jakarta',
        tanggalLahir: tglLahir || '2008-01-01',
        agama: (agama as any) || 'Islam',
        status: (status as any) || 'Aktif',
        nilaiRataRata: parseFloat(nilai) || 85.0,
        kehadiran: parseFloat(kehadiran) || 95.0,
        namaWali: namaWali || 'Wali Siswa',
        hubunganWali: (hubunganWali as any) || 'Ayah',
        teleponWali: telp || '081234567890',
        alamat: alamat || 'Jl. Pendidikan',
        kota: kota || 'Jakarta',
        tanggalMasuk: new Date().toISOString().split('T')[0]
      });
    }
  }

  return results;
}

export function getAvatarColor(name: string): { bg: string; text: string } {
  const colors = [
    { bg: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { bg: 'bg-blue-100 text-blue-700 border-blue-200' },
    { bg: 'bg-amber-100 text-amber-700 border-amber-200' },
    { bg: 'bg-rose-100 text-rose-700 border-rose-200' },
    { bg: 'bg-teal-100 text-teal-700 border-teal-200' },
    { bg: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
    { bg: 'bg-purple-100 text-purple-700 border-purple-200' }
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return { bg: colors[index].bg, text: '' };
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
