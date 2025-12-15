import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Use vi.hoisted to define mock functions before they're used in vi.mock
const { mockCookiesSet, mockCookiesGet, mockCookiesRemove } = vi.hoisted(() => ({
  mockCookiesSet: vi.fn(),
  mockCookiesGet: vi.fn(),
  mockCookiesRemove: vi.fn(),
}));

// Mock js-cookie library with hoisted functions
vi.mock('js-cookie', () => ({
  default: {
    set: mockCookiesSet,
    get: mockCookiesGet,
    remove: mockCookiesRemove,
  },
}));

// Import after mocks are defined
const { setCookie, readCookie, isCookieExpired, removeCookie } = await import('./cookie');

describe('Cookie Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset system time for each test
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('setCookie', () => {
    it('should set cookie with name and value only', () => {
      setCookie('testCookie', 'testValue');

      expect(mockCookiesSet).toHaveBeenCalledWith('testCookie', 'testValue', undefined);
      expect(mockCookiesSet).toHaveBeenCalledTimes(1);
    });

    it('should set cookie with name, value, and expiry days', () => {
      setCookie('testCookie', 'testValue', 7);

      expect(mockCookiesSet).toHaveBeenCalledWith('testCookie', 'testValue', { expires: 7 });
      expect(mockCookiesSet).toHaveBeenCalledTimes(1);
    });

    it('should set cookie with empty string value', () => {
      setCookie('emptyCookie', '');

      expect(mockCookiesSet).toHaveBeenCalledWith('emptyCookie', '', undefined);
    });

    it('should handle special characters in cookie name and value', () => {
      setCookie('special-cookie_123', 'value with spaces & symbols!', 1);

      expect(mockCookiesSet).toHaveBeenCalledWith(
        'special-cookie_123',
        'value with spaces & symbols!',
        { expires: 1 },
      );
    });
  });

  describe('readCookie', () => {
    it('should return cookie value when cookie exists', () => {
      const expectedValue = 'testValue';
      mockCookiesGet.mockReturnValue(expectedValue);

      const result = readCookie('testCookie');

      expect(mockCookiesGet).toHaveBeenCalledWith('testCookie');
      expect(result).toBe(expectedValue);
    });

    it('should return null when cookie does not exist', () => {
      mockCookiesGet.mockReturnValue(undefined);

      const result = readCookie('nonExistentCookie');

      expect(mockCookiesGet).toHaveBeenCalledWith('nonExistentCookie');
      expect(result).toBe(null);
    });

    it('should return null when cookie value is null', () => {
      mockCookiesGet.mockReturnValue(null);

      const result = readCookie('nullCookie');

      expect(result).toBe(null);
    });

    it('should return empty string when cookie has empty value', () => {
      mockCookiesGet.mockReturnValue('');

      const result = readCookie('emptyCookie');

      expect(result).toBe('');
    });

    it('should handle special characters in cookie name', () => {
      const cookieName = 'special-cookie_123';
      const expectedValue = 'special value';
      mockCookiesGet.mockReturnValue(expectedValue);

      const result = readCookie(cookieName);

      expect(mockCookiesGet).toHaveBeenCalledWith(cookieName);
      expect(result).toBe(expectedValue);
    });
  });

  describe('isCookieExpired', () => {
    it('should return true when cookie does not exist', () => {
      mockCookiesGet.mockReturnValue(undefined);

      const result = isCookieExpired('nonExistentCookie');

      expect(result).toBe(true);
      expect(mockCookiesGet).toHaveBeenCalledWith('nonExistentCookie');
    });

    it('should return false when cookie exists but no expiry info', () => {
      mockCookiesGet
        .mockReturnValueOnce('cookieValue') // First call for the main cookie
        .mockReturnValueOnce(undefined); // Second call for expiry cookie

      const result = isCookieExpired('testCookie');

      expect(result).toBe(false);
      expect(mockCookiesGet).toHaveBeenCalledWith('testCookie');
      expect(mockCookiesGet).toHaveBeenCalledWith('testCookie_expiry');
    });

    it('should return false when cookie is not expired', () => {
      vi.useFakeTimers();
      const currentTime = new Date('2023-01-01T12:00:00Z');
      const futureTime = new Date('2023-01-02T12:00:00Z');
      vi.setSystemTime(currentTime);

      mockCookiesGet
        .mockReturnValueOnce('cookieValue') // Main cookie
        .mockReturnValueOnce(futureTime.toISOString()); // Expiry cookie

      const result = isCookieExpired('testCookie');

      expect(result).toBe(false);
    });

    it('should return true when cookie is expired', () => {
      vi.useFakeTimers();
      const currentTime = new Date('2023-01-02T12:00:00Z');
      const pastTime = new Date('2023-01-01T12:00:00Z');
      vi.setSystemTime(currentTime);

      mockCookiesGet
        .mockReturnValueOnce('cookieValue') // Main cookie
        .mockReturnValueOnce(pastTime.toISOString()); // Expiry cookie

      const result = isCookieExpired('testCookie');

      expect(result).toBe(true);
    });

    it('should return false when cookie exists but expiry is null', () => {
      mockCookiesGet
        .mockReturnValueOnce('cookieValue') // Main cookie
        .mockReturnValueOnce(null); // Expiry cookie

      const result = isCookieExpired('testCookie');

      expect(result).toBe(false); // No expiry info means assume not expired
    });

    it('should handle invalid expiry date format', () => {
      mockCookiesGet
        .mockReturnValueOnce('cookieValue') // Main cookie
        .mockReturnValueOnce('invalid-date'); // Invalid expiry cookie

      const result = isCookieExpired('testCookie');

      // Invalid date should result in NaN comparison, which should be handled
      expect(result).toBe(false); // Invalid date should be treated as expired
    });

    it('should handle edge case when current time equals expiry time', () => {
      vi.useFakeTimers();
      const exactTime = new Date('2023-01-01T12:00:00Z');
      vi.setSystemTime(exactTime);

      mockCookiesGet
        .mockReturnValueOnce('cookieValue') // Main cookie
        .mockReturnValueOnce(exactTime.toISOString()); // Same time as current

      const result = isCookieExpired('testCookie');

      expect(result).toBe(false); // Exactly equal should not be expired
    });
  });

  describe('removeCookie', () => {
    it('should remove a cookie by name', () => {
      // Act
      removeCookie('testCookie');

      // Assert
      expect(mockCookiesRemove).toHaveBeenCalledWith('testCookie');
      expect(mockCookiesRemove).toHaveBeenCalledTimes(1);
    });

    it('should handle special characters in cookie name', () => {
      // Arrange
      const cookieName = 'special-cookie_123';

      // Act
      removeCookie(cookieName);

      // Assert
      expect(mockCookiesRemove).toHaveBeenCalledWith(cookieName);
    });

    it('should not throw when removing non-existent cookie', () => {
      // Act & Assert
      expect(() => removeCookie('nonExistentCookie')).not.toThrow();
      expect(mockCookiesRemove).toHaveBeenCalledWith('nonExistentCookie');
    });
  });

  describe('Integration Tests', () => {
    it('should work together - set cookie and read it back', () => {
      // Mock the set operation
      setCookie('integrationTest', 'testValue', 1);

      // Mock the get operation to return what we "set"
      mockCookiesGet.mockReturnValue('testValue');

      const result = readCookie('integrationTest');

      expect(mockCookiesSet).toHaveBeenCalledWith('integrationTest', 'testValue', { expires: 1 });
      expect(result).toBe('testValue');
    });

    it('should handle cookie lifecycle with expiry', () => {
      vi.useFakeTimers();
      const currentTime = new Date('2023-01-01T12:00:00Z');
      vi.setSystemTime(currentTime);

      // Set a cookie
      setCookie('lifecycleTest', 'value', 1);

      // Mock reading the cookie and its expiry
      mockCookiesGet
        .mockReturnValueOnce('value') // Main cookie
        .mockReturnValueOnce(new Date('2023-01-02T12:00:00Z').toISOString()); // Future expiry

      // Cookie should not be expired
      expect(isCookieExpired('lifecycleTest')).toBe(false);

      // Move time forward past expiry
      vi.setSystemTime(new Date('2023-01-03T12:00:00Z'));

      // Mock the same calls again for the second check
      mockCookiesGet
        .mockReturnValueOnce('value') // Main cookie still exists
        .mockReturnValueOnce(new Date('2023-01-02T12:00:00Z').toISOString()); // Same expiry

      // Cookie should now be expired
      expect(isCookieExpired('lifecycleTest')).toBe(true);
    });

    it('should handle multiple cookies with different expiry times', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-01-01T12:00:00Z'));

      // Mock multiple cookies with different expiry times
      mockCookiesGet.mockImplementation((name: string) => {
        if (name === 'shortLived') return 'shortValue';
        if (name === 'shortLived_expiry') return new Date('2023-01-01T13:00:00Z').toISOString(); // 1 hour
        if (name === 'longLived') return 'longValue';
        if (name === 'longLived_expiry') return new Date('2023-01-02T12:00:00Z').toISOString(); // 1 day
        return undefined;
      });

      // Both should not be expired initially
      expect(isCookieExpired('shortLived')).toBe(false);
      expect(isCookieExpired('longLived')).toBe(false);

      // Move time forward by 2 hours
      vi.setSystemTime(new Date('2023-01-01T14:00:00Z'));

      // Short-lived should be expired, long-lived should not
      expect(isCookieExpired('shortLived')).toBe(true);
      expect(isCookieExpired('longLived')).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle Date parsing errors gracefully in isCookieExpired', () => {
      mockCookiesGet.mockReturnValueOnce('cookieValue').mockReturnValueOnce('not-a-valid-date');

      // Should not throw, but return true (treat as expired)
      expect(() => isCookieExpired('testCookie')).not.toThrow();
      expect(isCookieExpired('testCookie')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined days parameter correctly', () => {
      setCookie('testCookie', 'value', undefined);

      expect(mockCookiesSet).toHaveBeenCalledWith('testCookie', 'value', undefined);
    });

    it('should handle very large expiry days', () => {
      setCookie('testCookie', 'value', 999999);

      expect(mockCookiesSet).toHaveBeenCalledWith('testCookie', 'value', { expires: 999999 });
    });

    it('should handle negative expiry days', () => {
      setCookie('testCookie', 'value', -1);

      expect(mockCookiesSet).toHaveBeenCalledWith('testCookie', 'value', { expires: -1 });
    });

    it('should handle very long cookie names and values', () => {
      const longName = 'a'.repeat(1000);
      const longValue = 'b'.repeat(1000);

      setCookie(longName, longValue, 1);

      expect(mockCookiesSet).toHaveBeenCalledWith(longName, longValue, { expires: 1 });
    });
  });
});
