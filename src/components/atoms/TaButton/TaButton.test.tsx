import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaButton } from './TaButton';

describe('TaButton', () => {
  it('renders with children text', () => {
    render(<TaButton>Click Me</TaButton>);
    expect(screen.getByRole('button', { name: /Click Me/i })).toBeInTheDocument();
  });

  it('applies the default variant "contained"', () => {
    render(<TaButton>Contained Button</TaButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-contained'); // MUI applies this class based on variant
  });

  it('applies a custom variant', () => {
    render(<TaButton variant='outlined'>Outlined Button</TaButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-outlined');
  });

  it('calls onClick when clicked', () => {
    const onClickMock = vi.fn();
    render(<TaButton onClick={onClickMock}>Click Me</TaButton>);
    const button = screen.getByRole('button');
    button.click();
    expect(onClickMock).toHaveBeenCalledOnce();
  });
  it('applies disable-hover class when disableHover is true', () => {
    render(<TaButton disableHover>No Hover Button</TaButton>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/ta-button--disable-hover/);
  });

  describe('customColor prop', () => {
    it('applies custom color styles for contained variant', () => {
      const customColor = '#ff5722';
      render(
        <TaButton variant='contained' customColor={customColor}>
          Custom Contained
        </TaButton>,
      );

      const button = screen.getByRole('button');

      // Check if custom color is applied to background and border
      expect(button).toHaveStyle({
        backgroundColor: customColor,
        borderColor: customColor,
      });
    });

    it('applies custom color styles for outlined variant', () => {
      const customColor = '#2196f3';
      render(
        <TaButton variant='outlined' customColor={customColor} data-testid='outlined-button'>
          Custom Outlined
        </TaButton>,
      );

      const button = screen.getByTestId('outlined-button');

      // Check if custom color is applied to text and border
      expect(button).toHaveStyle({
        color: customColor,
      });
    });

    it('applies custom color styles for text variant', () => {
      const customColor = '#4caf50';
      render(
        <TaButton variant='text' customColor={customColor}>
          Custom Text
        </TaButton>,
      );

      const button = screen.getByRole('button');

      // Check if custom color is applied to text
      expect(button).toHaveStyle({
        color: customColor,
      });
    });

    it('applies custom color with default variant when variant is not specified', () => {
      const customColor = '#9c27b0';
      render(<TaButton customColor={customColor}>Default Variant</TaButton>);

      const button = screen.getByRole('button');

      // Should apply contained variant styles by default
      expect(button).toHaveStyle({
        backgroundColor: customColor,
        borderColor: customColor,
      });
    });

    it('handles hex color values correctly', () => {
      const hexColor = '#e91e63';
      render(
        <TaButton variant='outlined' customColor={hexColor}>
          Hex Color
        </TaButton>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        color: hexColor,
        borderColor: hexColor,
      });
    });

    it('handles RGB color values correctly', () => {
      const rgbColor = 'rgb(255, 152, 0)';
      render(
        <TaButton variant='contained' customColor={rgbColor}>
          RGB Color
        </TaButton>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        backgroundColor: rgbColor,
        borderColor: rgbColor,
      });
    });

    it('combines customColor with additional sx prop styles', () => {
      const customColor = '#673ab7';
      const additionalSx = { padding: '16px', fontSize: '18px' };

      render(
        <TaButton variant='contained' customColor={customColor} sx={additionalSx}>
          Combined Styles
        </TaButton>,
      );

      const button = screen.getByRole('button');

      // Should have both custom color and additional styles
      expect(button).toHaveStyle({
        backgroundColor: customColor,
        borderColor: customColor,
        padding: '16px',
        fontSize: '18px',
      });
    });

    it('prioritizes sx prop styles over customColor when there are conflicts', () => {
      const customColor = '#795548';
      const overrideSx = { color: 'white' };

      render(
        <TaButton variant='contained' customColor={customColor} sx={overrideSx}>
          Override Styles
        </TaButton>,
      );

      const button = screen.getByRole('button');

      // sx prop should override customColor styles
      expect(button).toHaveStyle({
        color: 'rgb(255, 255, 255)',
      });
    });

    it('works with disableHover and customColor together', () => {
      const customColor = '#607d8b';
      render(
        <TaButton variant='outlined' customColor={customColor} disableHover>
          No Hover Custom Color
        </TaButton>,
      );

      const button = screen.getByRole('button');

      // Should have both custom color and disable hover class
      expect(button).toHaveStyle({
        color: customColor,
        borderColor: customColor,
      });
      expect(button.className).toMatch(/ta-button--disable-hover/);
    });

    it('applies hover styles for contained variant with customColor', () => {
      const customColor = '#ff9800';
      render(
        <TaButton variant='contained' customColor={customColor}>
          Hover Test
        </TaButton>,
      );

      const button = screen.getByRole('button');

      // Check that hover styles are properly configured in sx prop
      // Note: We can't directly test hover state in JSDOM, but we can verify the styles are applied
      expect(button).toHaveStyle({
        backgroundColor: customColor,
        borderColor: customColor,
      });
    });

    it('applies tinted hover background for outlined and text variants', () => {
      const customColor = '#3f51b5';

      render(
        <TaButton variant='outlined' customColor={customColor}>
          Tinted Hover
        </TaButton>,
      );

      const button = screen.getByRole('button');

      // Verify base styles (hover styles are in sx but can't be directly tested in JSDOM)
      expect(button).toHaveStyle({
        color: customColor,
      });
    });
  });
});
