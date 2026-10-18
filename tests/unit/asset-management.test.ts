/**
 * Nusantara Theme Builder — Unit Tests: Asset Management
 * Pengujian: Klasifikasi aset, pencegahan tabrakan nama, batas ukuran 5MB,
 * dan sanitasi keamanan SVG terhadap XSS.
 */

import { describe, it, expect } from 'vitest';
import { assetService } from '../../src/services/asset-service';
import { validateAsset, MAX_ASSET_FILE_SIZE_BYTES } from '../../src/domain/project/project-validator';
import { ProjectAsset } from '../../src/types/project';

describe('Asset Service & Safety Inspection', () => {
  it('mengklasifikasikan jenis aset dengan benar', () => {
    expect(assetService.getAssetType('gambar.png')).toBe('image');
    expect(assetService.getAssetType('foto.webp')).toBe('image');
    expect(assetService.getAssetType('ikon.svg')).toBe('svg');
    expect(assetService.getAssetType('font.woff2')).toBe('font');
    expect(assetService.getAssetType('gaya.css')).toBe('css');
    expect(assetService.getAssetType('app.js')).toBe('js');
    expect(assetService.getAssetType('catatan.txt')).toBe('text');
  });

  it('mencegah tabrakan nama berkas dengan menambahkan counter numerik', () => {
    const existing: ProjectAsset[] = [
      {
        id: '1',
        name: 'hero.png',
        type: 'image',
        mimeType: 'image/png',
        sizeBytes: 100,
        path: 'assets/hero.png',
        createdAt: '',
        updatedAt: ''
      }
    ];

    const unique1 = assetService.resolveUniqueFilename('hero.png', existing);
    expect(unique1).toBe('hero-1.png');

    existing.push({
      id: '2',
      name: 'hero-1.png',
      type: 'image',
      mimeType: 'image/png',
      sizeBytes: 100,
      path: 'assets/hero-1.png',
      createdAt: '',
      updatedAt: ''
    });

    const unique2 = assetService.resolveUniqueFilename('hero.png', existing);
    expect(unique2).toBe('hero-2.png');
  });

  it('menolak aset yang melebihi batas ukuran maksimal 5 MB', () => {
    const oversized = MAX_ASSET_FILE_SIZE_BYTES + 1024;
    const check = validateAsset('besar.png', oversized);
    expect(check.isValid).toBe(false);
    expect(check.error).toContain('melebihi batas maksimal 5 MB');
  });

  it('menolak SVG yang mengandung skrip berbahaya atau event handler XSS', () => {
    const maliciousSvg = `<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>`;
    const check = validateAsset('danger.svg', 100, maliciousSvg);
    expect(check.isValid).toBe(false);
    expect(check.error).toContain('mengandung kode skrip');
  });

  it('menolak SVG dengan event handler seperti onload=', () => {
    const eventHandlerSvg = `<svg xmlns="http://www.w3.org/2000/svg" onload="alert('xss')"><circle r="10"/></svg>`;
    const check = validateAsset('event.svg', 100, eventHandlerSvg);
    expect(check.isValid).toBe(false);
    expect(check.error).toContain('mengandung kode skrip');
  });

  it('menerima SVG bersih tanpa kode skrip', () => {
    const cleanSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="red"/></svg>`;
    const check = validateAsset('clean.svg', 200, cleanSvg);
    expect(check.isValid).toBe(true);
    expect(check.isSvgSafe).toBe(true);
  });
});
