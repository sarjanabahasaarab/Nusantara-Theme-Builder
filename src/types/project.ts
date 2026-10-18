/**
 * Nusantara Theme Builder — Project Domain Types
 * Lisensi: MIT
 * Phase 1 & Phase 2 Foundation
 */

export type TargetPlatform = 'blogger' | 'wordpress';

export type ComponentCategory =
  | 'layout'
  | 'header'
  | 'navigation'
  | 'content'
  | 'article'
  | 'sidebar'
  | 'footer'
  | 'media'
  | 'basic';

export interface ComponentStyleProps {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  fontSize?: string;
  fontWeight?: string;
  customCss?: string;
}

export interface ThemeComponent {
  id: string;
  type: string;
  label: string;
  category: ComponentCategory;
  props: {
    title?: string;
    content?: string;
    subtitle?: string;
    href?: string;
    alt?: string;
    imageUrl?: string;
    items?: Array<{ id: string; label: string; url: string }>;
    columns?: number;
    showDate?: boolean;
    showAuthor?: boolean;
    buttonText?: string;
    buttonUrl?: string;
    [key: string]: unknown;
  };
  styles: ComponentStyleProps;
  children?: ThemeComponent[];
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamilySans: string;
  fontFamilyHeading: string;
  containerMaxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  darkModeSupport: boolean;
  customHeadCode?: string;
}

export interface ProjectPage {
  id: string;
  title: string;
  slug: string;
  isHome?: boolean;
  components: ThemeComponent[];
}

export type AssetType = 'image' | 'svg' | 'font' | 'css' | 'js' | 'html' | 'text';

export interface ProjectAsset {
  id: string;
  name: string;
  type: AssetType;
  mimeType: string;
  sizeBytes: number;
  path: string; // e.g. "assets/hero.png"
  dataUrl?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMetadata {
  author: string;
  authorUrl?: string;
  description: string;
  version: string;
  license: string;
  tags: string[];
}

export interface ProjectFileNode {
  id: string;
  name: string;
  path: string; // e.g. "styles/main.css"
  type: 'file' | 'folder';
  extension?: string;
  sizeBytes?: number;
  updatedAt: string;
  content?: string;
  isSystemFolder?: boolean;
  children?: ProjectFileNode[];
}

export interface Project {
  schemaVersion: '1.0.0';
  id: string;
  name: string;
  targetPlatform: TargetPlatform;
  createdAt: string;
  updatedAt: string;
  storagePath?: string;
  themeSettings: ThemeSettings;
  pages: ProjectPage[];
  assets: ProjectAsset[];
  customFiles?: ProjectFileNode[];
  metadata: ProjectMetadata;
}

export interface ProjectSummary {
  id: string;
  name: string;
  targetPlatform: TargetPlatform;
  createdAt: string;
  updatedAt: string;
  storagePath?: string;
  pageCount: number;
  componentCount: number;
  assetCount?: number;
}
