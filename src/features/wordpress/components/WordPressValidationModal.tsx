/**
 * Nusantara Theme Builder — WordPress Validation Modal
 * Laporan komprehensif uji standar tema WordPress (Theme Review Guidelines & Security)
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import {
  WordPressValidationResult,
  WordPressValidationItem
} from '../types/wordpress';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  ShieldCheck,
  FileCode,
  Check
} from 'lucide-react';

interface WordPressValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  validation: WordPressValidationResult;
}

export const WordPressValidationModal: React.FC<WordPressValidationModalProps> = ({
  isOpen,
  onClose,
  validation
}) => {
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  if (!isOpen) return null;

  const filteredItems = validation.items.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl h-[75vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                validation.isValid
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Laporan Uji Standar Tema WordPress
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono font-bold">
                  Skor: {validation.scorePercent}%
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Pemeriksaan kepatuhan terhadap WordPress Theme Review Team & Gutenberg FSE Standards.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills & Stats */}
        <div className="p-3 border-b border-neutral-800 bg-neutral-950/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Semua ({validation.items.length})
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                filter === 'error'
                  ? 'bg-red-500/20 text-red-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span>Galat ({validation.totalErrors})</span>
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                filter === 'warning'
                  ? 'bg-amber-500/20 text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Peringatan ({validation.totalWarnings})</span>
            </button>
            <button
              onClick={() => setFilter('info')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                filter === 'info'
                  ? 'bg-blue-500/20 text-blue-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Info className="w-3 h-3 text-blue-400" />
              <span>Informasi ({validation.totalInfo})</span>
            </button>
          </div>

          <span className="text-[11px] text-neutral-500 font-mono">
            {validation.isValid ? 'Tema Siap Produksi' : 'Perlu Penyesuaian'}
          </span>
        </div>

        {/* Validation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                item.type === 'error'
                  ? 'bg-red-950/20 border-red-800/40 text-red-200'
                  : item.type === 'warning'
                  ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                  : 'bg-blue-950/20 border-blue-800/40 text-blue-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {item.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  ) : item.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                  <span className="font-semibold">{item.message}</span>
                </div>
                {item.file && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-neutral-400 shrink-0">
                    {item.file}
                  </span>
                )}
              </div>

              <div className="pl-6 text-[11px] text-neutral-400">
                <strong className="text-neutral-300">Rekomendasi: </strong>
                {item.recommendation}
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-neutral-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-semibold text-white">Tidak ada masalah ditemukan</h4>
              <p className="text-xs text-neutral-500">
                Seluruh aturan pada filter ini terpenuhi dengan sempurna.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
