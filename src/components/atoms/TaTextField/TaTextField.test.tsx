import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaTextField } from './TaTextField';

describe('TaTextField', () => {
  it('renders with label', () => {
    render(<TaTextField label='Customer Name' />);
    expect(screen.getByLabelText('Customer Name')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<TaTextField placeholder='Enter value' />);
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  it('applies the correct type', () => {
    render(<TaTextField type='password' label='Password' />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders as disabled', () => {
    render(<TaTextField label='Disabled' disabled />);
    expect(screen.getByLabelText('Disabled')).toBeDisabled();
  });

  it('shows helper text', () => {
    render(<TaTextField label='Email' helperText='Enter a valid email' />);
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
  });

  it('renders required field', () => {
    render(<TaTextField label='Required' required />);
    const input = screen.getByLabelText(/Required/);
    expect(input).toBeRequired();
  });

  it('should disable border', () => {
    render(<TaTextField disableBorder data-testid='ta-text-field' />);
    const input = screen.getByTestId('ta-text-field');
    expect(input).toHaveClass(/ta-text-field--no-border/);
  });

  it('should toggle password visibility when eye icon is clicked', () => {
    render(<TaTextField type='password' label='Password' />);

    // Initially should be password type
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

    // Click the toggle button
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    fireEvent.click(toggleButton);

    // Should now be text type
    expect(input).toHaveAttribute('type', 'text');

    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should show eye icon for password fields', () => {
    render(<TaTextField type='password' label='Password' />);
    expect(screen.getByTestId('eye-open')).toBeInTheDocument();
  });

  it('should not show eye icon for non-password fields', () => {
    const { container } = render(<TaTextField type='text' label='Username' />);
    expect(container.querySelector('button')).not.toBeInTheDocument();
  });

  it('should pass through slotProps to the input', () => {
    render(
      <TaTextField
        label='Test'
        slotProps={{
          input: {
            placeholder: 'Custom placeholder',
          },
        }}
      />,
    );
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('should handle mouse down on password toggle button', () => {
    render(<TaTextField type='password' label='Password' />);
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
    const preventDefaultSpy = vi.spyOn(mouseDownEvent, 'preventDefault');

    act(() => {
      toggleButton.dispatchEvent(mouseDownEvent);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should render with email type', () => {
    render(<TaTextField type='email' label='Email' />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should render with number type', () => {
    render(<TaTextField type='number' label='Age' />);
    const input = screen.getByLabelText('Age');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should apply custom className', () => {
    const { container } = render(<TaTextField className='custom-class' />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should render with standard variant', () => {
    render(<TaTextField variant='standard' label='Standard' />);
    const input = screen.getByLabelText('Standard');
    expect(input).toHaveAttribute('class', expect.stringContaining('MuiInput-input'));
  });

  it('should show error state', () => {
    render(<TaTextField error helperText='Error message' />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should render with fullWidth prop', () => {
    const { container } = render(<TaTextField fullWidth />);
    expect(container.firstChild).toHaveClass('MuiFormControl-fullWidth');
  });

  it('should use default props when not provided', () => {
    render(<TaTextField />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).not.toBeRequired();
  });

  it('should not show password toggle for non-password fields', () => {
    const { queryByRole } = render(<TaTextField type='text' />);
    expect(queryByRole('button')).not.toBeInTheDocument();
  });
});
