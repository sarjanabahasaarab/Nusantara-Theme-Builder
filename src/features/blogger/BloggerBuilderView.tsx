/**
 * Nusantara Theme Builder — Blogger Builder View
 * Arsitektur khusus Blogger & rencana implementasi Phase 4 sesuai spesifikasi H.
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { checkBloggerExportReadiness } from '../../domain/blogger/blogger-module';
import {
  FileCode,
  AlertTriangle,
  Layers,
  Code2,
  CheckCircle2,
  ExternalLink,
  Copy,
  FolderPlus
} from 'lucide-react';
import { NewProjectModal } from '../../components/modals/NewProjectModal';

export const BloggerBuilderView: React.FC = () => {
  const { currentProject, addToast } = useProjectStore();
  const [copied, setCopied] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // If there's an active project, inspect readiness
  const readiness = currentProject
    ? checkBloggerExportReadiness(currentProject)
    : null;

  const handleCopyXml = () => {
    if (!readiness) return;
    navigator.clipboard.writeText(readiness.sampleXmlPreview);
    setCopied(true);
    addToast('info', 'Contoh skema XML Blogger disalin.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/30">
              Target Platform: Blogger (Blogspot)
            </span>
            <span className="text-xs text-neutral-500 font-mono">Modul Persiapan Phase 4</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Blogger Builder Architecture</h1>
          <p className="text-xs text-neutral-400">
            Fondasi teknis dan cetak biru serializer XML Google Blogger Blogspot v2/v3.
          </p>
        </div>

        {!currentProject && (
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Buat Proyek Blogger</span>
          </button>
        )}
      </div>

      {/* Honest Status Card */}
      <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-800/40 text-xs space-y-2">
        <div className="flex items-center gap-2 text-orange-300 font-semibold">
          <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
          <span>Informasi Batasan & Roadmap Phase 1 (Jujur dan Transparan)</span>
        </div>
        <p className="text-orange-200/90 leading-relaxed">
          Pada Phase 1, modul ini menyediakan target platform Blogger, definisi tipe domain, dan spesifikasi struktur layout XML. Fitur <strong>XML Serializer lengkap, validasi skema Google DTD, dan tombol unduh file .xml yang siap diunggah ke Blogspot</strong> akan diimplementasikan penuh pada <strong>Phase 4</strong>.
        </p>
      </div>

      {/* Architecture Layout Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-400" />
            Struktur Hirarki Layout XML Blogger
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Format tema Blogger tidak menggunakan HTML standar biasa, melainkan XML berstruktur khusus:
          </p>
          <ul className="text-xs space-y-2 text-neutral-300 font-mono">
            <li className="p-2 bg-neutral-950 rounded border border-neutral-800">
              <span className="text-orange-400 font-bold">&lt;b:skin&gt;</span> — Tempat deklarasi variabel CSS dinamis dan CSS tema.
            </li>
            <li className="p-2 bg-neutral-950 rounded border border-neutral-800">
              <span className="text-orange-400 font-bold">&lt;b:section&gt;</span> — Wadah utama untuk widget (Header, Blog, Sidebar, Footer).
            </li>
            <li className="p-2 bg-neutral-950 rounded border border-neutral-800">
              <span className="text-orange-400 font-bold">&lt;b:widget&gt;</span> — Komponen fungsional (Header1, Blog1, Attribution1, HTML1).
            </li>
            <li className="p-2 bg-neutral-950 rounded border border-neutral-800">
              <span className="text-orange-400 font-bold">&lt;b:includable&gt;</span> — Sub-rutin rendering data posting dan komentar.
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Checklist Kesiapan Ekspor (Phase 4 Roadmap)
          </h3>
          <p className="text-xs text-neutral-400">
            Persyaratan yang sedang dirancang sebelum ekspor satu-klik dinyatakan aktif:
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 p-2 bg-neutral-950 rounded border border-neutral-800 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
              <span>Model data proyek terisolasi (Selesai di Phase 1)</span>
            </div>
            <div className="flex items-start gap-2 p-2 bg-neutral-950 rounded border border-neutral-800 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
              <span>Struktur layout dan pemetaan widget (Selesai di Phase 1)</span>
            </div>
            <div className="flex items-start gap-2 p-2 bg-neutral-950 rounded border border-neutral-800 text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-neutral-600 mt-1 shrink-0" />
              <span>XML Serializer engine (Phase 4)</span>
            </div>
            <div className="flex items-start gap-2 p-2 bg-neutral-950 rounded border border-neutral-800 text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-neutral-600 mt-1 shrink-0" />
              <span>Uji coba upload langsung ke akun Blogger nyata (Phase 4)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sample XML Blueprint Preview */}
      {readiness && (
        <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-semibold text-white">
                Contoh Cetak Biru XML Blogger untuk Proyek Ini
              </h3>
            </div>
            <button
              onClick={handleCopyXml}
              className="flex items-center gap-1 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Tersalin' : 'Salin Contoh XML'}</span>
            </button>
          </div>

          <pre className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-80 select-text leading-relaxed">
            {readiness.sampleXmlPreview}
          </pre>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        defaultPlatform="blogger"
      />
    </div>
  );
};
