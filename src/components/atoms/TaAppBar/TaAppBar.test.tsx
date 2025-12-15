import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaAppBar } from './TaAppBar';

const TestAppBar = ({ title = 'Test App', className = '' }) => (
  <TaAppBar position='static' className={className}>
    <h1>{title}</h1>
  </TaAppBar>
);

describe('TaAppBar', () => {
  it('renders children', () => {
    render(<TestAppBar title='Test App' />);
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<TestAppBar title='Test App' className='custom-class' />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it("should have a property position set to 'static'", () => {
    const { container } = render(<TestAppBar title='Test App' />);
    expect(container.firstChild).toHaveStyle({ position: 'static' });
  });
});
