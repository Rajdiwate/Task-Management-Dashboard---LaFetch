import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { TaPaginator } from './TaPaginator';
import { describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/components/atoms/TaSelect', () => ({
  TaSelect: ({ onChange }: { onChange: (e: { target: { value: string } }) => void }) => (
    <select
      data-testid='paginatorPageSize'
      onChange={(e) => onChange({ target: { value: e.target.value } })}
    >
      <option value='20'>20</option>
      <option value='50'>50</option>
      <option value='100'>100</option>
    </select>
  ),
}));

describe('TaPaginator', () => {
  const setPage = vi.fn();
  const setPageSize = vi.fn();
  const defaultProps = {
    currentPage: 1,
    pageSize: 20,
    totalPages: 5,
    setPage,
    setPageSize,
  };

  beforeEach(() => {
    setPage.mockClear();
    setPageSize.mockClear();
  });

  it('renders with default props', () => {
    render(<TaPaginator {...defaultProps} />);

    const prevButton = screen.getByLabelText('Previous page');
    const nextButton = screen.getByLabelText('Next page');
    const pageSizeSelect = screen.getByTestId('paginatorPageSize');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(pageSizeSelect).toBeInTheDocument();
  });

  it('calls setPage when clicking next page button', () => {
    render(<TaPaginator {...defaultProps} currentPage={1} />);

    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);

    expect(setPage).toHaveBeenCalledWith(2);
    expect(setPageSize).not.toHaveBeenCalled();
  });

  it('calls setPage when clicking previous page button', () => {
    render(<TaPaginator {...defaultProps} currentPage={2} />);

    const prevButton = screen.getByLabelText('Previous page');
    fireEvent.click(prevButton);

    expect(setPage).toHaveBeenCalledWith(1);
    expect(setPageSize).not.toHaveBeenCalled();
  });

  it('calls setPage and setPageSize when changing page size', async () => {
    render(<TaPaginator {...defaultProps} />);

    // Get the select element
    const pageSizeSelect = screen.getByTestId('paginatorPageSize');

    // Simulate the change event that TaSelect would trigger
    const changeEvent = {
      target: {
        value: '50',
        name: pageSizeSelect.getAttribute('name'),
      },
    };

    // Trigger the onChange handler directly
    fireEvent.change(pageSizeSelect, changeEvent);
    // Verify the handlers were called correctly
    expect(setPageSize).toHaveBeenCalledWith(50);
    expect(setPage).toHaveBeenCalledWith(1);
  });

  it('disables previous button on first page', () => {
    render(<TaPaginator {...defaultProps} currentPage={1} />);

    const prevButton = screen.getByLabelText('Previous page');

    fireEvent.click(prevButton);
    expect(setPage).not.toHaveBeenCalled();
  });

  it('disables next button on last page', () => {
    render(<TaPaginator {...defaultProps} currentPage={5} totalPages={5} />);

    const nextButton = screen.getByLabelText('Next page');

    fireEvent.click(nextButton);
    expect(setPage).not.toHaveBeenCalled();
  });

  it('handles single page correctly', () => {
    render(
      <TaPaginator
        currentPage={1}
        pageSize={20}
        totalPages={1}
        setPage={setPage}
        setPageSize={setPageSize}
      />,
    );

    const prevButton = screen.getByLabelText('Previous page');
    const nextButton = screen.getByLabelText('Next page');

    fireEvent.click(prevButton);
    fireEvent.click(nextButton);

    expect(setPage).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<TaPaginator {...defaultProps} className='custom-class' />);
    const paginator = screen.getByTestId('ta-paginator');
    expect(paginator).toHaveClass('custom-class');
  });

  it('displays correct page info', () => {
    render(<TaPaginator {...defaultProps} currentPage={3} totalPages={5} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
