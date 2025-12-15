import { Box, type BoxProps } from '@mui/material';
import type { FC } from 'react';
import styles from './TaImage.module.scss';
import clsx from 'clsx';

export const TaImage: FC<BoxProps<'img'>> = ({ className = '', ...props }) => (
  <Box component='img' {...props} className={clsx(styles['ta-image'], className)} />
);
