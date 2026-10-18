/**
 * Nusantara Theme Builder — Import Project Modal
 * Dialog impor proyek JSON dengan validasi struktur skema v1.0.0,
 * pengecekan ukuran file, dan perlindungan dari file rusak.
 */

import React, { useState, useRef } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { validationService } from '../../services/validation-service';
import { ValidationResult } from '../../domain/project/project-validator';
import { X, Upload, FileCode, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

interface ImportProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportProjectModal: React.FC<ImportProjectModalProps> = ({ isOpen, onClose }) => {
  const { importProjectFromJson } = useProjectStore();
  const [jsonContent, setJsonContent] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonContent(content);
      const res = validationService.parseAndValidateProjectJson(content);
      setValidation(res.validation);
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonContent(text);
    if (text.trim().length > 0) {
      const res = validationService.parseAndValidateProjectJson(text);
      setValidation(res.validation);
    } else {
      setValidation(null);
    }
  };

  const handleImport = async () => {
    if (!validation?.isValid || !jsonContent.trim()) return;

    setIsProcessing(true);
    try {
      const result = await importProjectFromJson(jsonContent);
      if (result.success) {
        onClose();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-100">Impor Proyek</h2>
              <p className="text-xs text-neutral-400">Unggah file JSON proyek Nusantara Theme Builder</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* File input dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-700 hover:border-neutral-500 bg-neutral-950/50 hover:bg-neutral-950 rounded-xl p-6 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".ntbproject,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <FileCode className="w-8 h-8 mx-auto text-neutral-400 group-hover:text-blue-400 transition-colors mb-2" />
            <p className="text-xs font-medium text-neutral-200">
              {fileName ? fileName : 'Klik untuk memilih berkas .ntbproject atau .json'}
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Maksimal 10 MB per file format proyek internal v1.0.0</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-900 px-2 text-neutral-500">atau tempel kode JSON .ntbproject</span>
            </div>
          </div>

          {/* Paste area */}
          <textarea
            value={jsonContent}
            onChange={handleTextChange}
            placeholder='{"schemaVersion": "1.0.0", "id": "...", ...}'
            rows={5}
            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-200 placeholder-neutral-600 rounded-lg focus:outline-none focus:border-blue-500"
          />

          {/* Validation Feedback */}
          {validation && (
            <div
              className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                validation.isValid
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                {validation.isValid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Format JSON dan skema v1.0.0 valid!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Ditemukan kesalahan pada file:</span>
                  </>
                )}
              </div>

              {!validation.isValid && (
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-200 pl-1">
                  {validation.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}

              {validation.warnings.length > 0 && (
                <div className="text-amber-300 text-[11px] flex items-start gap-1 pt-1 border-t border-amber-900/40 mt-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span>Peringatan: {validation.warnings.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-900/60">
          <div className="text-[11px] text-neutral-500">Pemeriksaan anti-timpa aktif</div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleImport}
              disabled={!validation?.isValid || isProcessing}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-lg shadow-sm transition-all"
            >
              {isProcessing ? 'Mengimpor...' : 'Impor Proyek'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
