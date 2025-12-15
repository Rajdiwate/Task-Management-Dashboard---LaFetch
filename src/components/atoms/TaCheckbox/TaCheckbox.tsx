import { Checkbox, FormControlLabel, type CheckboxProps } from '@mui/material';
import type { FC } from 'react';
import styles from './TaCheckbox.module.scss';
import clsx from 'clsx';

export interface TaCheckboxProps extends CheckboxProps {
  className?: string;
  label?: string;
}

export const TaCheckbox: FC<TaCheckboxProps> = ({ className, label, ...props }) => {
  return (
    <FormControlLabel
      label={label}
      control={<Checkbox {...props} className={clsx(styles['ta-checkbox'], className)} />}
    />
  );
};
