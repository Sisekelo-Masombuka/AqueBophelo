/**
 * AquaBophelo Frontend Unit Tests — Citizen Fault & Pipe Leak Reporting
 */
import { describe, it, expect } from 'vitest';

describe('Citizen Issue Reporting & Photo Upload Validation', () => {
  it('validates uploaded image file size and MIME type', () => {
    const validateImageFile = (file) => {
      const MAX_BYTES = 5 * 1024 * 1024; // 5MB
      const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

      if (!file) return { valid: false, error: 'File is required' };
      if (!ALLOWED_TYPES.includes(file.type)) return { valid: false, error: 'Only JPEG, PNG, or WebP images are permitted' };
      if (file.size > MAX_BYTES) return { valid: false, error: 'File exceeds 5MB limit' };
      return { valid: true };
    };

    const validJpg = { type: 'image/jpeg', size: 2 * 1024 * 1024 };
    expect(validateImageFile(validJpg).valid).toBe(true);

    const oversized = { type: 'image/png', size: 6 * 1024 * 1024 };
    expect(validateImageFile(oversized).valid).toBe(false);
    expect(validateImageFile(oversized).error).toContain('5MB');

    const invalidType = { type: 'application/pdf', size: 1 * 1024 * 1024 };
    expect(validateImageFile(invalidType).valid).toBe(false);
    expect(validateImageFile(invalidType).error).toContain('Only JPEG');
  });

  it('generates compliant Sol Plaatje ticket reference numbers', () => {
    const generateTicketRef = (seq) => `#SPM-2026-${seq.toString().padStart(4, '0')}`;

    expect(generateTicketRef(1)).toBe('#SPM-2026-0001');
    expect(generateTicketRef(4410)).toBe('#SPM-2026-4410');
    expect(generateTicketRef(9812)).toBe('#SPM-2026-9812');
  });

  it('assigns appropriate priority based on reported category', () => {
    const evaluatePriority = (category) => {
      switch (category?.toLowerCase()) {
        case 'burst pipe':
        case 'sewage overflow':
          return 'Critical';
        case 'low water pressure':
        case 'meter leak':
          return 'High';
        case 'water discoloration':
          return 'Medium';
        default:
          return 'Low';
      }
    };

    expect(evaluatePriority('Burst Pipe')).toBe('Critical');
    expect(evaluatePriority('Low Water Pressure')).toBe('High');
    expect(evaluatePriority('Water Discoloration')).toBe('Medium');
    expect(evaluatePriority('General Inquiry')).toBe('Low');
  });
});
