import type { FC } from 'react';
import clsx from 'clsx';
import { Stack, type StackProps } from '@mui/material';
import styles from './TaStack.module.scss';

export const TaStack: FC<StackProps> = ({ children, className = '', ...props }) => {
  return (
    <Stack className={clsx(styles['ta-stack'], className)} {...props}>
      {children}
    </Stack>
  );
};
