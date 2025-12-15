import { type FC } from 'react';
import clsx from 'clsx';
import {
  Select,
  type SelectProps,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import styles from './TaSelect.module.scss';

export type TaSelectProps = SelectProps & {
  label?: string;
  options?: Array<{ value: string | number; label: string }>;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  id: string;
};

export const TaSelect: FC<TaSelectProps> = ({
  className = '',
  label,
  options = [],
  helperText,
  error = false,
  fullWidth = true,
  id,
  ...props
}) => {
  const labelId = `${id}-label`;
  return (
    <FormControl
      className={clsx(styles['ta-select'], className)}
      fullWidth={fullWidth}
      error={error}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <Select label={label} labelId={labelId} {...props}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default TaSelect;
