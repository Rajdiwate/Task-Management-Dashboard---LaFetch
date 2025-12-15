import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaSelect } from './TaSelect';

describe('TaSelect', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders with label', () => {
    render(<TaSelect id='test-select' label='Test Label' options={options} />);
    expect(screen.getAllByText('Test Label')).toHaveLength(2);
  });

  it('renders all options', () => {
    render(<TaSelect id='test-select' options={options} open />);
    options.forEach((option) => {
      expect(screen.getByRole('option', { name: option.label })).toBeInTheDocument();
    });
  });

  it('calls onChange when an option is selected', async () => {
    const handleChange = vi.fn();
    render(<TaSelect id='test-select' options={options} onChange={handleChange} value='' />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    await waitFor(() => {
      const option = screen.getByRole('option', { name: 'Option 2' });
      fireEvent.click(option);
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('displays error state', () => {
    render(<TaSelect id='test-select' options={options} error helperText='Error message' />);

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
