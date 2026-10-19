/**
 * Nusantara Theme Builder — Default Blogger Settings
 * Generator default settings Blogger dari tema aktif
 * Lisensi: MIT
 */

import { Project } from '../../../types/project';
import { BloggerSettings } from '../types/blogger';

export function getDefaultBloggerSettings(project?: Project | null): BloggerSettings {
  const name = project?.name || 'Blog Nusantara';
  const desc = project?.metadata?.description || 'Template Blogger modern karya kreator Indonesia.';
  const theme = project?.themeSettings;

  return {
    version: '2',
    identity: {
      blogTitle: name,
      blogDescription: desc,
      useDynamicTitleTag: true,
      useDynamicDescription: true,
      showLogoWithTitle: 'both',
      logoUrl: '',
      faviconUrl: ''
    },
    layout: {
      containerMaxWidth: '1200px',
      layoutType: 'two-column-right-sidebar',
      contentWidthPercent: 70,
      sidebarWidthPercent: 30,
      headerSticky: true,
      enableBreadcrumbs: true,
      enablePagination: true,
      postsPerPage: 6
    },
    appearance: {
      primaryColor: theme?.primaryColor || '#f59e0b',
      secondaryColor: theme?.secondaryColor || '#d97706',
      backgroundColor: theme?.backgroundColor || '#09090b',
      textColor: theme?.textColor || '#f4f4f5',
      surfaceColor: '#18181b',
      borderColor: '#27272a',
      fontFamilySans: theme?.fontFamilySans || 'Plus Jakarta Sans',
      fontFamilyHeading: theme?.fontFamilyHeading || 'Plus Jakarta Sans',
      fontSizeBase: '15px',
      borderRadius: '8px',
      boxShadow: 'md',
      buttonStyle: 'rounded',
      cardStyle: 'bordered'
    },
    article: {
      showFeaturedImage: true,
      imageAspectRatio: '16:9',
      showAuthor: true,
      showDate: true,
      showLabels: true,
      showCommentsCount: true,
      showSnippet: true,
      snippetLength: 140,
      readMoreText: 'Baca Selengkapnya →',
      enableComments: true,
      commentsSystem: 'blogger'
    },
    seo: {
      enableCanonical: true,
      enableOpenGraph: true,
      enableTwitterCards: true,
      enableStructuredData: true,
      metaRobots: 'all',
      defaultKeywords: 'blogger, blogspot, template, nusantara, responsive',
      authorTwitterHandle: ''
    },
    customHeadCode: '',
    customCss: ''
  };
}
