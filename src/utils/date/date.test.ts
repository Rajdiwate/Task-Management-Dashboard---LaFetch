import { formatDate, hhmmssToAMPm } from './date';

describe('formatDate', () => {
  it('should format a valid ISO date string', () => {
    const date = '2023-01-15';
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe('15/01/2023');
  });

  it('should return an "Invalid Date" for invalid date strings', () => {
    const invalidDate = 'invalid-date';
    const formattedDate = formatDate(invalidDate);
    expect(formattedDate).toBe('Invalid Date');
  });
});

describe('hhmmssToAMPm', () => {
  it('should convert 24-hour time to 12-hour AM format', () => {
    expect(hhmmssToAMPm('09:30:00')).toBe('9:30 AM');
    expect(hhmmssToAMPm('00:15:00')).toBe('12:15 AM');
  });

  it('should convert 24-hour time to 12-hour PM format', () => {
    expect(hhmmssToAMPm('13:45:00')).toBe('1:45 PM');
    expect(hhmmssToAMPm('23:59:59')).toBe('11:59 PM');
  });

  it('should handle noon (12:00 PM) correctly', () => {
    expect(hhmmssToAMPm('12:00:00')).toBe('12:00 PM');
  });

  it('should handle midnight (12:00 AM) correctly', () => {
    expect(hhmmssToAMPm('00:00:00')).toBe('12:00 AM');
  });

  it('should handle single-digit minutes correctly', () => {
    expect(hhmmssToAMPm('08:05:00')).toBe('8:05 AM');
    expect(hhmmssToAMPm('20:09:00')).toBe('8:09 PM');
  });

  it('should handle time without seconds', () => {
    expect(hhmmssToAMPm('14:30')).toBe('2:30 PM');
  });
});
