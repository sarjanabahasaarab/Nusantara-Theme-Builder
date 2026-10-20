/**
 * Nusantara Theme Builder — WordPress Types & Interfaces (Phase 5)
 * Spesifikasi domain & schema konfigurasi WordPress Block & Classic Theme
 * Lisensi: MIT
 */

import { ThemeComponent } from '../../../types/project';

export type WordPressThemeType = 'block' | 'classic';

export interface WordPressThemeMetadata {
  themeName: string;
  themeUri: string;
  author: string;
  authorUri: string;
  description: string;
  version: string;
  requiresAtLeast: string;
  testedUpTo: string;
  requiresPhp: string;
  license: string;
  licenseUri: string;
  textDomain: string;
  tags: string[];
}

export interface WordPressColorPaletteItem {
  slug: string;
  color: string;
  name: string;
}

export interface WordPressFontFamilyItem {
  fontFamily: string;
  name: string;
  slug: string;
  fontFace?: Array<{
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    fontStretch?: string;
    src: string[];
  }>;
}

export interface WordPressFontSizeItem {
  slug: string;
  size: string;
  name: string;
}

export interface WordPressThemeJsonConfig {
  $schema?: string;
  version: 3;
  settings: {
    appearanceTools?: boolean;
    useRootPaddingAwareAlignments?: boolean;
    color?: {
      palette?: WordPressColorPaletteItem[];
      custom?: boolean;
      defaultPalette?: boolean;
      duotone?: Array<{ colors: string[]; name: string; slug: string }>;
    };
    typography?: {
      fontFamilies?: WordPressFontFamilyItem[];
      fontSizes?: WordPressFontSizeItem[];
      fluid?: boolean;
      customFontSize?: boolean;
      lineHeight?: boolean;
    };
    spacing?: {
      blockGap?: boolean;
      margin?: boolean;
      padding?: boolean;
      units?: string[];
      spacingScale?: {
        operator?: string;
        increment?: number;
        steps?: number;
        mediumStep?: number;
        unit?: string;
      };
    };
    layout?: {
      contentSize?: string;
      wideSize?: string;
    };
    dimensions?: {
      aspectRatio?: boolean;
      minHeight?: boolean;
    };
    border?: {
      color?: boolean;
      radius?: boolean;
      style?: boolean;
      width?: boolean;
    };
  };
  styles: {
    color?: {
      background?: string;
      text?: string;
    };
    typography?: {
      fontFamily?: string;
      fontSize?: string;
      lineHeight?: string;
    };
    elements?: {
      link?: {
        color?: { text?: string };
        ':hover'?: { color?: { text?: string } };
      };
      h1?: { typography?: { fontSize?: string; fontFamily?: string } };
      h2?: { typography?: { fontSize?: string; fontFamily?: string } };
      h3?: { typography?: { fontSize?: string; fontFamily?: string } };
      button?: {
        color?: { background?: string; text?: string };
        border?: { radius?: string };
      };
    };
    blocks?: Record<string, unknown>;
  };
  templateParts?: Array<{
    name: string;
    title: string;
    area: 'header' | 'footer' | 'sidebar' | 'general';
  }>;
  customTemplates?: Array<{
    name: string;
    title: string;
    postTypes?: string[];
  }>;
  patterns?: string[];
}

export interface WordPressBlockPattern {
  name: string;
  title: string;
  description: string;
  categories: string[];
  keywords?: string[];
  viewportWidth?: number;
  content: string; // Gutenberg HTML block comment markup
}

export interface WordPressTemplateItem {
  id: string; // e.g., 'index', 'single', 'page', 'archive', '404', 'search', 'front-page'
  title: string;
  description: string;
  type: 'template' | 'part';
  area?: 'header' | 'footer' | 'sidebar' | 'general';
  components: ThemeComponent[];
  rawHtml?: string;
}

export interface WordPressSettings {
  themeType: WordPressThemeType;
  metadata: WordPressThemeMetadata;
  themeJson: WordPressThemeJsonConfig;
  activeTemplateId: string;
  templates: WordPressTemplateItem[];
  templateParts: WordPressTemplateItem[];
  customPatterns: WordPressBlockPattern[];
  includeCustomCss: boolean;
  customCssContent: string;
  includeFunctionsPhp: boolean;
  customFunctionsContent: string;
  enableBlockStyles: boolean;
  enableResponsiveEmbeds: boolean;
}

export interface WordPressGeneratedFile {
  path: string; // e.g. "style.css", "theme.json", "templates/index.html", "parts/header.html"
  content: string | Uint8Array;
  isBinary?: boolean;
  category: 'core' | 'template' | 'part' | 'pattern' | 'asset' | 'php';
  sizeBytes: number;
}

export interface WordPressThemePackage {
  themeSlug: string;
  themeName: string;
  version: string;
  themeType: WordPressThemeType;
  files: WordPressGeneratedFile[];
  summary: {
    totalFiles: number;
    totalTemplates: number;
    totalParts: number;
    totalPatterns: number;
    totalBytes: number;
  };
}

export interface WordPressValidationItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: 'metadata' | 'theme-json' | 'templates' | 'security' | 'standards';
  file?: string;
  message: string;
  recommendation: string;
}

export interface WordPressValidationResult {
  isValid: boolean;
  totalErrors: number;
  totalWarnings: number;
  totalInfo: number;
  items: WordPressValidationItem[];
  scorePercent: number;
}
