/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { FilterToolbar } from './components/FilterToolbar';
import { StudentTable } from './components/StudentTable';
import { StudentCards } from './components/StudentCards';
import { StudentDetailModal } from './components/StudentDetailModal';
import { StudentFormModal } from './components/StudentFormModal';
import { StudentIdCardModal } from './components/StudentIdCardModal';
import { StatsAnalytics } from './components/StatsAnalytics';
import { AttendanceTracker } from './components/AttendanceTracker';
import { ImportExportModal } from './components/ImportExportModal';
import { BatchActionBar } from './components/BatchActionBar';
import { SettingsBackup } from './components/SettingsBackup';

import { Student, FilterState, ViewMode, StatusSiswa } from './types/student';
import { 
  getStudentsFromStorage, 
  saveStudentsToStorage, 
  resetStudentsToDefault,
  filterAndSortStudents,
  exportToCSV 
} from './utils/studentHelpers';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  // --- Core State ---
  const [students, setStudents] = useState<Student[]>(() => getStudentsFromStorage());
  const [activeTab, setActiveTab] = useState<ActiveTab>('directory');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    kelas: 'ALL',
    jurusan: 'ALL',
    status: 'ALL',
    jenisKelamin: 'ALL',
    sortBy: 'nama',
    sortDirection: 'asc'
  });

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [studentDetail, setStudentDetail] = useState<Student | null>(null);
  const [studentForIdCard, setStudentForIdCard] = useState<Student | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);

  // Sync to localStorage whenever students change
  useEffect(() => {
    saveStudentsToStorage(students);
  }, [students]);

  // Filtered & Sorted Student List
  const filteredStudents = useMemo(() => {
    return filterAndSortStudents(students, filters);
  }, [students, filters]);

  // Counts
  const activeCount = useMemo(() => {
    return students.filter((s) => s.status === 'Aktif').length;
  }, [students]);

  // --- Selection Handlers ---
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // --- CRUD Handlers ---
  const handleSaveStudent = (savedStudent: Student) => {
    setStudents((prev) => {
      const existsIndex = prev.findIndex((s) => s.id === savedStudent.id);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = savedStudent;
        return next;
      } else {
        return [savedStudent, ...prev];
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!studentToDelete) return;
    setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
    setSelectedIds((prev) => prev.filter((id) => id !== studentToDelete.id));
    setStudentToDelete(null);
  };

  const handleBatchDeleteConfirm = () => {
    setStudents((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
    setSelectedIds([]);
    setShowBatchDeleteConfirm(false);
  };

  const handleBatchStatusChange = (newStatus: StatusSiswa) => {
    setStudents((prev) =>
      prev.map((s) => (selectedIds.includes(s.id) ? { ...s, status: newStatus } : s))
    );
  };

  const handleBatchExport = () => {
    const selectedStudents = students.filter((s) => selectedIds.includes(s.id));
    exportToCSV(selectedStudents, `siswa-terpilih-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleBatchPrintCards = () => {
    if (selectedIds.length > 0) {
      const first = students.find((s) => s.id === selectedIds[0]);
      if (first) setStudentForIdCard(first);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      kelas: 'ALL',
      jurusan: 'ALL',
      status: 'ALL',
      jenisKelamin: 'ALL',
      sortBy: 'nama',
      sortDirection: 'asc'
    });
  };

  const handleResetToDemo = () => {
    const initial = resetStudentsToDefault();
    setStudents(initial);
    setSelectedIds([]);
  };

  const handleRestoreBackup = (restored: Student[]) => {
    setStudents(restored);
    setSelectedIds([]);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block shrink-0">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedIds([]);
          }}
          totalStudents={students.length}
          activeCount={activeCount}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 h-full">
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setSelectedIds([]);
                setMobileMenuOpen(false);
              }}
              totalStudents={students.length}
              activeCount={activeCount}
            />
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onOpenAddModal={() => {
            setStudentToEdit(null);
            setIsAddEditOpen(true);
          }}
          onOpenImportExport={() => setIsImportExportOpen(true)}
          totalFiltered={filteredStudents.length}
          totalAll={students.length}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {activeTab === 'directory' && (
            <div className="flex flex-col flex-1 min-h-0">
              <FilterToolbar
                filters={filters}
                onFilterChange={setFilters}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onResetFilters={handleResetFilters}
              />

              <div className="flex-1 overflow-y-auto">
                {viewMode === 'table' ? (
                  <StudentTable
                    students={filteredStudents}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                    onViewStudent={(st) => setStudentDetail(st)}
                    onEditStudent={(st) => {
                      setStudentToEdit(st);
                      setIsAddEditOpen(true);
                    }}
                    onDeleteStudent={(st) => setStudentToDelete(st)}
                    onPrintCard={(st) => setStudentForIdCard(st)}
                    onResetFilters={handleResetFilters}
                  />
                ) : (
                  <StudentCards
                    students={filteredStudents}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onViewStudent={(st) => setStudentDetail(st)}
                    onEditStudent={(st) => {
                      setStudentToEdit(st);
                      setIsAddEditOpen(true);
                    }}
                    onDeleteStudent={(st) => setStudentToDelete(st)}
                    onPrintCard={(st) => setStudentForIdCard(st)}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <StatsAnalytics
              students={students}
              onViewStudent={(st) => setStudentDetail(st)}
            />
          )}

          {activeTab === 'idcard' && (
            <div className="p-6 overflow-y-auto flex-1">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Pusat Cetak Kartu Tanda Pelajar (KTP Siswa Digital)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Pilih siswa untuk menghasilkan kartu identitas resmi dengan barcode dan stempel verifikasi.
                  </p>
                </div>

                <StudentCards
                  students={filteredStudents}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onViewStudent={(st) => setStudentDetail(st)}
                  onEditStudent={(st) => {
                    setStudentToEdit(st);
                    setIsAddEditOpen(true);
                  }}
                  onDeleteStudent={(st) => setStudentToDelete(st)}
                  onPrintCard={(st) => setStudentForIdCard(st)}
                />
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <AttendanceTracker
              students={students}
              onUpdateStudents={(updated) => setStudents(updated)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsBackup
              students={students}
              onResetToDemo={handleResetToDemo}
              onRestoreBackup={handleRestoreBackup}
            />
          )}
        </main>

        {/* Floating Batch Action Bar */}
        <BatchActionBar
          selectedCount={selectedIds.length}
          onClearSelection={handleClearSelection}
          onBatchStatusChange={handleBatchStatusChange}
          onBatchDelete={() => setShowBatchDeleteConfirm(true)}
          onBatchExport={handleBatchExport}
          onBatchPrintCards={handleBatchPrintCards}
        />
      </div>

      {/* --- MODALS --- */}

      {/* Student Detail Modal */}
      {studentDetail && (
        <StudentDetailModal
          student={studentDetail}
          onClose={() => setStudentDetail(null)}
          onEdit={(st) => {
            setStudentToEdit(st);
            setIsAddEditOpen(true);
          }}
          onPrintCard={(st) => setStudentForIdCard(st)}
        />
      )}

      {/* Add / Edit Form Modal */}
      <StudentFormModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      {/* Student ID Card Modal */}
      {studentForIdCard && (
        <StudentIdCardModal
          student={studentForIdCard}
          students={students}
          onClose={() => setStudentForIdCard(null)}
          onSelectStudent={(st) => setStudentForIdCard(st)}
        />
      )}

      {/* CSV Import/Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        students={students}
        onImportStudents={(imported) => {
          setStudents((prev) => [...imported, ...prev]);
        }}
      />

      {/* Delete Single Student Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Konfirmasi Hapus Siswa</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Apakah Anda yakin ingin menghapus data siswa <strong className="font-semibold text-slate-900">{studentToDelete.nama}</strong> (NIS: {studentToDelete.nis}, Kelas: {studentToDelete.kelas}) dari Buku Induk?
            </p>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
              >
                Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Delete Confirmation Modal */}
      {showBatchDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hapus {selectedIds.length} Siswa Terpilih</h3>
                <p className="text-xs text-slate-500">Tindakan massal tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Apakah Anda yakin ingin menghapus sekaligus <strong className="font-semibold text-rose-600">{selectedIds.length} data siswa</strong> yang sedang dipilih dari database sekolah?
            </p>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowBatchDeleteConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleBatchDeleteConfirm}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
              >
                Hapus {selectedIds.length} Siswa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
