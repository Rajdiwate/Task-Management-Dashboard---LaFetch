import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaDrawer } from './TaDrawer';

describe('TaDrawer', () => {
  it('renders with children content', () => {
    render(
      <TaDrawer open onClose={() => {}}>
        <div>Drawer Content</div>
      </TaDrawer>,
    );
    expect(screen.getByText(/Drawer Content/i)).toBeInTheDocument();
  });

  it('applies the default "open" state as false', async () => {
    render(
      <TaDrawer onClose={() => {}}>
        <div>Drawer Content</div>
      </TaDrawer>,
    );
    const drawer = screen.queryByRole('presentation');
    expect(drawer).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <TaDrawer className='custom-class' open onClose={() => {}}>
        <div>Drawer Content</div>
      </TaDrawer>,
    );
    const drawer = screen.getByRole('presentation');
    expect(drawer).toHaveClass('custom-class');
  });
});
