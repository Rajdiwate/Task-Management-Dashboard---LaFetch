import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TaTimePicker } from './TaTimePicker';

describe('TaTimePicker', () => {
  it('applies custom className', () => {
    const { container } = render(<TaTimePicker className='custom-class' />);
    const timePickerElement = container.querySelector('.custom-class');
    expect(timePickerElement).toBeInTheDocument();
  });

  it('has clock button', () => {
    render(<TaTimePicker label='Time' />);
    const clockButton = screen.getByRole('button');
    expect(clockButton).toBeInTheDocument();
  });

  it('opens time picker when clock icon is clicked', async () => {
    const user = userEvent.setup();
    render(<TaTimePicker label='Time' />);
    const clockButton = screen.getByRole('button');

    await act(async () => {
      await user.click(clockButton);
    });

    // Check if time picker dialog opens
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });
});
