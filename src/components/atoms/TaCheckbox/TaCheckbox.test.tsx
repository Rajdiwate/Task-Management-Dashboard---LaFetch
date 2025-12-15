import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaCheckbox } from './TaCheckbox';

describe('TaCheckbox', () => {
  it('renders with the provided label', () => {
    const label = 'Test Checkbox';
    render(<TaCheckbox label={label} />);

    expect(screen.getByLabelText(label)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onChange handler when clicked', async () => {
    const handleChange = vi.fn();
    const label = 'Clickable Checkbox';

    render(<TaCheckbox label={label} onChange={handleChange} />);

    const checkbox = screen.getByLabelText(label);
    await act(async () => {
      fireEvent.click(checkbox);
    });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(checkbox).toBeChecked();
    });
  });
});
