/**
 * Nusantara Theme Builder — WordPress Patterns Tab
 * Koleksi Block Patterns siap pakai untuk template WordPress Gutenberg
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import { WordPressBlockPattern } from '../types/wordpress';
import {
  Sparkles,
  Layers,
  Copy,
  Plus,
  Check,
  FileCode,
  Tag
} from 'lucide-react';

interface WordPressPatternsTabProps {
  patterns: WordPressBlockPattern[];
  onInsertPattern: (pattern: WordPressBlockPattern) => void;
  activeTemplateTitle: string;
}

export const WordPressPatternsTab: React.FC<WordPressPatternsTabProps> = ({
  patterns,
  onInsertPattern,
  activeTemplateTitle
}) => {
  const [selectedPattern, setSelectedPattern] = useState<WordPressBlockPattern | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCopy = (pattern: WordPressBlockPattern) => {
    navigator.clipboard.writeText(pattern.content);
    setCopiedSlug(pattern.name);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-900/40">
      {/* Header */}
      <div className="p-3 border-b border-neutral-800 bg-neutral-950/60 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Koleksi Block Patterns</span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
          {patterns.length} Pola
        </span>
      </div>

      {/* Pattern List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
        {patterns.map((pat) => (
          <div
            key={pat.name}
            className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:border-neutral-700 transition-all space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-semibold text-neutral-200">
                  {pat.title}
                </h4>
                <span className="text-[10px] font-mono text-neutral-500">
                  patterns/{pat.name}.php
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(pat)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Salin Markup Blok"
                >
                  {copiedSlug === pat.name ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onInsertPattern(pat)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  title={`Sisipkan pattern ini ke dalam ${activeTemplateTitle}`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Sisipkan</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-tight">
              {pat.description}
            </p>

            <div className="flex flex-wrap items-center gap-1 pt-1">
              {pat.categories.map((c) => (
                <span
                  key={c}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}

        {patterns.length === 0 && (
          <div className="text-center py-10 text-xs text-neutral-500">
            Belum ada block pattern.
          </div>
        )}
      </div>
    </div>
  );
};
