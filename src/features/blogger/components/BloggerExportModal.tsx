/**
 * Nusantara Theme Builder — Blogger Export Modal
 * Modal Ekspor File Tema Blogger (.xml) dengan Pemeriksaan Pra-Ekspor & Encoding UTF-8
 * Lisensi: MIT
 */

import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { BloggerExportService, PreExportCheck } from '../exporter/BloggerExportService';
import {
  X,
  Download,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCode,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface BloggerExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BloggerExportModal: React.FC<BloggerExportModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentProject, addToast } = useProjectStore();
  const [fileName, setFileName] = useState('');
  const [checkResult, setCheckResult] = useState<PreExportCheck | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isOpen && currentProject) {
      const check = BloggerExportService.performPreExportCheck(currentProject);
      setCheckResult(check);
      setFileName(check.suggestedFileName);
    }
  }, [isOpen, currentProject]);

  if (!isOpen || !currentProject) return null;

  const handleCopyXml = () => {
    if (!checkResult) return;
    navigator.clipboard.writeText(checkResult.generation.xml);
    setCopied(true);
    addToast('info', 'Kode XML Blogger disalin ke clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!checkResult) return;
    setIsExporting(true);

    const success = BloggerExportService.exportToFile(
      checkResult.generation.xml,
      fileName || checkResult.suggestedFileName
    );

    if (success) {
      addToast(
        'success',
        `File tema Blogger "${fileName}" berhasil diekspor (Encoding UTF-8).`
      );
      onClose();
    } else {
      addToast('error', 'Gagal menyimpan berkas XML tema.');
    }
    setIsExporting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-100">
                Ekspor Tema Blogger XML
              </h2>
              <p className="text-[11px] text-neutral-400">
                Dokumen XML siap diunggah melalui menu Tema &gt; Cadangkan/Pulihkan di Blogger
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-neutral-300">
          {/* File Name Configuration */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-200">Nama File Hasil Ekspor</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 font-mono text-xs focus:border-orange-500 outline-none"
              />
              <span className="text-[11px] font-mono text-neutral-500 shrink-0">
                {(checkResult ? checkResult.fileSizeBytes / 1024 : 0).toFixed(1)} KB (UTF-8)
              </span>
            </div>
          </div>

          {/* Pre-export Check Results */}
          {checkResult && (
            <div className="space-y-3">
              {checkResult.canExport ? (
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-bold">Lolos Uji Validasi XML & Struktur</h4>
                    <p className="text-[11px] text-emerald-400/80">
                      Sintaks XML well-formed dan elemen wajib Blogger (b:skin, b:section, widget Blog) telah lengkap.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 text-rose-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>Perhatian: Ditemukan Galat Kritis</span>
                  </div>
                  <ul className="text-[11px] space-y-1 text-rose-200 list-disc list-inside">
                    {checkResult.blockers.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings Summary */}
              {checkResult.warnings.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-300 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Catatan & Peringatan Pra-Ekspor ({checkResult.warnings.length}):</span>
                  </div>
                  <ul className="text-[11px] space-y-1 text-amber-200/90 list-disc list-inside">
                    {checkResult.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* XML Code Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-300">
                    Pratinjau Dokumen XML Terkompilasi
                  </span>
                  <button
                    onClick={handleCopyXml}
                    className="flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Tersalin' : 'Salin Kode XML'}</span>
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto p-3 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-[10px] text-neutral-400 leading-relaxed select-all">
                  <pre>{checkResult.generation.xml.substring(0, 1500)}...</pre>
                </div>
              </div>

              {/* Instructions on Uploading to Blogger */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <h5 className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  Cara Memasang di Dashboard Blogger:
                </h5>
                <ol className="text-[11px] text-neutral-400 space-y-1 list-decimal list-inside leading-relaxed">
                  <li>Unduh berkas <code>.xml</code> tema melalui tombol di bawah.</li>
                  <li>Buka <strong>blogger.com</strong> dan pilih blog Anda.</li>
                  <li>Buka menu <strong>Tema</strong> di bilah navigasi kiri.</li>
                  <li>Klik tombol panah di sebelah <strong>Sesuaikan</strong>, lalu pilih <strong>Pulihkan (Restore)</strong>.</li>
                  <li>Pilih file <code>.xml</code> yang baru saja Anda ekspor.</li>
                  <li>Simpan tema cadangan lama Anda terlebih dahulu untuk keamanan.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-900/60 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            onClick={handleDownload}
            disabled={!checkResult || !checkResult.canExport || isExporting}
            className="px-5 py-2 text-xs font-bold text-neutral-950 bg-orange-500 hover:bg-orange-400 disabled:opacity-30 rounded-lg transition-all cursor-pointer shadow flex items-center gap-2 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Unduh File .xml</span>
          </button>
        </div>
      </div>
    </div>
  );
};
