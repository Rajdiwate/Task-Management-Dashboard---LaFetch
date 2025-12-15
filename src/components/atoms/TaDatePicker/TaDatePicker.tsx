import type { FC } from 'react';
import clsx from 'clsx';
import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import styles from './TaDatePicker.module.scss';

export const TaDatePicker: FC<DatePickerProps> = ({ className = '', slotProps, ...props }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        {...props}
        className={clsx(styles['ta-date-picker'], className)}
        slotProps={slotProps}
      />
    </LocalizationProvider>
  );
};
