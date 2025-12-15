import { Toolbar, type ToolbarProps } from '@mui/material';
import type { FC } from 'react';
import styles from './TaToolbar.module.scss';
import clsx from 'clsx';

export const TaToolbar: FC<ToolbarProps> = ({ children, className = '', ...props }) => (
  <Toolbar {...props} className={clsx(styles['ta-toolbar'], className)}>
    {children}
  </Toolbar>
);
