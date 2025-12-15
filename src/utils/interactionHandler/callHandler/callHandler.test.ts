import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callHandler } from './callHandler';
import { logger } from '@/utils/logger';

// Mock the logger
vi.mock('@/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('callHandler', () => {
  let hrefSpy: ReturnType<typeof vi.fn>;
  let hrefValue: string;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Reset href value
    hrefValue = '';

    // Create a spy for window.location.href
    hrefSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: {
        get href() {
          return hrefValue;
        },
        set href(value: string) {
          hrefValue = value;
          hrefSpy(value);
        },
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initiate call with valid contact number', () => {
    const contactNumber = '9999999999';

    callHandler(contactNumber);

    expect(hrefSpy).toHaveBeenCalledWith('tel:9999999999');
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should trim whitespace from contact number', () => {
    const contactNumber = '  9999999999  ';

    callHandler(contactNumber);

    expect(hrefSpy).toHaveBeenCalledWith('tel:9999999999');
  });

  it('should log warning when contact number is undefined', () => {
    callHandler(undefined);

    expect(logger.warn).toHaveBeenCalledWith('No contact number provided');
    expect(hrefSpy).not.toHaveBeenCalled();
  });

  it('should log warning when contact number is empty string', () => {
    callHandler('');

    expect(logger.warn).toHaveBeenCalledWith('No contact number provided');
    expect(hrefSpy).not.toHaveBeenCalled();
  });

  it('should log warning when contact number is only whitespace', () => {
    callHandler('   ');

    expect(logger.warn).toHaveBeenCalledWith('No contact number provided');
    expect(hrefSpy).not.toHaveBeenCalled();
  });

  it('should log error when setting href throws an error', () => {
    const contactNumber = '9999999999';
    const mockError = new Error('Navigation failed');

    // Override the href setter to throw an error
    Object.defineProperty(window.location, 'href', {
      set: vi.fn(() => {
        throw mockError;
      }),
      configurable: true,
    });

    callHandler(contactNumber);

    expect(logger.error).toHaveBeenCalledWith('Failed to initiate call:', 'Navigation failed');
  });

  it('should handle non-Error exceptions', () => {
    const contactNumber = '9999999999';

    // Override the href setter to throw a non-Error value
    Object.defineProperty(window.location, 'href', {
      set: vi.fn(() => {
        throw 'String error';
      }),
      configurable: true,
    });

    callHandler(contactNumber);

    expect(logger.error).toHaveBeenCalledWith('Failed to initiate call:', 'Unknown error');
  });
});
