/**
 * Nusantara Theme Builder — Asset Management Service (Phase 2)
 * Pengelolaan aset proyek lokal: gambar (PNG, JPEG, WebP, SVG aman),
 * font, file gaya, dan skrip pendukung.
 */

import { ProjectAsset, AssetType } from '../types/project';
import { validateAsset, MAX_ASSET_FILE_SIZE_BYTES } from '../domain/project/project-validator';

export class AssetService {
  /**
   * Menentukan jenis aset berdasarkan ekstensi berkas
   */
  getAssetType(filename: string): AssetType {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'image';
    if (ext === 'svg') return 'svg';
    if (['woff', 'woff2', 'ttf', 'otf'].includes(ext)) return 'font';
    if (ext === 'css') return 'css';
    if (ext === 'js') return 'js';
    if (ext === 'html') return 'html';
    return 'text';
  }

  /**
   * Menghindari tabrakan nama file dengan menambahkan indeks numerik
   */
  resolveUniqueFilename(name: string, existingAssets: ProjectAsset[]): string {
    const existingNames = new Set(existingAssets.map((a) => a.name.toLowerCase()));
    if (!existingNames.has(name.toLowerCase())) {
      return name;
    }

    const lastDotIdx = name.lastIndexOf('.');
    const baseName = lastDotIdx > -1 ? name.substring(0, lastDotIdx) : name;
    const ext = lastDotIdx > -1 ? name.substring(lastDotIdx) : '';

    let counter = 1;
    let candidate = `${baseName}-${counter}${ext}`;
    while (existingNames.has(candidate.toLowerCase())) {
      counter++;
      candidate = `${baseName}-${counter}${ext}`;
    }
    return candidate;
  }

  /**
   * Membaca File objek dari input peramban dan menghasilkan ProjectAsset tervalidasi
   */
  async processUploadedFile(
    file: File,
    existingAssets: ProjectAsset[]
  ): Promise<{ asset: ProjectAsset | null; error?: string }> {
    if (file.size > MAX_ASSET_FILE_SIZE_BYTES) {
      return {
        asset: null,
        error: `Ukuran file ${(file.size / (1024 * 1024)).toFixed(2)} MB melebihi batas 5 MB.`
      };
    }

    const type = this.getAssetType(file.name);
    const uniqueName = this.resolveUniqueFilename(file.name, existingAssets);

    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onerror = () => {
        resolve({ asset: null, error: 'Gagal membaca isi berkas dari komputer.' });
      };

      if (type === 'image' || type === 'svg' || type === 'font') {
        reader.onload = () => {
          const dataUrl = reader.result as string;

          // Validate SVG safety
          if (type === 'svg') {
            const check = validateAsset(uniqueName, file.size, dataUrl);
            if (!check.isValid) {
              resolve({ asset: null, error: check.error });
              return;
            }
          }

          const now = new Date().toISOString();
          const asset: ProjectAsset = {
            id: 'asset-' + Math.random().toString(36).substring(2, 9),
            name: uniqueName,
            type,
            mimeType: file.type || 'application/octet-stream',
            sizeBytes: file.size,
            path: `assets/${uniqueName}`,
            dataUrl,
            createdAt: now,
            updatedAt: now
          };
          resolve({ asset });
        };
        reader.readAsDataURL(file);
      } else {
        // Text / CSS / JS / HTML
        reader.onload = () => {
          const content = reader.result as string;
          const now = new Date().toISOString();
          const asset: ProjectAsset = {
            id: 'asset-' + Math.random().toString(36).substring(2, 9),
            name: uniqueName,
            type,
            mimeType: file.type || 'text/plain',
            sizeBytes: file.size,
            path: `assets/${uniqueName}`,
            content,
            createdAt: now,
            updatedAt: now
          };
          resolve({ asset });
        };
        reader.readAsText(file);
      }
    });
  }

  /**
   * Format ukuran byte yang ramah pengguna
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

export const assetService = new AssetService();
