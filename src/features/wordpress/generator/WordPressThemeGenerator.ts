/**
 * Nusantara Theme Builder — WordPress Theme Generator
 * Mengorkestrasi seluruh berkas paket tema WordPress (Block Theme FSE & Classic Foundation)
 * Lisensi: MIT
 */

import {
  WordPressSettings,
  WordPressGeneratedFile,
  WordPressThemePackage
} from '../types/wordpress';
import { generateThemeJson } from './WordPressThemeJsonGenerator';
import {
  generateStyleCss,
  generateFunctionsPhp,
  generatePatternPhp,
  generateReadmeTxt,
  generateClassicIndexPhp,
  generateClassicHeaderPhp,
  generateClassicFooterPhp
} from './WordPressPhpGenerator';
import {
  serializeComponentsToTemplateHtml,
  serializeComponentToGutenberg
} from './WordPressBlockSerializer';
import { generateScreenshotSvg } from '../utils/screenshotGenerator';

export function generateWordPressThemePackage(settings: WordPressSettings): WordPressThemePackage {
  const files: WordPressGeneratedFile[] = [];
  const slug = settings.metadata.textDomain;

  // 1. Core Files
  // style.css
  const styleCssContent = generateStyleCss(settings);
  files.push({
    path: 'style.css',
    content: styleCssContent,
    category: 'core',
    sizeBytes: new Blob([styleCssContent]).size
  });

  // theme.json
  const themeJsonContent = generateThemeJson(settings);
  files.push({
    path: 'theme.json',
    content: themeJsonContent,
    category: 'core',
    sizeBytes: new Blob([themeJsonContent]).size
  });

  // readme.txt
  const readmeContent = generateReadmeTxt(settings);
  files.push({
    path: 'readme.txt',
    content: readmeContent,
    category: 'core',
    sizeBytes: new Blob([readmeContent]).size
  });

  // functions.php
  const functionsContent = generateFunctionsPhp(settings);
  files.push({
    path: 'functions.php',
    content: functionsContent,
    category: 'php',
    sizeBytes: new Blob([functionsContent]).size
  });

  // screenshot
  const screenshotContent = generateScreenshotSvg(settings);
  files.push({
    path: 'screenshot.svg',
    content: screenshotContent,
    category: 'asset',
    sizeBytes: new Blob([screenshotContent]).size
  });

  // 2. Templates (templates/*.html)
  for (const tpl of settings.templates) {
    let tplContent = '';
    if (tpl.rawHtml) {
      tplContent = tpl.rawHtml;
    } else {
      tplContent = serializeComponentsToTemplateHtml(
        tpl.components,
        slug,
        true, // include header part
        true  // include footer part
      );
    }

    files.push({
      path: `templates/${tpl.id}.html`,
      content: tplContent,
      category: 'template',
      sizeBytes: new Blob([tplContent]).size
    });
  }

  // 3. Template Parts (parts/*.html)
  for (const part of settings.templateParts) {
    let partContent = '';
    if (part.rawHtml) {
      partContent = part.rawHtml;
    } else {
      partContent = part.components
        .map((c) => serializeComponentToGutenberg(c, slug))
        .join('\n\n');
    }

    files.push({
      path: `parts/${part.id}.html`,
      content: partContent,
      category: 'part',
      sizeBytes: new Blob([partContent]).size
    });
  }

  // 4. Block Patterns (patterns/*.php)
  for (const pattern of settings.customPatterns) {
    const patternContent = generatePatternPhp(pattern, slug);
    files.push({
      path: `patterns/${pattern.name}.php`,
      content: patternContent,
      category: 'pattern',
      sizeBytes: new Blob([patternContent]).size
    });
  }

  // 5. Assets (assets/css/custom.css)
  if (settings.includeCustomCss && settings.customCssContent) {
    files.push({
      path: 'assets/css/custom.css',
      content: settings.customCssContent,
      category: 'asset',
      sizeBytes: new Blob([settings.customCssContent]).size
    });
  }

  // 6. Classic Fallback PHP templates if themeType is classic
  if (settings.themeType === 'classic') {
    const classicIndex = generateClassicIndexPhp(settings);
    files.push({
      path: 'index.php',
      content: classicIndex,
      category: 'php',
      sizeBytes: new Blob([classicIndex]).size
    });

    const classicHeader = generateClassicHeaderPhp(settings);
    files.push({
      path: 'header.php',
      content: classicHeader,
      category: 'php',
      sizeBytes: new Blob([classicHeader]).size
    });

    const classicFooter = generateClassicFooterPhp(settings);
    files.push({
      path: 'footer.php',
      content: classicFooter,
      category: 'php',
      sizeBytes: new Blob([classicFooter]).size
    });
  }

  const totalBytes = files.reduce((acc, f) => acc + f.sizeBytes, 0);

  return {
    themeSlug: slug,
    themeName: settings.metadata.themeName,
    version: settings.metadata.version,
    themeType: settings.themeType,
    files,
    summary: {
      totalFiles: files.length,
      totalTemplates: settings.templates.length,
      totalParts: settings.templateParts.length,
      totalPatterns: settings.customPatterns.length,
      totalBytes
    }
  };
}
