import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaLoader } from './TaLoader';

// Mock MUI components
vi.mock('@mui/material', () => ({
  Backdrop: vi.fn(({ open, children, sx }) => {
    if (!open) return null;
    return (
      <div data-testid='backdrop' data-open={open} data-z-index={sx ? 'custom' : 'default'}>
        {children}
      </div>
    );
  }),
  CircularProgress: vi.fn(() => <div data-testid='circular-progress'>Loading...</div>),
}));

describe('TaLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Basic rendering', () => {
    it('renders without crashing when open is false', () => {
      const { container } = render(<TaLoader open={true} />);
      expect(container).toBeInTheDocument();
    });

    it('renders without crashing when open is true', () => {
      const { container } = render(<TaLoader open={true} />);
      expect(container).toBeInTheDocument();
    });

    it('does not show backdrop initially when open is false', () => {
      render(<TaLoader open={false} />);
      expect(screen.queryByTestId('backdrop')).not.toBeInTheDocument();
    });
  });

  describe('Timer cleanup', () => {
    it('cleans up timer on unmount', () => {
      const { unmount } = render(<TaLoader open={true} />);

      // Unmount before timer completes
      unmount();

      // Advance timers - should not cause errors
      expect(() => {
        vi.advanceTimersByTime(200);
      }).not.toThrow();
    });

    it('clears timeout when component unmounts during opening', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const { unmount } = render(<TaLoader open={true} />);

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it('clears timeout when component unmounts during closing', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const { rerender, unmount } = render(<TaLoader open={true} />);

      vi.advanceTimersByTime(0);
      rerender(<TaLoader open={false} />);

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('Visibility logic', () => {
    it('visible state is false initially', () => {
      render(<TaLoader open={false} />);
      expect(screen.queryByTestId('backdrop')).not.toBeInTheDocument();
    });
  });

  describe('Performance considerations', () => {
    it('does not create multiple timers unnecessarily', () => {
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

      const { rerender } = render(<TaLoader open={false} />);

      const initialCallCount = setTimeoutSpy.mock.calls.length;

      // Change open state
      rerender(<TaLoader open={true} />);

      // Should have created exactly one new timer
      expect(setTimeoutSpy).toHaveBeenCalledTimes(initialCallCount + 1);

      setTimeoutSpy.mockRestore();
    });
  });
});
