import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { TaThemeToggle } from './TaThemeToggle';
import { renderWithProviders } from '@/tests/testUtils';
import styles from './TaThemeToggle.module.scss';
// Mock the icons
vi.mock('@/core', async () => {
  const originalModule = await vi.importActual<typeof import('@/core')>('@/core');
  return {
    ...originalModule,
    TaIcon: {
      ArrowSwitch: () => <div data-testid='theme-toggle-icon'>Theme Toggle</div>,
    },
  };
});

const mockDispatch = vi.fn();

vi.mock('@/hooks/reduxHooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

describe('TaThemeToggle', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('renders the theme toggle button', () => {
    renderWithProviders(<TaThemeToggle />, {
      preloadedState: { theme: { themeMode: 'light' } },
    });

    const button = screen.getByRole('button', { name: /theme-toggle/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle-icon')).toBeInTheDocument();
  });

  it('dispatches toggleThemeMode action when clicked', () => {
    renderWithProviders(<TaThemeToggle />, {
      preloadedState: { theme: { themeMode: 'light' } },
    });

    const button = screen.getByRole('button', { name: /theme-toggle/i });
    fireEvent.click(button);

    waitFor(() => expect(mockDispatch).toHaveBeenCalled());
  });

  it('applies custom className when provided', () => {
    const testClassName = 'test-class';
    const { container } = renderWithProviders(<TaThemeToggle className={testClassName} />, {
      preloadedState: { theme: { themeMode: 'light' } },
    });

    const button = container.querySelector(`.${testClassName}`);
    expect(button).toBeInTheDocument();
  });

  it('has the correct default styles', () => {
    renderWithProviders(<TaThemeToggle data-testid='theme-toggle' />, {
      preloadedState: { theme: { themeMode: 'light' } },
    });

    const button = document.getElementsByClassName(styles['ta-theme-toggle'])[0];
    expect(button).toBeInTheDocument();
  });
});
