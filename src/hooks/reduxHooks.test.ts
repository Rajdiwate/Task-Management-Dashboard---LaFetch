import { describe, it, expect, vi } from 'vitest';

// Mock react-redux
const mockDispatch = vi.fn();
const mockSelector = vi.fn();
const mockState: Partial<RootState> = {
  theme: { themeMode: 'light' },
};

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (fn: (state: Partial<RootState>) => string) => {
    mockSelector(fn);
    return fn(mockState); // Call the selectorFn with a mock state
  },
}));

// Import hooks after mocking
import { useAppDispatch, useAppSelector } from './reduxHooks';
import type { RootState } from '@/store';

describe('reduxHooks', () => {
  it('useAppDispatch returns dispatch function', () => {
    const dispatch = useAppDispatch();
    expect(dispatch).toBe(mockDispatch);
  });

  it('useAppSelector calls useSelector with provided function', () => {
    const selectorFn = vi.fn().mockReturnValue('selected');
    const result = useAppSelector(selectorFn);
    expect(selectorFn).toHaveBeenCalled();
    expect(result).toBe('selected');
  });
});
