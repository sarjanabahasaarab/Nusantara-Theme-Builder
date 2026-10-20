/**
 * Nusantara Theme Builder — WordPress Metadata & Aset Tab
 * Pengaturan informasi tema style.css, versi PHP/WP, dan kustom fungsi PHP
 * Lisensi: MIT
 */

import React, { useState } from 'react';
import { WordPressSettings, WordPressThemeMetadata } from '../types/wordpress';
import { generateStyleCss } from '../generator/WordPressPhpGenerator';
import {
  FileText,
  Sliders,
  Code2,
  Copy,
  Check,
  Tag,
  ShieldCheck,
  FolderTree
} from 'lucide-react';

interface WordPressMetadataTabProps {
  settings: WordPressSettings;
  onUpdateMetadata: (meta: Partial<WordPressThemeMetadata>) => void;
  onUpdateSettings: (settings: Partial<WordPressSettings>) => void;
}

export const WordPressMetadataTab: React.FC<WordPressMetadataTabProps> = ({
  settings,
  onUpdateMetadata,
  onUpdateSettings
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'preview' | 'code'>('info');
  const [copied, setCopied] = useState(false);

  const meta = settings.metadata;
  const styleCssPreview = generateStyleCss(settings);

  const handleCopy = () => {
    navigator.clipboard.writeText(styleCssPreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-900/40">
      {/* Sub Tabs */}
      <div className="grid grid-cols-3 border-b border-neutral-800 bg-neutral-950/60 text-xs">
        <button
          onClick={() => setActiveSubTab('info')}
          className={`py-2 text-center font-medium transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'info'
              ? 'border-blue-500 text-blue-400 font-bold bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Info Tema
        </button>
        <button
          onClick={() => setActiveSubTab('preview')}
          className={`py-2 text-center font-medium transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'preview'
              ? 'border-blue-500 text-blue-400 font-bold bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          style.css
        </button>
        <button
          onClick={() => setActiveSubTab('code')}
          className={`py-2 text-center font-medium transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'code'
              ? 'border-blue-500 text-blue-400 font-bold bg-neutral-900/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          functions.php
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeSubTab === 'info' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-neutral-400 block mb-1 font-semibold">Nama Tema (Theme Name)</label>
              <input
                type="text"
                value={meta.themeName}
                onChange={(e) => onUpdateMetadata({ themeName: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-neutral-400 block mb-1 font-semibold">Text Domain (Slug)</label>
                <input
                  type="text"
                  value={meta.textDomain}
                  onChange={(e) => onUpdateMetadata({ textDomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 font-semibold">Versi Tema</label>
                <input
                  type="text"
                  value={meta.version}
                  onChange={(e) => onUpdateMetadata({ version: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1 font-semibold">Deskripsi Tema</label>
              <textarea
                value={meta.description}
                onChange={(e) => onUpdateMetadata({ description: e.target.value })}
                rows={2}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-neutral-400 block mb-1 font-semibold">Penulis (Author)</label>
                <input
                  type="text"
                  value={meta.author}
                  onChange={(e) => onUpdateMetadata({ author: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 font-semibold">Lisensi</label>
                <input
                  type="text"
                  value={meta.license}
                  onChange={(e) => onUpdateMetadata({ license: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-neutral-400 block mb-1 font-semibold text-[10px]">Min. WordPress</label>
                <input
                  type="text"
                  value={meta.requiresAtLeast}
                  onChange={(e) => onUpdateMetadata({ requiresAtLeast: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white font-mono text-center text-[11px]"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 font-semibold text-[10px]">Uji Hingga WP</label>
                <input
                  type="text"
                  value={meta.testedUpTo}
                  onChange={(e) => onUpdateMetadata({ testedUpTo: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white font-mono text-center text-[11px]"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 font-semibold text-[10px]">Min. PHP</label>
                <input
                  type="text"
                  value={meta.requiresPhp}
                  onChange={(e) => onUpdateMetadata({ requiresPhp: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white font-mono text-center text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1 font-semibold">Tags (pisahkan koma)</label>
              <input
                type="text"
                value={meta.tags.join(', ')}
                onChange={(e) =>
                  onUpdateMetadata({
                    tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-750 text-white text-[11px]"
              />
            </div>
          </div>
        )}

        {activeSubTab === 'preview' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Preview Header style.css:</span>
              <button
                onClick={handleCopy}
                className="p-1 rounded text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 overflow-x-auto whitespace-pre">
              {styleCssPreview}
            </pre>
          </div>
        )}

        {activeSubTab === 'code' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Konten functions.php:</span>
              <span className="text-[10px] font-mono text-blue-400">WordPress 6.x Setup</span>
            </div>
            <textarea
              value={settings.customFunctionsContent}
              onChange={(e) => onUpdateSettings({ customFunctionsContent: e.target.value })}
              rows={16}
              className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};
