/**
 * Nusantara Theme Builder — About & Roadmap Modal
 * Menampilkan informasi produk, lisensi MIT, teknologi, dan transparansi roadmap 10 fase.
 */

import React from 'react';
import { X, Layers, Code, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-neutral-950 font-bold text-sm shadow">
              N
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100">Nusantara Theme Builder</h2>
              <p className="text-xs text-blue-400 font-mono">Versi 0.5.0 (Phase 5 WordPress Theme Builder & ZIP Export)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-300 leading-relaxed">
          <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2">
            <h4 className="font-semibold text-neutral-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Tentang Aplikasi & Lisensi Open-Source
            </h4>
            <p>
              Nusantara Theme Builder adalah software desktop open-source berlisensi <strong>MIT</strong> yang dirancang untuk membantu kreator, pengembang web, dan komunitas blogger di Indonesia membangun template Blogger dan theme WordPress modern secara visual maupun kode.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-100 uppercase tracking-wider text-[11px] text-neutral-400">
              Arsitektur & Tumpukan Teknologi
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">Desktop Backend</span>
                <span className="font-medium text-neutral-200">Tauri 2 (Rust)</span>
              </div>
              <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">Frontend View</span>
                <span className="font-medium text-neutral-200">React 19 + TypeScript</span>
              </div>
              <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">State Engine</span>
                <span className="font-medium text-neutral-200">Zustand</span>
              </div>
              <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">Code Editor</span>
                <span className="font-medium text-neutral-200">Monaco Editor</span>
              </div>
              <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">WordPress Engine</span>
                <span className="font-medium text-neutral-200">theme.json v3 & JSZip</span>
              </div>
              <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800">
                <span className="text-[10px] text-neutral-500 block">Unit Testing</span>
                <span className="font-medium text-neutral-200">Vitest</span>
              </div>
            </div>
          </div>

          {/* Roadmap Status */}
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-100 uppercase tracking-wider text-[11px] text-neutral-400">
              Status Roadmap 10 Fase
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-emerald-950/30 border border-emerald-800/40 rounded text-emerald-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Phase 1 (Selesai):</strong> Fondasi arsitektur, state store, Monaco Editor, validasi JSON, dan lisensi MIT.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-emerald-950/30 border border-emerald-800/40 rounded text-emerald-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Phase 2 (Selesai):</strong> Manajemen proyek lokal, Project Wizard, File Explorer sandbox, Template Library 6 kategori, dan Asset Management.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-emerald-950/30 border border-emerald-800/40 rounded text-emerald-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Phase 3 (Selesai):</strong> Advanced Visual Editor, dnd-kit sortable kanvas, Component Tree, Properties Inspector 3-tab, Asset Picker, Multi-Halaman, dan Zoom.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-emerald-950/30 border border-emerald-800/40 rounded text-emerald-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Phase 4 (Selesai):</strong> Blogger Theme Builder, visual layout, serializer XML Blogger v2/v3, validasi 3-tingkat, impor aman, dan ekspor .xml.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-emerald-950/30 border border-emerald-800/40 rounded text-emerald-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Phase 5 (Selesai):</strong> WordPress Theme Builder, Block Theme FSE, theme.json v3, Templates & Parts, Block Patterns, validator 4-tingkat, dan ekspor ZIP siap pasang.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-950 border border-neutral-800 rounded text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                <span><strong>Phase 6 (Mendatang):</strong> Integrasi E-Commerce & WooCommerce Block Components.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-900/60">
          <span className="text-[11px] text-neutral-500">Lisensi MIT © 2026 Nusantara Theme Builder</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-neutral-200 hover:bg-white rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
