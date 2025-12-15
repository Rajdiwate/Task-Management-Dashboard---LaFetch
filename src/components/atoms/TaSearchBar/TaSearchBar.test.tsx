/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaSearchBar } from './TaSearchBar';
import styles from './TaSearchBar.module.scss';
import React from 'react';

// Mock TaTextField - filter out non-DOM props
vi.mock('@/components/atoms/TaTextField/TaTextField', () => ({
  TaTextField: vi.fn((props) => {
    const {
      // Extract custom props that shouldn't be passed to DOM
      variant,
      slotProps,
      // Extract standard input props
      'data-testid': dataTestId,
      className,
      placeholder,
      value,
      onChange,
      size,
      ...otherProps
    } = props;

    return (
      <div data-testid='text-field-wrapper' data-variant={variant} data-size={size}>
        <input
          data-testid={dataTestId}
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          // Only pass standard HTML attributes
          {...Object.fromEntries(
            Object.entries(otherProps).filter(
              ([key]) => !key.startsWith('data-') || key === 'data-testid',
            ),
          )}
        />
        {/* Mock the InputAdornment content */}
        {slotProps?.input?.startAdornment && (
          <div data-testid='start-adornment'>{slotProps.input.startAdornment}</div>
        )}
      </div>
    );
  }),
}));

// Mock TaIcon
vi.mock('@/core', () => ({
  TaIcon: {
    Search: vi.fn((props) => (
      <span data-testid='search-icon' className={props.className}>
        🔍
      </span>
    )),
  },
}));

// Mock MUI InputAdornment
vi.mock('@mui/material/InputAdornment', () => ({
  default: vi.fn(({ children, position }) => (
    <div data-testid='input-adornment' data-position={position}>
      {children}
    </div>
  )),
}));

// Mock useDebounce hook - return a simple function that tracks calls
const mockDebouncedFunction = vi.fn();
vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: vi.fn((callback) => {
    // Return a mock function that we can track
    mockDebouncedFunction.mockImplementation(callback);
    return mockDebouncedFunction;
  }),
}));

describe('TaSearchBar', () => {
  const mockOnChange = vi.fn();

  const defaultProps = {
    value: '',
    onChange: mockOnChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders with default props', () => {
      render(<TaSearchBar {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');
      expect(input).toHaveAttribute('placeholder', 'Search Bar');
    });

    it('renders with custom placeholder', () => {
      const customPlaceholder = 'Search for items...';
      render(<TaSearchBar {...defaultProps} placeholder={customPlaceholder} />);

      const input = screen.getByPlaceholderText(customPlaceholder);
      expect(input).toBeInTheDocument();
    });

    it('renders with provided value', () => {
      const testValue = 'test value';
      render(<TaSearchBar value={testValue} onChange={mockOnChange} />);

      const input = screen.getByDisplayValue(testValue);
      expect(input).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const customClass = 'custom-search-class';
      render(<TaSearchBar {...defaultProps} className={customClass} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(customClass);
    });

    it('applies dataTestId correctly', () => {
      const testId = 'search-bar-test';
      render(<TaSearchBar {...defaultProps} dataTestId={testId} />);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  describe('TaTextField integration', () => {
    it('passes correct props to TaTextField', async () => {
      render(<TaSearchBar {...defaultProps} placeholder='Custom placeholder' />);

      const wrapper = screen.getByTestId('text-field-wrapper');
      expect(wrapper).toHaveAttribute('data-variant', 'outlined');
      expect(wrapper).toHaveAttribute('data-size', 'small');

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Custom placeholder');
    });

    it('overrides size with textFieldProps', () => {
      const textFieldProps = {
        size: 'medium' as const,
      };

      render(<TaSearchBar {...defaultProps} textFieldProps={textFieldProps} />);

      const wrapper = screen.getByTestId('text-field-wrapper');
      expect(wrapper).toHaveAttribute('data-size', 'medium');
    });

    it('renders search icon in start adornment', () => {
      render(<TaSearchBar {...defaultProps} />);

      expect(screen.getByTestId('start-adornment')).toBeInTheDocument();
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });
  });

  describe('Input handling', () => {
    it('updates local value immediately when user types', async () => {
      const user = userEvent.setup();
      render(<TaSearchBar {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(input).toHaveValue('test');
    });

    it('calls debounced onChange when input changes', async () => {
      const user = userEvent.setup();
      render(<TaSearchBar {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 't');

      // Check that the debounced function was called
      expect(mockDebouncedFunction).toHaveBeenCalled();
    });

    it('maintains local state correctly', async () => {
      const user = userEvent.setup();
      render(<TaSearchBar {...defaultProps} />);

      const input = screen.getByRole('textbox');

      await user.type(input, 'search');
      expect(input).toHaveValue('search');

      await user.clear(input);
      expect(input).toHaveValue('');
    });
  });

  describe('Debouncing behavior', () => {
    it('sets up debounce with correct parameters', async () => {
      render(<TaSearchBar {...defaultProps} />);

      const { useDebounce } = await import('@/hooks/useDebounce');
      expect(vi.mocked(useDebounce)).toHaveBeenCalledWith(mockOnChange, 500);
    });

    it('calls debounced function with event object', async () => {
      const user = userEvent.setup();
      render(<TaSearchBar {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'a');

      // Check that debounced function was called
      expect(mockDebouncedFunction).toHaveBeenCalled();

      // Check that it was called with an event-like object
      const callArgs = mockDebouncedFunction.mock.calls[0][0];
      expect(callArgs).toHaveProperty('target');
      expect(callArgs.target).toHaveProperty('value');
    });
  });

  describe('Value synchronization', () => {
    it('initializes with provided value', () => {
      const initialValue = 'initial search';
      render(<TaSearchBar value={initialValue} onChange={mockOnChange} />);

      const input = screen.getByDisplayValue(initialValue);
      expect(input).toBeInTheDocument();
    });

    it('handles empty string value', () => {
      render(<TaSearchBar value='' onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });
  });

  describe('Event handling', () => {
    it('handles typing correctly', async () => {
      const user = userEvent.setup();
      render(<TaSearchBar {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test query');

      expect(input).toHaveValue('test query');
    });

    it('handles clearing input', async () => {
      const user = userEvent.setup();
      render(<TaSearchBar {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      expect(input).toHaveValue('test');

      await user.clear(input);
      expect(input).toHaveValue('');
    });

    it('handles focus and blur', async () => {
      const user = userEvent.setup();
      render(<TaSearchBar {...defaultProps} />);

      const input = screen.getByRole('textbox');

      await user.click(input);
      expect(input).toHaveFocus();

      await user.tab();
      expect(input).not.toHaveFocus();
    });
  });

  describe('Component integration', () => {
    it('works in controlled component pattern', async () => {
      function TestComponent() {
        const [value, setValue] = React.useState('');

        return (
          <div>
            <TaSearchBar value={value} onChange={(e) => setValue(e.target.value)} />
            <div data-testid='external-value'>{value}</div>
          </div>
        );
      }

      const user = userEvent.setup();
      render(<TestComponent />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      // The input shows immediate feedback
      expect(input).toHaveValue('test');
    });

    it('applies CSS classes correctly', () => {
      const customClass = 'custom-class';
      render(<TaSearchBar {...defaultProps} className={customClass} />);

      const input = screen.getByRole('textbox');
      expect(input.className).toContain(customClass);
    });
  });

  describe('Accessibility', () => {
    it('provides accessible textbox role', () => {
      render(<TaSearchBar {...defaultProps} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button>Previous element</button>
          <TaSearchBar {...defaultProps} />
          <button>Next element</button>
        </div>,
      );

      const input = screen.getByRole('textbox');

      await user.tab(); // Focus on first button
      await user.tab(); // Focus on input
      expect(input).toHaveFocus();

      await user.keyboard('test');
      expect(input).toHaveValue('test');
    });
  });

  describe('Edge cases', () => {
    it('handles special characters', async () => {
      const user = userEvent.setup();
      render(<TaSearchBar {...defaultProps} />);

      const input = screen.getByRole('textbox');
      const specialChars = '!@#$%^&*()';

      await user.type(input, specialChars);
      expect(input).toHaveValue(specialChars);
    });

    it('handles undefined onChange gracefully', () => {
      // Should not crash during render
      expect(() => {
        render(<TaSearchBar value='' onChange={undefined as any} />);
      }).not.toThrow();
    });

    it('handles long text input', async () => {
      const user = userEvent.setup();
      render(<TaSearchBar {...defaultProps} />);

      const input = screen.getByRole('textbox');
      const longText = 'This is a very long search query that should be handled correctly';

      await user.type(input, longText);
      expect(input).toHaveValue(longText);
    });
  });

  describe('Search icon rendering', () => {
    it('renders search icon with correct styling', () => {
      render(<TaSearchBar {...defaultProps} />);

      const searchIcon = screen.getByTestId('search-icon');
      expect(searchIcon).toBeInTheDocument();
      expect(searchIcon).toHaveClass(styles['ta-search-bar__icon']);
    });

    it('includes search icon in start adornment', () => {
      render(<TaSearchBar {...defaultProps} />);

      const startAdornment = screen.getByTestId('start-adornment');
      const searchIcon = screen.getByTestId('search-icon');

      expect(startAdornment).toBeInTheDocument();
      expect(startAdornment).toContainElement(searchIcon);
    });
  });

  describe('Performance and optimization', () => {
    it('does not cause excessive re-renders', () => {
      let renderCount = 0;

      function TestWrapper(props: any) {
        renderCount++;
        return <TaSearchBar {...props} />;
      }

      const { rerender } = render(<TestWrapper {...defaultProps} />);
      expect(renderCount).toBe(1);

      rerender(<TestWrapper {...defaultProps} />);
      expect(renderCount).toBe(2);
    });

    it('handles rapid input changes', async () => {
      const user = userEvent.setup();
      render(<TaSearchBar {...defaultProps} />);

      const input = screen.getByRole('textbox');

      // Type rapidly - each keystroke should call the debounced function
      await user.type(input, 'abcdef');
      expect(input).toHaveValue('abcdef');

      // Check that debounced function was called for each character
      expect(mockDebouncedFunction).toHaveBeenCalledTimes(6);
    });
  });
});
