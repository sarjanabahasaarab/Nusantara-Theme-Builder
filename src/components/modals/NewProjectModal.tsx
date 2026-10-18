/**
 * Nusantara Theme Builder — New Project Modal
 * Dialog pembuatan proyek baru dengan validasi nama, pilihan target, dan starter template.
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { STARTER_TEMPLATES, StarterTemplateId } from '../../domain/project/project-factory';
import { validateProjectName } from '../../domain/project/project-validator';
import { TargetPlatform } from '../../types/project';
import { X, Sparkles, FolderPlus, Check, Globe } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlatform?: TargetPlatform;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  defaultPlatform = 'blogger'
}) => {
  const { createProject, addToast } = useProjectStore();
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<TargetPlatform>(defaultPlatform);
  const [selectedTemplate, setSelectedTemplate] = useState<StarterTemplateId>('personal-blog');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateProjectName(name);
    if (!check.isValid) {
      setValidationError(check.error || 'Nama proyek tidak valid.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      const ok = await createProject(name, platform, selectedTemplate);
      if (ok) {
        setName('');
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100">Buat Proyek Baru</h2>
              <p className="text-xs text-neutral-400">Inisialisasi tema dengan model skema lokal v1.0.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300">
              Nama Proyek <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Contoh: Majalah Sastra Nusantara, Berita Merdeka..."
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              autoFocus
            />
            {validationError && (
              <p className="text-xs text-rose-400 mt-1">{validationError}</p>
            )}
          </div>

          {/* Target Platform */}
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300">
              Target Platform Tema <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPlatform('blogger')}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  platform === 'blogger'
                    ? 'border-orange-500/80 bg-orange-500/10 text-white'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                    Blogger (Blogspot)
                  </span>
                  {platform === 'blogger' && <Check className="w-4 h-4 text-orange-400" />}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Arsitektur XML template, section <code className="text-orange-300">b:section</code>, dan widget bawaan Google Blogspot.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('wordpress')}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  platform === 'wordpress'
                    ? 'border-blue-500/80 bg-blue-500/10 text-white'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                    WordPress Theme
                  </span>
                  {platform === 'wordpress' && <Check className="w-4 h-4 text-blue-400" />}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Arsitektur modern FSE Block Theme (theme.json & template parts) dan Classic PHP theme.
                </p>
              </button>
            </div>
          </div>

          {/* Starter Template Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300">
                Pilih Starter Template (Fondasi Awal)
              </label>
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Model Data Phase 1
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STARTER_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-amber-500/70 bg-amber-500/10 text-neutral-100 ring-1 ring-amber-500/50'
                        : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-neutral-200">{tmpl.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {tmpl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-900/60">
          <div className="text-[11px] text-neutral-400">
            Penyimpanan lokal: <span className="text-neutral-300 font-mono">ntb_project_*</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg shadow-sm transition-all"
            >
              {isSubmitting ? 'Memproses...' : 'Buat Proyek'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
