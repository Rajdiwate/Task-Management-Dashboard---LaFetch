import { useState, type FC, type PropsWithChildren } from 'react';
import clsx from 'clsx';
import { TextField, type TextFieldProps, InputAdornment } from '@mui/material';
import styles from './TaTextField.module.scss';
import { TaIcon } from '@/core';
import { TaIconButton } from '../TaIconButton';

export type TaTextFieldProps = PropsWithChildren<TextFieldProps> & {
  variant?: 'outlined' | 'standard';
  type?: 'text' | 'password' | 'email' | 'number';
  disableBorder?: boolean;
};

export const TaTextField: FC<TaTextFieldProps> = ({
  className = '',
  variant = 'outlined',
  disableBorder = false,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextField
      className={clsx(
        styles['ta-text-field'],
        disableBorder && styles['ta-text-field--no-border'],
        className,
      )}
      variant={variant}
      type={type === 'password' && showPassword ? 'text' : type}
      slotProps={{
        ...props.slotProps,
        inputLabel: { title: props.label?.toString() },
        input: {
          ...props.slotProps?.input,
          // Add endAdornment here instead of in slots
          ...(type === 'password' && {
            endAdornment: (
              <InputAdornment position='end'>
                <TaIconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {showPassword ? (
                    <TaIcon.EyeClose data-testid='eye-close' />
                  ) : (
                    <TaIcon.EyeOpen data-testid='eye-open' />
                  )}
                </TaIconButton>
              </InputAdornment>
            ),
          }),
        },
      }}
      slots={{
        ...props.slots,
      }}
      {...props}
    />
  );
};
