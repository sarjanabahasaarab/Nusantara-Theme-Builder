/**
 * Nusantara Theme Builder — Projects Manager View (Phase 2)
 * Manajemen proyek tersimpan lokal: pencarian, filter platform, pengurutan,
 * penggantian nama, penggandaan, ekspor .ntbproject, dan hapus aman.
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import {
  FolderPlus,
  Upload,
  Search,
  Trash2,
  Copy,
  Edit3,
  Download,
  ArrowRight,
  Filter,
  Layers,
  Calendar,
  FolderTree,
  ArrowUpDown
} from 'lucide-react';
import { ProjectCreationWizardModal } from '../../components/modals/ProjectCreationWizardModal';
import { ImportProjectModal } from '../../components/modals/ImportProjectModal';
import { ConfirmDeleteModal } from '../../components/modals/ConfirmDeleteModal';
import { DuplicateProjectModal } from '../../components/modals/DuplicateProjectModal';
import { RenameProjectModal } from '../../components/modals/RenameProjectModal';
import { TargetPlatform } from '../../types/project';
import { projectService } from '../../services/project-service';

export const ProjectsManagerView: React.FC = () => {
  const { recentProjects, openProject, deleteProject, addToast, setActiveView } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | TargetPlatform>('all');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'name'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [isWizardModalOpen, setIsWizardModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [projectToDuplicate, setProjectToDuplicate] = useState<{ id: string; name: string } | null>(null);
  const [projectToRename, setProjectToRename] = useState<{ id: string; name: string } | null>(null);

  const filteredProjects = recentProjects
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleExportProject = async (id: string, name: string) => {
    try {
      const full = await projectService.getProjectById(id);
      if (!full) return;

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(full, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ntbproject`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      addToast('success', `File .ntbproject untuk "${name}" berhasil diekspor.`);
    } catch {
      addToast('error', 'Gagal mengekspor berkas proyek.');
    }
  };

  const handleOpenFolder = (id: string) => {
    openProject(id);
    setActiveView('file-explorer');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Proyek Saya</h1>
          <p className="text-xs text-neutral-400">
            Kelola, duplikasi, ganti nama, dan ekspor tema Blogger dan WordPress lokal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-neutral-400" />
            <span>Impor .ntbproject</span>
          </button>
          <button
            onClick={() => setIsWizardModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Proyek Baru (Wizard)</span>
          </button>
        </div>
      </div>

      {/* Search, Filter, and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama proyek..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setPlatformFilter('all')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              platformFilter === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Semua ({recentProjects.length})
          </button>
          <button
            onClick={() => setPlatformFilter('blogger')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              platformFilter === 'blogger' ? 'bg-orange-500/20 text-orange-400 font-medium' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Blogger
          </button>
          <button
            onClick={() => setPlatformFilter('wordpress')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              platformFilter === 'wordpress' ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            WordPress
          </button>
        </div>

        <div className="flex items-center gap-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-300"
          >
            <option value="updatedAt">Diubah Terakhir</option>
            <option value="createdAt">Dibuat Terakhir</option>
            <option value="name">Nama Alfabetis</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white"
            title="Ubah Urutan"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-neutral-900/40 border border-dashed border-neutral-800 space-y-3">
          <Layers className="w-10 h-10 mx-auto text-neutral-600" />
          <p className="text-xs text-neutral-400">Tidak ada proyek yang sesuai dengan kriteria pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((proj) => {
            const isBlogger = proj.targetPlatform === 'blogger';

            return (
              <div
                key={proj.id}
                className="group p-5 rounded-xl bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold border ${
                        isBlogger
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {proj.targetPlatform}
                    </span>
                    <span className="text-[11px] text-neutral-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(proj.updatedAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-neutral-100 group-hover:text-amber-400 transition-colors truncate">
                      {proj.name}
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-mono mt-0.5 truncate">
                      ID: {proj.id}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span>{proj.pageCount} Halaman</span>
                    <span>•</span>
                    <span>{proj.componentCount} Komponen Aktif</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-800/80">
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
                      onClick={() => handleExportProject(proj.id, proj.name)}
                      className="p-1.5 text-neutral-500 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                      title="Unduh Berkas .ntbproject"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setProjectToDelete({ id: proj.id, name: proj.name })}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      title="Hapus Proyek"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => openProject(proj.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Buka Editor</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
