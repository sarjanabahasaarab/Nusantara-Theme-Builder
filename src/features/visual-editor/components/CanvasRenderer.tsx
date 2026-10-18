/**
 * Nusantara Theme Builder — Canvas Item Renderer
 * Perenderan visual komponen realistis pada kanvas dengan dukungan dnd-kit sortable
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ThemeComponent } from '../../../types/project';
import {
  GripVertical,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sliders,
  Calendar,
  User,
  Quote,
  ArrowRight,
  Sparkles,
  Mail,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface SortableCanvasItemProps {
  component: ThemeComponent;
  index: number;
  totalCount: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const SortableCanvasItem: React.FC<SortableCanvasItemProps> = ({
  component,
  index,
  totalCount,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1
  };

  const isFirst = index === 0;
  const isLast = index === totalCount - 1;

  // Render Component Inner Content Based on Type
  const renderComponentBody = () => {
    const { type, props } = component;

    switch (type) {
      case 'header':
        return (
          <header className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {String(props.title || 'Judul Utama Blog')}
            </h1>
            {Boolean(props.subtitle) && (
              <p className="text-sm opacity-80 max-w-2xl mx-auto leading-relaxed">
                {String(props.subtitle)}
              </p>
            )}
          </header>
        );

      case 'hero':
        return (
          <div className="space-y-4 py-4 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tema Unggulan
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {String(props.title || 'Wujudkan Tema Impian Anda')}
            </h2>
            {Boolean(props.subtitle) && (
              <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto leading-relaxed">
                {String(props.subtitle)}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {Boolean(props.buttonText) && (
                <button className="px-5 py-2.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-md transition-all">
                  {String(props.buttonText)}
                </button>
              )}
              {Boolean(props.secondaryButtonText) && (
                <button className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-all">
                  {String(props.secondaryButtonText)}
                </button>
              )}
            </div>
          </div>
        );

      case 'navigation': {
        const items = (props.items as Array<{ id: string; label: string; url: string }>) || [];
        return (
          <nav className="flex items-center justify-between flex-wrap gap-4">
            <div className="font-bold text-sm tracking-tight text-amber-400 flex items-center gap-1.5">
              <span>{String(props.brandText || 'Nusantara')}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              {items.map((it) => (
                <span
                  key={it.id}
                  className="opacity-80 hover:opacity-100 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {it.label}
                </span>
              ))}
            </div>
          </nav>
        );
      }

      case 'article':
        return (
          <article className="space-y-3">
            <div className="space-y-1.5">
              {Boolean(props.subtitle) && (
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                  {String(props.subtitle)}
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {String(props.title || 'Tajuk Artikel Baru')}
              </h2>
            </div>

            {(Boolean(props.showDate) || Boolean(props.showAuthor)) && (
              <div className="flex items-center gap-4 text-xs opacity-70 border-b border-neutral-800/80 pb-2">
                {Boolean(props.showAuthor) && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    {String(props.author || 'Penulis')}
                  </span>
                )}
                {Boolean(props.showDate) && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {String(props.date || '18 Oktober 2026')}
                  </span>
                )}
              </div>
            )}

            <p className="text-sm leading-relaxed opacity-90 whitespace-pre-line">
              {String(props.content || 'Isi artikel lengkap dapat diedit melalui Properties Inspector di sebelah kanan...')}
            </p>

            {Boolean(props.readMoreText) && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer inline-flex items-center gap-1">
                  {String(props.readMoreText)}
                </span>
              </div>
            )}
          </article>
        );

      case 'post-grid': {
        const posts = (props.posts as Array<{ id: string; title: string; category: string; excerpt: string }>) || [];
        return (
          <div className="space-y-4">
            {Boolean(props.sectionTitle) && (
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                <h3 className="text-base font-bold text-neutral-100">{String(props.sectionTitle)}</h3>
                <span className="text-xs text-amber-400 hover:underline cursor-pointer">Lihat Semua →</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800 space-y-2 hover:border-neutral-700 transition-colors"
                >
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 font-semibold">
                    {post.category}
                  </span>
                  <h4 className="font-bold text-xs text-neutral-100 line-clamp-2 leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'content':
        return (
          <div className="space-y-2">
            {Boolean(props.title) && <h3 className="text-lg font-bold">{String(props.title)}</h3>}
            <p className="text-sm leading-relaxed opacity-85 whitespace-pre-line">
              {String(props.content || 'Tuliskan informasi atau paragraf di sini...')}
            </p>
          </div>
        );

      case 'media-image':
        return (
          <div className="space-y-2">
            <div className="w-full rounded-lg overflow-hidden bg-neutral-950 flex items-center justify-center min-h-[160px] max-h-[400px]">
              {props.imageUrl ? (
                <img
                  src={String(props.imageUrl)}
                  alt={String(props.alt || 'Gambar')}
                  className="w-full h-auto max-h-[380px] object-cover"
                />
              ) : (
                <div className="py-12 text-center text-neutral-500">
                  <span className="text-xs">Belum ada gambar yang dipilih</span>
                </div>
              )}
            </div>
            {Boolean(props.caption) && (
              <p className="text-xs opacity-70 italic text-center">{String(props.caption)}</p>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="relative p-4 text-center space-y-3">
            <Quote className="w-8 h-8 mx-auto text-amber-400/40" />
            <blockquote className="text-base sm:text-lg font-serif italic leading-relaxed max-w-xl mx-auto">
              "{String(props.quote || 'Kutipan inspiratif di sini...')}"
            </blockquote>
            {(Boolean(props.author) || Boolean(props.role)) && (
              <div className="text-xs font-sans space-y-0.5">
                {Boolean(props.author) && <p className="font-bold text-neutral-200">{String(props.author)}</p>}
                {Boolean(props.role) && <p className="opacity-70 text-[11px]">{String(props.role)}</p>}
              </div>
            )}
          </div>
        );

      case 'features': {
        const items = (props.items as unknown as Array<{ id: string; title: string; desc: string }>) || [];
        return (
          <div className="space-y-4">
            {Boolean(props.title) && (
              <h3 className="text-lg font-bold text-center">{String(props.title)}</h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800 space-y-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-neutral-100">{item.title}</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'cta':
        return (
          <div className="text-center space-y-3 py-2">
            <h3 className="text-xl sm:text-2xl font-bold">{String(props.title || 'Ambil Tindakan Sekarang')}</h3>
            {Boolean(props.subtitle) && (
              <p className="text-xs sm:text-sm opacity-85 max-w-lg mx-auto leading-relaxed">
                {String(props.subtitle)}
              </p>
            )}
            {Boolean(props.buttonText) && (
              <div className="pt-1">
                <button className="px-6 py-2.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-lg transition-transform hover:scale-105">
                  {String(props.buttonText)}
                </button>
              </div>
            )}
          </div>
        );

      case 'newsletter':
        return (
          <div className="max-w-md mx-auto text-center space-y-3 py-2">
            <Mail className="w-6 h-6 mx-auto text-amber-400" />
            <h3 className="text-base font-bold">{String(props.title || 'Langganan Buletin')}</h3>
            {Boolean(props.subtitle) && <p className="text-xs opacity-75">{String(props.subtitle)}</p>}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={String(props.placeholder || 'Email Anda...')}
                className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
                readOnly
              />
              <button className="px-4 py-1.5 bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg shadow">
                {String(props.buttonText || 'Langganan')}
              </button>
            </div>
          </div>
        );

      case 'sidebar':
        return (
          <div className="p-3 bg-neutral-950/80 rounded border border-neutral-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 pb-1 border-b border-neutral-800 font-bold text-amber-400">
              <span>{String(props.title || 'Widget Samping')}</span>
            </div>
            <p className="opacity-80 text-[11px] leading-relaxed whitespace-pre-line">
              {String(props.content || 'Isi widget pendukung...')}
            </p>
          </div>
        );

      case 'footer': {
        const links = (props.links as Array<{ id: string; label: string; url: string }>) || [];
        return (
          <footer className="text-center text-xs space-y-2 py-1">
            <p className="font-medium text-neutral-300">{String(props.title || 'Footer Hak Cipta')}</p>
            {Boolean(props.subtitle) && <p className="text-[11px] opacity-70">{String(props.subtitle)}</p>}
            {links.length > 0 && (
              <div className="flex items-center justify-center gap-4 pt-1 text-[11px] opacity-75">
                {links.map((link) => (
                  <span key={link.id} className="hover:underline cursor-pointer">
                    {link.label}
                  </span>
                ))}
              </div>
            )}
          </footer>
        );
      }

      default:
        return (
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold">{component.label}</h4>
            <p className="text-xs opacity-80">{String(props.content || props.title || 'Komponen visual.')}</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`relative group rounded-xl border transition-all duration-150 ${
        isSelected
          ? 'border-amber-400 ring-2 ring-amber-400/40 bg-neutral-900/90 shadow-xl'
          : 'border-neutral-800/80 hover:border-neutral-700 bg-neutral-900/50 hover:bg-neutral-900/70'
      }`}
    >
      {/* Component Floating Top Toolbar */}
      <div
        className={`flex items-center justify-between px-3 py-1.5 rounded-t-xl border-b transition-colors text-xs select-none ${
          isSelected
            ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
            : 'bg-neutral-950/80 border-neutral-800/80 text-neutral-400'
        }`}
      >
        {/* Drag Handle & Label */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-neutral-500 hover:text-amber-400 p-0.5 rounded transition-colors"
            title="Seret untuk memindahkan posisi komponen"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="font-semibold text-neutral-200 text-xs truncate max-w-[200px]">
            {component.label}
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400 border border-neutral-800/80 uppercase">
            {component.type}
          </span>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={isFirst}
            className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 disabled:hover:text-neutral-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Pindahkan ke Atas"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={isLast}
            className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 disabled:hover:text-neutral-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Pindahkan ke Bawah"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 text-neutral-400 hover:text-amber-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Duplikat Komponen"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-neutral-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Hapus Komponen"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Render Component Content with Applied Styles */}
      <div
        className="transition-all"
        style={{
          backgroundColor: component.styles.backgroundColor || 'transparent',
          color: component.styles.textColor || 'inherit',
          padding: component.styles.padding || '1.25rem',
          margin: component.styles.margin,
          textAlign: component.styles.textAlign || 'left',
          borderRadius: component.styles.borderRadius,
          boxShadow: component.styles.boxShadow
        }}
      >
        {renderComponentBody()}
      </div>
    </div>
  );
};
