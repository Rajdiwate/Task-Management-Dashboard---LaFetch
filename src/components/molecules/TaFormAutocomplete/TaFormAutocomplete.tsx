import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { TaAutocomplete } from '@/components/atoms';
import clsx from 'clsx';
import styles from './TaFormAutocomplete.module.scss';
import type {
  TaAutocompleteProps,
  AutocompleteOptionType,
} from '@/components/atoms/TaAutocomplete';

type TaFormAutocompleteProps<T extends FieldValues> = {
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
  /** The options for the select */
  options: AutocompleteOptionType[];
  /** Helper text to display below the input */
  helperText?: string;
  /** Additional props to pass to the underlying TaTextField */
  autoCompleteProps?: Omit<
    TaAutocompleteProps,
    | 'name'
    | 'label'
    | 'error'
    | 'helperText'
    | 'disabled'
    | 'required'
    | 'id'
    | 'options'
    | 'value'
    | 'onChange'
  >;
};

export const TaFormAutocomplete = <T extends FieldValues>({
  name,
  control,
  errors,
  label,
  id,
  dataTestId,
  options,
  disabled = false,
  helperText,
  className,
  autoCompleteProps,
}: TaFormAutocompleteProps<T>) => {
  const error = errors?.[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TaAutocomplete
          id={id}
          {...field}
          {...autoCompleteProps}
          label={label}
          error={!!error}
          disabled={disabled}
          helperText={helperText || errorMessage}
          options={options}
          data-testid={dataTestId}
          onChange={field.onChange}
          value={field.value}
          className={clsx(styles['ta-form-autocomplete'], className)}
        />
      )}
    />
  );
};
