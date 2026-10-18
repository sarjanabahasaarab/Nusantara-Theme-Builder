/**
 * Nusantara Theme Builder — Validation Service
 * Layanan terpadu untuk validasi input pengguna dan file proyek.
 */

import {
  validateProjectName,
  validateProjectStructure,
  parseAndValidateProjectJson,
  ValidationResult
} from '../domain/project/project-validator';

export const validationService = {
  validateProjectName,
  validateProjectStructure,
  parseAndValidateProjectJson
};
