import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, it, expect, vi } from 'vitest';
import { TaFormSelectField } from './TaFormSelectField';

describe('TaFormSelectField', () => {
  // Test component that wraps TaFormSelectField with form context
  const TestForm = ({
    onSubmit = vi.fn(),
    defaultValues = { testField: '' },
    options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    ...props
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: any) => {
    const {
      control,
      formState: { errors },
      handleSubmit,
    } = useForm({ defaultValues });

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <TaFormSelectField
          name='testField'
          control={control}
          label='Test Select'
          id='test-select'
          dataTestId='test-select'
          errors={errors}
          options={options}
          {...props}
        />
        <button type='submit'>Submit</button>
      </form>
    );
  };

  it('renders the select field with label', () => {
    render(<TestForm />);
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
  });

  it('displays all provided options', async () => {
    const options = [
      { value: '1', label: 'First Option' },
      { value: '2', label: 'Second Option' },
    ];
    render(<TestForm options={options} />);

    // Open the select dropdown
    const select = screen.getByLabelText('Test Select');
    await userEvent.click(select);

    // Check that all options are rendered
    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('calls onChange handler when an option is selected', async () => {
    const onChange = vi.fn();
    render(<TestForm selectProps={{ onChange }} />);

    const select = screen.getByLabelText('Test Select');
    await userEvent.click(select);

    // Select the first option
    const option = screen.getByText('Option 1');
    await userEvent.click(option);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('displays error message when field is required and not filled', async () => {
    const handleSubmit = vi.fn();
    render(<TestForm required onSubmit={handleSubmit} defaultValues={{ testField: '' }} />);

    // Submit the form without selecting an option
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<TestForm disabled />);
    const select = screen.getByLabelText('Test Select');
    expect(select).toHaveAttribute('aria-disabled', 'true');
  });

  it('displays helper text when provided', () => {
    const helperText = 'Please select an option';
    render(<TestForm helperText={helperText} />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it('submits the form with selected value', async () => {
    const handleSubmit = vi.fn();
    render(<TestForm onSubmit={handleSubmit} defaultValues={{ testField: '' }} />);

    // Open and select an option
    const select = screen.getByLabelText('Test Select');
    await userEvent.click(select);
    const option = screen.getByText('Option 2');
    await userEvent.click(option);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({ testField: 'option2' }, expect.anything());
  });
});
