/**
 * Nusantara Theme Builder — Dashboard View (Phase 2 Enhanced)
 * Pusat pengelolaan proyek desktop:
 * - Aksi: Proyek Baru (Wizard 5-Step), Buka Proyek, Impor Proyek (.ntbproject), Buka Folder Proyek
 * - Filter platform (Blogger / WordPress), Pencarian proyek, Pengurutan nama/tanggal
 * - Informasi waktu pembuatan dan perubahan terakhir
 * - Duplikasi & hapus dengan konfirmasi
 * - Metrik kapasitas penyimpanan lokal nyata & starter templates
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { STARTER_TEMPLATES, StarterTemplateId } from '../../domain/project/project-factory';
import {
  FolderPlus,
  FolderOpen,
  Upload,
  FolderTree,
  Search,
  Filter,
  ArrowUpDown,
  Layers,
  HardDrive,
  Clock,
  Sparkles,
  ArrowRight,
  Trash2,
  Copy,
  Edit3,
  Calendar,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { ProjectCreationWizardModal } from '../../components/modals/ProjectCreationWizardModal';
import { ImportProjectModal } from '../../components/modals/ImportProjectModal';
import { ConfirmDeleteModal } from '../../components/modals/ConfirmDeleteModal';
import { DuplicateProjectModal } from '../../components/modals/DuplicateProjectModal';
import { RenameProjectModal } from '../../components/modals/RenameProjectModal';
import { TargetPlatform } from '../../types/project';

export const DashboardView: React.FC = () => {
  const {
    recentProjects,
    storageInfo,
    openProject,
    deleteProject,
    createProject,
    currentProject,
    setActiveView
  } = useProjectStore();

  const [isWizardModalOpen, setIsWizardModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [projectToDuplicate, setProjectToDuplicate] = useState<{ id: string; name: string } | null>(null);
  const [projectToRename, setProjectToRename] = useState<{ id: string; name: string } | null>(null);

  // Search, Filter, Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | TargetPlatform>('all');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'name'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredProjects = recentProjects
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = platformFilter === 'all' || p.targetPlatform === platformFilter;
      return matchesSearch && matchesPlatform;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') {
        cmp = a.name.localeCompare(b.name, 'id');
      } else if (sortBy === 'createdAt') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  const handleQuickTemplate = async (templateId: StarterTemplateId, name: string, platform: TargetPlatform) => {
    await createProject(`${name} Baru`, platform, templateId);
  };

  const handleOpenFolder = (projId: string) => {
    openProject(projId);
    setActiveView('file-explorer');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-neutral-800 p-6 md:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nusantara Theme Builder — Phase 2 (Project & Asset Management)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Pusat Pengelolaan Tema & Workspace Desktop
          </h1>
          <p className="text-neutral-300 text-xs md:text-sm leading-relaxed">
            Software desktop open-source mandiri untuk merancang template Blogger dan theme WordPress.
            Didukung wizard pembuatan 5 langkah, File Explorer workspace, pengelola aset terisolasi, serta penyimpanan lokal di perangkat Anda.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsWizardModalOpen(true)}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Proyek Baru (Wizard)</span>
            </button>
            <button
              onClick={() => setActiveView('projects')}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Buka Proyek</span>
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Impor Proyek (.ntbproject)</span>
            </button>
            {currentProject && (
              <button
                onClick={() => setActiveView('file-explorer')}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-emerald-500/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <FolderTree className="w-4 h-4" />
                <span>Buka Folder Proyek Aktif</span>
              </button>
            )}
          </div>
        </div>

        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Storage and Project Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3.5">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-medium">Total Proyek Lokal</span>
            <span className="text-xl font-bold text-white">{recentProjects.length} Proyek</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3.5">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-medium">Kapasitas Penyimpanan</span>
            <span className="text-xl font-bold text-white">
              {(storageInfo.usedBytes / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3.5">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-medium">Format Proyek Utama</span>
            <span className="text-sm font-semibold text-neutral-200 font-mono block">
              .ntbproject (v1.0.0)
            </span>
          </div>
        </div>
      </div>

      {/* Projects Management Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-neutral-100">Daftar Proyek Tersimpan</h2>
            <span className="text-xs text-neutral-500">({filteredProjects.length} dari {recentProjects.length})</span>
          </div>

          {/* Search, Filter, Sort Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama proyek..."
                className="pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-xs">
              <button
                onClick={() => setPlatformFilter('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  platformFilter === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setPlatformFilter('blogger')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  platformFilter === 'blogger' ? 'bg-orange-500/20 text-orange-400 font-medium' : 'text-neutral-400'
                }`}
              >
                Blogger
              </button>
              <button
                onClick={() => setPlatformFilter('wordpress')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  platformFilter === 'wordpress' ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-neutral-400'
                }`}
              >
                WordPress
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-300"
            >
              <option value="updatedAt">Tanggal Perubahan</option>
              <option value="createdAt">Tanggal Pembuatan</option>
              <option value="name">Nama Proyek</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white"
              title={`Urutan: ${sortOrder === 'asc' ? 'A-Z / Lama ke Baru' : 'Z-A / Baru ke Lama'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-8 rounded-xl bg-neutral-900/40 border border-dashed border-neutral-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-neutral-300">Tidak ada proyek yang sesuai</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Mulai dengan membuat proyek baru lewat wizard atau pilih salah satu starter template di bawah.
              </p>
            </div>
            <button
              onClick={() => setIsWizardModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              Buat Proyek Baru
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProjects.map((proj) => {
              const isBlogger = proj.targetPlatform === 'blogger';
              const isActive = currentProject?.id === proj.id;

              return (
                <div
                  key={proj.id}
                  className={`group p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-neutral-900 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-semibold border ${
                          isBlogger
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {proj.targetPlatform}
                      </span>

                      {isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono font-medium">
                          Sedang Aktif
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-neutral-100 group-hover:text-amber-400 transition-colors truncate">
                      {proj.name}
                    </h3>

                    <div className="space-y-1 text-[11px] text-neutral-400">
                      <div className="flex items-center gap-2">
                        <span>{proj.pageCount} halaman</span>
                        <span>•</span>
                        <span>{proj.componentCount} komponen</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                        <span>Dibuat: {new Date(proj.createdAt).toLocaleDateString('id-ID')}</span>
                        <span>Diubah: {new Date(proj.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-800/80">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setProjectToRename({ id: proj.id, name: proj.name })}
                        className="p-1.5 text-neutral-500 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                        title="Ganti Nama Proyek"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setProjectToDuplicate({ id: proj.id, name: proj.name })}
                        className="p-1.5 text-neutral-500 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                        title="Gandakan Proyek"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenFolder(proj.id)}
                        className="p-1.5 text-neutral-500 hover:text-emerald-400 rounded hover:bg-emerald-500/10 transition-colors"
                        title="Buka File Explorer Workspace"
                      >
                        <FolderTree className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setProjectToDelete({ id: proj.id, name: proj.name })}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
                        title="Hapus Proyek"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => openProject(proj.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Buka Editor</span>
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Starter Templates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-100">Starter Templates (Perpustakaan Awal)</h2>
            <p className="text-xs text-neutral-400">
              Koleksi cetak biru berstruktur skema JSON v1.0.0 siap pakai.
            </p>
          </div>
          <button
            onClick={() => setActiveView('templates')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            Katalog Lengkap <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STARTER_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                    {tmpl.category}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    {tmpl.recommendedPlatform}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">{tmpl.name}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                  {tmpl.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500 font-mono">
                  {tmpl.componentCountPreview} Komponen
                </span>
                <button
                  onClick={() => handleQuickTemplate(tmpl.id, tmpl.name, tmpl.recommendedPlatform)}
                  className="px-3 py-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors cursor-pointer"
                >
                  Gunakan Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <ProjectCreationWizardModal isOpen={isWizardModalOpen} onClose={() => setIsWizardModalOpen(false)} />
      <ImportProjectModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
      <ConfirmDeleteModal
        isOpen={Boolean(projectToDelete)}
        projectName={projectToDelete?.name || ''}
        onConfirm={async () => {
          if (projectToDelete) {
            await deleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }
        }}
        onCancel={() => setProjectToDelete(null)}
      />
      {projectToDuplicate && (
        <DuplicateProjectModal
          isOpen={Boolean(projectToDuplicate)}
          projectId={projectToDuplicate.id}
          originalName={projectToDuplicate.name}
          onClose={() => setProjectToDuplicate(null)}
        />
      )}
      {projectToRename && (
        <RenameProjectModal
          isOpen={Boolean(projectToRename)}
          projectId={projectToRename.id}
          currentName={projectToRename.name}
          onClose={() => setProjectToRename(null)}
        />
      )}
    </div>
  );
};
