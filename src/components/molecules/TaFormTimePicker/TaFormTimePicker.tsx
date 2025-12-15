import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { TaTimePicker } from '@/components/atoms';
import clsx from 'clsx';
import styles from './TaFormTimePicker.module.scss';
import type { Dayjs } from 'dayjs';
import type { TimePickerProps } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

type TaFormTimePickerProps<T extends FieldValues> = {
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
    TimePickerProps,
    'name' | 'label' | 'error' | 'helperText' | 'disabled' | 'required' | 'type' | 'id'
  >;
};

export const TaFormTimePicker = <T extends FieldValues>({
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
  format = 'HH:mm',
  datePickerProps = {},
}: TaFormTimePickerProps<T>) => {
  const error = errors?.[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const timeValue = (field.value as unknown) instanceof Date ? dayjs(field.value) : null;
        return (
          <TaTimePicker
            {...field}
            format={format}
            label={label}
            value={timeValue}
            onChange={(date: Dayjs | null) => {
              field.onChange(date?.toDate());
            }}
            slotProps={{
              textField: {
                error: !!error,
                helperText: helperText || errorMessage,
                required,
                disabled,
                id,
                inputProps: {
                  'data-testid': dataTestId,
                },
              },
              ...datePickerProps,
            }}
            className={clsx(styles['ta-form-time-picker'], className)}
          />
        );
      }}
    />
  );
};
