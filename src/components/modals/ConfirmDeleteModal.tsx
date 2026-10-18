/**
 * Nusantara Theme Builder — Confirm Delete Modal
 * Dialog konfirmasi aman sebelum menghapus proyek dari penyimpanan lokal.
 */

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  projectName,
  onConfirm,
  onCancel,
  isDeleting = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-100">Hapus Proyek Ini?</h3>
            <p className="text-xs text-neutral-400">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-800">
          Proyek <strong className="text-white font-medium">"{projectName}"</strong> beserta seluruh konfigurasi dan komponen halamannya akan dihapus secara permanen dari penyimpanan lokal Anda.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Proyek'}
          </button>
        </div>
      </div>
    </div>
  );
};
