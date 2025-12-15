import type { FC } from 'react';
import clsx from 'clsx';
import { Box, type BoxProps } from '@mui/material';
import styles from './TaBox.module.scss';

export const TaBox: FC<BoxProps> = ({ children, className = '', ...props }) => {
  return (
    <Box className={clsx(styles['ta-box'], className)} {...props}>
      {children}
    </Box>
  );
};
