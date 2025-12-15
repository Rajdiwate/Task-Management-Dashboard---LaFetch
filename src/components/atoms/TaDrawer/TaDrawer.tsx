import type { FC } from 'react';
import clsx from 'clsx';
import { Drawer, type DrawerProps } from '@mui/material';
import styles from './TaDrawer.module.scss';
import { TaIconButton } from '../TaIconButton';
import { TaIcon } from '@/core';
import { TaBox } from '../TaBox';

type TaDrawerProps = DrawerProps & {
  onClose: () => void;
  children: React.ReactNode;
  childrenClassName?: string;
};

export const TaDrawer: FC<TaDrawerProps> = ({
  className = '',
  childrenClassName = '',
  open = false,
  onClose,
  children,
  ...props
}) => {
  return (
    <Drawer
      className={clsx(styles['ta-drawer'], className)}
      open={open}
      {...props}
      onClose={onClose}
    >
      <TaIconButton
        className={styles['ta-drawer__close-icon']}
        onClick={() => onClose()}
        data-testid='drawer-close-button'
      >
        <TaIcon.Close />
      </TaIconButton>
      <TaBox className={clsx(styles['ta-drawer__content'], childrenClassName)}>{children}</TaBox>
    </Drawer>
  );
};
