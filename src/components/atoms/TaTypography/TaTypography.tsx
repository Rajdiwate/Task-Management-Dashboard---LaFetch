import type { FC } from 'react';
import clsx from 'clsx';
import { Typography, type TypographyProps } from '@mui/material';
import styles from './TaTypography.module.scss';

type TaTypographyProps = TypographyProps & {
  colorVariant?: 'default' | 'muted';
  sizeType?: 'large' | 'normal';
};

export const TaTypography: FC<TaTypographyProps> = ({
  children,
  variant = 'body1',
  className = '',
  colorVariant = 'default',
  sizeType = 'normal',
  ...props
}) => {
  return (
    <Typography
      className={clsx(
        styles['ta-typography'],
        colorVariant === 'muted' && styles['ta-typography--muted'],
        className,
        sizeType === 'large' && styles['ta-typography--large'],
      )}
      variant={variant}
      {...props}
    >
      {children}
    </Typography>
  );
};
