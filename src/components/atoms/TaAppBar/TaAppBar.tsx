import { AppBar, type AppBarProps } from '@mui/material';
import type { FC } from 'react';
import styles from './TaAppBar.module.scss';
import clsx from 'clsx';

export const TaAppBar: FC<AppBarProps> = ({ children, className = '', ...props }) => (
  <AppBar {...props} className={clsx(styles['ta-appbar'], className)}>
    {children}
  </AppBar>
);
