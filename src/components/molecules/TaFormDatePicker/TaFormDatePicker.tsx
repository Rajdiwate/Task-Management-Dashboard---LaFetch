import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { TaDatePicker } from '@/components/atoms';
import clsx from 'clsx';
import styles from './TaFormDatePicker.module.scss';
import type { Dayjs } from 'dayjs';
import type { DatePickerProps } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

type TaFormDatePickerProps<T extends FieldValues> = {
  /** The name of the form field */
  name: Path<T>;
  /** Form control from react-hook-form */
  control: Control<T>;
  /** Form errors from react-hook-form */
  errors: FieldErrors<T>;
  /** The label to display above the input */
  label: string;
  /** Test ID for testing libraries */
  dataTestId: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** The id of the input */
  id: string;
  /** The className of the input */
  className?: string;
  /** The format of the date */
  format?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Helper text to display below the input */
  helperText?: string;
  /** Additional props to pass to the underlying TaTextField */
  datePickerProps?: Omit<
    DatePickerProps,
    'name' | 'label' | 'error' | 'helperText' | 'disabled' | 'required' | 'type' | 'id'
  >;
};

export const TaFormDatePicker = <T extends FieldValues>({
  name,
  control,
  errors,
  label,
  id,
  dataTestId,
  disabled = false,
  required = false,
  helperText,
  className,
  format = 'YYYY-MM-DD',
  datePickerProps = {},
}: TaFormDatePickerProps<T>) => {
  const error = errors?.[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const dateValue = (field.value as unknown) instanceof Date ? dayjs(field.value) : null;
        return (
          <TaDatePicker
            {...field}
            {...datePickerProps}
            format={format}
            label={label}
            value={dateValue}
            onChange={(date: Dayjs | null) => {
              field.onChange(date?.toDate());
            }}
            slotProps={{
              textField: {
                error: !!error,
                helperText: errorMessage || helperText,
                required,
                disabled,
                id,
                inputProps: {
                  'data-testid': dataTestId,
                },
              },
            }}
            className={clsx(styles['ta-form-date-picker'], className)}
          />
        );
      }}
    />
  );
};
