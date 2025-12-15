// Theme types
export type Theme = 'light' | 'dark';

// Default theme (can be loaded from localStorage or other sources)
let currentTheme: Theme = 'light';

// Apply theme to the document
export const applyTheme = (theme: Theme) => {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
};

// Get current theme
export const getCurrentTheme = (): Theme => currentTheme;
