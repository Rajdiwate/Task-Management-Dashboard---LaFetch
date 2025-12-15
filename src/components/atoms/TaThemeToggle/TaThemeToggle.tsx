import { Fab, type FabProps } from '@mui/material';
import styles from './TaThemeToggle.module.scss';
import { toggleThemeMode } from '@/store/theme/themeSlice';
import clsx from 'clsx';
import { type FC } from 'react';
import { TaIcon } from '@/core';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';

export type TaThemeToggleProps = FabProps & {
  className?: string;
  dataTestId?: string;
};

export const TaThemeToggle: FC<TaThemeToggleProps> = ({ className, dataTestId }) => {
  const dispatch = useAppDispatch();

  const themeMode = useAppSelector((state) => state.theme.themeMode);

  const handleThemeToggle = () => {
    dispatch(toggleThemeMode());
  };

  return (
    <Fab
      color='primary'
      aria-label='theme-toggle'
      className={clsx(styles['ta-theme-toggle'], className)}
      onClick={handleThemeToggle}
      data-testid={dataTestId}
    >
      {themeMode === 'dark' ? <TaIcon.PaginatorArrowLeft /> : <TaIcon.PaginatorArrowRight />}
    </Fab>
  );
};
