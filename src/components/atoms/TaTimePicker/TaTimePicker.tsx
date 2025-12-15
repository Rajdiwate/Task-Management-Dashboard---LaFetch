import type { FC } from 'react';
import clsx from 'clsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker, type TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'; // doubt

import styles from './TaTimePicker.module.scss';

export const TaTimePicker: FC<TimePickerProps> = ({ className = '', slotProps, ...props }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker']}>
        <TimePicker
          {...props}
          className={clsx(styles['ta-time-picker'], className)}
          slotProps={{
            desktopPaper: {
              className: clsx(styles['ta-time-picker__desktop-paper']),
            },
            ...slotProps,
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};
