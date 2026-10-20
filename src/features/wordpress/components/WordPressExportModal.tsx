/**
 * Nusantara Theme Builder — WordPress Export Modal
 * Ekspor file .zip tema WordPress siap pasang di wp-admin dengan inspektur berkas
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import {
  WordPressThemePackage,
  WordPressGeneratedFile
} from '../types/wordpress';
import {
  createWordPressZipBlob,
  downloadWordPressZip
} from '../exporter/WordPressZipExporter';
import {
  Download,
  CheckCircle2,
  FileCode,
  FolderTree,
  Copy,
  Check,
  X,
  ExternalLink,
  PackageCheck,
  AlertCircle
} from 'lucide-react';

interface WordPressExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  themePackage: WordPressThemePackage;
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const WordPressExportModal: React.FC<WordPressExportModalProps> = ({
  isOpen,
  onClose,
  themePackage,
  onToast
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile: WordPressGeneratedFile | undefined = themePackage.files[selectedFileIndex];

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zipBlob = await createWordPressZipBlob(themePackage);
      downloadWordPressZip(zipBlob, `${themePackage.themeSlug}.zip`);
      onToast('success', `Tema "${themePackage.themeName}" berhasil dikemas ke dalam berkas ${themePackage.themeSlug}.zip!`);
    } catch (err: any) {
      onToast('error', `Gagal mengekspor ZIP: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCode = () => {
    if (!currentFile || typeof currentFile.content !== 'string') return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Ekspor Paket Tema WordPress (.zip)
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
                  {themePackage.themeSlug}.zip
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Paket tema WordPress standar dengan total {themePackage.summary.totalFiles} berkas (
                {Math.round(themePackage.summary.totalBytes / 1024)} KB).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-900/30"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Mengompresi ZIP...' : 'Unduh File .ZIP'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content: File Tree & Code Viewer */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree Sidebar */}
          <aside className="w-64 border-r border-neutral-800 bg-neutral-950/50 flex flex-col shrink-0 overflow-hidden">
            <div className="p-2.5 border-b border-neutral-800 text-[11px] font-mono font-semibold text-neutral-400 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-blue-400" />
              <span>Struktur Berkas Tema</span>
            </div>

            <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
              {themePackage.files.map((file, idx) => {
                const isSelected = idx === selectedFileIndex;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                    }`}
                  >
                    <span className="truncate">{file.path}</span>
                    <span className="text-[10px] text-neutral-600">
                      {Math.round(file.sizeBytes / 1024 * 10) / 10}k
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Petunjuk Instalasi */}
            <div className="p-3 border-t border-neutral-800 bg-neutral-950 text-[10px] text-neutral-400 space-y-1">
              <span className="font-semibold text-neutral-300 block">Cara Pasang di wp-admin:</span>
              <p>1. Buka <strong>Appearance &gt; Themes</strong></p>
              <p>2. Klik <strong>Add New &gt; Upload Theme</strong></p>
              <p>3. Unggah file <strong>{themePackage.themeSlug}.zip</strong></p>
              <p>4. Klik <strong>Activate</strong></p>
            </div>
          </aside>

          {/* Code Viewer */}
          <main className="flex-1 flex flex-col overflow-hidden bg-neutral-950">
            {currentFile ? (
              <>
                <div className="p-2.5 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-mono font-semibold text-neutral-200">
                      {currentFile.path}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      ({currentFile.category})
                    </span>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin Kode'}</span>
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-4">
                  <pre className="text-xs font-mono text-neutral-300 whitespace-pre leading-relaxed">
                    {typeof currentFile.content === 'string'
                      ? currentFile.content
                      : '[Berkas Biner]'}
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-neutral-500">
                Pilih berkas di sebelah kiri untuk melihat isinya.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
