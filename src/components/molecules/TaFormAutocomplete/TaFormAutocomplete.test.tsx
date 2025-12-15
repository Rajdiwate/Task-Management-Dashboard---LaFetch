import { render, screen, fireEvent } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { TaFormAutocomplete } from './TaFormAutocomplete';
import { vi } from 'vitest';

// Mock the TaAutocomplete component
vi.mock('@/components/atoms', () => ({
  TaAutocomplete: vi.fn(({ label, error, helperText, options, onChange, value, ...props }) => {
    return (
      <div data-testid='mock-search-select' {...props}>
        <label>{label}</label>
        <div data-testid='mock-options'>
          {options.map((option: { value: string; label: string }) => (
            <button
              key={option.value}
              onClick={() => onChange(option, {})}
              data-testid={`option-${option.value}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {error && <div data-testid='error-message'>{helperText}</div>}
        {helperText && !error && <div data-testid='helper-text'>{helperText}</div>}
        <div data-testid='selected-value'>{JSON.stringify(value)}</div>
      </div>
    );
  }),
}));

describe('TaFormAutocomplete', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];

  // Create a test component that uses the actual form methods
  const TestComponent = ({ errors = {}, defaultValues = { testField: null }, ...props }) => {
    const methods = useForm({ defaultValues });

    return (
      <FormProvider {...methods}>
        <TaFormAutocomplete
          name='testField'
          control={methods.control} // Use actual control
          errors={errors}
          label='Test Label'
          id='test-id'
          dataTestId='test-select'
          options={options}
          {...props}
        />
      </FormProvider>
    );
  };

  it('renders with label and options', () => {
    render(<TestComponent />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByTestId('mock-options')).toBeInTheDocument();
    expect(screen.getByTestId('option-1')).toHaveTextContent('Option 1');
    expect(screen.getByTestId('option-2')).toHaveTextContent('Option 2');
  });

  it('displays error message when error exists', () => {
    const errors = {
      testField: { message: 'This field is required' },
    };

    render(<TestComponent errors={errors} />);

    expect(screen.getByTestId('error-message')).toHaveTextContent('This field is required');
  });

  it('displays helper text when provided', () => {
    render(<TestComponent helperText='Helpful information' />);

    expect(screen.getByTestId('helper-text')).toHaveTextContent('Helpful information');
  });

  it('passes disabled prop to the select', () => {
    render(<TestComponent disabled={true} />);

    expect(screen.getByTestId('test-select')).toHaveAttribute('disabled');
  });

  it('updates value when an option is selected', () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByTestId('option-1'));

    // The value should be updated
    const selectedValue = JSON.parse(screen.getByTestId('selected-value').textContent || 'null');
    expect(selectedValue).toEqual({ value: '1', label: 'Option 1' });
  });

  it('forwards additional props to TaAutocomplete', () => {
    render(
      <TestComponent
        autoCompleteProps={{
          placeholder: 'Select an option',
          className: 'custom-class',
        }}
      />,
    );

    const select = screen.getByTestId('test-select');
    expect(select).toHaveAttribute('placeholder', 'Select an option');
  });
});
