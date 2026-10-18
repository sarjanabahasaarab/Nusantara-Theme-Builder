/**
 * Nusantara Theme Builder — Assets Tab in Visual Editor
 * Integrasi aset proyek Phase 2 langsung ke dalam alur kerja editor visual
 */

import React, { useRef } from 'react';
import { useProjectStore } from '../../../stores/useProjectStore';
import { createComponent } from '../../../domain/project/project-factory';
import {
  Image as ImageIcon,
  Upload,
  Plus,
  ArrowRight,
  Sparkles,
  FileText,
  Trash2
} from 'lucide-react';
import { ProjectAsset } from '../../../types/project';

export const AssetsTab: React.FC = () => {
  const {
    currentProject,
    selectedComponentId,
    updateComponent,
    addComponent,
    uploadAssetFile,
    deleteAsset,
    addToast
  } = useProjectStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentProject) return null;

  const assets = currentProject.assets || [];
  const imageAssets = assets.filter((a) => a.type === 'image' || a.type === 'svg');

  const activePage = currentProject.pages[0];
  const selectedComp = activePage?.components.find((c) => c.id === selectedComponentId);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      await uploadAssetFile(files[i]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyToSelectedComponent = (asset: ProjectAsset) => {
    if (!selectedComp) {
      addToast('warning', 'Pilih komponen di kanvas terlebih dahulu untuk memasukkan aset.');
      return;
    }

    const url = asset.dataUrl || asset.path;
    // Check if component supports imageUrl or backgroundImage
    updateComponent(selectedComp.id, {
      props: {
        ...selectedComp.props,
        imageUrl: url,
        alt: asset.name
      }
    });

    addToast('success', `Aset "${asset.name}" diterapkan ke komponen "${selectedComp.label}".`);
  };

  const handleInsertAsNewImageComponent = (asset: ProjectAsset) => {
    const url = asset.dataUrl || asset.path;
    const newComp = createComponent(
      'media-image',
      `Gambar: ${asset.name}`,
      'media',
      {
        imageUrl: url,
        alt: asset.name,
        caption: `Aset proyek: ${asset.name}`
      },
      {
        padding: '1rem',
        textAlign: 'center',
        borderRadius: '0.5rem'
      }
    );

    addComponent(newComp);
    addToast('success', `Komponen gambar baru dengan aset "${asset.name}" ditambahkan ke kanvas.`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Upload Header */}
      <div className="p-3 border-b border-neutral-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-300">Aset Media Proyek</span>
          <span className="text-[10px] font-mono text-neutral-500">{imageAssets.length} Gambar</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2 px-3 rounded-lg border border-dashed border-neutral-700 bg-neutral-950 hover:bg-neutral-900 hover:border-amber-400/60 text-xs font-medium text-neutral-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          <span>Unggah Gambar Lokal</span>
        </button>
      </div>

      {/* Assets Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {imageAssets.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 space-y-2">
            <ImageIcon className="w-8 h-8 mx-auto text-neutral-600" />
            <p className="text-xs">Belum ada aset gambar di proyek ini.</p>
            <p className="text-[11px] text-neutral-600">
              Klik tombol unggah di atas untuk menambahkan gambar atau foto ke tema Anda.
            </p>
          </div>
        ) : (
          imageAssets.map((asset) => (
            <div
              key={asset.id}
              className="p-2.5 rounded-xl border border-neutral-800/80 bg-neutral-900/50 hover:border-neutral-700 space-y-2 text-xs"
            >
              {/* Asset Preview Thumbnail */}
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
                  {asset.dataUrl ? (
                    <img src={asset.dataUrl} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-neutral-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-200 truncate text-xs">{asset.name}</p>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    {(asset.sizeBytes / 1024).toFixed(1)} KB • {asset.mimeType.replace('image/', '')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={() => handleApplyToSelectedComponent(asset)}
                  className="px-2 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] font-medium text-neutral-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title={
                    selectedComp
                      ? `Terapkan ke ${selectedComp.label}`
                      : 'Pilih komponen di kanvas terlebih dahulu'
                  }
                >
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="truncate">Terapkan</span>
                </button>

                <button
                  onClick={() => handleInsertAsNewImageComponent(asset)}
                  className="px-2 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-[11px] font-medium text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Sisipkan sebagai komponen gambar baru di halaman"
                >
                  <Plus className="w-3 h-3" />
                  <span className="truncate">Gambar Baru</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Status */}
      <div className="p-2.5 border-t border-neutral-800 bg-neutral-950/60 text-[10px] text-neutral-500">
        {selectedComp ? (
          <span className="text-amber-400">
            ✓ Komponen aktif: <strong>{selectedComp.label}</strong>
          </span>
        ) : (
          <span>Pilih komponen di kanvas untuk menerapkan gambar.</span>
        )}
      </div>
    </div>
  );
};
