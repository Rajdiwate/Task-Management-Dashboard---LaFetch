import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaIconButton } from './TaIconButton';

describe('TaIconButton', () => {
  it('renders with children content', () => {
    render(
      <TaIconButton aria-label='test icon button'>
        <span>Icon</span>
      </TaIconButton>,
    );
    expect(screen.getByRole('button', { name: /test icon button/i })).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('applies the custom ta-icon-button class', () => {
    render(
      <TaIconButton aria-label='styled button'>
        <span>Icon</span>
      </TaIconButton>,
    );
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/ta-icon-button/);
  });

  it('applies additional custom className', () => {
    render(
      <TaIconButton className='custom-class' aria-label='custom button'>
        <span>Icon</span>
      </TaIconButton>,
    );
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/ta-icon-button/);
    expect(button.className).toMatch(/custom-class/);
  });

  it('calls onClick when clicked', () => {
    const onClickMock = vi.fn();
    render(
      <TaIconButton onClick={onClickMock} aria-label='clickable button'>
        <span>Icon</span>
      </TaIconButton>,
    );
    const button = screen.getByRole('button');
    button.click();
    expect(onClickMock).toHaveBeenCalledOnce();
  });

  it('applies disabled state when disabled prop is true', () => {
    render(
      <TaIconButton disabled aria-label='disabled button'>
        <span>Icon</span>
      </TaIconButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('forwards all IconButton props correctly', () => {
    render(
      <TaIconButton size='large' color='primary' aria-label='large primary button'>
        <span>Icon</span>
      </TaIconButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiIconButton-sizeLarge');
    expect(button).toHaveClass('MuiIconButton-colorPrimary');
  });
});
