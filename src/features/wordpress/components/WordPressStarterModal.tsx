/**
 * Nusantara Theme Builder — WordPress Starter Themes Modal
 * Katalog template awal siap pakai untuk berbagai tipe situs WordPress Block Theme
 * Lisensi: MIT
 */

import React from 'react';
import {
  WORDPRESS_STARTER_THEMES,
  WordPressStarterTemplate
} from '../data/starterThemes';
import { WordPressSettings } from '../types/wordpress';
import {
  Sparkles,
  Check,
  X,
  Layers,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface WordPressStarterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStarter: (settings: Partial<WordPressSettings>) => void;
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const WordPressStarterModal: React.FC<WordPressStarterModalProps> = ({
  isOpen,
  onClose,
  onSelectStarter,
  onToast
}) => {
  if (!isOpen) return null;

  const handleApply = (starter: WordPressStarterTemplate) => {
    const newSettings = starter.getSettings();
    onSelectStarter(newSettings);
    onToast('success', `Starter template "${starter.name}" berhasil diterapkan!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Pilih Starter Template WordPress
              </h3>
              <p className="text-[11px] text-neutral-400">
                Pilih desain awal untuk mempercepat perancangan tema WordPress Block Theme Anda.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grid of Starters */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {WORDPRESS_STARTER_THEMES.map((starter) => (
            <div
              key={starter.id}
              className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 hover:border-blue-500/40 hover:bg-neutral-900 transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: starter.previewColor }}
                    />
                    <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      {starter.name}
                    </h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20">
                    {starter.badge}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {starter.description}
                </p>

                <div className="space-y-1 pt-1">
                  {starter.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] text-neutral-300">
                      <Check className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleApply(starter)}
                className="w-full py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-semibold transition-all cursor-pointer border border-blue-500/30 flex items-center justify-center gap-1.5 mt-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gunakan Desain Ini</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-neutral-400 hover:text-white text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
