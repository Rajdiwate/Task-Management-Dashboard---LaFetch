import { createTheme } from '@mui/material/styles';
import { colors } from './muiThemeVariables';
import { muiComponentTheme } from './muiComponentTheme';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary400,
      light: colors.primary200,
      dark: colors.primary700,
      contrastText: colors.neutralWhite,
    },
    secondary: {
      main: colors.secondary,
      light: colors.secondary200,
      dark: colors.secondary700,
      contrastText: colors.neutralWhite,
    },
    info: {
      main: colors.primary,
      light: colors.primary200,
      dark: colors.primary700,
      contrastText: colors.neutralWhite,
    },
    success: {
      main: colors.success,
      light: colors.success200,
      dark: colors.success700,
      contrastText: colors.neutralWhite,
    },
    warning: {
      main: colors.warning,
      light: colors.warning200,
      dark: colors.warning700,
      contrastText: colors.neutralWhite,
    },
    error: {
      main: colors.error,
      light: colors.error200,
      dark: colors.error700,
      contrastText: colors.neutralWhite,
    },
    background: {
      default: colors.neutralWhite,
      paper: colors.neutralWhite100,
    },
    text: {
      primary: colors.neutralBlack,
      secondary: colors.neutralBlack900,
      disabled: colors.neutralBlack500,
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },
  components: {
    ...muiComponentTheme,
  },
  typography: {
    fontFamily: 'Outfit, sans-serif',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary400,
      light: colors.primary200,
      dark: colors.primary700,
      contrastText: colors.neutralWhite,
    },
    secondary: {
      main: colors.secondary,
      light: colors.secondary200,
      dark: colors.secondary700,
      contrastText: colors.neutralWhite,
    },
    info: {
      main: colors.primary,
      light: colors.primary200,
      dark: colors.primary700,
      contrastText: colors.neutralWhite,
    },
    success: {
      main: colors.success,
      light: colors.success200,
      dark: colors.success700,
      contrastText: colors.neutralWhite,
    },
    warning: {
      main: colors.warning,
      light: colors.warning200,
      dark: colors.warning700,
      contrastText: colors.neutralWhite,
    },
    error: {
      main: colors.error800,
      light: colors.error200,
      dark: colors.error700,
      contrastText: colors.neutralWhite,
    },
    background: {
      default: colors.neutralBlack,
      paper: colors.neutralBlack800,
    },
    text: {
      primary: colors.neutralWhite,
      secondary: colors.neutralWhite200,
      disabled: colors.neutralWhite700,
    },
    action: {
      active: 'rgba(255, 255, 255, 0.7)',
      hover: 'rgba(255, 255, 255, 0.1)',
      selected: 'rgba(255, 255, 255, 0.2)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
  components: {
    ...muiComponentTheme,
  },
  typography: {
    fontFamily: 'Outfit, sans-serif',
  },
});
