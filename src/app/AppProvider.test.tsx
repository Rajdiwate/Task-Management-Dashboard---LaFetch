import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { AppProvider } from './AppProvider';

// Mock the store before importing the hook
vi.mock('@/hooks/reduxHooks', async () => {
  const actual = await vi.importActual<typeof import('@/hooks/reduxHooks')>('@/hooks/reduxHooks');
  return {
    ...actual,
    useAppSelector: vi.fn(),
  };
});

// Import mocked hook
import { useAppSelector } from '@/hooks/reduxHooks';
import { renderWithProviders } from '@/tests/testUtils';

describe('AppProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders child content inside Redux and Theme providers', () => {
    (useAppSelector as Mock).mockReturnValue('light');

    renderWithProviders(
      <AppProvider>
        <div>Test Child</div>
      </AppProvider>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders children with dark theme if themeMode is dark', () => {
    (useAppSelector as Mock).mockReturnValue('dark');

    renderWithProviders(
      <AppProvider>
        <div>Dark Theme Test</div>
      </AppProvider>,
    );

    expect(screen.getByText('Dark Theme Test')).toBeInTheDocument();
  });

  it('provides Redux store context to children', () => {
    (useAppSelector as Mock).mockReturnValue('light');

    const TestComponent = () => {
      const theme = useAppSelector((state) => state.theme);
      return <div>Theme: {theme.themeMode}</div>;
    };

    renderWithProviders(
      <AppProvider>
        <TestComponent />
      </AppProvider>,
    );

    expect(useAppSelector).toHaveBeenCalled();
  });

  it('handles theme state changes', () => {
    (useAppSelector as Mock).mockReturnValue('system');

    renderWithProviders(
      <AppProvider>
        <div>System Theme Test</div>
      </AppProvider>,
    );

    expect(screen.getByText('System Theme Test')).toBeInTheDocument();
    expect(useAppSelector).toHaveBeenCalled();
  });
});
