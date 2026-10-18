/**
 * Nusantara Theme Builder — Dashboard View
 * Beranda utama aplikasi desktop sesuai spesifikasi D:
 * Sambutan, Aksi Cepat, Statistik Lokal Nyata, Daftar Proyek Terbaru,
 * Starter Templates, Roadmap 10 Fase, dan Panduan Penggunaan.
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { STARTER_TEMPLATES, StarterTemplateId } from '../../domain/project/project-factory';
import {
  FolderPlus,
  FolderOpen,
  Upload,
  Layers,
  HardDrive,
  Clock,
  Sparkles,
  ArrowRight,
  Trash2,
  ExternalLink,
  BookOpen,
  Code,
  FileCode,
  Blocks,
  CheckCircle2
} from 'lucide-react';
import { NewProjectModal } from '../../components/modals/NewProjectModal';
import { ImportProjectModal } from '../../components/modals/ImportProjectModal';
import { ConfirmDeleteModal } from '../../components/modals/ConfirmDeleteModal';

export const DashboardView: React.FC = () => {
  const {
    recentProjects,
    storageInfo,
    openProject,
    deleteProject,
    createProject,
    setActiveView
  } = useProjectStore();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleQuickTemplate = async (templateId: StarterTemplateId, name: string, platform: 'blogger' | 'wordpress') => {
    await createProject(`${name} Baru`, platform, templateId);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-neutral-800 p-6 md:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nusantara Theme Builder — Phase 1 (Fondasi Desktop)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Rancang & Kembangkan Tema Web Tanpa Batas
          </h1>
          <p className="text-neutral-300 text-xs md:text-sm leading-relaxed">
            Software desktop open-source mandiri untuk merancang template Blogger dan theme WordPress.
            Dilengkapi editor visual drag-and-drop, Monaco Editor terintegrasi, serta penyimpanan aman 100% lokal di perangkat Anda.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Proyek Baru</span>
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
              <span>Impor Proyek (.json)</span>
            </button>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
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
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-medium">Kapasitas Terpakai</span>
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
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-medium">Mode Penyimpanan</span>
            <span className="text-sm font-semibold text-neutral-200 truncate block max-w-[180px]">
              {storageInfo.mode}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-neutral-100">Proyek Terbaru</h2>
            <span className="text-xs text-neutral-500">({recentProjects.length})</span>
          </div>
          {recentProjects.length > 0 && (
            <button
              onClick={() => setActiveView('projects')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentProjects.length === 0 ? (
          <div className="p-8 rounded-xl bg-neutral-900/40 border border-dashed border-neutral-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-neutral-300">Belum ada proyek tersimpan</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Mulai dengan membuat proyek baru atau pilih salah satu starter template di bawah ini.
              </p>
            </div>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg inline-flex items-center gap-1.5 transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              Buat Proyek Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {recentProjects.slice(0, 6).map((proj) => {
              const isBlogger = proj.targetPlatform === 'blogger';
              return (
                <div
                  key={proj.id}
                  className="group p-4 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
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
                      <span className="text-[11px] text-neutral-500">
                        {new Date(proj.updatedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-100 group-hover:text-amber-400 transition-colors truncate">
                      {proj.name}
                    </h3>

                    <p className="text-xs text-neutral-400">
                      {proj.pageCount} halaman • {proj.componentCount} komponen aktif
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-neutral-800/80">
                    <button
                      onClick={() => setProjectToDelete({ id: proj.id, name: proj.name })}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 rounded transition-colors"
                      title="Hapus Proyek"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openProject(proj.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors"
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
            <h2 className="text-base font-bold text-neutral-100">Starter Templates (Fondasi Awal)</h2>
            <p className="text-xs text-neutral-400">
              Model data awal terstruktur dengan validasi skema internal v1.0.0.
            </p>
          </div>
          <button
            onClick={() => setActiveView('templates')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
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
                <span className="text-[11px] text-neutral-500">Model JSON v1.0.0</span>
                <button
                  onClick={() => handleQuickTemplate(tmpl.id, tmpl.name, tmpl.recommendedPlatform)}
                  className="px-3 py-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors"
                >
                  Gunakan Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap 10 Fase Card */}
      <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">
              Roadmap Pengembangan 10 Fase
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Phase 1 Aktif
            </span>
          </div>
          <span className="text-xs text-neutral-500 font-mono">MIT Open Source</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-neutral-950 rounded-lg border border-emerald-800/40 text-neutral-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Phase 1 (Saat Ini)</span>
              <span>Fondasi aplikasi, dashboard, penyimpanan lokal, visual editor dasar, Monaco Editor, validasi JSON.</span>
            </div>
          </div>
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-400 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
            <div>
              <span className="font-medium text-neutral-200 block">Phase 2 — Manajemen Proyek Lanjutan</span>
              <span>File explorer terpadu, multi-page, dan pengelola aset media lokal.</span>
            </div>
          </div>
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-400 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-neutral-600 shrink-0 mt-1.5" />
            <div>
              <span className="font-medium text-neutral-200 block">Phase 4 — Blogger Builder</span>
              <span>XML template serializer, validasi widget Blogger, dan ekspor XML Blogspot.</span>
            </div>
          </div>
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-400 flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-neutral-600 shrink-0 mt-1.5" />
            <div>
              <span className="font-medium text-neutral-200 block">Phase 5 — WordPress Builder</span>
              <span>Theme.json compiler, block patterns FSE, classic PHP theme, dan ekspor ZIP.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Guide / Panduan Penggunaan */}
      <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 space-y-2">
        <h4 className="font-semibold text-neutral-200 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-amber-400" />
          Panduan Singkat Penggunaan Phase 1
        </h4>
        <ol className="list-decimal list-inside space-y-1 pl-1 leading-relaxed">
          <li>Buat proyek baru atau pilih starter template dengan target platform Blogger atau WordPress.</li>
          <li>Gunakan <strong>Visual Editor</strong> untuk menambahkan komponen, mengurutkan letak komponen, dan menyesuaikan properti di inspector.</li>
          <li>Gunakan <strong>Code Editor</strong> berbasis Monaco untuk memeriksa dokumen struktur JSON, HTML pratinjau, atau draf arsitektur tema.</li>
          <li>Perubahan tersimpan secara aman di penyimpanan komputer Anda dengan riwayat Undo/Redo penuh.</li>
        </ol>
      </div>

      {/* Modals */}
      <NewProjectModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
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
    </div>
  );
};
