/**
 * Nusantara Theme Builder — Pages Tab in Visual Editor
 * Manajemen struktur multi-halaman proyek (Blogger & WordPress)
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import {
  FileText,
  Plus,
  Home,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Layers
} from 'lucide-react';
import { ProjectPage } from '../../../types/project';

export const PagesTab: React.FC = () => {
  const {
    currentProject,
    activePageId,
    setActivePageId,
    addPage,
    updatePage,
    deletePage
  } = useProjectStore();

  const [isAddingPage, setIsAddingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageIsHome, setNewPageIsHome] = useState(false);

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');

  if (!currentProject) return null;

  const pages = currentProject.pages || [];

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    addPage(newPageTitle.trim(), newPageSlug.trim() || undefined, newPageIsHome);
    setNewPageTitle('');
    setNewPageSlug('');
    setNewPageIsHome(false);
    setIsAddingPage(false);
  };

  const handleStartEdit = (page: ProjectPage) => {
    setEditingPageId(page.id);
    setEditTitle(page.title);
    setEditSlug(page.slug);
  };

  const handleSaveEdit = (pageId: string) => {
    if (!editTitle.trim()) return;
    updatePage(pageId, {
      title: editTitle.trim(),
      slug: editSlug.trim() || editTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')
    });
    setEditingPageId(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with Add Page Button */}
      <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-300">Daftar Halaman Proyek</span>
        {!isAddingPage && (
          <button
            onClick={() => setIsAddingPage(true)}
            className="px-2 py-1 rounded bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Tambah</span>
          </button>
        )}
      </div>

      {/* Add Page Form Drawer */}
      {isAddingPage && (
        <form onSubmit={handleCreatePage} className="p-3 bg-neutral-950 border-b border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-200">
            <span>Buat Halaman Baru</span>
            <button
              type="button"
              onClick={() => setIsAddingPage(false)}
              className="text-neutral-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400">Judul Halaman</label>
            <input
              type="text"
              value={newPageTitle}
              onChange={(e) => {
                setNewPageTitle(e.target.value);
                if (!newPageSlug || newPageSlug === newPageTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
                  setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                }
              }}
              placeholder="Misal: Tentang Kami"
              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
              autoFocus
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-neutral-400">Slug URL</label>
            <input
              type="text"
              value={newPageSlug}
              onChange={(e) => setNewPageSlug(e.target.value)}
              placeholder="tentang-kami"
              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded font-mono text-xs text-neutral-300 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="setAsHome"
              checked={newPageIsHome}
              onChange={(e) => setNewPageIsHome(e.target.checked)}
              className="rounded border-neutral-800 text-amber-400 focus:ring-amber-400"
            />
            <label htmlFor="setAsHome" className="text-xs text-neutral-300 cursor-pointer">
              Jadikan Halaman Utama (Beranda)
            </label>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={!newPageTitle.trim()}
              className="flex-1 py-1.5 rounded bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-neutral-950 font-semibold text-xs transition-colors cursor-pointer"
            >
              Simpan Halaman
            </button>
            <button
              type="button"
              onClick={() => setIsAddingPage(false)}
              className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {pages.map((page) => {
          const isActive = page.id === activePageId;
          const isEditing = editingPageId === page.id;

          if (isEditing) {
            return (
              <div
                key={page.id}
                className="p-3 rounded-lg border border-amber-400/80 bg-neutral-900/90 space-y-2 text-xs"
              >
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400">Judul</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-xs text-neutral-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400">Slug</label>
                  <input
                    type="text"
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 rounded font-mono text-xs text-neutral-200"
                  />
                </div>
                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => handleSaveEdit(page.id)}
                    className="px-2.5 py-1 rounded bg-amber-400 text-neutral-950 font-semibold text-xs flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Simpan
                  </button>
                  <button
                    onClick={() => setEditingPageId(null)}
                    className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 text-xs"
                  >
                    Batal
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              className={`group p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/10 border-amber-400/80 shadow-sm'
                  : 'bg-neutral-900/60 border-neutral-800/80 hover:bg-neutral-850 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isActive ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {page.isHome ? <Home className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-semibold truncate ${isActive ? 'text-amber-400' : 'text-neutral-200'}`}>
                        {page.title}
                      </span>
                      {page.isHome && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-medium">
                          Beranda
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 block truncate">
                      /{page.slug}
                    </span>
                  </div>
                </div>

                {/* Page Actions */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(page);
                    }}
                    className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                    title="Ubah Nama & Slug Halaman"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePage(page.id);
                      }}
                      className="p-1 text-neutral-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
                      title="Hapus Halaman"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Component count badge */}
              <div className="mt-2 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-neutral-500" />
                  {page.components.length} Komponen
                </span>
                {isActive && <span className="text-amber-400 font-medium">Sedang Disunting</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pages Footer Info */}
      <div className="p-2.5 border-t border-neutral-800 bg-neutral-950/60 text-[10px] text-neutral-500">
        💡 Setiap halaman memiliki susunan komponen mandiri yang tersimpan di proyek Anda.
      </div>
    </div>
  );
};
