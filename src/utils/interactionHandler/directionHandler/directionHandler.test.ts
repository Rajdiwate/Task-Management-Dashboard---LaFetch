import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { directionHandler } from './directionHandler';
import { logger } from '@/utils/logger';

// Mock the logger
vi.mock('@/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('directionHandler', () => {
  let windowOpenSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock window.open
    windowOpenSpy = vi.fn();
    window.open = windowOpenSpy;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should open map URL in new tab with valid URL', () => {
    const mapUrl = 'https://maps.google.com/maps?q=123+Main+St';

    directionHandler(mapUrl);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://maps.google.com/maps?q=123+Main+St',
      '_blank',
      'noopener,noreferrer',
    );
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should trim whitespace from map URL', () => {
    const mapUrl = '  https://maps.google.com/maps?q=test  ';

    directionHandler(mapUrl);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://maps.google.com/maps?q=test',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('should log warning when map URL is undefined', () => {
    directionHandler(undefined);

    expect(logger.warn).toHaveBeenCalledWith('No map URL provided');
    expect(windowOpenSpy).not.toHaveBeenCalled();
  });

  it('should log warning when map URL is empty string', () => {
    directionHandler('');

    expect(logger.warn).toHaveBeenCalledWith('No map URL provided');
    expect(windowOpenSpy).not.toHaveBeenCalled();
  });

  it('should log warning when map URL is only whitespace', () => {
    directionHandler('   ');

    expect(logger.warn).toHaveBeenCalledWith('No map URL provided');
    expect(windowOpenSpy).not.toHaveBeenCalled();
  });

  it('should handle Google Maps URL', () => {
    const mapUrl = 'https://www.google.com/maps/dir/?api=1&destination=40.7128,-74.0060';

    directionHandler(mapUrl);

    expect(windowOpenSpy).toHaveBeenCalledWith(mapUrl, '_blank', 'noopener,noreferrer');
  });

  it('should handle Apple Maps URL', () => {
    const mapUrl = 'https://maps.apple.com/?daddr=San+Francisco,CA';

    directionHandler(mapUrl);

    expect(windowOpenSpy).toHaveBeenCalledWith(mapUrl, '_blank', 'noopener,noreferrer');
  });

  it('should handle geo URI', () => {
    const mapUrl = 'geo:37.7749,-122.4194';

    directionHandler(mapUrl);

    expect(windowOpenSpy).toHaveBeenCalledWith(mapUrl, '_blank', 'noopener,noreferrer');
  });

  it('should log error when window.open throws an error', () => {
    const mapUrl = 'https://maps.google.com/maps?q=test';
    const mockError = new Error('Popup blocked');

    windowOpenSpy.mockImplementation(() => {
      throw mockError;
    });

    directionHandler(mapUrl);

    expect(logger.error).toHaveBeenCalledWith('Failed to open directions:', 'Popup blocked');
  });

  it('should handle non-Error exceptions', () => {
    const mapUrl = 'https://maps.google.com/maps?q=test';

    windowOpenSpy.mockImplementation(() => {
      throw 'String error';
    });

    directionHandler(mapUrl);

    expect(logger.error).toHaveBeenCalledWith('Failed to open directions:', 'Unknown error');
  });

  it('should handle URL with special characters', () => {
    const mapUrl = 'https://maps.google.com/maps?q=123+Main+St,+City+%26+State';

    directionHandler(mapUrl);

    expect(windowOpenSpy).toHaveBeenCalledWith(mapUrl, '_blank', 'noopener,noreferrer');
  });

  it('should handle URL with query parameters', () => {
    const mapUrl = 'https://maps.google.com/maps?q=address&zoom=15&layer=traffic';

    directionHandler(mapUrl);

    expect(windowOpenSpy).toHaveBeenCalledWith(mapUrl, '_blank', 'noopener,noreferrer');
  });

  it('should open with noopener and noreferrer for security', () => {
    const mapUrl = 'https://maps.google.com/maps?q=test';

    directionHandler(mapUrl);

    const callArgs = windowOpenSpy.mock.calls[0];
    expect(callArgs[2]).toBe('noopener,noreferrer');
  });
});
