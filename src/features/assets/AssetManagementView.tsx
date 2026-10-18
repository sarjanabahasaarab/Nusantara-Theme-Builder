/**
 * Nusantara Theme Builder — Asset Management View (Phase 2)
 * Pengelolaan aset proyek lokal: gambar, SVG aman, font, CSS, dan skrip.
 * Fitur: upload berkas, pratinjau instan, pencegahan tabrakan nama,
 * pemeriksaan ukuran aman (maks 5 MB), dan penghapusan referensi.
 */

import React, { useState, useRef } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { ProjectAsset, AssetType } from '../../types/project';
import { assetService } from '../../services/asset-service';
import {
  Image,
  FileCode,
  Type,
  FileText,
  Upload,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  X,
  Search,
  Filter,
  HardDrive
} from 'lucide-react';

export const AssetManagementView: React.FC = () => {
  const { currentProject, uploadAssetFile, deleteAsset, addToast } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | AssetType>('all');
  const [assetPreviewModal, setAssetPreviewModal] = useState<ProjectAsset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<ProjectAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-400 text-xs">
        <Image className="w-12 h-12 text-neutral-600 mb-3" />
        <p className="font-semibold text-neutral-200">Tidak ada proyek yang aktif</p>
        <p className="text-neutral-500 mt-1">Buka atau buat proyek terlebih dahulu untuk mengelola aset.</p>
      </div>
    );
  }

  const assets = currentProject.assets || [];

  const filteredAssets = assets.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || a.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ok = await uploadAssetFile(file);
      if (ok) successCount++;
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const totalAssetBytes = assets.reduce((sum, a) => sum + (a.sizeBytes || 0), 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Pengelola Aset Proyek</h1>
          <p className="text-xs text-neutral-400">
            Aset lokal untuk "{currentProject.name}" (gambar, font, css, dan skrip pendukung).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.svg,.woff,.woff2,.ttf,.otf,.css,.js,.html,.txt,.md"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Mengunggah...' : 'Unggah Aset'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Image className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-medium">Total Aset</span>
            <span className="text-sm font-bold text-white block">{assets.length} Berkas</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-medium">Ukuran Aset</span>
            <span className="text-sm font-bold text-white block">
              {assetService.formatBytes(totalAssetBytes)}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-medium">Pemeriksaan Keamanan</span>
            <span className="text-sm font-semibold text-emerald-400 block">Sanitasi SVG Aktif</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari aset berdasarkan nama berkas..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              filterType === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Semua ({assets.length})
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              filterType === 'image' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Gambar
          </button>
          <button
            onClick={() => setFilterType('svg')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              filterType === 'svg' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            SVG
          </button>
          <button
            onClick={() => setFilterType('font')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              filterType === 'font' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Font
          </button>
          <button
            onClick={() => setFilterType('css')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              filterType === 'css' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Gaya & Skrip
          </button>
        </div>
      </div>

      {/* Asset Grid */}
      {filteredAssets.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-neutral-900/40 border border-dashed border-neutral-800 space-y-3">
          <FolderOpen className="w-10 h-10 mx-auto text-neutral-600" />
          <p className="text-xs text-neutral-400">Belum ada aset dalam kategori ini.</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Unggah Aset Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => {
            const isImage = asset.type === 'image' || asset.type === 'svg';
            let Icon = FileText;
            if (asset.type === 'font') Icon = Type;
            else if (asset.type === 'css' || asset.type === 'js') Icon = FileCode;

            return (
              <div
                key={asset.id}
                className="group p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                {/* Thumbnail / Icon area */}
                <div
                  onClick={() => setAssetPreviewModal(asset)}
                  className="w-full h-28 rounded-lg bg-neutral-950 border border-neutral-800/80 flex items-center justify-center overflow-hidden cursor-pointer group-hover:border-neutral-600 transition-all relative"
                >
                  {isImage && asset.dataUrl ? (
                    <img
                      src={asset.dataUrl}
                      alt={asset.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <Icon className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-mono uppercase">{asset.type}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Details */}
                <div className="pt-2.5 space-y-1">
                  <span className="text-xs font-semibold text-neutral-200 block truncate" title={asset.name}>
                    {asset.name}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                    <span className="uppercase">{asset.type}</span>
                    <span>{assetService.formatBytes(asset.sizeBytes)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-neutral-850">
                  <span className="text-[9px] text-neutral-500 font-mono truncate max-w-[80px]">
                    {asset.path}
                  </span>
                  <button
                    onClick={() => setAssetToDelete(asset)}
                    className="p-1 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                    title="Hapus Aset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Asset Preview Modal */}
      {assetPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-white font-semibold">{assetPreviewModal.name}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">{assetService.formatBytes(assetPreviewModal.sizeBytes)}</span>
              </div>
              <button
                onClick={() => setAssetPreviewModal(null)}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto flex items-center justify-center bg-neutral-950 p-4 rounded-lg border border-neutral-800">
              {assetPreviewModal.dataUrl ? (
                <img
                  src={assetPreviewModal.dataUrl}
                  alt={assetPreviewModal.name}
                  className="max-h-96 object-contain"
                />
              ) : (
                <pre className="p-3 text-[11px] font-mono text-neutral-300 w-full overflow-x-auto whitespace-pre-wrap select-text">
                  {assetPreviewModal.content || '// Berkas biner tidak memiliki pratinjau teks'}
                </pre>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setAssetPreviewModal(null)}
                className="px-4 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {assetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Hapus Referensi Aset?</h3>
                <p className="text-xs text-neutral-400">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 bg-neutral-950 p-3 rounded-lg border border-neutral-800">
              Aset <strong className="text-white">"{assetToDelete.name}"</strong> akan dihapus dari proyek ini.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAssetToDelete(null)}
                className="px-4 py-2 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteAsset(assetToDelete.id);
                  setAssetToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg cursor-pointer"
              >
                Ya, Hapus Aset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
