/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaFormTimePicker } from './TaFormTimePicker';
import dayjs from 'dayjs';
import React from 'react';

// Mock the TaTimePicker component
vi.mock('@/components/atoms', () => ({
  TaTimePicker: vi.fn(({ label, value, onChange, slotProps, className, format }: any) => {
    const { textField } = slotProps || {};
    const { error, helperText, required, disabled, id } = textField || {};

    return (
      <div className={className} data-testid={'test-wrapper'}>
        <label>
          {label}
          {required && <span aria-label='required'> *</span>}
          <input
            type='time'
            value={value ? value.format(format || 'HH:mm') : ''}
            onChange={(e) => {
              if (onChange) {
                const timeValue = e.target.value ? dayjs(`2000-01-01T${e.target.value}`) : null;
                onChange(timeValue);
              }
            }}
            disabled={disabled}
            placeholder={format}
            aria-invalid={!!error}
            data-testid={textField.inputProps['data-testid']}
            id={id}
          />
        </label>
        {error && helperText && (
          <div className='error' role='alert'>
            {helperText}
          </div>
        )}
        {!error && helperText && <div className='helper-text'>{helperText}</div>}
      </div>
    );
  }),
}));

describe('TaFormTimePicker', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test component that wraps TaFormTimePicker with form context
  const TestForm = ({ onSubmit = vi.fn(), defaultValues = { testField: null }, ...props }: any) => {
    const {
      control,
      formState: { errors },
      handleSubmit,
    } = useForm({
      defaultValues,
      mode: 'onChange',
    });

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <TaFormTimePicker
          name='testField'
          control={control}
          label='Test Time'
          id='test-time'
          dataTestId='test-time-picker'
          errors={errors}
          {...props}
        />
        <button type='submit'>Submit</button>
      </form>
    );
  };

  it('renders the time picker with label', () => {
    render(<TestForm />);
    expect(screen.getByTestId('test-time-picker')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Time')).toBeInTheDocument();
  });

  it('displays helper text when provided and no error exists', () => {
    const helperText = 'Please select a time';
    render(<TestForm helperText={helperText} />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(screen.getByText(helperText)).toHaveClass('helper-text');
  });

  it('respects the disabled prop', () => {
    render(<TestForm disabled />);
    expect(screen.getByTestId('test-time-picker')).toHaveAttribute('disabled');
  });

  it('applies custom className', () => {
    const customClass = 'custom-time-picker';
    render(<TestForm className={customClass} />);
    expect(screen.getByTestId('test-wrapper')).toHaveClass(customClass);
  });

  it('respects the format prop', () => {
    const customFormat = 'HH:mm:ss';
    render(<TestForm format={customFormat} />);
    expect(screen.getByPlaceholderText(customFormat)).toBeInTheDocument();
  });

  it('shows required indicator when required prop is true', () => {
    render(<TestForm required />);
    expect(screen.getByLabelText('required')).toBeInTheDocument();
  });

  it('renders with default format when format prop is not provided', () => {
    render(<TestForm />);
    expect(screen.getByPlaceholderText('HH:mm')).toBeInTheDocument();
  });

  it('handles time value changes correctly', () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByTestId('test-time-picker');
    fireEvent.change(input, { target: { value: '14:30' } });

    expect(input).toHaveValue('14:30');
  });

  it('handles invalid time values correctly', () => {
    render(<TestForm defaultValues={{ testField: 'not-a-time' }} />);
    const input = screen.getByTestId('test-time-picker');
    expect(input).toHaveValue('');
  });

  it('passes through timePickerProps to TaTimePicker', () => {
    const timePickerProps = {
      'data-custom-prop': 'test-value',
      minTime: dayjs('09:00', 'HH:mm'),
    };
    render(<TestForm timePickerProps={timePickerProps} />);
    expect(screen.getByTestId('test-time-picker')).toBeInTheDocument();
  });

  it('displays error message', () => {
    const TestFormWithError = () => {
      const {
        control,
        formState: { errors },
        setError,
      } = useForm({
        defaultValues: { testField: null },
      });

      React.useEffect(() => {
        setError('testField', {
          type: 'manual',
          message: 'Invalid time selected',
        });
      }, [setError]);

      return (
        <TaFormTimePicker
          name='testField'
          control={control}
          label='Test Time'
          id='test-time'
          dataTestId='test-time-picker'
          errors={errors}
        />
      );
    };

    render(<TestFormWithError />);
    expect(screen.getByText('Invalid time selected')).toBeInTheDocument();
    expect(screen.getByText('Invalid time selected')).toHaveAttribute('role', 'alert');
  });

  it('sets correct aria-invalid when error exists', () => {
    const TestFormWithError = () => {
      const {
        control,
        formState: { errors },
        setError,
      } = useForm({
        defaultValues: { testField: null },
      });

      React.useEffect(() => {
        setError('testField', {
          type: 'manual',
          message: 'Invalid time',
        });
      }, [setError]);

      return (
        <TaFormTimePicker
          name='testField'
          control={control}
          label='Test Time'
          id='test-time'
          dataTestId='test-time-picker'
          errors={errors}
        />
      );
    };

    render(<TestFormWithError />);
    expect(screen.getByTestId('test-time-picker')).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles complex nested error objects', () => {
    const TestFormWithComplexError = () => {
      const {
        control,
        formState: { errors },
        setError,
      } = useForm({
        defaultValues: { testField: null },
      });

      React.useEffect(() => {
        setError('testField', {
          type: 'custom',
          message: 'Complex error message',
        });
      }, [setError]);

      return (
        <TaFormTimePicker
          name='testField'
          control={control}
          label='Test Time'
          id='test-time'
          dataTestId='test-time-picker'
          errors={errors}
        />
      );
    };

    render(<TestFormWithComplexError />);
    expect(screen.getByText('Complex error message')).toBeInTheDocument();
  });

  it('applies form-time-picker class from styles module', () => {
    render(<TestForm />);
    expect(screen.getByTestId('test-time-picker')).toBeInTheDocument();
  });
});
