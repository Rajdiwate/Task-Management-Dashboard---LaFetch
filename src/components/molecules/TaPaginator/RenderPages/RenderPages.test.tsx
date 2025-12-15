import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import { RenderPages } from './RenderPages';

describe('RenderPages', () => {
  const mockHandlePageChange = vi.fn();

  beforeEach(() => {
    mockHandlePageChange.mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders all pages when total pages is 3 or less', () => {
      const { rerender } = render(
        <RenderPages totalPages={3} validCurrentPage={1} handlePageChange={mockHandlePageChange} />,
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.queryAllByText('...')).toHaveLength(0);

      // Test with 2 pages
      rerender(
        <RenderPages totalPages={2} validCurrentPage={1} handlePageChange={mockHandlePageChange} />,
      );
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });

    it('handles single page correctly', () => {
      render(
        <RenderPages totalPages={1} validCurrentPage={1} handlePageChange={mockHandlePageChange} />,
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.queryByText('2')).not.toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });

  describe('Active Page States', () => {
    it('shows first page when current page is 1', () => {
      render(
        <RenderPages
          totalPages={10}
          validCurrentPage={1}
          handlePageChange={mockHandlePageChange}
        />,
      );

      const firstPageButton = screen.getByText('1');
      expect(firstPageButton).toBeInTheDocument();
    });

    it('shows last page as active when current page equals total pages', () => {
      render(
        <RenderPages
          totalPages={10}
          validCurrentPage={10}
          handlePageChange={mockHandlePageChange}
        />,
      );

      const lastPageButton = screen.getByText('10');
      expect(lastPageButton.closest('button')).toHaveClass('MuiButton-text');
    });

    it('shows correct page as active when current page is in the middle', () => {
      render(
        <RenderPages
          totalPages={10}
          validCurrentPage={5}
          handlePageChange={mockHandlePageChange}
        />,
      );

      const middlePageButton = screen.getByText('5');
      expect(middlePageButton.closest('button')).toHaveClass('MuiButton-text');
    });
  });

  describe('Ellipsis Rendering', () => {
    it('renders ellipsis correctly when there are many pages', () => {
      render(
        <RenderPages
          totalPages={10}
          validCurrentPage={5}
          handlePageChange={mockHandlePageChange}
        />,
      );

      const ellipsis = screen.getAllByText('...');
      expect(ellipsis).toHaveLength(2);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('shows single ellipsis when current page is at the end', () => {
      render(
        <RenderPages
          totalPages={10}
          validCurrentPage={10}
          handlePageChange={mockHandlePageChange}
        />,
      );

      const ellipsis = screen.getAllByText('...');
      expect(ellipsis).toHaveLength(1);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('shows single ellipsis when current page is at the start', () => {
      render(
        <RenderPages
          totalPages={10}
          validCurrentPage={1}
          handlePageChange={mockHandlePageChange}
        />,
      );

      const ellipsis = screen.getAllByText('...');
      expect(ellipsis).toHaveLength(1);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('does not show ellipsis when all pages fit', () => {
      render(
        <RenderPages totalPages={4} validCurrentPage={3} handlePageChange={mockHandlePageChange} />,
      );

      expect(screen.queryByText('...')).not.toBeInTheDocument();
      for (let i = 1; i <= 4; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });
  });

  describe('Page Change Handling', () => {
    it('calls handlePageChange with correct page number when clicked', () => {
      render(
        <RenderPages
          totalPages={10}
          validCurrentPage={5}
          handlePageChange={mockHandlePageChange}
        />,
      );

      fireEvent.click(screen.getByText('1'));
      expect(mockHandlePageChange).toHaveBeenCalledWith(1);

      fireEvent.click(screen.getByText('4'));
      expect(mockHandlePageChange).toHaveBeenCalledWith(4);

      fireEvent.click(screen.getByText('6'));
      expect(mockHandlePageChange).toHaveBeenCalledWith(6);

      expect(mockHandlePageChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Edge Cases', () => {
    it('handles zero or negative totalPages', () => {
      const { container } = render(
        <RenderPages totalPages={0} validCurrentPage={1} handlePageChange={mockHandlePageChange} />,
      );
      expect(container.firstChild).toBeNull();

      const { container: container2 } = render(
        <RenderPages
          totalPages={-5}
          validCurrentPage={1}
          handlePageChange={mockHandlePageChange}
        />,
      );
      expect(container2.firstChild).toBeNull();
    });

    it('handles validCurrentPage greater than totalPages', () => {
      render(
        <RenderPages
          totalPages={5}
          validCurrentPage={10}
          handlePageChange={mockHandlePageChange}
        />,
      );

      expect(mockHandlePageChange).toHaveBeenCalledWith(5);
      expect(screen.getByText('5').closest('button')).toHaveStyle(
        'color: var(--variant-textColor)',
      );
    });

    it('handles boundary conditions correctly', () => {
      render(
        <RenderPages totalPages={8} validCurrentPage={1} handlePageChange={mockHandlePageChange} />,
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.queryByText('3')).not.toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('shows left ellipsis only when current page is near end', () => {
      render(
        <RenderPages
          totalPages={10}
          validCurrentPage={8}
          handlePageChange={mockHandlePageChange}
        />,
      );

      const ellipsis = screen.getAllByText('...');
      expect(ellipsis).toHaveLength(1); // Should only show left ellipsis
    });
    it('shows right ellipsis only when current page is near start', () => {
      render(
        <RenderPages
          totalPages={10}
          validCurrentPage={2}
          handlePageChange={mockHandlePageChange}
        />,
      );

      const ellipsis = screen.getAllByText('...');
      expect(ellipsis).toHaveLength(1); // Should only show right ellipsis
    });
  });
});
