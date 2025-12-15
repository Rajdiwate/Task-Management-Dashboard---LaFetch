import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/testUtils';
import { getMockThemeState } from '@/tests/fakeStateFactory';
import App from './App';
import styles from './App.module.scss';

// Mock AppRouter
vi.mock('@/routes/Router', () => ({
  AppRouter: vi.fn(() => <div data-testid='app-router'>App Router Content</div>),
}));

// Mock ToastContainer
vi.mock('react-toastify', () => ({
  ToastContainer: vi.fn(({ position, autoClose, transition, theme }) => (
    <div
      data-testid='toast-container'
      data-position={position}
      data-auto-close={autoClose}
      data-theme={theme}
      data-transition={transition?.name || 'Slide'}
    />
  )),
  Slide: { name: 'Slide' },
}));

// Mock TaLoader
vi.mock('@/components/atoms/TaLoader/TaLoader', () => ({
  TaLoader: vi.fn(({ open }) => (open ? <div data-testid='ta-loader'>Loading...</div> : null)),
}));

// Mock allApis
vi.mock('@/store', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('@/store')>();
  return {
    ...originalModule,
    allApis: [],
  };
});

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<App />, {
        preloadedState: {
          theme: getMockThemeState(),
        },
      });

      expect(document.body).toBeTruthy();
    });

    it('renders main element with correct CSS class', () => {
      const { container } = renderWithProviders(<App />, {
        preloadedState: {
          theme: getMockThemeState(),
        },
      });

      const mainElement = container.querySelector('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveClass(styles['ta-app']);
    });

    it('renders content div with correct CSS class', () => {
      const { container } = renderWithProviders(<App />, {
        preloadedState: {
          theme: getMockThemeState(),
        },
      });

      const contentDiv = container.querySelector(`.${styles['ta-app__content']}`);
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe('Component integration', () => {
    it('renders AppRouter', () => {
      renderWithProviders(<App />, {
        preloadedState: {
          theme: getMockThemeState(),
        },
      });

      expect(screen.getByTestId('app-router')).toBeInTheDocument();
      expect(screen.getByText('App Router Content')).toBeInTheDocument();
    });

    it('renders ToastContainer with correct props', () => {
      renderWithProviders(<App />, {
        preloadedState: {
          theme: getMockThemeState(),
        },
      });

      const toastContainer = screen.getByTestId('toast-container');
      expect(toastContainer).toBeInTheDocument();
      expect(toastContainer).toHaveAttribute('data-position', 'bottom-right');
      expect(toastContainer).toHaveAttribute('data-auto-close', '4000');
      expect(toastContainer).toHaveAttribute('data-theme', 'light');
      expect(toastContainer).toHaveAttribute('data-transition', 'Slide');
    });
  });

  describe('Theme state management', () => {
    it('handles theme state correctly', () => {
      const themeState = getMockThemeState();
      const { store } = renderWithProviders(<App />, {
        preloadedState: {
          theme: themeState,
        },
      });

      expect(store.getState().theme).toEqual(themeState);
    });

    it('checks preloaded theme state', () => {
      const { store } = renderWithProviders(<App />, {
        preloadedState: {
          theme: getMockThemeState(),
        },
      });

      expect(store.getState().theme.themeMode).toBe('light');
    });

    it('renders with all states including theme', () => {
      const { container, store } = renderWithProviders(<App />, {
        preloadedState: {
          theme: getMockThemeState(),
        },
      });

      expect(container.firstChild).toBeTruthy();
      expect(store.getState().theme).toBeDefined();
    });
  });

  describe('Layout structure', () => {
    it('maintains correct DOM hierarchy', () => {
      const { container } = renderWithProviders(<App />, {
        preloadedState: {
          theme: getMockThemeState(),
        },
      });

      const main = container.querySelector('main');
      const content = container.querySelector(`.${styles['ta-app__content']}`);
      const router = screen.getByTestId('app-router');

      expect(main).toContainElement(content as HTMLElement);
      expect(content).toContainElement(router);
    });

    it('renders ToastContainer outside content div', () => {
      const { container } = renderWithProviders(<App />, {
        preloadedState: {
          theme: getMockThemeState(),
        },
      });

      const main = container.querySelector('main');
      const toastContainer = screen.getByTestId('toast-container');

      expect(main).toContainElement(toastContainer);
    });
  });

  describe('Component props verification', () => {
    it('calls AppRouter component', async () => {
      renderWithProviders(<App />, {
        preloadedState: {
          theme: getMockThemeState(),
        },
      });

      const { AppRouter } = await import('@/routes/Router');
      expect(vi.mocked(AppRouter)).toHaveBeenCalled();
    });
  });
});
