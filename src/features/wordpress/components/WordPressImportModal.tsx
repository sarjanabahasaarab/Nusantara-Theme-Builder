/**
 * Nusantara Theme Builder — WordPress Import Modal
 * Mengimpor berkas konfigurasi theme.json atau header style.css ke dalam proyek aktif
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import { importWordPressFileContent } from '../importer/WordPressThemeImporter';
import { WordPressSettings } from '../types/wordpress';
import {
  Upload,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText
} from 'lucide-react';

interface WordPressImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyImport: (settings: Partial<WordPressSettings>) => void;
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const WordPressImportModal: React.FC<WordPressImportModalProps> = ({
  isOpen,
  onClose,
  onApplyImport,
  onToast
}) => {
  const [pasteContent, setPasteContent] = useState('');
  const [filename, setFilename] = useState('theme.json');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setPasteContent(text);
      setErrorMsg(null);
    };
    reader.readAsText(file);
  };

  const handleProcessImport = () => {
    if (!pasteContent.trim()) {
      setErrorMsg('Konten berkas tidak boleh kosong.');
      return;
    }

    const result = importWordPressFileContent(filename, pasteContent);
    if (!result.success) {
      setErrorMsg(result.message);
      return;
    }

    if (result.appliedSettings) {
      onApplyImport(result.appliedSettings);
      onToast('success', result.message);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Impor Berkas Tema WordPress
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 text-xs">
          <p className="text-neutral-400">
            Unggah atau tempelkan isi berkas <strong>theme.json</strong> (konfigurasi gaya global) atau <strong>style.css</strong> (metadata tema) untuk disinkronkan ke dalam proyek.
          </p>

          <div className="flex items-center gap-2">
            <label className="flex-1 px-3 py-2 border-2 border-dashed border-neutral-750 hover:border-blue-500 rounded-xl cursor-pointer text-center text-neutral-400 hover:text-white transition-colors bg-neutral-950/40">
              <Upload className="w-4 h-4 mx-auto mb-1 text-blue-400" />
              <span>Pilih Berkas theme.json / style.css</span>
              <input
                type="file"
                accept=".json,.css,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 text-neutral-400">
              <label>Atau Tempelkan Konten di Sini:</label>
              <span className="font-mono text-[10px] text-blue-400">Nama: {filename}</span>
            </div>
            <textarea
              value={pasteContent}
              onChange={(e) => {
                setPasteContent(e.target.value);
                setErrorMsg(null);
              }}
              rows={8}
              placeholder="Paste isi theme.json atau style.css..."
              className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-neutral-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white text-xs transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleProcessImport}
            disabled={!pasteContent.trim()}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Terapkan Konfigurasi
          </button>
        </div>
      </div>
    </div>
  );
};
