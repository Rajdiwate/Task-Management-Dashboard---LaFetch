import type { PropsWithChildren } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider as ReduxProvider } from 'react-redux';
import { lightTheme, darkTheme } from '@/theme/muiTheme';
import { store } from '@/store';
import { useAppSelector } from '@/hooks/reduxHooks';
import { TaThemeToggle } from '@/components/atoms';

const ThemedApp = ({ children }: PropsWithChildren) => {
  const themeMode = useAppSelector((state) => state.theme.themeMode);

  return (
    <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <TaThemeToggle />
      {children}
    </ThemeProvider>
  );
};

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <ReduxProvider store={store}>
      <ThemedApp>{children}</ThemedApp>
    </ReduxProvider>
  );
};
