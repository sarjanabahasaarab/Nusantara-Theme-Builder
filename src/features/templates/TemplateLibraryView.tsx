/**
 * Nusantara Theme Builder — Template Library View (Phase 2)
 * Perpustakaan template awal terstruktur:
 * - Pencarian dan filter kategori
 * - Modal detail template (komponen yang didukung, konfigurasi, pratinjau mockup)
 * - Pembuatan salinan independen saat template digunakan (tanpa merusak template sumber)
 * - Label jujur: "Starter Project"
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { STARTER_TEMPLATES, StarterTemplateInfo, createStarterComponents } from '../../domain/project/project-factory';
import {
  Sparkles,
  Layers,
  ArrowRight,
  Check,
  Globe,
  Filter,
  Search,
  Eye,
  Info,
  X,
  Copy,
  FolderPlus
} from 'lucide-react';
import { TargetPlatform, ThemeComponent } from '../../types/project';

export const TemplateLibraryView: React.FC = () => {
  const { createProject, addToast } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | TargetPlatform>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTemplateForDetail, setSelectedTemplateForDetail] = useState<StarterTemplateInfo | null>(null);

  const categories = ['all', ...Array.from(new Set(STARTER_TEMPLATES.map((t) => t.category)))];

  const filteredTemplates = STARTER_TEMPLATES.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || t.recommendedPlatform === platformFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesPlatform && matchesCategory;
  });

  const handleUseTemplate = async (tmpl: StarterTemplateInfo) => {
    const success = await createProject(`${tmpl.name} Baru`, tmpl.recommendedPlatform, tmpl.id);
    if (success) {
      setSelectedTemplateForDetail(null);
      addToast('success', `Membuat proyek mandiri dari "${tmpl.name}".`);
    }
  };

  const templateComponents = selectedTemplateForDetail
    ? createStarterComponents(selectedTemplateForDetail.id)
    : [];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              Starter Project Engine
            </span>
            <span className="text-xs text-neutral-500">Skema v1.0.0</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Katalog Template Awal</h1>
          <p className="text-xs text-neutral-400">
            Pilih starter template terverifikasi untuk memulai perancangan tema Blogger atau WordPress.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari template berdasarkan nama atau deskripsi..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Platform filter */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setPlatformFilter('all')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              platformFilter === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Semua Platform
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

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-300"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Semua Kategori' : cat}
            </option>
          ))}
        </select>
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
                  <span className="text-[11px] text-amber-400 font-medium">Starter Project • {tmpl.badge}</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {tmpl.description}
                </p>

                <div className="text-[11px] text-neutral-500 font-mono">
                  {tmpl.componentCountPreview} Komponen Awal Terpasang
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedTemplateForDetail(tmpl)}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Detail</span>
                </button>

                <button
                  onClick={() => handleUseTemplate(tmpl)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Gunakan Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplateForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden p-6 space-y-5 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedTemplateForDetail.name}</h3>
                <span className="text-xs text-amber-400 font-mono">
                  Target: {selectedTemplateForDetail.recommendedPlatform.toUpperCase()} • Kategori: {selectedTemplateForDetail.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedTemplateForDetail(null)}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 pr-1">
              <p className="text-xs text-neutral-300 leading-relaxed">
                {selectedTemplateForDetail.description}
              </p>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                  Komponen Terpasang ({templateComponents.length})
                </span>

                {templateComponents.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic p-3 bg-neutral-950 rounded border border-neutral-800">
                    Proyek kosong murni tanpa komponen. Anda dapat menambahkan komponen sesuka hati di Visual Editor.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {templateComponents.map((comp, idx) => (
                      <div
                        key={comp.id || idx}
                        className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-neutral-800 text-neutral-400 font-mono text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-neutral-200 font-medium">{comp.label}</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase text-amber-400 bg-neutral-900 px-2 py-0.5 rounded">
                          {comp.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Menggunakan template ini akan menyalin seluruh komponen ke proyek baru Anda tanpa memengaruhi data master template.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setSelectedTemplateForDetail(null)}
                className="px-4 py-2 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => handleUseTemplate(selectedTemplateForDetail)}
                className="px-5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg shadow cursor-pointer"
              >
                Buat Proyek dari Template Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
