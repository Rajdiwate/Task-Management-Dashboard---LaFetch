import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode, ThemeState } from './theme.types';
import { applyTheme } from '@/theme/theme';

const initialState: ThemeState = {
  themeMode: 'light',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleThemeMode(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      applyTheme(state.themeMode);
    },
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
      applyTheme(state.themeMode);
    },
  },
});

export const { toggleThemeMode, setThemeMode } = themeSlice.actions;
