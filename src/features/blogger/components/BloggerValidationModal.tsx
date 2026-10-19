/**
 * Nusantara Theme Builder — Blogger Validation Modal
 * Modal Hasil Validasi 3 Tingkat: Sintaks XML, Struktur Template Blogger, Kualitas & SEO
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { BloggerThemeGenerator } from '../generator/BloggerThemeGenerator';
import { BloggerThemeValidator } from '../validator/BloggerThemeValidator';
import { ValidationReport, ValidationItem } from '../types/blogger';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw,
  Code2,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

interface BloggerValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BloggerValidationModal: React.FC<BloggerValidationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentProject } = useProjectStore();
  const [activeCategory, setActiveCategory] = useState<'all' | 'syntax' | 'template' | 'quality_seo'>('all');
  const [report, setReport] = useState<ValidationReport | null>(null);

  // Run validation whenever modal opens or refreshes
  React.useEffect(() => {
    if (isOpen && currentProject) {
      runValidation();
    }
  }, [isOpen, currentProject]);

  const runValidation = () => {
    if (!currentProject) return;
    const { xml } = BloggerThemeGenerator.generate(currentProject);
    const result = BloggerThemeValidator.validate(xml);
    setReport(result);
  };

  if (!isOpen || !currentProject) return null;

  const allItems: ValidationItem[] = report
    ? [...report.syntaxErrors, ...report.templateIssues, ...report.qualityIssues]
    : [];

  const filteredItems = allItems.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-100">
                Pemeriksaan & Validasi XML Blogger
              </h2>
              <p className="text-[11px] text-neutral-400">
                Evaluasi 3 tingkat: Sintaks XML, Struktur Template Blogger, dan Kualitas SEO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runValidation}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              title="Periksa Ulang Template"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overall Status Banner */}
        {report && (
          <div className="px-6 py-3 border-b border-neutral-800 shrink-0">
            {report.totalErrors === 0 ? (
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs flex items-center justify-between text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold block">Sintaks & Struktur Siap Ekspor</span>
                    <span className="text-[11px] text-emerald-400/80">
                      Tidak ditemukan galat kritis yang menghalangi pembentukan file XML.
                    </span>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-neutral-400">
                  {report.totalWarnings} Peringatan · {report.totalInfos} Rekomendasi
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs flex items-center justify-between text-rose-300">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="font-bold block">Ditemukan {report.totalErrors} Galat Kritis</span>
                    <span className="text-[11px] text-rose-300/80">
                      Perbaiki masalah sebelum mengekspor atau mengunggah tema ke dashboard Blogger.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                  Belum Siap Ekspor
                </span>
              </div>
            )}
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 border-b border-neutral-800 bg-neutral-950/40 text-xs shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
              activeCategory === 'all'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Semua ({allItems.length})
          </button>
          <button
            onClick={() => setActiveCategory('syntax')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
              activeCategory === 'syntax'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Sintaks XML ({report?.syntaxErrors.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveCategory('template')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
              activeCategory === 'template'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-orange-400" />
            <span>Struktur Blogger ({report?.templateIssues.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveCategory('quality_seo')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
              activeCategory === 'quality_seo'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kualitas & SEO ({report?.qualityIssues.length || 0})</span>
          </button>
        </div>

        {/* Validation Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500/50 mx-auto" />
              <p className="text-sm font-semibold text-neutral-300">Tidak ada masalah pada kategori ini</p>
              <p className="text-xs text-neutral-500">
                Semua aturan pemeriksaan pada kelompok ini terpenuhi dengan baik.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  item.severity === 'error'
                    ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                    : item.severity === 'warning'
                    ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                    : 'bg-blue-950/20 border-blue-800/40 text-blue-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.severity === 'error' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    {item.severity === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    {item.severity === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
                    <h4 className="font-bold">{item.title}</h4>
                  </div>

                  {item.location && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                      {item.location}
                    </span>
                  )}
                </div>

                <p className="text-[11px] opacity-90 leading-relaxed pl-6">{item.message}</p>

                {item.suggestion && (
                  <div className="ml-6 mt-1 p-2 rounded bg-neutral-950/80 border border-neutral-800/60 text-[11px] text-neutral-300 flex items-start gap-1.5">
                    <span className="font-bold text-orange-400 shrink-0">Saran:</span>
                    <span>{item.suggestion}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-800 bg-neutral-900/60 shrink-0 text-xs">
          <span className="text-[11px] text-neutral-500">
            Perhatian: Pengujian akhir disarankan dilakukan di blog uji coba Blogger sebelum mengganti tema aktif.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-neutral-950 bg-neutral-200 hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
