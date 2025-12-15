/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, it, expect, vi } from 'vitest';
import { TaFormTextField } from './TaFormTextField';

describe('TaFormTextField', () => {
  // Test component that wraps TaFormTextField with form context
  const TestForm = ({ onSubmit = vi.fn(), defaultValues = { testField: '' }, ...props }: any) => {
    const {
      control,
      formState: { errors },
      handleSubmit,
    } = useForm({ defaultValues });

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <TaFormTextField
          name='testField'
          control={control}
          label='Test Field'
          data-testid='test-field'
          errors={errors}
          {...props}
        />
        <button type='submit'>Submit</button>
      </form>
    );
  };

  it('renders the text field with label', () => {
    render(<TestForm />);
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
  });

  it('displays error message when field is required and empty', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <TestForm onSubmit={handleSubmit} required rules={{ required: 'This field is required' }} />,
    );

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onChange handler with the input value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<TestForm textFieldProps={{ onChange: handleChange }} />);

    const input = screen.getByLabelText('Test Field');
    await user.type(input, 'test value');

    expect(handleChange).toHaveBeenCalledTimes(10); // 'test value' is 10 characters
  });

  it('displays helper text when provided', () => {
    const helperText = 'This is a helpful message';
    render(<TestForm helperText={helperText} />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it('applies error styling when there is an error', () => {
    const errorMessage = 'This field has an error';
    render(<TestForm errors={{ testField: { message: errorMessage, type: 'required' } }} />);

    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('respects the disabled prop', () => {
    render(<TestForm disabled />);
    expect(screen.getByLabelText('Test Field')).toBeDisabled();
  });

  it('applies custom className through textFieldProps', () => {
    const customClass = 'custom-class';
    render(<TestForm className={customClass} dataTestId='test-field' />);

    const input = screen.getByTestId('test-field');
    expect(input).toHaveClass(customClass);
  });

  it('forwards additional props to the input element', () => {
    render(<TestForm textFieldProps={{ placeholder: 'Enter text here' }} />);
    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
  });

  it('handles empty input correctly for number type', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(<TestForm type='number' onValueChange={handleValueChange} />);

    const input = screen.getByLabelText('Test Field');
    await user.type(input, '1');
    expect(handleValueChange).toHaveBeenLastCalledWith(1);

    await user.clear(input);
    expect(handleValueChange).toHaveBeenLastCalledWith('');
  });
});
