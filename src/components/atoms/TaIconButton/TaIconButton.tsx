import { IconButton, type IconButtonProps } from '@mui/material';
import type { FC } from 'react';
import styles from './TaIconButton.module.scss';
import clsx from 'clsx';
import type { ReactElement } from 'react';

type TaIconButtonProps = IconButtonProps & {
  children: ReactElement;
  hover?: 'active';
  mode?: 'contrast' | 'active';
};

export const TaIconButton: FC<TaIconButtonProps> = ({
  children,
  className = '',
  hover,
  mode,
  ...props
}) => {
  return (
    <IconButton
      className={clsx(
        styles['ta-icon-button'],
        hover && styles[`ta-icon-button--hover-${hover}`],
        mode && styles[`ta-icon-button--mode-${mode}`],
        className,
      )}
      {...props}
    >
      {children}
    </IconButton>
  );
};
