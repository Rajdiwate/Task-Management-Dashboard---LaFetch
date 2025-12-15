import InputAdornment from '@mui/material/InputAdornment';
import styles from './TaSearchBar.module.scss';
import { useState, type ChangeEvent } from 'react';
import clsx from 'clsx';
import type { FC } from 'react';
import { TaTextField, type TaTextFieldProps } from '@/components/atoms';
import { TaIcon } from '@/core';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  dataTestId?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  textFieldProps?: TaTextFieldProps;
}

export const TaSearchBar: FC<SearchBarProps> = ({
  placeholder = 'Search Bar',
  className,
  dataTestId,
  value = '',
  onChange,
  textFieldProps,
}: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedChangeHandler = useDebounce(onChange, 500);

  const localValueChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value);
    debouncedChangeHandler(event);
  };

  return (
    <TaTextField
      className={clsx(styles['ta-search-bar'], className)}
      variant='outlined'
      placeholder={placeholder}
      value={localValue}
      onChange={localValueChangeHandler}
      disableBorder
      data-testid={dataTestId}
      size='small'
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <TaIcon.Search className={styles['ta-search-bar__icon']} />
            </InputAdornment>
          ),
        },
      }}
      {...textFieldProps}
    />
  );
};
