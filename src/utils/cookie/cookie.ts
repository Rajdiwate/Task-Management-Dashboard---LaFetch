import Cookies from 'js-cookie';

/**
 * Set a cookie
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Expiry in days (optional)
 */
export const setCookie = (name: string, value: string, days?: number): void => {
  Cookies.set(name, value, days ? { expires: days } : undefined);
};

/**
 * Read a cookie
 * @param name - Cookie name
 * @returns The cookie value or null if not found
 */
export const readCookie = (name: string): string | null => {
  const value = Cookies.get(name);
  return value ?? null;
};

/**
 * Check if a cookie is expired
 * Note: js-cookie does not give direct expiry info,
 * so we need to track expiry manually by storing an expiry timestamp.
 *
 * Example: setCookie("token", "abc", 1) → stores expiry timestamp separately.
 */
export const isCookieExpired = (name: string): boolean => {
  const value = readCookie(name);
  if (!value) return true;

  const expiry = readCookie(`${name}_expiry`);
  if (!expiry) return false; // No expiry info → assume not expired

  const expiryDate = new Date(expiry);
  return new Date() > expiryDate;
};

// remove cookie function
export const removeCookie = (name: string): void => {
  Cookies.remove(name);
};
