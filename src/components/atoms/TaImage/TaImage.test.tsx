import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaImage } from './TaImage';

// Mock the SCSS module
vi.mock('./TaImage.module.scss', () => ({
  default: {
    'ta-image': 'ta-image-mock-class',
  },
}));

describe('TaImage', () => {
  const defaultProps = {
    src: 'https://via.placeholder.com/300x200',
    alt: 'Test image',
  };

  it('should render as an img element', () => {
    render(<TaImage {...defaultProps} data-testid='ta-image' />);

    const image = screen.getByTestId('ta-image');
    expect(image).toBeInTheDocument();
    expect(image.tagName).toBe('IMG');
  });

  it('should apply default ta-image class', () => {
    render(<TaImage {...defaultProps} data-testid='ta-image' />);

    const image = screen.getByTestId('ta-image');
    expect(image).toHaveClass('ta-image-mock-class');
  });

  it('should apply both default and custom className when className is provided', () => {
    const customClass = 'custom-image-class';

    render(<TaImage {...defaultProps} className={customClass} data-testid='ta-image' />);

    const image = screen.getByTestId('ta-image');
    expect(image).toHaveClass('ta-image-mock-class');
    expect(image).toHaveClass(customClass);
  });

  it('should handle MUI Box sx prop for styling', () => {
    const sxStyles = {
      borderRadius: '8px',
      boxShadow: 2,
    };

    render(<TaImage {...defaultProps} sx={sxStyles} data-testid='ta-image' />);

    const image = screen.getByTestId('ta-image');
    expect(image).toBeInTheDocument();
    // Note: sx styles are applied via MUI's system, exact style testing would require theme context
  });

  it('should handle undefined className', () => {
    render(<TaImage {...defaultProps} className={undefined} data-testid='ta-image' />);

    const image = screen.getByTestId('ta-image');
    expect(image).toHaveClass('ta-image-mock-class');
  });

  it('should handle responsive image attributes', () => {
    const srcSet =
      'https://example.com/image-320w.jpg 320w, https://example.com/image-640w.jpg 640w';
    const sizes = '(max-width: 320px) 280px, (max-width: 640px) 600px, 800px';

    render(
      <TaImage
        src='https://example.com/image.jpg'
        alt='Responsive image'
        srcSet={srcSet}
        sizes={sizes}
        data-testid='ta-image'
      />,
    );

    const image = screen.getByTestId('ta-image');
    expect(image).toHaveAttribute('srcset', srcSet);
    expect(image).toHaveAttribute('sizes', sizes);
  });

  it('should handle image event handlers', () => {
    const handleLoad = vi.fn();
    const handleError = vi.fn();

    render(
      <TaImage
        {...defaultProps}
        onLoad={handleLoad}
        onError={handleError}
        data-testid='ta-image'
      />,
    );

    const image = screen.getByTestId('ta-image');

    // Simulate load event
    image.dispatchEvent(new Event('load'));
    expect(handleLoad).toHaveBeenCalledTimes(1);

    // Simulate error event
    image.dispatchEvent(new Event('error'));
    expect(handleError).toHaveBeenCalledTimes(1);
  });

  it('should handle MUI Box component props', () => {
    render(<TaImage {...defaultProps} display='block' maxWidth='100%' data-testid='ta-image' />);

    const image = screen.getByTestId('ta-image');
    expect(image).toBeInTheDocument();
    expect(image.tagName).toBe('IMG');
  });
});
