import { waitFor } from '@testing-library/dom';
import { themeSlice, toggleThemeMode, setThemeMode } from './themeSlice';
import { describe, it, expect } from 'vitest';

describe('themeSlice reducer', () => {
  const initialState = { themeMode: 'light' as const };
  const themeReducer = themeSlice.reducer;

  it('should return the initial state by default', () => {
    waitFor(() => expect(themeReducer(undefined, { type: '@@INIT' })).toEqual(initialState));
  });

  it('should toggle theme mode from light to dark', () => {
    const state = themeReducer(initialState, toggleThemeMode());
    expect(state.themeMode).toBe('dark');
  });

  it('should toggle theme mode from dark to light', () => {
    const state = themeReducer({ themeMode: 'dark' }, toggleThemeMode());
    expect(state.themeMode).toBe('light');
  });

  it('should set theme mode to dark explicitly', () => {
    const state = themeReducer(initialState, setThemeMode('dark'));
    expect(state.themeMode).toBe('dark');
  });

  it('should set theme mode to light explicitly', () => {
    const state = themeReducer({ themeMode: 'dark' }, setThemeMode('light'));
    expect(state.themeMode).toBe('light');
  });
});
