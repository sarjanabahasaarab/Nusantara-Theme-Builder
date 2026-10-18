/**
 * Nusantara Theme Builder — WordPress Architecture Domain Types
 * Disiapkan untuk pengembangan Phase 5 (WordPress Builder)
 */

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

export interface WordPressBlockPattern {
  name: string;
  title: string;
  description: string;
  categories: string[];
  content: string;
}

export interface WordPressTemplatePart {
  name: string;
  title: string;
  area: 'header' | 'footer' | 'sidebar' | 'general';
  content: string;
}

export interface WordPressThemeJsonConfig {
  version: 3;
  settings: {
    appearanceTools?: boolean;
    color?: {
      palette?: Array<{ slug: string; color: string; name: string }>;
      custom?: boolean;
    };
    typography?: {
      fontFamilies?: Array<{ fontFamily: string; name: string; slug: string }>;
      fontSizes?: Array<{ slug: string; size: string; name: string }>;
    };
    layout?: {
      contentSize?: string;
      wideSize?: string;
    };
  };
  styles: Record<string, unknown>;
}
