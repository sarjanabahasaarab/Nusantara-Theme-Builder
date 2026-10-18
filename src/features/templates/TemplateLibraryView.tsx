/**
 * Nusantara Theme Builder — Template Library View
 * Katalog template starter internal dengan skema terstruktur v1.0.0.
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { STARTER_TEMPLATES, StarterTemplateId } from '../../domain/project/project-factory';
import {
  Sparkles,
  Layers,
  ArrowRight,
  Check,
  Globe,
  Filter
} from 'lucide-react';
import { TargetPlatform } from '../../types/project';

export const TemplateLibraryView: React.FC = () => {
  const { createProject, addToast } = useProjectStore();
  const [platformFilter, setPlatformFilter] = useState<'all' | TargetPlatform>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<StarterTemplateId | null>(null);

  const filteredTemplates = STARTER_TEMPLATES.filter((t) => {
    if (platformFilter === 'all') return true;
    return t.recommendedPlatform === platformFilter;
  });

  const handleUseTemplate = async (templateId: StarterTemplateId, name: string, platform: TargetPlatform) => {
    const success = await createProject(`${name} Baru`, platform, templateId);
    if (success) {
      addToast('success', `Membuat proyek dari template "${name}".`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Katalog Template Awal</h1>
          <p className="text-xs text-neutral-400">
            Pilih starter template terverifikasi skema JSON v1.0.0 untuk memulai perancangan tema.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setPlatformFilter('all')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              platformFilter === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Semua ({STARTER_TEMPLATES.length})
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
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tmpl) => {
          const isBlogger = tmpl.recommendedPlatform === 'blogger';

          return (
            <div
              key={tmpl.id}
              className="p-5 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                    {tmpl.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                      isBlogger
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {tmpl.recommendedPlatform}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{tmpl.name}</h3>
                  <span className="text-[11px] text-amber-400/90 font-medium">Lencana: {tmpl.badge}</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">Struktur Model v1.0.0</span>
                <button
                  onClick={() => handleUseTemplate(tmpl.id, tmpl.name, tmpl.recommendedPlatform)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <span>Gunakan Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
