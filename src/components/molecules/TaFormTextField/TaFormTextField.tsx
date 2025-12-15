import {
  Controller,
  get,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { TaTextField } from '@/components/atoms';
import clsx from 'clsx';
import styles from './TaFormTextField.module.scss';
import { type TaTextFieldProps } from '@/components/atoms/TaTextField';

type TaFormTextFieldProps<T extends FieldValues> = {
  /** The name of the form field */
  name: Path<T>;
  /** Form control from react-hook-form */
  control: Control<T>;
  /** Form errors from react-hook-form */
  errors: FieldErrors<T>;
  /** The label to display above the input */
  label: string;
  /** The type of the input */
  type?: 'text' | 'email' | 'password' | 'number';
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
  /** Additional props to pass to the underlying TaTextField */
  textFieldProps?: Omit<
    TaTextFieldProps,
    'name' | 'label' | 'error' | 'helperText' | 'disabled' | 'required' | 'type' | 'id'
  >;

  onValueChange?: (value: string | number) => void;
};

export const TaFormTextField = <T extends FieldValues>({
  name,
  control,
  errors,
  label,
  type = 'text',
  id,
  dataTestId,
  disabled = false,
  required = false,
  helperText,
  className,
  onValueChange,
  textFieldProps = {},
}: TaFormTextFieldProps<T>) => {
  const error = get(errors, name);
  const errorMessage = error?.message as string | undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TaTextField
          id={id}
          {...field}
          {...textFieldProps}
          label={label}
          type={type}
          error={!!error}
          onChange={(e) => {
            const value =
              type === 'number'
                ? e.target.value === ''
                  ? ''
                  : Number(e.target.value)
                : e.target.value;
            field.onChange(value);
            textFieldProps?.onChange?.(e);
            onValueChange?.(value);
          }}
          helperText={errorMessage || helperText}
          disabled={disabled}
          required={required}
          data-testid={dataTestId}
          className={clsx(styles['ta-form-text-field'], className)}
        />
      )}
    />
  );
};
