import type { Components, Theme } from '@mui/material/styles';

export const muiComponentTheme: Components<Theme> = {
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontSize: '1rem',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        borderRadius: '8px',

        '&:first-of-type': {
          borderRadius: '8px',
        },
        '&:last-of-type': {
          borderRadius: '8px',
        },
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {},
    },
    variants: [
      {
        props: { variant: 'h1' },
        style: {
          fontSize: '2rem',
        },
      },
      {
        props: { variant: 'h2' },
        style: {
          fontSize: '1.5rem',
        },
      },
      {
        props: { variant: 'h3' },
        style: {
          fontSize: '1.25rem',
        },
      },
      {
        props: { variant: 'h4' },
        style: {
          fontSize: '1.125rem',
        },
      },
      {
        props: { variant: 'h5' },
        style: {
          fontSize: '1rem',
        },
      },
      {
        props: { variant: 'h6' },
        style: {
          fontSize: '0.875rem',
        },
      },
      {
        props: { variant: 'caption' },
        style: {
          fontSize: '0.6rem',
        },
      },
    ],
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: 'var(--bg-primary)',
        boxShadow: 'none',
      },
    },
  },
};
