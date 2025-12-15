import type { ThemeState } from '@/store/theme/theme.types';

export const getMockThemeState = (): ThemeState => {
  return {
    themeMode: 'light', // or 'dark'
  };
};
