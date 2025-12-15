import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaTypography } from './TaTypography';

describe('TaTypography', () => {
  it('renders with children text', () => {
    render(<TaTypography>Hello World</TaTypography>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies the correct className from CSS module', () => {
    render(<TaTypography>Test Text</TaTypography>);
    const element = screen.getByText('Test Text');
    // Test for the mapped class name that CSS modules generates
    expect(element.className).toContain('ta-typography');
  });

  it('passes variant prop to MUI Typography', () => {
    render(<TaTypography variant='h1'>Heading 1</TaTypography>);
    // MUI applies variants as classes with the pattern "MuiTypography-{variant}"
    const element = screen.getByRole('heading', { level: 1, name: 'Heading 1' });
    expect(element).toBeInTheDocument();
  });

  it('applies text alignment via prop', () => {
    render(<TaTypography align='center'>Centered Text</TaTypography>);
    const element = screen.getByText('Centered Text');
    // Instead of checking the inline style directly, check if the prop was passed
    expect(element.className).toContain('MuiTypography-alignCenter');
  });

  it('merges custom classNames with default classes', () => {
    render(<TaTypography className='custom-class'>Custom Class Text</TaTypography>);
    const element = screen.getByText('Custom Class Text');
    expect(element.className).toContain('ta-typography');
    expect(element.className).toContain('custom-class');
  });

  it('accepts and passes through additional props', () => {
    render(<TaTypography data-testid='typography-test'>Additional Props</TaTypography>);
    expect(screen.getByTestId('typography-test')).toBeInTheDocument();
  });
});
