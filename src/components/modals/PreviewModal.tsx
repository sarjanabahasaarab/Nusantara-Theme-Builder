/**
 * Nusantara Theme Builder — Preview Modal
 * Modal pratinjau responsif tema (Desktop, Tablet, Mobile) dengan perenderan komponen aktif.
 */

import React, { useState } from 'react';
import { useProjectStore, ViewportMode } from '../../stores/useProjectStore';
import { X, Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
  const { currentProject } = useProjectStore();
  const [viewport, setViewport] = useState<ViewportMode>('desktop');

  if (!isOpen || !currentProject) return null;

  const activePage = currentProject.pages[0];
  const { themeSettings } = currentProject;

  let containerWidth = 'w-full max-w-5xl';
  if (viewport === 'tablet') containerWidth = 'w-[768px]';
  if (viewport === 'mobile') containerWidth = 'w-[375px]';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950/95 backdrop-blur-md animate-in fade-in">
      {/* Top bar */}
      <div className="h-14 border-b border-neutral-800 bg-neutral-900/90 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Pratinjau Tema</span>
          <span className="text-neutral-600">/</span>
          <span className="text-xs text-neutral-200 font-medium">{currentProject.name}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 uppercase font-mono">
            {currentProject.targetPlatform}
          </span>
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
              viewport === 'desktop' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Desktop (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
              viewport === 'tablet' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
              viewport === 'mobile' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Ponsel</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Preview canvas viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-neutral-950/80">
        <div
          className={`${containerWidth} transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col min-h-[600px]`}
          style={{
            backgroundColor: themeSettings.backgroundColor,
            color: themeSettings.textColor,
            fontFamily: `${themeSettings.fontFamilySans}, sans-serif`
          }}
        >
          {/* Simulated browser header bar for desktop realism */}
          <div className="h-8 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex-1 mx-4 text-center">
              <span className="text-[10px] text-neutral-400 font-mono bg-neutral-950 px-3 py-0.5 rounded-md border border-neutral-800 inline-block">
                https://{currentProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.local/
              </span>
            </div>
          </div>

          {/* Render Theme Components */}
          <div className="flex-1 p-6 space-y-4">
            {(!activePage || activePage.components.length === 0) ? (
              <div className="py-20 text-center text-neutral-500 text-sm">
                Belum ada komponen di halaman ini. Buka Visual Editor untuk menambahkan komponen.
              </div>
            ) : (
              activePage.components.map((comp) => {
                const styleObj: React.CSSProperties = {
                  backgroundColor: comp.styles.backgroundColor,
                  color: comp.styles.textColor,
                  padding: comp.styles.padding || '1rem',
                  borderRadius: comp.styles.borderRadius || '0.375rem',
                  textAlign: comp.styles.textAlign || 'left',
                  borderWidth: comp.styles.borderWidth,
                  borderColor: comp.styles.borderColor,
                  borderStyle: comp.styles.borderWidth ? 'solid' : undefined
                };

                return (
                  <div key={comp.id} style={styleObj} className="transition-all">
                    {comp.type === 'header' && (
                      <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight" style={{ color: themeSettings.primaryColor }}>
                          {comp.props.title || 'Judul Header'}
                        </h1>
                        {comp.props.subtitle && (
                          <p className="text-sm opacity-80">{comp.props.subtitle}</p>
                        )}
                      </div>
                    )}

                    {comp.type === 'navigation' && (
                      <nav className="flex flex-wrap gap-4 py-2 border-y border-neutral-800 text-xs font-medium">
                        {(comp.props.items as Array<{ id: string; label: string; url: string }> || []).map((item) => (
                          <span key={item.id} className="hover:underline cursor-pointer opacity-90">
                            {item.label}
                          </span>
                        ))}
                      </nav>
                    )}

                    {comp.type === 'article' && (
                      <article className="space-y-3">
                        <h2 className="text-xl font-bold">{comp.props.title || 'Judul Artikel'}</h2>
                        <div className="text-[11px] opacity-60 flex gap-3">
                          {comp.props.showAuthor && <span>Oleh Redaksi</span>}
                          {comp.props.showDate && <span>18 Oktober 2026</span>}
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-line opacity-90">
                          {comp.props.content || 'Konten artikel lengkap...'}
                        </p>
                      </article>
                    )}

                    {comp.type === 'content' && (
                      <div className="space-y-2">
                        {comp.props.title && <h3 className="text-lg font-semibold">{comp.props.title}</h3>}
                        <p className="text-sm leading-relaxed whitespace-pre-line opacity-90">
                          {comp.props.content || 'Isi blok konten...'}
                        </p>
                      </div>
                    )}

                    {comp.type === 'sidebar' && (
                      <div className="p-4 bg-neutral-900/60 rounded-lg border border-neutral-800 text-xs space-y-2">
                        <h4 className="font-semibold uppercase tracking-wider text-amber-400">
                          {comp.props.title || 'Sidebar'}
                        </h4>
                        <div className="whitespace-pre-line opacity-80">
                          {comp.props.content || 'Widget area'}
                        </div>
                      </div>
                    )}

                    {comp.type === 'basic' && (
                      <div className="text-center py-4 space-y-3">
                        {comp.props.title && <h3 className="text-base font-bold">{comp.props.title}</h3>}
                        {comp.props.buttonText && (
                          <button
                            className="px-5 py-2 rounded-lg text-xs font-semibold shadow-md inline-block cursor-pointer"
                            style={{
                              backgroundColor: themeSettings.primaryColor,
                              color: '#ffffff'
                            }}
                          >
                            {comp.props.buttonText}
                          </button>
                        )}
                      </div>
                    )}

                    {comp.type === 'footer' && (
                      <footer className="pt-6 border-t border-neutral-800 text-center text-xs opacity-70 space-y-1">
                        <p>{comp.props.title || '© Nusantara Theme Builder'}</p>
                        {comp.props.subtitle && <p className="text-[10px]">{comp.props.subtitle}</p>}
                      </footer>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
