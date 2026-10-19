/**
 * Nusantara Theme Builder — Blogger Import Modal
 * Modal Impor File Tema Blogger XML secara aman (anti-XXE, isolasi script)
 * Lisensi: MIT
 */

import React, { useState, useRef } from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { BloggerThemeImporter } from '../importer/BloggerThemeImporter';
import { BloggerImportResult } from '../types/blogger';
import {
  X,
  Upload,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Layers,
  Palette
} from 'lucide-react';

interface BloggerImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BloggerImportModal: React.FC<BloggerImportModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentProject, updateThemeSettings, addToast } = useProjectStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [xmlContent, setXmlContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [importResult, setImportResult] = useState<BloggerImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xml')) {
      addToast('error', 'Silakan pilih file dengan ekstensi .xml');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result || '');
      setXmlContent(content);
      const result = BloggerThemeImporter.importXml(content, currentProject);
      setImportResult(result);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      addToast('error', 'Gagal membaca berkas XML.');
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    if (!importResult || !importResult.success || !currentProject) return;

    // Apply extracted theme settings
    if (importResult.extractedSettings) {
      updateThemeSettings({
        primaryColor: importResult.extractedSettings.appearance?.primaryColor || currentProject.themeSettings.primaryColor,
        secondaryColor: importResult.extractedSettings.appearance?.secondaryColor || currentProject.themeSettings.secondaryColor,
        backgroundColor: importResult.extractedSettings.appearance?.backgroundColor || currentProject.themeSettings.backgroundColor,
        textColor: importResult.extractedSettings.appearance?.textColor || currentProject.themeSettings.textColor,
        bloggerSettings: {
          ...currentProject.themeSettings.bloggerSettings,
          ...importResult.extractedSettings
        }
      });
    }

    // Replace or append components
    const activePage = currentProject.pages[0];
    if (activePage && importResult.mappedComponents.length > 0) {
      const store = useProjectStore.getState();
      // Update page components
      store.updatePage(activePage.id, {
        components: importResult.mappedComponents
      });
    }

    addToast(
      'success',
      `Tema Blogger "${fileName || 'XML'}" berhasil diimpor dengan ${importResult.mappedComponents.length} komponen.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-100">
                Impor Template Blogger XML
              </h2>
              <p className="text-[11px] text-neutral-400">
                Parsing aman berkas .xml, ekstraksi widget Blogger, dan sinkronisasi ke kanvas
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
          {/* File Picker Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 border-2 border-dashed border-neutral-700 hover:border-orange-500 rounded-xl text-center cursor-pointer transition-colors bg-neutral-950/40 hover:bg-neutral-950 space-y-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xml,text/xml"
              className="hidden"
            />
            <FileCode className="w-8 h-8 mx-auto text-neutral-500" />
            <div>
              <span className="font-semibold text-neutral-200">
                {fileName ? fileName : 'Klik untuk Memilih File .xml Tema Blogger'}
              </span>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Maksimum ukuran aman 5 MB · Eksekusi JavaScript ditiadakan demi keamanan
              </p>
            </div>
          </div>

          {/* Import Inspection Results */}
          {importResult && (
            <div className="space-y-4 pt-2">
              {importResult.success ? (
                <>
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-center gap-3 text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="font-bold">Template Blogger Dikenali</h4>
                      <p className="text-[11px] text-emerald-400/80">
                        File berhasil diparsing tanpa eksekusi skrip berisiko.
                      </p>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                      <span className="text-[10px] text-neutral-500 block">Ukuran File</span>
                      <span className="font-mono font-bold text-neutral-200">
                        {(importResult.rawXmlLength / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                      <span className="text-[10px] text-neutral-500 block">Section Blogger</span>
                      <span className="font-mono font-bold text-neutral-200">
                        {importResult.sectionsCount}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                      <span className="text-[10px] text-neutral-500 block">Widget Terdeteksi</span>
                      <span className="font-mono font-bold text-neutral-200">
                        {importResult.widgetsCount}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                      <span className="text-[10px] text-neutral-500 block">Komponen Siap</span>
                      <span className="font-mono font-bold text-neutral-200">
                        {importResult.mappedComponents.length}
                      </span>
                    </div>
                  </div>

                  {/* Detected Widgets Tag List */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-neutral-300">Tipe Widget Terdeteksi:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {importResult.detectedWidgetTypes.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px]"
                        >
                          &lt;b:widget type="{t}"&gt;
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Warnings & Honesty Notice */}
                  {importResult.warnings.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-300 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Keterbatasan Impor (Transparan):</span>
                      </div>
                      <ul className="text-[11px] space-y-1 text-amber-200/90 list-disc list-inside">
                        {importResult.warnings.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 text-rose-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>Gagal Mengimpor File XML</span>
                  </div>
                  <ul className="text-[11px] space-y-1 text-rose-200 list-disc list-inside">
                    {importResult.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
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
            onClick={handleApplyImport}
            disabled={!importResult || !importResult.success}
            className="px-4 py-2 text-xs font-bold text-neutral-950 bg-orange-500 hover:bg-orange-400 disabled:opacity-30 rounded-lg transition-colors cursor-pointer shadow disabled:cursor-not-allowed"
          >
            Terapkan ke Proyek Aktif
          </button>
        </div>
      </div>
    </div>
  );
};
