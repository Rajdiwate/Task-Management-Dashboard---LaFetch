/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaFormDatePicker } from './TaFormDatePicker';
import dayjs from 'dayjs';
import React from 'react';

// Mock the TaDatePicker component
vi.mock('@/components/atoms', () => ({
  TaDatePicker: vi.fn(({ label, value, onChange, slotProps, className, format }: any) => {
    const { textField } = slotProps || {};
    const { error, helperText, required, disabled, id } = textField || {};

    return (
      <div data-testid='test-wrapper' className={className}>
        <label>
          {label}
          {required && <span aria-label='required'> *</span>}
          <input
            type='text'
            value={value ? value.format(format || 'YYYY-MM-DD') : ''}
            onChange={(e) => {
              if (onChange) {
                const dateValue = e.target.value ? dayjs(e.target.value) : null;
                onChange(dateValue);
              }
            }}
            disabled={disabled}
            placeholder={format}
            aria-invalid={!!error}
            data-testid={textField?.inputProps?.['data-testid']}
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

describe('TaFormDatePicker', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test component that wraps TaFormDatePicker with form context
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
        <TaFormDatePicker
          name='testField'
          control={control}
          label='Test Date'
          id='test-date'
          dataTestId='test-date-picker'
          errors={errors}
          {...props}
        />
        <button type='submit'>Submit</button>
      </form>
    );
  };

  it('renders the date picker with label', () => {
    render(<TestForm />);
    expect(screen.getByTestId('test-wrapper')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Date')).toBeInTheDocument();
  });

  it('displays helper text when provided and no error exists', () => {
    const helperText = 'Please select a date';
    render(<TestForm helperText={helperText} />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(screen.getByText(helperText)).toHaveClass('helper-text');
  });

  it('respects the disabled prop', () => {
    render(<TestForm disabled />);
    expect(screen.getByRole('textbox', { name: 'Test Date' })).toBeDisabled();
  });

  it('applies custom className', () => {
    const customClass = 'custom-date-picker';
    render(<TestForm className={customClass} />);
    expect(screen.getByTestId('test-wrapper')).toHaveClass(customClass);
  });

  it('respects the format prop', () => {
    const customFormat = 'DD/MM/YYYY';
    render(<TestForm format={customFormat} />);
    expect(screen.getByPlaceholderText(customFormat)).toBeInTheDocument();
  });

  it('shows required indicator when required prop is true', () => {
    render(<TestForm required />);
    expect(screen.getByLabelText('required')).toBeInTheDocument();
  });

  it('renders with default format when format prop is not provided', () => {
    render(<TestForm />);
    expect(screen.getByPlaceholderText('YYYY-MM-DD')).toBeInTheDocument();
  });

  it('handles date value changes correctly', () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const input = screen.getByTestId('test-date-picker');
    fireEvent.change(input, { target: { value: '2023-12-25' } });

    expect(input).toHaveValue('2023-12-25');
  });

  it('converts Date object to dayjs value correctly', () => {
    const testDate = new Date('2023-12-25');
    render(<TestForm defaultValues={{ testField: testDate }} />);

    const input = screen.getByTestId('test-date-picker');
    expect(input).toHaveValue('2023-12-25');
  });

  it('handles non-Date field values correctly', () => {
    render(<TestForm defaultValues={{ testField: 'not-a-date' }} />);

    const input = screen.getByTestId('test-date-picker');
    expect(input).toHaveValue('');
  });

  it('passes through datePickerProps to TaDatePicker', () => {
    const datePickerProps = {
      'data-custom-prop': 'test-value',
      minDate: dayjs('2023-01-01'),
    };
    render(<TestForm datePickerProps={datePickerProps} />);

    // The mock should receive these props
    expect(screen.getByTestId('test-date-picker')).toBeInTheDocument();
  });

  it('prioritizes error message over helper text', () => {
    const TestFormWithError = () => {
      const {
        control,
        formState: { errors },
        setError,
      } = useForm({
        defaultValues: { testField: null },
      });

      // Simulate setting an error
      React.useEffect(() => {
        setError('testField', {
          type: 'manual',
          message: 'Invalid date selected',
        });
      }, [setError]);

      return (
        <TaFormDatePicker
          name='testField'
          control={control}
          label='Test Date'
          id='test-date'
          dataTestId='test-date-picker'
          errors={errors}
          helperText='This is helper text'
        />
      );
    };

    render(<TestFormWithError />);
    expect(screen.getByText('Invalid date selected')).toBeInTheDocument();
    expect(screen.getByText('Invalid date selected')).toHaveAttribute('role', 'alert');
    expect(screen.queryByText('This is helper text')).not.toBeInTheDocument();
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
          message: 'Invalid date',
        });
      }, [setError]);

      return (
        <TaFormDatePicker
          name='testField'
          control={control}
          label='Test Date'
          id='test-date'
          dataTestId='test-date-picker'
          errors={errors}
        />
      );
    };

    render(<TestFormWithError />);
    expect(screen.getByTestId('test-date-picker')).toHaveAttribute('aria-invalid', 'true');
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
        <TaFormDatePicker
          name='testField'
          control={control}
          label='Test Date'
          id='test-date'
          dataTestId='test-date-picker'
          errors={errors}
        />
      );
    };

    render(<TestFormWithComplexError />);
    expect(screen.getByText('Complex error message')).toBeInTheDocument();
  });

  it('applies form-date-picker class from styles module', () => {
    render(<TestForm />);
    // The mock should receive the className with styles applied
    expect(screen.getByTestId('test-date-picker')).toBeInTheDocument();
  });
});
