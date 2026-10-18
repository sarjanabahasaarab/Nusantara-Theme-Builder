/**
 * Nusantara Theme Builder — Duplicate Project Modal
 * Dialog untuk menggandakan proyek dengan nama baru tanpa berbagi state.
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { validateProjectName } from '../../domain/project/project-validator';
import { Copy, X, AlertCircle } from 'lucide-react';

interface DuplicateProjectModalProps {
  isOpen: boolean;
  projectId: string;
  originalName: string;
  onClose: () => void;
}

export const DuplicateProjectModal: React.FC<DuplicateProjectModalProps> = ({
  isOpen,
  projectId,
  originalName,
  onClose
}) => {
  const { duplicateProject } = useProjectStore();
  const [name, setName] = useState(`${originalName} (Salinan)`);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateProjectName(name);
    if (!check.isValid) {
      setError(check.error || 'Nama proyek duplikat tidak valid.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await duplicateProject(projectId, name);
      if (ok) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              <Copy className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-100">Gandakan Proyek</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-neutral-400">
            Seluruh halaman, komponen, berkas, dan aset akan disalin secara independen dengan ID unik baru.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs text-neutral-300 font-medium block">Nama Proyek Duplikat</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg shadow transition-all cursor-pointer"
            >
              {isSubmitting ? 'Menggandakan...' : 'Gandakan Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
