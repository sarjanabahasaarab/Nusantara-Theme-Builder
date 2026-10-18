/**
 * Nusantara Theme Builder — Component Palette Tab
 * Daftar komponen kaya yang dapat ditambahkan ke kanvas visual
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { COMPONENT_CATALOG, CATEGORY_LABELS, ComponentDefinition } from '../component-catalog';
import { createComponent } from '../../../domain/project/project-factory';
import { Search, Plus, Layers, Filter } from 'lucide-react';
import { ComponentCategory } from '../../../types/project';

export const ComponentPaletteTab: React.FC = () => {
  const { addComponent, addToast } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredComponents = COMPONENT_CATALOG.filter((comp) => {
    const matchCategory = selectedCategory === 'all' || comp.category === selectedCategory;
    const matchQuery =
      searchQuery.trim() === '' ||
      comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const handleAddComponent = (def: ComponentDefinition) => {
    const newComp = createComponent(
      def.type,
      def.label,
      def.category as ComponentCategory,
      JSON.parse(JSON.stringify(def.defaultProps)),
      JSON.parse(JSON.stringify(def.defaultStyles))
    );
    addComponent(newComp);
    addToast('info', `Komponen "${def.label}" ditambahkan ke halaman.`);
  };

  const categories = Object.keys(CATEGORY_LABELS);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search Bar */}
      <div className="p-3 border-b border-neutral-800 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari komponen..."
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Category Filter Horizontal Scroll */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {categories.map((catKey) => {
            const isActive = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-2 py-0.5 rounded-full shrink-0 font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 font-semibold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {CATEGORY_LABELS[catKey]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredComponents.length === 0 ? (
          <div className="py-8 text-center text-neutral-500 space-y-2">
            <Layers className="w-6 h-6 mx-auto text-neutral-600" />
            <p className="text-xs">Tidak ada komponen yang cocok.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-[11px] text-amber-400 hover:underline"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredComponents.map((def) => {
            const Icon = def.icon;
            return (
              <div
                key={def.type}
                className="group p-2.5 rounded-xl border border-neutral-800/80 bg-neutral-900/50 hover:bg-neutral-850 hover:border-neutral-700/80 transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-neutral-800/80 group-hover:bg-amber-500/10 group-hover:text-amber-400 text-neutral-400 transition-colors shrink-0">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-neutral-200 truncate group-hover:text-amber-400 transition-colors">
                      {def.label}
                    </span>
                    <button
                      onClick={() => handleAddComponent(def)}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer shrink-0"
                      title="Tambahkan komponen ini ke halaman aktif"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-400 line-clamp-2 mt-0.5 leading-snug">
                    {def.description}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400 border border-neutral-800/60 uppercase">
                      {CATEGORY_LABELS[def.category] || def.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-neutral-800 bg-neutral-950/60 text-[10px] text-neutral-500 text-center">
        Menampilkan {filteredComponents.length} dari {COMPONENT_CATALOG.length} komponen
      </div>
    </div>
  );
};
