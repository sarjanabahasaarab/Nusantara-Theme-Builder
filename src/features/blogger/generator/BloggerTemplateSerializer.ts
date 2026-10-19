/**
 * Nusantara Theme Builder — Blogger Template Serializer
 * Serializer XML template Google Blogger v2/v3 berstandar resmi
 * Menangani escaping XML, CDATA b:skin, b:section, b:widget, dan b:includable.
 * Lisensi: MIT
 */

import { Project, ThemeComponent } from '../../../types/project';
import { BloggerSettings } from '../types/blogger';

export class BloggerTemplateSerializer {
  /**
   * Escape karakter khusus untuk XML string
   */
  public static escapeXml(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Escape teks khusus untuk nilai atribut XML
   */
  public static escapeAttr(text: string): string {
    return this.escapeXml(text);
  }

  /**
   * Menghasilkan CSS terkompilasi untuk elemen <b:skin>
   */
  public static generateSkinCss(project: Project, settings: BloggerSettings): string {
    const { appearance, layout } = settings;

    return `
    /* ==========================================================================
       Nusantara Theme Builder — Blogger Theme Stylesheet
       Proyek: ${project.name}
       Lisensi: MIT
       ========================================================================== */
    
    :root {
      --primary-color: ${appearance.primaryColor};
      --secondary-color: ${appearance.secondaryColor};
      --bg-color: ${appearance.backgroundColor};
      --text-color: ${appearance.textColor};
      --surface-color: ${appearance.surfaceColor};
      --border-color: ${appearance.borderColor};
      --font-sans: '${appearance.fontFamilySans}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-heading: '${appearance.fontFamilyHeading}', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-size-base: ${appearance.fontSizeBase};
      --border-radius: ${appearance.borderRadius};
      --max-container: ${layout.containerMaxWidth === 'full' ? '100%' : layout.containerMaxWidth};
      --content-width: ${layout.contentWidthPercent}%;
      --sidebar-width: ${layout.sidebarWidthPercent}%;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-sans);
      font-size: var(--font-size-base);
      line-height: 1.6;
      background-color: var(--bg-color);
      color: var(--text-color);
      -webkit-font-smoothing: antialiased;
    }

    a {
      color: var(--primary-color);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    a:hover {
      text-decoration: underline;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    /* Container */
    .ntb-container {
      width: 100%;
      max-width: var(--max-container);
      margin-left: auto;
      margin-right: auto;
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }

    /* Site Header */
    .site-header {
      background-color: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
      padding: 1.25rem 0;
      ${layout.headerSticky ? 'position: sticky; top: 0; z-index: 40; backdrop-filter: blur(8px);' : ''}
    }

    .site-header .Header h1 {
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.025em;
    }

    .site-header .Header p.description {
      font-size: 0.875rem;
      opacity: 0.75;
      margin-top: 0.25rem;
    }

    /* Navigation */
    .site-nav {
      background-color: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
    }

    .site-nav ul {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      gap: 1.5rem;
      padding: 0.75rem 0;
      font-size: 0.875rem;
      font-weight: 600;
    }

    /* Layout Columns */
    .layout-wrapper {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem 0;
    }

    @media (min-width: 768px) {
      .layout-wrapper.two-column-right-sidebar {
        flex-direction: row;
      }
      .layout-wrapper.two-column-left-sidebar {
        flex-direction: row-reverse;
      }
      .layout-wrapper.two-column-right-sidebar .main-section,
      .layout-wrapper.two-column-left-sidebar .main-section {
        width: var(--content-width);
        flex: 1 1 var(--content-width);
      }
      .layout-wrapper.two-column-right-sidebar .sidebar-section,
      .layout-wrapper.two-column-left-sidebar .sidebar-section {
        width: var(--sidebar-width);
        flex: 0 0 var(--sidebar-width);
      }
    }

    /* Blog Posts */
    .post {
      background-color: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 1.75rem;
      margin-bottom: 2rem;
      box-shadow: ${
        appearance.boxShadow === 'sm'
          ? '0 1px 2px rgba(0,0,0,0.05)'
          : appearance.boxShadow === 'md'
          ? '0 4px 6px rgba(0,0,0,0.1)'
          : appearance.boxShadow === 'lg'
          ? '0 10px 15px rgba(0,0,0,0.15)'
          : 'none'
      };
    }

    .post-title {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .post-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
      font-size: 0.75rem;
      color: #a1a1aa;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-color);
    }

    .post-body {
      font-size: 0.9375rem;
      line-height: 1.75;
    }

    .read-more-btn {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background-color: var(--primary-color);
      color: #09090b;
      font-weight: 700;
      font-size: 0.8125rem;
      border-radius: ${appearance.buttonStyle === 'pill' ? '9999px' : appearance.buttonStyle === 'square' ? '0px' : '6px'};
      transition: opacity 0.2s;
    }
    .read-more-btn:hover {
      opacity: 0.9;
      text-decoration: none;
    }

    /* Sidebar Widgets */
    .sidebar-section .widget {
      background-color: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .sidebar-section .widget h2 {
      font-size: 1rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    /* Footer */
    .site-footer {
      background-color: var(--surface-color);
      border-top: 1px solid var(--border-color);
      padding: 2.5rem 0;
      margin-top: 3rem;
      text-align: center;
      font-size: 0.8125rem;
      color: #a1a1aa;
    }

    /* Custom CSS Overrides */
    ${settings.customCss || ''}
    `;
  }

  /**
   * Menghasilkan dokumen XML lengkap tema Blogger
   */
  public static serializeTheme(
    project: Project,
    settings: BloggerSettings,
    components: ThemeComponent[] = []
  ): string {
    const skinCss = this.generateSkinCss(project, settings);
    const { identity, seo, layout } = settings;

    // Check custom components to convert to HTML widget
    const customHtmlSnippets = components
      .filter((c) => c.type === 'html' || c.type === 'custom-html')
      .map(
        (c, idx) => `
        <b:widget id='CustomHTML${idx + 1}' locked='false' title='${this.escapeAttr(c.label || 'Widget Tambahan')}' type='HTML'>
          <b:includable id='main'>
            <div class='custom-html-wrapper'>
              <data:content/>
            </div>
          </b:includable>
        </b:widget>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:responsive='true' b:version='${settings.version}' class='v2' expr:dir='data:blog.languageDirection' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
  <meta charset='utf-8'/>
  <meta content='width=device-width, initial-scale=1, shrink-to-fit=no' name='viewport'/>

  <!-- Title Tag Dinamis Blogger -->
  <b:if cond='data:blog.pageType == &quot;index&quot;'>
    <title><data:blog.pageTitle/></title>
  <b:else/>
    <b:if cond='data:blog.pageType != &quot;error_page&quot;'>
      <title><data:blog.pageName/> - <data:blog.title/></title>
    <b:else/>
      <title>404 Halaman Tidak Ditemukan - <data:blog.title/></title>
    </b:if>
  </b:if>

  <!-- Canonical URL & Meta Deskripsi -->
  ${seo.enableCanonical ? "<link expr:href='data:blog.canonicalUrl' rel='canonical'/>" : ''}
  <b:if cond='data:blog.metaDescription'>
    <meta expr:content='data:blog.metaDescription' name='description'/>
  </b:if>
  <meta content='${this.escapeAttr(seo.metaRobots)}' name='robots'/>

  <!-- Open Graph & Social Cards -->
  ${
    seo.enableOpenGraph
      ? `
  <meta expr:content='data:blog.pageTitle' property='og:title'/>
  <meta expr:content='data:blog.canonicalUrl' property='og:url'/>
  <meta expr:content='data:blog.title' property='og:site_name'/>
  <b:if cond='data:blog.postImageUrl'>
    <meta expr:content='data:blog.postImageUrl' property='og:image'/>
  </b:if>
  `
      : ''
  }

  <!-- Font Typography Google Fonts -->
  <link rel='preconnect' href='https://fonts.googleapis.com'/>
  <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin='anonymous'/>
  <link href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&amp;display=swap' rel='stylesheet'/>

  ${settings.customHeadCode ? `<!-- Custom Head Code -->\n  ${settings.customHeadCode}\n` : ''}

  <!-- Blogger Skin CSS Variable Engine -->
  <b:skin><![CDATA[${skinCss}]]></b:skin>
</head>

<body>
  <!-- Header Section -->
  <header class='site-header'>
    <div class='ntb-container'>
      <b:section id='header-section' maxwidgets='2' showaddelement='no'>
        <b:widget id='Header1' locked='true' title='${this.escapeAttr(identity.blogTitle)}' type='Header'>
          <b:includable id='main'>
            <div class='Header'>
              <b:if cond='data:useImage'>
                <a expr:href='data:blog.homepageUrl'>
                  <img expr:alt='data:title' expr:src='data:sourceUrl'/>
                </a>
              <b:else/>
                <h1>
                  <a expr:href='data:blog.homepageUrl'><data:title/></a>
                </h1>
                <p class='description'><data:description/></p>
              </b:if>
            </div>
          </b:includable>
        </b:widget>
      </b:section>
    </div>
  </header>

  <!-- Navigation Section -->
  <nav class='site-nav'>
    <div class='ntb-container'>
      <b:section id='nav-section' maxwidgets='1' showaddelement='no'>
        <b:widget id='PageList1' locked='true' title='Menu Navigasi' type='PageList'>
          <b:includable id='main'>
            <div class='widget-content'>
              <ul>
                <b:loop values='data:links' var='link'>
                  <li>
                    <a expr:href='data:link.href'><data:link.title/></a>
                  </li>
                </b:loop>
              </ul>
            </div>
          </b:includable>
        </b:widget>
      </b:section>
    </div>
  </nav>

  <!-- Main Content & Layout Wrapper -->
  <div class='ntb-container'>
    <div class='layout-wrapper ${layout.layoutType}'>
      <!-- Main Content Section -->
      <main class='main-section' role='main'>
        <b:section id='main-section' showaddelement='no'>
          <b:widget id='Blog1' locked='true' title='Posting Blog' type='Blog'>
            <b:includable id='main' var='top'>
              <div class='blog-posts hfeed'>
                <b:loop values='data:posts' var='post'>
                  <b:include data='post' name='post'/>
                </b:loop>
              </div>

              <!-- Pagination Navigation -->
              <b:include name='nextprev'/>
            </b:includable>

            <!-- Template Includable: Single Post Article -->
            <b:includable id='post' var='post'>
              <article class='post hentry' expr:id='&quot;post-&quot; + data:post.id'>
                <!-- Breadcrumbs -->
                ${
                  layout.enableBreadcrumbs
                    ? `
                <b:if cond='data:blog.pageType == &quot;item&quot;'>
                  <div class='breadcrumbs' style='font-size: 0.75rem; margin-bottom: 0.75rem; color: #a1a1aa;'>
                    <a expr:href='data:blog.homepageUrl'>Beranda</a> &gt; <span><data:post.title/></span>
                  </div>
                </b:if>`
                    : ''
                }

                <h2 class='post-title entry-title'>
                  <b:if cond='data:post.link'>
                    <a expr:href='data:post.link'><data:post.title/></a>
                  <b:else/>
                    <b:if cond='data:post.url'>
                      <a expr:href='data:post.url'><data:post.title/></a>
                    <b:else/>
                      <data:post.title/>
                    </b:if>
                  </b:if>
                </h2>

                <div class='post-meta'>
                  <span class='post-author author vcard'>
                    Oleh <span class='fn'><data:post.author/></span>
                  </span>
                  <span class='post-date published' expr:title='data:post.timestampISO8601'>
                    <data:post.dateHeader/>
                  </span>
                  <b:if cond='data:post.numComments'>
                    <span class='post-comments-count'>
                      <data:post.numComments/> Komentar
                    </span>
                  </b:if>
                </div>

                <!-- Post Body / Snippet -->
                <div class='post-body entry-content'>
                  <b:if cond='data:blog.pageType == &quot;item&quot; or data:blog.pageType == &quot;static_page&quot;'>
                    <data:post.body/>
                  <b:else/>
                    <b:if cond='data:post.snippet'>
                      <p><data:post.snippet/></p>
                      <a class='read-more-btn' expr:href='data:post.url'>${this.escapeXml(
                        settings.article.readMoreText
                      )}</a>
                    <b:else/>
                      <data:post.body/>
                    </b:if>
                  </b:if>
                </div>
              </article>
            </b:includable>

            <!-- Template Includable: Pagination -->
            <b:includable id='nextprev'>
              <div class='blog-pager' id='blog-pager' style='display: flex; justify-content: space-between; padding: 1.5rem 0;'>
                <b:if cond='data:newerPageUrl'>
                  <a class='blog-pager-newer-link' expr:href='data:newerPageUrl' id='blog-pager-newer-link' title='Posting Lebih Baru'>
                    &larr; Posting Lebih Baru
                  </a>
                </b:if>
                <b:if cond='data:olderPageUrl'>
                  <a class='blog-pager-older-link' expr:href='data:olderPageUrl' id='blog-pager-older-link' title='Posting Lebih Lama'>
                    Posting Lebih Lama &rarr;
                  </a>
                </b:if>
              </div>
            </b:includable>
          </b:widget>
          ${customHtmlSnippets}
        </b:section>
      </main>

      <!-- Sidebar Section -->
      ${
        layout.layoutType !== 'one-column'
          ? `
      <aside class='sidebar-section' role='complementary'>
        <b:section id='sidebar-section' showaddelement='yes'>
          <b:widget id='PopularPosts1' locked='false' title='Artikel Populer' type='PopularPosts'>
            <b:includable id='main'>
              <div class='widget PopularPosts'>
                <h2><data:title/></h2>
                <div class='widget-content'>
                  <ul>
                    <b:loop values='data:posts' var='post'>
                      <li style='margin-bottom: 0.5rem;'>
                        <a expr:href='data:post.href'><data:post.title/></a>
                      </li>
                    </b:loop>
                  </ul>
                </div>
              </div>
            </b:includable>
          </b:widget>

          <b:widget id='Label1' locked='false' title='Kategori Label' type='Label'>
            <b:includable id='main'>
              <div class='widget Label'>
                <h2><data:title/></h2>
                <div class='widget-content list-label-widget-content'>
                  <ul style='list-style: none; display: flex; flex-wrap: wrap; gap: 0.5rem;'>
                    <b:loop values='data:labels' var='label'>
                      <li>
                        <a expr:href='data:label.url' style='font-size: 0.75rem; background: var(--border-color); padding: 0.25rem 0.5rem; border-radius: 4px;'>
                          <data:label.name/> (<data:label.count/>)
                        </a>
                      </li>
                    </b:loop>
                  </ul>
                </div>
              </div>
            </b:includable>
          </b:widget>
        </b:section>
      </aside>`
          : ''
      }
    </div>
  </div>

  <!-- Footer Section -->
  <footer class='site-footer'>
    <div class='ntb-container'>
      <b:section id='footer-section' maxwidgets='3' showaddelement='yes'>
        <b:widget id='Attribution1' locked='true' title='Hak Cipta' type='Attribution'>
          <b:includable id='main'>
            <div class='widget-content' style='text-align: center;'>
              <p>&copy; <data:blog.title/>. Dibuat dengan <a href='https://github.com/nusantara-theme-builder' rel='noopener' target='_blank'>Nusantara Theme Builder</a>.</p>
            </div>
          </b:includable>
        </b:widget>
      </b:section>
    </div>
  </footer>
</body>
</html>`;
  }
}
