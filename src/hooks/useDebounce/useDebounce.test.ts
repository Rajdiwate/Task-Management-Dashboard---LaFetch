import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should call the callback after the specified delay', () => {
    const callback = vi.fn();
    const delay = 500;
    const { result } = renderHook(() => useDebounce(callback, delay));

    // Call the debounced function
    act(() => {
      result.current('test');
    });

    // Should not be called immediately
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time by delay - 1ms
    act(() => {
      vi.advanceTimersByTime(delay - 1);
    });

    // Still shouldn't be called
    expect(callback).not.toHaveBeenCalled();

    // Complete the timer
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Now it should be called
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test');
  });

  it('should cancel previous pending call when called again', () => {
    const callback = vi.fn();
    const delay = 500;
    const { result } = renderHook(() => useDebounce(callback, delay));

    // First call
    act(() => {
      result.current('first');
    });

    // Second call before delay elapses
    act(() => {
      vi.advanceTimersByTime(delay / 2);
      result.current('second');
    });

    // Should not be called yet
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward past first delay
    act(() => {
      vi.advanceTimersByTime(delay / 2);
    });

    // Still shouldn't be called because it was cancelled
    expect(callback).not.toHaveBeenCalled();

    // Complete the second delay
    act(() => {
      vi.advanceTimersByTime(delay / 2);
    });

    // Now it should be called with the second argument
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second');
  });

  it('should clean up pending timeouts on unmount', () => {
    const callback = vi.fn();
    const delay = 500;
    const { result, unmount } = renderHook(() => useDebounce(callback, delay));

    // Call the debounced function
    act(() => {
      result.current('test');
    });

    // Unmount before delay elapses
    unmount();

    // Fast-forward past the delay
    act(() => {
      vi.runAllTimers();
    });

    // Callback should not have been called
    expect(callback).not.toHaveBeenCalled();
  });

  it('should work with multiple arguments', () => {
    const callback = vi.fn();
    const delay = 500;
    const { result } = renderHook(() => useDebounce(callback, delay));

    // Call with multiple arguments
    act(() => {
      result.current('arg1', 'arg2', 123);
    });

    // Fast-forward past the delay
    act(() => {
      vi.advanceTimersByTime(delay);
    });

    // Should be called with all arguments
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });
});
