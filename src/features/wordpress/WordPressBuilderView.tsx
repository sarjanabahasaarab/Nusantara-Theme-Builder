/**
 * Nusantara Theme Builder — WordPress Builder View
 * Arsitektur khusus WordPress & rencana implementasi Phase 5 sesuai spesifikasi I.
 * Membedakan Block Theme (FSE) dengan Classic Theme.
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { checkWordPressExportReadiness } from '../../domain/wordpress/wordpress-module';
import {
  Blocks,
  FileCode,
  AlertTriangle,
  FolderTree,
  CheckCircle2,
  Copy,
  FolderPlus,
  Layers
} from 'lucide-react';
import { NewProjectModal } from '../../components/modals/NewProjectModal';

export const WordPressBuilderView: React.FC = () => {
  const { currentProject, addToast } = useProjectStore();
  const [activeTab, setActiveTab] = useState<'block' | 'classic'>('block');
  const [copied, setCopied] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const readiness = currentProject
    ? checkWordPressExportReadiness(currentProject)
    : null;

  const handleCopyThemeJson = () => {
    if (!readiness) return;
    navigator.clipboard.writeText(JSON.stringify(readiness.themeJsonDraft, null, 2));
    setCopied(true);
    addToast('info', 'Draf theme.json disalin ke clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30">
              Target Platform: WordPress
            </span>
            <span className="text-xs text-neutral-500 font-mono">Modul Persiapan Phase 5</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">WordPress Builder Architecture</h1>
          <p className="text-xs text-neutral-400">
            Arsitektur pemisahan Block Theme (FSE) modern dan Classic Theme PHP.
          </p>
        </div>

        {!currentProject && (
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Buat Proyek WordPress</span>
          </button>
        )}
      </div>

      {/* Honest Status Card */}
      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 text-xs space-y-2">
        <div className="flex items-center gap-2 text-blue-300 font-semibold">
          <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Informasi Batasan & Roadmap Phase 1 (Jujur dan Transparan)</span>
        </div>
        <p className="text-blue-200/90 leading-relaxed">
          Pada Phase 1, modul ini menyediakan target platform WordPress, domain model theme.json v3, dan hierarki berkas. Fitur <strong>pengemasan berkas ZIP tema siap instalasi di wp-admin, validasi Gutenberg block, serta perenderan template PHP dinamis</strong> dijadwalkan pada <strong>Phase 5</strong>.
        </p>
      </div>

      {/* Block Theme vs Classic Theme Comparison */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab('block')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'block'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            1. Modern Block Theme (Full Site Editing)
          </button>
          <button
            onClick={() => setActiveTab('classic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'classic'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            2. Classic PHP Theme (Legacy)
          </button>
        </div>

        {activeTab === 'block' ? (
          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-blue-400" />
              Hierarki Berkas Block Theme (FSE)
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Block theme mengandalkan file konfigurasi terpusat <code className="text-amber-400">theme.json</code> dan blok HTML berbasis Gutenberg:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1">
                <span className="text-blue-400 font-bold block">theme.json</span>
                <span className="text-neutral-400 text-[11px] block">
                  Pusat definisi warna, tipografi, jarak (spacing), layout, dan preset tema.
                </span>
              </div>
              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1">
                <span className="text-blue-400 font-bold block">templates/</span>
                <span className="text-neutral-400 text-[11px] block">
                  index.html, single.html, archive.html, 404.html.
                </span>
              </div>
              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1">
                <span className="text-blue-400 font-bold block">parts/</span>
                <span className="text-neutral-400 text-[11px] block">
                  header.html, footer.html, sidebar.html.
                </span>
              </div>
              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1">
                <span className="text-blue-400 font-bold block">patterns/</span>
                <span className="text-neutral-400 text-[11px] block">
                  Pola tata letak blok yang dapat disisipkan kreator ke laman artikel.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-neutral-400" />
              Hierarki Berkas Classic PHP Theme
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Classic theme mengandalkan template engine tradisional berbasis PHP:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1">
                <span className="text-neutral-200 font-bold block">style.css</span>
                <span className="text-neutral-400 text-[11px] block">
                  Header deklarasi metadata tema resmi WordPress dan gaya CSS dasar.
                </span>
              </div>
              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1">
                <span className="text-neutral-200 font-bold block">functions.php</span>
                <span className="text-neutral-400 text-[11px] block">
                  Enqueuing script, register_nav_menus, dan tema support (thumbnails, title-tag).
                </span>
              </div>
              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1">
                <span className="text-neutral-200 font-bold block">index.php, header.php, footer.php</span>
                <span className="text-neutral-400 text-[11px] block">
                  Struktur template hierarki standar loop WordPress.
                </span>
              </div>
              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1">
                <span className="text-neutral-200 font-bold block">sidebar.php & comments.php</span>
                <span className="text-neutral-400 text-[11px] block">
                  Area widget dinamis dan formulir komentar pengunjung.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* theme.json v3 Blueprint Draft */}
      {readiness && (
        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">
                Draf Konfigurasi theme.json v3
              </h3>
            </div>
            <button
              onClick={handleCopyThemeJson}
              className="flex items-center gap-1 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Tersalin' : 'Salin theme.json'}</span>
            </button>
          </div>

          <pre className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-80 select-text leading-relaxed">
            {JSON.stringify(readiness.themeJsonDraft, null, 2)}
          </pre>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        defaultPlatform="wordpress"
      />
    </div>
  );
};
