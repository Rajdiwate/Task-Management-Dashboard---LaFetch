import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaAutocomplete, type AutocompleteOptionType } from './TaAutocomplete';

describe('TaAutocomplete', () => {
  const options: AutocompleteOptionType[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  const defaultProps = {
    options,
    value: [],
    onChange: vi.fn(),
    placeholder: 'Select options...',
    label: 'Test Label',
    multiple: true,
  };

  it('renders with default props', () => {
    render(<TaAutocomplete {...defaultProps} />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select options...')).toBeInTheDocument();
  });

  it('displays selected options when value is provided (multiple)', () => {
    const selectedOptions = [options[0], options[1]];
    render(<TaAutocomplete {...defaultProps} value={selectedOptions} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('displays error state when error prop is true', () => {
    render(<TaAutocomplete {...defaultProps} error={true} helperText='Test error message' />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('displays custom placeholder when provided', () => {
    render(<TaAutocomplete {...defaultProps} placeholder='Custom placeholder' />);
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('renders custom selected values when renderSelected prop is provided', () => {
    const renderSelected = <div data-testid='custom-selected'>Custom Selected</div>;
    render(<TaAutocomplete {...defaultProps} renderSelected={renderSelected} />);
    expect(screen.getByTestId('custom-selected')).toBeInTheDocument();
  });

  it('disables the input when disabled prop is true', () => {
    render(<TaAutocomplete {...defaultProps} disabled={true} />);
    const input = screen.getByRole('combobox');
    expect(input).toBeDisabled();
  });

  it('handles freeSolo behavior and converts string values to option objects', () => {
    const onChangeMock = vi.fn();
    render(<TaAutocomplete {...defaultProps} freeSolo onChange={onChangeMock} />);

    const input = screen.getByRole('combobox');

    // Simulate selecting a new string value not in options
    fireEvent.change(input, { target: { value: 'New option' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // The onChange should be called with object containing label 'New option'
    const calledArg = onChangeMock.mock.calls[0][0];
    if (Array.isArray(calledArg)) {
      expect(calledArg[0]).toHaveProperty('label', 'New option');
      expect(typeof calledArg[0].value).toBe('string'); // value is timestamp string
    } else {
      expect(calledArg).toHaveProperty('label', 'New option');
    }
  });

  it('prevents chip deletion with backspace keydown', () => {
    render(<TaAutocomplete {...defaultProps} />);
    const input = screen.getByRole('combobox');

    // Spy on the prototype stopPropagation method
    const stopPropagationSpy = vi.spyOn(Event.prototype, 'stopPropagation');

    fireEvent.keyDown(input, { key: 'Backspace' });

    expect(stopPropagationSpy).toHaveBeenCalled();

    // Restore original implementation to avoid side effects
    stopPropagationSpy.mockRestore();
  });

  it('calls onChange when an option is selected', async () => {
    const onChangeMock = vi.fn();
    render(<TaAutocomplete {...defaultProps} onChange={onChangeMock} multiple={false} />);

    const input = screen.getByRole('combobox');
    fireEvent.mouseDown(input);

    const option = await screen.findByText('Option 1');
    fireEvent.click(option);

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ value: '1', label: 'Option 1' }),
    );
  });

  it('calls onOptionSelect callback when provided', async () => {
    const onOptionSelectMock = vi.fn();
    render(<TaAutocomplete {...defaultProps} onOptionSelect={onOptionSelectMock} />);

    const input = screen.getByRole('combobox');
    fireEvent.mouseDown(input);

    const option = await screen.findByText('Option 1');
    fireEvent.click(option);

    expect(onOptionSelectMock).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ value: '1', label: 'Option 1' })]),
    );
  });
});
