import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaBox } from './TaBox';

describe('TaBox', () => {
  it('renders with children text', () => {
    render(<TaBox>This is a TaBox content</TaBox>);
    expect(screen.getByText('This is a TaBox content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<TaBox className='custom-class'>Content</TaBox>);
    const box = screen.getByText('Content');
    expect(box).toHaveClass('custom-class');
  });

  it('applies background color', () => {
    render(<TaBox bgcolor='#e3f2fd'>Colored</TaBox>);
    const box = screen.getByText('Colored');
    expect(box).toHaveStyle({ backgroundColor: '#e3f2fd' });
  });

  it('renders as div element when component prop is set', () => {
    render(<TaBox>component</TaBox>);
    const box = screen.getByText('component');
    expect(box.tagName.toLowerCase()).toBe('div');
  });

  it('merges sx prop with other props', () => {
    render(
      <TaBox p={2} sx={{ border: '1px solid black' }}>
        With border
      </TaBox>,
    );
    const box = screen.getByText('With border');
    expect(box).toHaveStyle({ border: '1px solid black' });
  });
});

it('renders without className prop', () => {
  const { container } = render(<TaBox>Default class</TaBox>);
  const box = container.firstChild as HTMLElement;
  // Should have the ta-box class from styles, but not throw or fail
  expect(box.className).toContain('ta-box');
});

it('renders with className prop', () => {
  const { container } = render(<TaBox className='custom-class'>With class</TaBox>);
  const box = container.firstChild as HTMLElement;
  expect(box.className).toContain('custom-class');
  expect(box.className).toContain('ta-box');
});

it('renders with className as undefined', () => {
  const { container } = render(<TaBox className={undefined}>No className</TaBox>);
  const box = container.firstChild as HTMLElement;
  expect(box.className).toContain('ta-box');
});
