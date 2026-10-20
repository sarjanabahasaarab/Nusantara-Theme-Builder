/**
 * Nusantara Theme Builder — WordPress ZIP Exporter
 * Mengemas paket tema menjadi file .zip siap instalasi di WordPress Admin (Appearance > Themes)
 * Menggunakan pustaka JSZip client-side tanpa dependensi server eksternal.
 * Lisensi: MIT
 */

import JSZip from 'jszip';
import { WordPressThemePackage } from '../types/wordpress';

export async function createWordPressZipBlob(themePackage: WordPressThemePackage): Promise<Blob> {
  const zip = new JSZip();

  // Seluruh tema WordPress harus dikemas dalam folder root bernama slug tema (contoh: "tema-nusantara/style.css")
  const rootFolder = zip.folder(themePackage.themeSlug) || zip;

  for (const file of themePackage.files) {
    if (file.path === 'screenshot.svg') {
      // Masukkan screenshot.svg dan juga screenshot dummy jika browser mendukung
      rootFolder.file(file.path, file.content);
      // Buat file screenshot.png fallback sebagai teks/svg jika binary tidak dikirim
      rootFolder.file('screenshot.png', file.content);
    } else {
      rootFolder.file(file.path, file.content);
    }
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  return blob;
}

export function downloadWordPressZip(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.zip') ? filename : `${filename}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
