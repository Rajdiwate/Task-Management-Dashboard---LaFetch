import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaStack } from './TaStack';

describe('TaStack', () => {
  it('renders children', () => {
    render(
      <TaStack>
        <div>Item 1</div>
        <div>Item 2</div>
      </TaStack>,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TaStack className='custom-class'>
        <div>Item</div>
      </TaStack>,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
