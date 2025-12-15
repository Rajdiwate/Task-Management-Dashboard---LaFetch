import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useForm } from 'react-hook-form';
import { TaFormCheckbox } from './TaFormCheckbox';

// Test component to wrap TaFormCheckbox with form context
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TestForm = ({ defaultValues = { testField: false }, onSubmit = vi.fn(), ...props }: any) => {
  const { control, handleSubmit } = useForm({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TaFormCheckbox
        name='testField'
        control={control}
        label='Test Checkbox'
        id='test-checkbox'
        dataTestId='test-checkbox'
        {...props}
      />
      <button type='submit'>Submit</button>
    </form>
  );
};

describe('TaFormCheckbox', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders with default props', () => {
    render(<TestForm />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('id', 'test-checkbox');
    expect(screen.getByLabelText('Test Checkbox')).toBeInTheDocument();
  });

  it('is checked when default value is true', () => {
    render(<TestForm defaultValues={{ testField: true }} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('toggles value when clicked', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('is disabled when disabled prop is true', () => {
    render(<TestForm disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('shows as required when required prop is true', () => {
    render(<TestForm required />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeRequired();

    // Check if the required indicator is in the label
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-checkbox';
    render(<TestForm className={customClass} />);

    // The class should be applied to the root element of the checkbox
    expect(document.querySelector(`.${customClass}`)).toBeInTheDocument();
  });

  it('integrates with form submission', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<TestForm defaultValues={{ testField: false }} onSubmit={handleSubmit} />);

    // Check the checkbox
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({ testField: true }, expect.anything());
  });
});
