export type JenisKelamin = 'L' | 'P';
export type StatusSiswa = 'Aktif' | 'Cuti' | 'Pindah' | 'Lulus';
export type TingkatKelas = '10' | '11' | '12';
export type Jurusan = 'MIPA' | 'IPS' | 'Bahasa';
export type Agama = 'Islam' | 'Kristen Protestan' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  jenisKelamin: JenisKelamin;
  tingkat: TingkatKelas;
  kelas: string; // e.g. "X MIPA 1", "XI IPS 2", "XII MIPA 1"
  jurusan: Jurusan;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  agama: Agama;
  alamat: string;
  kota: string;
  namaWali: string;
  hubunganWali: 'Ayah' | 'Ibu' | 'Wali';
  teleponWali: string;
  emailWali?: string;
  status: StatusSiswa;
  nilaiRataRata: number; // e.g. 88.5
  kehadiran: number; // percentage 0-100
  catatanPrestasi?: string;
  catatanDisiplin?: string;
  avatarSeed?: string;
  tanggalMasuk: string;
}

export type ViewMode = 'table' | 'cards';

export interface FilterState {
  search: string;
  kelas: string;
  jurusan: string;
  status: string;
  jenisKelamin: string;
  sortBy: 'nama' | 'nis' | 'kelas' | 'nilaiRataRata' | 'kehadiran';
  sortDirection: 'asc' | 'desc';
}

export interface AttendanceEntry {
  studentId: string;
  status: 'H' | 'S' | 'I' | 'A'; // Hadir, Sakit, Izin, Alpa
  notes?: string;
}
