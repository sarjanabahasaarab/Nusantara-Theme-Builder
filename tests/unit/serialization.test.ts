/**
 * Nusantara Theme Builder — Unit Tests: Serialisasi & Deserialisasi
 */

import { describe, it, expect } from 'vitest';
import { createNewProject } from '../../src/domain/project/project-factory';
import { projectService } from '../../src/services/project-service';
import { Project } from '../../src/types/project';

describe('Project Serialization & Deserialization', () => {
  it('dapat mengekspor model proyek ke format JSON berlekuk rapi (indented JSON)', () => {
    const project = createNewProject('Proyek Serialisasi', 'blogger');
    const jsonStr = projectService.exportAsJsonString(project);

    expect(typeof jsonStr).toBe('string');
    expect(jsonStr).toContain('"schemaVersion": "1.0.0"');
    expect(jsonStr).toContain('"name": "Proyek Serialisasi"');
    expect(jsonStr).toContain('\n  '); // indentation check
  });

  it('dapat mengimpor dan memulihkan objek proyek tanpa kehilangan data properti', () => {
    const original = createNewProject('Proyek Asli', 'wordpress', 'tech-blog');
    const exportedStr = projectService.exportAsJsonString(original);
    const imported = projectService.importFromJsonString(exportedStr);

    expect(imported.validation.isValid).toBe(true);
    expect(imported.project).not.toBeNull();

    const restored = imported.project as Project;
    expect(restored.id).toBe(original.id);
    expect(restored.name).toBe(original.name);
    expect(restored.targetPlatform).toBe(original.targetPlatform);
    expect(restored.themeSettings.primaryColor).toBe(original.themeSettings.primaryColor);
    expect(restored.pages[0].components.length).toBe(original.pages[0].components.length);
  });
});
