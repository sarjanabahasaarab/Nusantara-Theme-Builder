/**
 * Nusantara Theme Builder — Asset Picker Modal
 * Modal pemilih aset proyek untuk komponen media dan latar belakang
 */

import React from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { X, Image as ImageIcon, Check } from 'lucide-react';
import { ProjectAsset } from '../../../types/project';

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: ProjectAsset) => void;
  selectedUrl?: string;
}

export const AssetPickerModal: React.FC<AssetPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
  selectedUrl
}) => {
  const { currentProject } = useProjectStore();

  if (!isOpen || !currentProject) return null;

  const assets = (currentProject.assets || []).filter(
    (a) => a.type === 'image' || a.type === 'svg'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-neutral-100">Pilih Aset Gambar Proyek</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Assets Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {assets.length === 0 ? (
            <div className="col-span-full py-12 text-center text-neutral-500 space-y-2">
              <ImageIcon className="w-8 h-8 mx-auto text-neutral-600" />
              <p className="text-xs">Belum ada aset gambar tersimpan di proyek.</p>
              <p className="text-[11px] text-neutral-600">
                Gunakan tab "Aset" di panel kiri untuk mengunggah gambar.
              </p>
            </div>
          ) : (
            assets.map((asset) => {
              const url = asset.dataUrl || asset.path;
              const isSelected = selectedUrl === url;

              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className={`group relative rounded-lg border overflow-hidden cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/40 bg-neutral-950'
                      : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/60'
                  }`}
                >
                  <div className="h-28 w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
                    {asset.dataUrl ? (
                      <img src={asset.dataUrl} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-neutral-600" />
                    )}
                  </div>
                  <div className="p-2 border-t border-neutral-800/80">
                    <p className="text-[11px] font-medium text-neutral-200 truncate">{asset.name}</p>
                    <p className="text-[9px] font-mono text-neutral-500">{(asset.sizeBytes / 1024).toFixed(1)} KB</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
