/**
 * Nusantara Theme Builder — Blogger Architecture Domain Types
 * Disiapkan untuk pengembangan Phase 4 (Blogger Builder)
 */

export type BloggerSectionType = 'header' | 'main' | 'sidebar' | 'footer';

export type BloggerWidgetType =
  | 'Header'
  | 'Blog'
  | 'HTML'
  | 'Profile'
  | 'PopularPosts'
  | 'FeaturedPost'
  | 'PageList'
  | 'Label'
  | 'Feed'
  | 'Attribution';

export interface BloggerWidgetDef {
  id: string;
  type: BloggerWidgetType;
  title: string;
  locked: boolean;
  visible: boolean;
}

export interface BloggerSectionDef {
  id: string;
  className: string;
  maxwidgets?: number;
  showaddelement: 'yes' | 'no';
  widgets: BloggerWidgetDef[];
}

export interface BloggerSkinVariable {
  name: string;
  description: string;
  type: 'color' | 'font' | 'length' | 'string';
  default: string;
  value: string;
}

export interface BloggerTemplateConfig {
  bSkinVariables: BloggerSkinVariable[];
  responsiveViewport: boolean;
  includeDefaultCss: boolean;
  includeJQuery: boolean;
  bDataTagsUsed: string[];
}
