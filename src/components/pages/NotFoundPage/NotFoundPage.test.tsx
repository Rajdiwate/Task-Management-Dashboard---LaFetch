import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotFoundPage } from './NotFoundPage';

describe('NotFoundPage', () => {
  it('should render 404 heading with correct data-id', () => {
    render(<NotFoundPage />);
    const heading = screen.getByTestId('not-found-code');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('404');
  });

  it('should render the correct message', () => {
    render(<NotFoundPage />);
    expect(
      screen.getByText("Sorry, the page you're looking for doesn't exist."),
    ).toBeInTheDocument();
  });
});
