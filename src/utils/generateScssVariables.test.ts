import { describe, it, expect } from 'vitest';
import { camelToKebab, groupColors, toScssMap } from './generateScssVariables';

describe('camelToKebab', () => {
  it('converts camelCase to kebab-case', () => {
    expect(camelToKebab('neutralBlack')).toBe('neutral-black');
    expect(camelToKebab('primary')).toBe('primary');
    expect(camelToKebab('accentPurple')).toBe('accent-purple');
  });
});

describe('groupColors', () => {
  it('groups colors by prefix and shade', () => {
    const input = {
      primary: '#1c9ebe',
      primary50: '#eefbfd',
      neutralBlack: '#303030',
      neutralBlack100: '#f6f6f6',
      accentPurple400: '#ad7bff',
    };
    const grouped = groupColors(input);
    expect(grouped).toEqual({
      primary: { base: '#1c9ebe', '50': '#eefbfd' },
      'neutral-black': { base: '#303030', '100': '#f6f6f6' },
      'accent-purple': { '400': '#ad7bff' },
    });
  });
});

describe('toScssMap', () => {
  it('generates SCSS map string from grouped colors', () => {
    const grouped = {
      primary: { base: '#1c9ebe', '50': '#eefbfd' },
      'neutral-black': { base: '#303030', '100': '#f6f6f6' },
    };
    const scss = toScssMap('ta-colors', grouped);
    expect(scss).toContain('$ta-colors: (');
    expect(scss).toContain('primary: (');
    expect(scss).toContain('neutral-black: (');
    expect(scss).toContain('base: #303030');
    expect(scss).toContain('100: #f6f6f6');
  });
});
