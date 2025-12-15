import { describe, it, expect } from 'vitest';
import { truncateText } from './truncateText';

describe('truncateText', () => {
  it('should return empty string when text is empty', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('should return original text when length is less than maxLength', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('should return original text when length equals maxLength', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  it('should truncate text and add ellipsis when length exceeds maxLength', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
  });

  it('should handle maxLength of 0', () => {
    expect(truncateText('Hello', 0)).toBe('...');
  });

  it('should handle single character text', () => {
    expect(truncateText('A', 1)).toBe('A');
    expect(truncateText('A', 0)).toBe('...');
  });

  it('should handle empty text', () => {
    expect(truncateText('', 1)).toBe('');
  });
});
