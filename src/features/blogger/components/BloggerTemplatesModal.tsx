/**
 * Nusantara Theme Builder — Blogger Templates Modal
 * Modal Pilihan 5 Template Awal Khusus Blogger
 * Lisensi: MIT
 */

import React from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { BLOGGER_STARTER_TEMPLATES, BloggerStarterTemplate } from '../data/bloggerStarterTemplates';
import {
  X,
  LayoutTemplate,
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface BloggerTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BloggerTemplatesModal: React.FC<BloggerTemplatesModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentProject, updateThemeSettings, updatePage, addToast } = useProjectStore();

  if (!isOpen || !currentProject) return null;

  const handleApplyTemplate = (template: BloggerStarterTemplate) => {
    // 1. Terapkan themeSettings & bloggerSettings
    updateThemeSettings({
      ...template.themeSettings,
      bloggerSettings: template.bloggerSettings
    });

    // 2. Terapkan komponen ke halaman aktif
    const activePage = currentProject.pages[0];
    if (activePage) {
      updatePage(activePage.id, {
        components: template.components
      });
    }

    addToast(
      'success',
      `Template awal "${template.name}" berhasil diterapkan ke proyek Blogger.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-100">
                Pustaka Template Awal Blogger
              </h2>
              <p className="text-[11px] text-neutral-400">
                Pilih layout awal yang telah dioptimalkan untuk generator template Blogger XML
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {BLOGGER_STARTER_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-4 rounded-xl bg-neutral-950/60 hover:bg-neutral-950 border border-neutral-800 hover:border-orange-500/50 transition-all flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-semibold border border-orange-500/20">
                    {tmpl.badge}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{ backgroundColor: tmpl.themeSettings.primaryColor }}
                      className="w-3 h-3 rounded-full inline-block border border-neutral-700"
                    />
                    <span
                      style={{ backgroundColor: tmpl.themeSettings.backgroundColor }}
                      className="w-3 h-3 rounded-full inline-block border border-neutral-700"
                    />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-neutral-100 group-hover:text-orange-400 transition-colors">
                  {tmpl.name}
                </h3>

                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {tmpl.description}
                </p>

                <div className="pt-1 text-[10px] font-mono text-neutral-500">
                  {tmpl.components.length} Komponen Terstruktur
                </div>
              </div>

              <button
                onClick={() => handleApplyTemplate(tmpl)}
                className="w-full py-2 px-3 rounded-lg bg-neutral-900 group-hover:bg-orange-500 group-hover:text-neutral-950 text-neutral-200 font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-neutral-800 group-hover:border-transparent"
              >
                <span>Gunakan Template Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-800 bg-neutral-900/60 shrink-0 text-xs">
          <span className="text-[11px] text-neutral-500">
            Catatan: Menerapkan template awal akan memperbarui gaya dan komponen pada halaman saat ini.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
