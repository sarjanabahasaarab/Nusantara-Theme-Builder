# Panduan Pengembangan (DEVELOPMENT.md)

Dokumen ini memuat panduan teknis bagi kontributor dan pengembang yang ingin memperluas atau mengembangkan kode sumber **Nusantara Theme Builder**.

---

## 1. Arsitektur Perangkat Lunak

Nusantara Theme Builder menggunakan arsitektur modular dengan pemisahan tanggung jawab yang tegas:

```
┌────────────────────────────────────────────────────────┐
│             UI / Tampilan Pengguna                     │
│  React 19 + Tailwind CSS + Lucide Icons + Monaco       │
└──────────────────────────┬─────────────────────────────┘
                           │ Dispatches Actions
┌──────────────────────────▼─────────────────────────────┐
│          State Management (Zustand Global Store)       │
│  Single Source of Truth: Proyek, Riwayat Undo/Redo     │
└──────────────────────────┬─────────────────────────────┘
                           │ Calls
┌──────────────────────────▼─────────────────────────────┐
│                 Domain & Service Layer                 │
│  - Project Factory & Validator                         │
│  - Blogger Architecture Module                         │
│  - WordPress Architecture Module                       │
│  - Validation Service & Storage Service                │
└──────────────────────────┬─────────────────────────────┘
                           │ Persists
┌──────────────────────────▼─────────────────────────────┐
│             Storage Abstraction Layer                  │
│  - Tauri Native Filesystem Adapter (Desktop)           │
│  - LocalStorage Sandbox Adapter (Web / Dev Mode)       │
└────────────────────────────────────────────────────────┘
```

---

## 2. Struktur Direktori

```
nusantara-theme-builder/
├── index.html                   # Entry point aplikasi web
├── package.json                 # Konfigurasi dependensi dan skrip proyek
├── tsconfig.json                # Pengaturan TypeScript ketat
├── vite.config.ts               # Bundler Vite dengan alias path '@/'
├── src/
│   ├── main.tsx                 # Bootstrap React root
│   ├── App.tsx                  # Shell aplikasi utama & router navigasi
│   ├── index.css                # Styling global Tailwind CSS & slim scrollbar
│   ├── types/
│   │   ├── project.ts           # Skema data proyek v1.0.0
│   │   ├── blogger.ts           # Tipe domain khusus Blogger Blogspot
│   │   └── wordpress.ts         # Tipe domain khusus WordPress
│   ├── domain/
│   │   ├── project/
│   │   │   ├── project-factory.ts   # Inisialisasi proyek & starter template
│   │   │   └── project-validator.ts # Validasi integritas dan keamanan
│   │   ├── blogger/
│   │   │   └── blogger-module.ts    # Model arsitektur & kesiapan Blogger
│   │   └── wordpress/
│   │       └── wordpress-module.ts  # Model arsitektur & kesiapan WordPress
│   ├── services/
│   │   ├── project-service.ts       # Layanan CRUD proyek, duplikasi, & rename
│   │   ├── asset-service.ts         # Layanan pemrosesan & sanitasi aset
│   │   ├── file-explorer-service.ts # Layanan pengelolaan file workspace & path guards
│   │   ├── validation-service.ts    # Layanan validasi terpadu
│   │   └── storage/
│   │       ├── storage-adapter.ts   # Interface penyimpanan
│   │       ├── local-storage-adapter.ts # Implementasi penyimpanan lokal
│   │       └── tauri-storage-adapter.ts # Adapter Tauri desktop
│   ├── stores/
│   │   └── useProjectStore.ts       # State store Zustand
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopToolbar.tsx       # Toolbar atas aplikasi desktop
│   │   │   └── Sidebar.tsx          # Navigasi samping
│   │   ├── common/
│   │   │   └── ToastContainer.tsx   # Notifikasi sistem informatif
│   │   └── modals/
│   │       ├── ProjectCreationWizardModal.tsx # Wizard 5-Langkah pembuatan proyek
│   │       ├── DuplicateProjectModal.tsx      # Dialog penggandaan proyek
│   │       ├── RenameProjectModal.tsx         # Dialog ganti nama proyek
│   │       ├── ImportProjectModal.tsx         # Dialog impor file .ntbproject
│   │       ├── ConfirmDeleteModal.tsx         # Konfirmasi penghapusan aman
│   │       ├── PreviewModal.tsx               # Pratinjau responsif kanvas
│   │       └── AboutModal.tsx                 # Informasi lisensi dan roadmap
│   └── features/
│       ├── dashboard/               # Tampilan beranda, filter, & pencarian
│       ├── projects/                # Manajer pencarian & daftar proyek
│       ├── file-explorer/           # Eksplorasi struktur berkas workspace
│       ├── assets/                  # Pengelolaan aset lokal terisolasi
│       ├── visual-editor/           # Editor visual drag-and-drop
│       ├── code-editor/             # Editor kode Monaco
│       ├── blogger/                 # Modul arsitektur Blogger
│       ├── wordpress/               # Modul arsitektur WordPress
│       ├── templates/               # Katalog template awal
│       └── settings/                # Pengaturan dan pencadangan
├── src-tauri/
│   ├── Cargo.toml               # Dependensi backend Rust
│   ├── tauri.conf.json          # Konfigurasi jendela aplikasi Tauri 2
│   ├── build.rs                 # Skrip build Tauri
│   ├── src/
│   │   ├── main.rs              # Titik masuk biner desktop
│   │   └── lib.rs               # Library handler perintah Tauri
│   └── capabilities/
│       └── default.json         # Izin sistem desktop terkontrol
├── tests/
│   └── unit/
│       ├── project-service-phase2.test.ts # Tes duplikasi & rename
│       ├── file-explorer.test.ts          # Tes berkas workspace & path traversal
│       ├── asset-management.test.ts       # Tes aset, nama unik, & keamanan SVG
│       ├── template-library.test.ts       # Tes isolasi master template
│       ├── project-validation.test.ts     # Tes validasi input dan skema
│       ├── project-factory.test.ts        # Tes factory dan UUID
│       ├── serialization.test.ts          # Tes impor/ekspor .ntbproject
│       ├── undo-redo.test.ts              # Tes riwayat stack undo/redo
│       └── storage.test.ts                # Tes adaptor penyimpanan lokal
├── docs/
│   └── ARCHITECTURE.md          # Penjelasan arsitektur mendalam
├── LICENSE                      # Lisensi resmi MIT
├── README.md                    # Dokumentasi utama proyek
├── ROADMAP.md                   # Rincian 10 fase pengembangan
├── PHASE-1.md                   # Verifikasi dan batasan Phase 1
└── PHASE-2.md                   # Verifikasi dan batasan Phase 2
```

---

## 3. Alur Data Proyek (Single Source of Truth)

1. **State Terpusat**: Seluruh komponen UI membaca proyek yang sedang aktif dari `useProjectStore` (`currentProject`).
2. **Modifikasi Komponen**: Setiap penambahan (`addComponent`), pengubahan properti (`updateComponent`), atau penghapusan (`removeComponent`) akan:
   - Merekam snapshot ke `undoStack` (maksimal 25 langkah).
   - Memperbarui state `currentProject` secara imutabel.
   - Mengubah status simpan menjadi `dirty` ("Ada perubahan").
3. **Penyimpanan Nyata**: Saat pengguna menekan Ctrl+S atau tombol "Simpan", store memanggil `projectService.save()`, yang menuliskan data ke adapter penyimpanan lokal, memperbarui waktu `updatedAt`, lalu mengubah status menjadi `saved` ("Tersimpan").
4. **Pencegahan Kehilangan Data**: Jika proyek akan dihapus, dialog konfirmasi modal (`ConfirmDeleteModal`) ditampilkan terlebih dahulu.

---

## 4. Cara Menambahkan Komponen Visual Baru

1. Buka berkas `src/features/visual-editor/VisualEditorView.tsx`.
2. Tambahkan definisi komponen baru pada array `AVAILABLE_COMPONENTS`.
3. Tentukan `type`, `label`, `category`, `icon`, `description`, dan `defaultProps`.
4. Tambahkan perenderan tampilan komponen pada komponen `SortableCanvasItem` di `VisualEditorView.tsx` dan `PreviewModal.tsx`.
5. Properti komponen secara otomatis dapat diedit melalui `Properties Inspector`.

---

## 5. Cara Menambahkan Unit Test Baru

Proyek menggunakan **Vitest**. Berkas pengujian diletakkan pada direktori `tests/unit/` dengan ekstensi `.test.ts`.

Contoh menambahkan pengujian baru:
```typescript
import { describe, it, expect } from 'vitest';
import { myHelper } from '../../src/utils/myHelper';

describe('My Helper Utility', () => {
  it('menghasilkan nilai yang sesuai dengan ekspektasi', () => {
    expect(myHelper('input')).toBe('output');
  });
});
```

Jalankan pengujian dengan:
```bash
npm run test
```

---

## 6. Menjaga Kompatibilitas Antarfase

Untuk memastikan fase lanjutan (Phase 2 hingga Phase 10) dapat dibangun di atas fondasi Phase 1 tanpa merusak kode sebelumnya:
1. Pertahankan field `schemaVersion` pada model proyek JSON. Jika ada perubahan skema pada masa mendatang, buat fungsi migrasi versi skema di `src/domain/project/project-validator.ts`.
2. Jangan mengganti nama proyek di `metadata.json`.
3. Gunakan antarmuka `StorageAdapter` saat menambahkan metode penyimpanan berkas baru agar tidak merusak kompabilitas mode peramban web dan desktop Tauri.
