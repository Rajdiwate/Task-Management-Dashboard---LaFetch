import type { ReactElement, ReactNode } from 'react';
import type { RootState } from '@/store';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { setupStore } from './setupTestStore';

//
// Standard: For most components using app's root reducer
//
interface StandardRenderOptions {
  route?: string;
  preloadedState?: Partial<RootState>;
  wrapWithRouter?: boolean;
  store?: ReturnType<typeof setupStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    preloadedState,
    store = setupStore(preloadedState),
    wrapWithRouter = false,
  }: StandardRenderOptions = {},
) {
  const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Provider store={store}>
      {wrapWithRouter ? <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter> : children}
    </Provider>
  );

  return {
    ...render(ui, { wrapper: Wrapper }),
    store,
  };
}
