/**
 * Nusantara Theme Builder — WordPress Templates & Parts Tab
 * Manajemen template FSE (index, single, page, archive, 404) dan template parts (header, footer)
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import { WordPressTemplateItem } from '../types/wordpress';
import {
  FileText,
  Layout,
  Plus,
  Check,
  FolderTree,
  FileCode,
  Tag
} from 'lucide-react';

interface WordPressTemplatesTabProps {
  templates: WordPressTemplateItem[];
  templateParts: WordPressTemplateItem[];
  activeTemplateId: string;
  onSelectTemplate: (id: string, isPart?: boolean) => void;
  onAddTemplate: (newTemplate: WordPressTemplateItem) => void;
}

export const WordPressTemplatesTab: React.FC<WordPressTemplatesTabProps> = ({
  templates,
  templateParts,
  activeTemplateId,
  onSelectTemplate,
  onAddTemplate
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newType, setNewType] = useState<'template' | 'part'>('template');
  const [newArea, setNewArea] = useState<'header' | 'footer' | 'sidebar' | 'general'>('general');

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const slug = (newSlug.trim() || newTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    const item: WordPressTemplateItem = {
      id: slug,
      title: newTitle,
      description: `Kustom ${newType === 'part' ? 'template part' : 'template'} WordPress.`,
      type: newType,
      area: newType === 'part' ? newArea : undefined,
      components: []
    };

    onAddTemplate(item);
    setShowAddModal(false);
    setNewTitle('');
    setNewSlug('');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-900/40">
      {/* Header */}
      <div className="p-3 border-b border-neutral-800 bg-neutral-950/60 flex items-center justify-between text-xs">
        <span className="font-semibold text-neutral-300">Daftar Template FSE</span>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-2 py-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Seksi 1: Full Templates (templates/*.html) */}
        <div className="space-y-1.5">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Templates (templates/*.html)</span>
          </div>

          {templates.map((tpl) => {
            const isActive = tpl.id === activeTemplateId;
            return (
              <div
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl.id, false)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-950/40 border-blue-500/60 shadow-sm ring-1 ring-blue-500/30'
                    : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-200">
                        {tpl.title}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-500">
                        templates/{tpl.id}.html
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Aktif</span>
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                  {tpl.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Seksi 2: Template Parts (parts/*.html) */}
        <div className="space-y-1.5">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-indigo-400" />
            <span>Template Parts (parts/*.html)</span>
          </div>

          {templateParts.map((part) => {
            const isActive = part.id === activeTemplateId;
            return (
              <div
                key={part.id}
                onClick={() => onSelectTemplate(part.id, true)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-sm ring-1 ring-indigo-500/30'
                    : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Layout className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-200">
                        {part.title}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-500">
                        parts/{part.id}.html ({part.area || 'general'})
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Aktif</span>
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                  {part.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Tambah Template */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-4 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white">Tambah Template Baru</h3>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Tipe Template</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('template')}
                    className={`py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      newType === 'template'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-semibold'
                        : 'border-neutral-800 text-neutral-400'
                    }`}
                  >
                    Template Penuh
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('part')}
                    className={`py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                      newType === 'part'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 font-semibold'
                        : 'border-neutral-800 text-neutral-400'
                    }`}
                  >
                    Template Part
                  </button>
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Nama Judul</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Landing Page Khusus"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Slug File (tanpa .html)</label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="landing-khusus"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white font-mono"
                />
              </div>

              {newType === 'part' && (
                <div>
                  <label className="text-neutral-400 block mb-1">Area Template Part</label>
                  <select
                    value={newArea}
                    onChange={(e: any) => setNewArea(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
                  >
                    <option value="header">Header</option>
                    <option value="footer">Footer</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="general">General (Umum)</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim()}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Simpan Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
