import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { TaSelect } from '@/components/atoms';
import clsx from 'clsx';
import styles from './TaFormSelectField.module.scss';

import type { TaSelectProps } from '@/components/atoms/TaSelect';

type TaFormSelectFieldProps<T extends FieldValues> = {
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
  /** Whether the field is required */
  required?: boolean;
  /** Helper text to display below the input */
  helperText?: string;
  /** Options for the select */
  options?: Array<{ value: string | number; label: string }>;
  /** Additional props to pass to the underlying TaSelect */
  selectProps?: Omit<
    TaSelectProps,
    | 'name'
    | 'label'
    | 'error'
    | 'helperText'
    | 'disabled'
    | 'required'
    | 'id'
    | 'options'
    | 'className'
  >;
};

export const TaFormSelectField = <T extends FieldValues>({
  name,
  control,
  errors,
  label,
  id,
  dataTestId,
  disabled = false,
  required = false,
  helperText,
  options,
  className,
  selectProps = {},
}: TaFormSelectFieldProps<T>) => {
  const error = errors?.[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TaSelect
          id={id}
          {...field}
          {...selectProps}
          label={label}
          error={!!error}
          helperText={errorMessage || helperText}
          disabled={disabled}
          required={required}
          data-testid={dataTestId}
          className={clsx(styles['ta-form-select-field'], className)}
          options={options}
        />
      )}
    />
  );
};
