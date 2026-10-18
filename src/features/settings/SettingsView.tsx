/**
 * Nusantara Theme Builder — Settings View
 * Pengaturan aplikasi, diagnosa penyimpanan lokal, backup semua proyek, dan informasi lisensi.
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { projectService } from '../../services/project-service';
import {
  Settings,
  HardDrive,
  Download,
  Trash2,
  Shield,
  Info,
  CheckCircle2,
  RefreshCw,
  Terminal
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { storageInfo, recentProjects, refreshProjects, addToast } = useProjectStore();
  const [isExportingAll, setIsExportingAll] = useState(false);

  const handleExportAllBackup = async () => {
    setIsExportingAll(true);
    try {
      const allProjectsData = [];
      for (const p of recentProjects) {
        const full = await projectService.getProjectById(p.id);
        if (full) allProjectsData.push(full);
      }

      const backupBundle = {
        app: 'Nusantara Theme Builder',
        exportDate: new Date().toISOString(),
        version: '0.1.0',
        projectCount: allProjectsData.length,
        projects: allProjectsData
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupBundle, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `nusantara-backup-${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      addToast('success', `Cadangan ${allProjectsData.length} proyek berhasil diunduh.`);
    } catch (err) {
      addToast('error', 'Gagal membuat file cadangan: ' + String(err));
    } finally {
      setIsExportingAll(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Pengaturan Aplikasi</h1>
        <p className="text-xs text-neutral-400">
          Konfigurasi sistem desktop, diagnostik penyimpanan, dan manajemen cadangan data.
        </p>
      </div>

      {/* Storage Management Card */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white">Penyimpanan Lokal Komputer</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase block font-medium">Lingkungan Sistem</span>
            <span className="text-sm font-bold text-neutral-200 mt-1 block">{storageInfo.mode}</span>
          </div>
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase block font-medium">Total Proyek Tersimpan</span>
            <span className="text-sm font-bold text-neutral-200 mt-1 block">{recentProjects.length} Proyek</span>
          </div>
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase block font-medium">Ukuran Digunakan</span>
            <span className="text-sm font-bold text-neutral-200 mt-1 block">
              {(storageInfo.usedBytes / 1024).toFixed(2)} KB
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-neutral-400">
            Seluruh data proyek tersimpan sepenuhnya di perangkat lokal Anda tanpa pengiriman data ke server eksternal.
          </p>

          <button
            onClick={handleExportAllBackup}
            disabled={isExportingAll || recentProjects.length === 0}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 rounded-lg border border-neutral-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>{isExportingAll ? 'Menyiapkan...' : 'Unduh Semua Cadangan Proyek (.json)'}</span>
          </button>
        </div>
      </div>

      {/* Tauri Desktop Info */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Status Integrasi Desktop Tauri 2</h2>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          Nusantara Theme Builder dirancang dengan arsitektur Tauri 2 (Rust) yang ringan, aman, dan menggunakan memori minimal. Saat dijalankan sebagai aplikasi desktop native di Windows, macOS, atau Linux, aplikasi ini mengakses sistem berkas secara langsung melalui kontrol capability yang terisolasi.
        </p>

        <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-[11px] font-mono text-neutral-400 space-y-1">
          <div>Target OS: Windows 10/11, macOS, Linux (Ubuntu/Debian)</div>
          <div>Frontend Core: React 19 + TypeScript + Tailwind CSS</div>
          <div>Backend Scaffold: src-tauri (Rust / Cargo)</div>
        </div>
      </div>

      {/* License & Open Source */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Lisensi & Hak Cipta</h2>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          Nusantara Theme Builder didistribusikan di bawah Lisensi Open Source <strong>MIT</strong>. Anda bebas menggunakan, memodifikasi, dan mendistribusikan perangkat lunak ini untuk keperluan pribadi maupun komersial sesuai dengan ketentuan lisensi.
        </p>
      </div>
    </div>
  );
};
