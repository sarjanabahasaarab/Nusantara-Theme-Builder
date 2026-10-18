# Arsitektur Sistem — Nusantara Theme Builder

Nusantara Theme Builder dirancang untuk berjalan sebagai aplikasi desktop lintas platform yang independen, cepat, dan aman.

## 1. Komponen Utama

### A. Frontend Application Shell (React 19 + TypeScript)
- **TopToolbar**: Kontrol jendela, status simpan riil, tombol Undo/Redo, pintasan keyboard, dan pratinjau responsif.
- **Sidebar**: Navigasi hirarkis dengan deteksi kebutuhan proyek aktif.
- **View Router**: Rute antarmuka berbasis state:
  - `dashboard`: Ringkasan metrik penyimpanan lokal, aksi cepat, template awal, dan riwayat proyek.
  - `projects`: Pencarian, pemfilteran target platform, dan manajemen file proyek.
  - `visual-editor`: Kanvas komponen, palet drag-and-drop sortable (@dnd-kit), dan properties inspector.
  - `code-editor`: Integrasi Monaco Editor dengan penyorotan kode multi-bahasa.
  - `blogger`: Arsitektur model template Google Blogspot v2/v3.
  - `wordpress`: Arsitektur model Full Site Editing (FSE) block theme dan classic PHP theme.
  - `templates`: Katalog 6 starter template terverifikasi.
  - `settings`: Diagnostik penyimpanan, pencadangan seluruh proyek, dan informasi lisensi.

### B. State Management Layer (Zustand)
- Mengelola state tunggal (`single source of truth`) untuk seluruh aplikasi.
- Menyimpan snapshot imutabel untuk mendukung operasi Undo dan Redo hingga 25 langkah ke belakang.
- Menyediakan status simpan eksplisit: `saved`, `saving`, `dirty`, dan `error`.

### C. Domain & Storage Abstraction Layer
- `ProjectFactory`: Membangun objek proyek baru dengan schemaVersion `1.0.0` dan UUID unik.
- `ProjectValidator`: Memvalidasi nama proyek, batas ukuran file, dan integritas struktur data.
- `StorageAdapter`: Interface umum yang mengabstraksikan `TauriStorageAdapter` (filesystem desktop via Rust IPC) dan `LocalStorageAdapter` (penyimpanan lokal browser).

### D. Desktop Native Engine (Tauri 2 + Rust)
- Menggunakan webview native sistem operasi (WebView2 di Windows, WebKit di macOS/Linux) yang menghemat konsumsi RAM hingga 90% dibanding framework berbasis Chromium penuh.
- Isolasi izin melalui file capabilities (`src-tauri/capabilities/default.json`).
