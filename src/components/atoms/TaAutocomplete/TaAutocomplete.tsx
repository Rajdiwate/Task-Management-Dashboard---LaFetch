import { Autocomplete, type AutocompleteProps, FormControl, TextField } from '@mui/material';
import { type FC, type SyntheticEvent } from 'react';
import styles from './TaAutocomplete.module.scss';
import clsx from 'clsx';

export interface AutocompleteOptionType {
  value: string;
  label: string;
}

export interface TaAutocompleteProps
  extends Omit<
    AutocompleteProps<AutocompleteOptionType, boolean, boolean, boolean>,
    'renderInput' | 'onChange' | 'value' | 'options'
  > {
  className?: string;
  options: AutocompleteOptionType[];
  value: AutocompleteOptionType[] | AutocompleteOptionType | null;
  onChange: (
    newValue: string | AutocompleteOptionType | (string | AutocompleteOptionType)[] | null,
  ) => void;
  placeholder?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  multiple?: boolean;
  renderSelected?: React.ReactNode;
  onOptionSelect?: (
    selectedOption: string | AutocompleteOptionType | (string | AutocompleteOptionType)[] | null,
  ) => void;
}

export const TaAutocomplete: FC<TaAutocompleteProps> = ({
  className,
  options,
  value,
  onChange,
  placeholder,
  multiple,
  error,
  label,
  helperText,
  renderSelected, // represents the component which will be used to dispaly selected items
  onOptionSelect,
  ...rest
}) => {
  const handleChange = (
    _: SyntheticEvent,
    newValue: string | AutocompleteOptionType | (string | AutocompleteOptionType)[] | null,
  ) => {
    let updatedValue = newValue;
    if (newValue && Array.isArray(newValue) && rest.freeSolo) {
      updatedValue = newValue.map((item) => {
        if (typeof item === 'string') {
          item = { value: new Date().getTime().toString(), label: item } as AutocompleteOptionType;
        }
        return item;
      });
    }
    onChange(updatedValue);

    // Call the onSelect callback if provided
    if (onOptionSelect) {
      onOptionSelect(updatedValue);
    }
  };
  return (
    <FormControl className={clsx(styles['ta-autocomplete'], className)}>
      {/* Search Input */}
      <Autocomplete<AutocompleteOptionType, boolean, boolean, boolean>
        options={options}
        value={
          multiple ? (value as AutocompleteOptionType[]) : (value as AutocompleteOptionType | null)
        }
        multiple={multiple}
        filterOptions={(options) => options} // dont apply any filters
        onChange={handleChange}
        getOptionLabel={(option) => (typeof option === 'string' ? option : (option?.label ?? ''))}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label ?? 'Select Items'}
            placeholder={placeholder ?? 'Search...'}
            error={error}
            helperText={helperText}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                // Stop chip deletion
                e.stopPropagation();
              }
            }}
          />
        )}
        sx={{
          // Force the text input to start on a new line and be full width
          '& .MuiAutocomplete-input': {
            flexBasis: '100%',
            width: '100%',
          },
        }}
        {...rest}
      />

      {/* Selected Chips below */}
      {renderSelected}
    </FormControl>
  );
};
