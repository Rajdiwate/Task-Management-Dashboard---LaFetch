import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaToolbar } from './TaToolbar';

describe('TaToolbar', () => {
  it('should render children correctly', () => {
    const testContent = 'Test toolbar content';

    render(
      <TaToolbar>
        <span data-testid='toolbar-child'>{testContent}</span>
      </TaToolbar>,
    );

    expect(screen.getByTestId('toolbar-child')).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('should apply default ta-toolbar class when no className is provided', () => {
    render(
      <TaToolbar data-testid='toolbar'>
        <span>Content</span>
      </TaToolbar>,
    );

    const toolbar = screen.getByTestId('toolbar');
    expect(toolbar).toHaveClass(/ta-toolbar/);
  });

  it('should apply multiple custom classes along with default class', () => {
    const customClasses = 'custom-class-1 custom-class-2';

    render(
      <TaToolbar className={customClasses} data-testid='toolbar'>
        <span>Content</span>
      </TaToolbar>,
    );

    const toolbar = screen.getByTestId('toolbar');
    expect(toolbar).toHaveClass(/ta-toolbar/);
    expect(toolbar).toHaveClass('custom-class-1');
    expect(toolbar).toHaveClass('custom-class-2');
  });

  it('should forward additional props to the underlying Toolbar component', () => {
    const testId = 'custom-toolbar';
    const ariaLabel = 'Custom toolbar';

    render(
      <TaToolbar data-testid={testId} aria-label={ariaLabel} role='toolbar'>
        <span>Content</span>
      </TaToolbar>,
    );

    const toolbar = screen.getByTestId(testId);
    expect(toolbar).toHaveAttribute('aria-label', ariaLabel);
    expect(toolbar).toHaveAttribute('role', 'toolbar');
  });
});
