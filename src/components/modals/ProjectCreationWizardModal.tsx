/**
 * Nusantara Theme Builder — 5-Step Project Creation Wizard Modal
 * Sesuai spesifikasi Phase 2:
 * 1. Nama Proyek (dengan validasi nama file & reserved names)
 * 2. Target Platform (Blogger vs WordPress)
 * 3. Template Awal (Proyek Kosong + 6 Starter Templates)
 * 4. Lokasi Penyimpanan Proyek
 * 5. Tinjau Konfigurasi & Buat Proyek
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { STARTER_TEMPLATES, StarterTemplateId } from '../../domain/project/project-factory';
import { validateProjectName } from '../../domain/project/project-validator';
import { TargetPlatform } from '../../types/project';
import {
  X,
  ChevronRight,
  ChevronLeft,
  FolderPlus,
  Sparkles,
  Check,
  HardDrive,
  Folder,
  Layers,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ProjectCreationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlatform?: TargetPlatform;
}

export const ProjectCreationWizardModal: React.FC<ProjectCreationWizardModalProps> = ({
  isOpen,
  onClose,
  defaultPlatform = 'blogger'
}) => {
  const { createProject, recentProjects } = useProjectStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form states
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<TargetPlatform>(defaultPlatform);
  const [selectedTemplate, setSelectedTemplate] = useState<StarterTemplateId>('personal-blog');
  const [storagePath, setStoragePath] = useState('~/NusantaraProjects');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNextFromStep1 = () => {
    const check = validateProjectName(name);
    if (!check.isValid) {
      setValidationError(check.error || 'Nama proyek tidak valid.');
      return;
    }

    // Check collision with existing projects
    const existing = recentProjects.find((p) => p.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) {
      setValidationError(`Proyek dengan nama "${name.trim()}" sudah ada di penyimpanan lokal. Gunakan nama yang berbeda.`);
      return;
    }

    setValidationError(null);
    setStep(2);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const fullPath = `${storagePath}/${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      const ok = await createProject(name, platform, selectedTemplate, fullPath);
      if (ok) {
        // Reset
        setName('');
        setStep(1);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTemplateInfo = STARTER_TEMPLATES.find((t) => t.id === selectedTemplate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Wizard Header with Steps indicator */}
        <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-100">Wizard Pembuatan Proyek</h2>
                <p className="text-xs text-neutral-400">Langkah {step} dari 5: Inisialisasi Tema Nusantara</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper bar */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  step >= i ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: NAMA PROYEK */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Langkah 1: Identitas
                </span>
                <h3 className="text-lg font-bold text-white">Beri Nama Proyek Tema Anda</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Nama ini akan menjadi identitas proyek lokal, judul berkas tema, serta nama folder penyimpanan.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300">
                  Nama Proyek <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNextFromStep1();
                    }
                  }}
                  placeholder="Contoh: Majalah Sastra Nusantara, Berita Merdeka..."
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  autoFocus
                />

                {validationError && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 pt-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-[11px] text-neutral-400 space-y-1 mt-3">
                  <span className="font-semibold text-neutral-300 block">Aturan Keamanan Sistem Berkas:</span>
                  <p>• Minimal 2 karakter, maksimal 80 karakter.</p>
                  <p>• Karakter terlarang: <code className="text-amber-400">&lt; &gt; : " / \ | ? *</code> tidak diizinkan.</p>
                  <p>• Reserved names seperti CON, PRN, AUX, NUL otomatis dicegah.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TARGET PLATFORM */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Langkah 2: Target Ekosistem
                </span>
                <h3 className="text-lg font-bold text-white">Pilih Target Platform Tema</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Pilih arsitektur keluaran template. Setiap platform memiliki aturan layout dan markup yang berbeda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setPlatform('blogger')}
                  className={`p-5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    platform === 'blogger'
                      ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/30 text-white'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
                        Blogger (Blogspot)
                      </span>
                      {platform === 'blogger' && <Check className="w-4 h-4 text-orange-400" />}
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                      Mendukung struktur XML template Blogspot v2/v3, skin variables dinamis, dan widget bawaan Google Blogger.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] font-mono text-orange-300/80">
                    Keluaran: XML Template
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform('wordpress')}
                  className={`p-5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    platform === 'wordpress'
                      ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30 text-white'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                        WordPress Theme
                      </span>
                      {platform === 'wordpress' && <Check className="w-4 h-4 text-blue-400" />}
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed mt-2">
                      Mendukung Block Theme modern berbasis Full Site Editing (FSE) dengan <code className="text-blue-300 font-mono">theme.json</code> dan Classic PHP Theme.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] font-mono text-blue-300/80">
                    Keluaran: FSE / Classic ZIP
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TEMPLATE AWAL */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Langkah 3: Tata Letak Awal
                </span>
                <h3 className="text-lg font-bold text-white">Pilih Template Awal (Starter)</h3>
                <p className="text-xs text-neutral-400">
                  Mulai dari kanvas kosong atau gunakan struktur komponen terverifikasi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {STARTER_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 text-white ring-1 ring-amber-400/50'
                          : 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-neutral-200">{tmpl.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {tmpl.description}
                      </p>
                      <div className="mt-2 text-[10px] text-amber-400/80 font-mono">
                        {tmpl.componentCountPreview} Komponen Awal
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: LOKASI PENYIMPANAN */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Langkah 4: Jalur Berkas
                </span>
                <h3 className="text-lg font-bold text-white">Lokasi Penyimpanan Proyek</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Tentukan folder direktori kerja tempat data proyek dan aset lokal akan disimpan.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300">
                    Direktori Kerja Induk
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Folder className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="text"
                        value={storagePath}
                        onChange={(e) => setStoragePath(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-neutral-950 rounded-lg border border-neutral-800 text-xs text-neutral-300 space-y-2">
                  <div className="flex items-center gap-2 font-medium text-amber-400">
                    <HardDrive className="w-4 h-4" />
                    <span>Jalur Berkas Lengkap Proyek Ini:</span>
                  </div>
                  <p className="font-mono text-[11px] text-neutral-200 bg-neutral-900 p-2 rounded border border-neutral-800 truncate">
                    {storagePath}/{name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}/
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Seluruh perubahan dan aset tersimpan 100% lokal di komputer Anda tanpa transmisi ke server cloud pihak ketiga.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW / TINJAU */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  Langkah 5: Konfirmasi
                </span>
                <h3 className="text-lg font-bold text-white">Tinjau Konfigurasi Proyek</h3>
                <p className="text-xs text-neutral-400">
                  Periksa kembali parameter proyek sebelum inisialisasi dilakukan.
                </p>
              </div>

              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-neutral-850">
                  <span className="text-neutral-500">Nama Proyek:</span>
                  <span className="font-bold text-white">{name.trim()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-850">
                  <span className="text-neutral-500">Platform Target:</span>
                  <span className="font-mono font-bold uppercase text-amber-400">{platform}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-850">
                  <span className="text-neutral-500">Starter Template:</span>
                  <span className="text-neutral-200 font-semibold">{selectedTemplateInfo?.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-850">
                  <span className="text-neutral-500">Format File Proyek:</span>
                  <span className="font-mono text-emerald-400">.ntbproject (v1.0.0)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-500">Lokasi:</span>
                  <span className="font-mono text-[11px] text-neutral-300 max-w-[280px] truncate">
                    {storagePath}/{name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}/
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Pemeriksaan keamanan lulus. Proyek siap dibuat dengan isolasi state penuh.</span>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-900/80">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Batal
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1) handleNextFromStep1();
                  else setStep((s) => (s + 1) as any);
                }}
                className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Lanjut</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={isSubmitting}
                className="px-6 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Membuat Proyek...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Buat Proyek Sekarang</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
