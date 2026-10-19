/**
 * Nusantara Theme Builder — Blogger Types & Interfaces
 * Spesifikasi domain & schema konfigurasi Blogger Theme (Phase 4)
 * Lisensi: MIT
 */

import { ThemeComponent } from '../../../types/project';

export interface BloggerIdentitySettings {
  blogTitle: string;
  blogDescription: string;
  useDynamicTitleTag: boolean; // Menggunakan <data:blog.pageTitle/>
  useDynamicDescription: boolean; // Menggunakan <data:blog.metaDescription/>
  logoUrl?: string;
  faviconUrl?: string;
  showLogoWithTitle: 'logo_only' | 'title_only' | 'both';
}

export interface BloggerLayoutSettings {
  containerMaxWidth: '1024px' | '1140px' | '1200px' | '1280px' | '1440px' | 'full';
  layoutType: 'one-column' | 'two-column-right-sidebar' | 'two-column-left-sidebar' | 'three-column';
  contentWidthPercent: number; // e.g. 70 (%)
  sidebarWidthPercent: number; // e.g. 30 (%)
  headerSticky: boolean;
  enableBreadcrumbs: boolean;
  enablePagination: boolean;
  postsPerPage: number;
}

export interface BloggerAppearanceSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  surfaceColor: string;
  borderColor: string;
  fontFamilySans: string;
  fontFamilyHeading: string;
  fontSizeBase: string; // e.g. "16px"
  borderRadius: string; // e.g. "8px"
  boxShadow: 'none' | 'sm' | 'md' | 'lg';
  buttonStyle: 'rounded' | 'pill' | 'square';
  cardStyle: 'bordered' | 'elevated' | 'flat';
}

export interface BloggerArticleSettings {
  showFeaturedImage: boolean;
  imageAspectRatio: '16:9' | '4:3' | '1:1' | 'auto';
  showAuthor: boolean;
  showDate: boolean;
  showLabels: boolean;
  showCommentsCount: boolean;
  showSnippet: boolean;
  snippetLength: number; // e.g. 140
  readMoreText: string;
  enableComments: boolean;
  commentsSystem: 'blogger' | 'disqus' | 'none';
  disqusShortname?: string;
}

export interface BloggerSeoSettings {
  enableCanonical: boolean;
  enableOpenGraph: boolean;
  enableTwitterCards: boolean;
  enableStructuredData: boolean; // Schema.org Article / BlogPosting
  metaRobots: 'all' | 'noindex,follow' | 'index,nofollow';
  defaultKeywords: string;
  authorTwitterHandle?: string;
  fbAppId?: string;
}

export interface BloggerSettings {
  version: '2' | '3'; // Blogger template version format
  identity: BloggerIdentitySettings;
  layout: BloggerLayoutSettings;
  appearance: BloggerAppearanceSettings;
  article: BloggerArticleSettings;
  seo: BloggerSeoSettings;
  customHeadCode?: string;
  customCss?: string;
}

export type ComponentSupportStatus = 'supported' | 'partial' | 'unsupported';

export interface BloggerMappedComponent {
  component: ThemeComponent;
  targetWidgetType?: string; // e.g. "Header", "Blog", "PageList", "Attribution", "HTML"
  targetSection: 'header' | 'navigation' | 'main' | 'sidebar' | 'footer';
  supportStatus: ComponentSupportStatus;
  notes: string;
}

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationItem {
  id: string;
  category: 'syntax' | 'template' | 'quality_seo';
  severity: ValidationSeverity;
  title: string;
  message: string;
  location?: string; // line number or element selector
  suggestion?: string;
}

export interface ValidationReport {
  isValid: boolean;
  syntaxErrors: ValidationItem[];
  templateIssues: ValidationItem[];
  qualityIssues: ValidationItem[];
  totalErrors: number;
  totalWarnings: number;
  totalInfos: number;
  timestamp: string;
}

export interface BloggerImportResult {
  success: boolean;
  rawXmlLength: number;
  skinVariablesCount: number;
  sectionsCount: number;
  widgetsCount: number;
  detectedWidgetTypes: string[];
  extractedSettings?: Partial<BloggerSettings>;
  mappedComponents: ThemeComponent[];
  unsupportedElements: string[];
  warnings: string[];
  errors: string[];
}
