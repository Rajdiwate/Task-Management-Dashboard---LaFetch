import { TaCheckbox } from '@/components/atoms';
import type { TaCheckboxProps } from '@/components/atoms/TaCheckbox/TaCheckbox';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import clsx from 'clsx';
import styles from './TaFormCheckbox.module.scss';

type TaFormCheckboxProps<T extends FieldValues> = {
  /** The name of the form field */
  name: Path<T>;
  /** Form control from react-hook-form */
  control: Control<T>;
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
  /** Additional props to pass to the underlying TaTextField */
  checkboxProps?: Omit<
    TaCheckboxProps,
    'name' | 'label' | 'disabled' | 'required' | 'id' | 'value'
  >;
};

export const TaFormCheckbox = <T extends FieldValues>({
  name,
  control,
  label,
  id,
  dataTestId,
  disabled = false,
  required = false,
  className,
  checkboxProps = {},
}: TaFormCheckboxProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TaCheckbox
          id={id}
          {...field}
          {...checkboxProps}
          label={label}
          disabled={disabled}
          checked={field.value}
          required={required}
          data-testid={dataTestId}
          className={clsx(styles['ta-form-checkbox'], className)}
        />
      )}
    />
  );
};
