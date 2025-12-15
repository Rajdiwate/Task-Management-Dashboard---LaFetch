import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TaDatePicker } from './TaDatePicker';

describe('TaDatePicker', () => {
  it('applies custom className', () => {
    const { container } = render(<TaDatePicker className='custom-class' />);
    const datePickerElement = container.querySelector('.custom-class');
    expect(datePickerElement).toBeInTheDocument();
  });

  it('has calendar button', () => {
    render(<TaDatePicker label='Date' />);
    const calendarButton = screen.getByRole('button');
    expect(calendarButton).toBeInTheDocument();
  });

  it('opens calendar when calendar icon is clicked', async () => {
    const user = userEvent.setup();
    render(<TaDatePicker label='Date' />);

    const calendarButton = screen.getByRole('button');

    await act(async () => {
      await user.click(calendarButton);
    });

    // Check if calendar dialog opens
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });
});
