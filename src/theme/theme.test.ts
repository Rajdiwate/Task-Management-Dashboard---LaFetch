import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { applyTheme, getCurrentTheme } from './theme';

describe('Theme Utilities', () => {
  // Mock document.documentElement
  const originalDocumentElement = document.documentElement;
  const mockSetAttribute = vi.fn();
  const mockRemoveAttribute = vi.fn();

  beforeEach(() => {
    // Setup mocks
    Object.defineProperty(document, 'documentElement', {
      value: {
        ...originalDocumentElement,
        setAttribute: mockSetAttribute,
        removeAttribute: mockRemoveAttribute,
      },
      writable: true,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original documentElement
    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      writable: true,
    });
  });

  describe('applyTheme', () => {
    it('should apply light theme', () => {
      applyTheme('light');
      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'light');
    });

    it('should apply dark theme', () => {
      applyTheme('dark');
      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });
  });

  describe('getCurrentTheme', () => {
    it('should return the current theme', () => {
      applyTheme('dark');
      expect(getCurrentTheme()).toBe('dark');

      applyTheme('light');
      expect(getCurrentTheme()).toBe('light');
    });
  });
});
