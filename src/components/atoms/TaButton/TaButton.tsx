import type { FC } from 'react';
import clsx from 'clsx';
import { Button, type ButtonProps } from '@mui/material';
import styles from './TaButton.module.scss';
import { alpha } from '@mui/material/styles';

export type TaButtonProps = ButtonProps & {
  disableHover?: boolean;
  customColor?: string; // ✅ your custom color (e.g. "#2196f3")
  'data-testid'?: string;
};

export const TaButton: FC<TaButtonProps> = ({
  children,
  variant = 'contained',
  className = '',
  disableHover = false,
  customColor,
  sx,
  ...props
}) => {
  // Build dynamic styles
  const dynamicStyles = customColor
    ? (() => {
        switch (variant) {
          case 'contained':
            return {
              backgroundColor: customColor,
              borderColor: customColor,
              '&:hover': {
                backgroundColor: alpha(customColor, 0.85), // light tint on hover
                borderColor: customColor,
              },
            };
          case 'outlined':
            return {
              color: customColor,
              borderColor: customColor,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: alpha(customColor, 0.1), // light tint on hover
              },
            };
          case 'text':
          default:
            return {
              color: customColor,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: alpha(customColor, 0.1), // light tint on hover
              },
            };
        }
      })()
    : {};

  return (
    <Button
      className={clsx(
        styles['ta-button'],
        disableHover && styles['ta-button--disable-hover'],
        className,
      )}
      variant={variant}
      sx={{
        ...dynamicStyles,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
