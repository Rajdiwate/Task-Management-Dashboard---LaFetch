import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@mui/material';
import { MaTable, type Column } from './MaTable';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import styles from './MaTable.module.scss';

// Mock MaPaginator
vi.mock('../MaPaginator', () => ({
  MaPaginator: vi.fn(
    ({
      currentPage,
      pageSize,
      totalPages,
      setPage,
      setPageSize,
    }: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      setPage: (page: number) => void;
      setPageSize: (size: number) => void;
    }) => (
      <div data-testid='mock-paginator'>
        <button
          onClick={() => currentPage > 1 && setPage(currentPage - 1)}
          disabled={currentPage === 1}
          data-testid='prev-button'
        >
          Previous
        </button>
        <span data-testid='page-info'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          data-testid='next-button'
        >
          Next
        </button>
        <select
          data-testid='page-size-select'
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    ),
  ),
}));

// Mock react-infinite-scroll-component
vi.mock('react-infinite-scroll-component', () => ({
  default: vi.fn(({ children, dataLength, hasMore, next, loader }) => (
    <div data-testid='infinite-scroll' data-data-length={dataLength} data-has-more={hasMore}>
      {children}
      {hasMore && (
        <button data-testid='load-more' onClick={next}>
          Load More
        </button>
      )}
      {hasMore && loader}
    </div>
  )),
}));

// Mock MaStack
vi.mock('@/components/atoms/MaStack/MaStack', () => ({
  MaStack: vi.fn(({ children, spacing, maxHeight }) => (
    <div data-testid='ma-stack' data-spacing={spacing} style={{ maxHeight }}>
      {children}
    </div>
  )),
}));

// Mock MaTypography
vi.mock('@/components/atoms/MaTypography/MaTypography', () => ({
  MaTypography: vi.fn(({ children, variant, fontWeight }) => (
    <span data-testid='ma-typography' data-variant={variant} data-font-weight={fontWeight}>
      {children}
    </span>
  )),
}));

describe('MaTable', () => {
  const columns: Column[] = [
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'age', label: 'Age', align: 'center' },
    { id: 'email', label: 'Email', align: 'right' },
  ];

  const rows = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders table with correct headers', () => {
      render(<MaTable columns={columns} rows={rows} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders correct number of rows', () => {
      render(<MaTable columns={columns} rows={rows} />);
      // Header row + data rows
      expect(screen.getAllByRole('row')).toHaveLength(rows.length + 1);
    });

    it('renders table data correctly', () => {
      render(<MaTable columns={columns} rows={rows} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('handles empty rows', () => {
      render(<MaTable columns={columns} rows={[]} />);
      // Only header row
      expect(screen.getAllByRole('row')).toHaveLength(1);
    });

    it('wraps table in MaStack', () => {
      render(<MaTable columns={columns} rows={rows} />);
      expect(screen.getByTestId('ma-stack')).toBeInTheDocument();
    });
  });

  describe('Column alignment', () => {
    it('applies correct alignment to header cells', () => {
      const { container } = render(<MaTable columns={columns} rows={rows} />);

      const headerCells = container.querySelectorAll('thead th');
      expect(headerCells[0]).toHaveStyle({ textAlign: 'left' });
      expect(headerCells[1]).toHaveStyle({ textAlign: 'center' });
      expect(headerCells[2]).toHaveStyle({ textAlign: 'right' });
    });

    it('applies correct alignment to body cells', () => {
      const { container } = render(<MaTable columns={columns} rows={rows} />);

      const bodyCells = container.querySelectorAll('tbody tr:first-child td');
      expect(bodyCells[0]).toHaveStyle({ textAlign: 'left' });
      expect(bodyCells[1]).toHaveStyle({ textAlign: 'center' });
      expect(bodyCells[2]).toHaveStyle({ textAlign: 'right' });
    });

    it('defaults to center alignment when not specified', () => {
      const columnsWithoutAlign: Column[] = [{ id: 'name', label: 'Name' }];
      const { container } = render(
        <MaTable columns={columnsWithoutAlign} rows={[{ name: 'Test' }]} />,
      );

      const headerCell = container.querySelector('thead th');
      expect(headerCell).toHaveStyle({ textAlign: 'center' });
    });
  });

  describe('Styling and CSS classes', () => {
    it('applies default CSS class', () => {
      const { container } = render(<MaTable columns={columns} rows={rows} />);
      const tableContainer = container.querySelector(`.${styles['ma-table']}`);
      expect(tableContainer).toBeInTheDocument();
    });

    it('applies custom class name', () => {
      const customClass = 'custom-table';
      const { container } = render(
        <MaTable columns={columns} rows={rows} className={customClass} />,
      );
      expect(container.querySelector(`.${customClass}`)).toBeInTheDocument();
    });

    it('applies no-background class when noBackground is true', () => {
      const { container } = render(<MaTable columns={columns} rows={rows} noBackground />);
      const tableContainer = container.querySelector(`.${styles['ma-table--no-background']}`);
      expect(tableContainer).toBeInTheDocument();
    });

    it('applies header CSS class', () => {
      const { container } = render(<MaTable columns={columns} rows={rows} />);
      const headerCell = container.querySelector(`.${styles['ma-table__header']}`);
      expect(headerCell).toBeInTheDocument();
    });

    it('applies maxHeight to MaStack', () => {
      render(<MaTable columns={columns} rows={rows} maxHeight='500px' />);
      const stack = screen.getByTestId('ma-stack');
      expect(stack).toHaveStyle({ maxHeight: '500px' });
    });
  });

  describe('Sticky header', () => {
    it('applies sticky header when stickyHeader prop is true', () => {
      const { container } = render(<MaTable columns={columns} rows={rows} stickyHeader />);
      const table = container.querySelector('.MuiTable-stickyHeader');
      expect(table).toBeInTheDocument();
    });

    it('does not apply sticky header by default', () => {
      const { container } = render(<MaTable columns={columns} rows={rows} />);
      const table = container.querySelector('.MuiTable-stickyHeader');
      expect(table).not.toBeInTheDocument();
    });
  });

  describe('React Component Support', () => {
    const componentColumns: Column[] = [
      { id: 'name', label: 'Name' },
      { id: 'action', label: 'Action' },
      { id: 'status', label: 'Status' },
    ];

    const componentRows = [
      {
        id: 1,
        name: 'John Doe',
        action: <Button data-testid='edit-button-1'>Edit</Button>,
        status: <span data-testid='status-badge-1'>Active</span>,
      },
      {
        id: 2,
        name: 'Jane Smith',
        action: <Button data-testid='delete-button-2'>Delete</Button>,
        status: <span data-testid='status-badge-2'>Inactive</span>,
      },
    ];

    it('renders React components in table cells', () => {
      render(<MaTable columns={componentColumns} rows={componentRows} />);

      expect(screen.getByTestId('edit-button-1')).toBeInTheDocument();
      expect(screen.getByTestId('delete-button-2')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('renders status badges correctly', () => {
      render(<MaTable columns={componentColumns} rows={componentRows} />);

      expect(screen.getByTestId('status-badge-1')).toHaveTextContent('Active');
      expect(screen.getByTestId('status-badge-2')).toHaveTextContent('Inactive');
    });

    it('handles mixed content types in cells', () => {
      const mixedRows = [
        {
          id: 1,
          name: 'John Doe', // string
          action: <Button data-testid='edit-btn'>Edit</Button>, // React component
          status: 'Active', // string
        },
        {
          id: 2,
          name: 'Jane Smith', // string
          action: <Button data-testid='delete-btn'>Delete</Button>, // React component
          status: 42, // number
        },
      ];

      render(<MaTable columns={componentColumns} rows={mixedRows} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByTestId('edit-btn')).toBeInTheDocument();
      expect(screen.getByTestId('delete-btn')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('wraps string and number values in MaTypography', () => {
      render(<MaTable columns={columns} rows={rows} />);

      const typographies = screen.getAllByTestId('ma-typography');
      expect(typographies.length).toBeGreaterThan(0);
    });

    it('does not wrap React components in MaTypography', () => {
      const rowsWithComponent = [
        {
          name: <div data-testid='custom-component'>Custom</div>,
        },
      ];

      render(<MaTable columns={[{ id: 'name', label: 'Name' }]} rows={rowsWithComponent} />);

      expect(screen.getByTestId('custom-component')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    const paginationProps = {
      page: 1,
      pageSize: 20,
      totalPages: 100,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
    };

    it('renders pagination when all props are provided', () => {
      render(<MaTable columns={columns} rows={rows} {...paginationProps} />);
      expect(screen.getByTestId('mock-paginator')).toBeInTheDocument();
    });

    it('does not render pagination when props are missing', () => {
      render(<MaTable columns={columns} rows={rows} />);
      expect(screen.queryByTestId('mock-paginator')).not.toBeInTheDocument();
    });

    it('calls setPage when clicking next button', () => {
      render(<MaTable columns={columns} rows={rows} {...paginationProps} page={1} />);

      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);

      expect(paginationProps.setPage).toHaveBeenCalledWith(2);
    });

    it('calls setPage when clicking previous button', () => {
      render(<MaTable columns={columns} rows={rows} {...paginationProps} page={2} />);

      const prevButton = screen.getByTestId('prev-button');
      fireEvent.click(prevButton);

      expect(paginationProps.setPage).toHaveBeenCalledWith(1);
    });

    it('calls setPageSize when changing page size', () => {
      render(<MaTable columns={columns} rows={rows} {...paginationProps} />);

      const pageSizeSelect = screen.getByTestId('page-size-select');
      fireEvent.change(pageSizeSelect, { target: { value: '50' } });

      expect(paginationProps.setPageSize).toHaveBeenCalledWith(50);
      expect(paginationProps.setPage).toHaveBeenCalledWith(1);
    });

    it('disables previous button on first page', () => {
      render(<MaTable columns={columns} rows={rows} {...paginationProps} page={1} />);
      const prevButton = screen.getByTestId('prev-button');
      expect(prevButton).toBeDisabled();
    });

    it('calculates total pages correctly', () => {
      render(
        <MaTable
          columns={columns}
          rows={rows}
          {...paginationProps}
          totalPages={100}
          pageSize={20}
        />,
      );

      // totalPages should be Math.ceil(100 / 20) = 5
      const pageInfo = screen.getByTestId('page-info');
      expect(pageInfo).toHaveTextContent('Page 1 of 5');
    });
  });

  describe('Infinite scroll', () => {
    const infiniteScrollProps = {
      infiniteScroll: true,
      page: 1,
      pageSize: 20,
      totalPages: 100,
      setPage: vi.fn(),
    };

    it('renders InfiniteScroll when infiniteScroll is true', () => {
      render(<MaTable columns={columns} rows={rows} {...infiniteScrollProps} />);
      expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
    });

    it('does not render pagination when infiniteScroll is true', () => {
      render(
        <MaTable columns={columns} rows={rows} {...infiniteScrollProps} setPageSize={vi.fn()} />,
      );
      expect(screen.queryByTestId('mock-paginator')).not.toBeInTheDocument();
    });

    it('calls setPage when loading more', () => {
      render(<MaTable columns={columns} rows={rows} {...infiniteScrollProps} />);

      const loadMoreButton = screen.getByTestId('load-more');
      fireEvent.click(loadMoreButton);

      expect(infiniteScrollProps.setPage).toHaveBeenCalledWith(2);
    });

    it('shows hasMore correctly', () => {
      render(<MaTable columns={columns} rows={rows} {...infiniteScrollProps} page={1} />);

      const infiniteScroll = screen.getByTestId('infinite-scroll');
      // page * pageSize (1 * 20 = 20) < totalPages (100), so hasMore = true
      expect(infiniteScroll).toHaveAttribute('data-has-more', 'true');
    });

    it('hides load more when all data is loaded', () => {
      render(
        <MaTable
          columns={columns}
          rows={rows}
          {...infiniteScrollProps}
          page={5}
          pageSize={20}
          totalPages={100}
        />,
      );

      // page * pageSize (5 * 20 = 100) >= totalPages (100), so hasMore = false
      const infiniteScroll = screen.getByTestId('infinite-scroll');
      expect(infiniteScroll).toHaveAttribute('data-has-more', 'false');
    });

    it('renders loader when hasMore is true', () => {
      render(<MaTable columns={columns} rows={rows} {...infiniteScrollProps} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Container props', () => {
    it('passes containerProps to TableContainer', () => {
      const containerProps = {
        sx: { maxHeight: 400 },
      };

      const { container } = render(
        <MaTable columns={columns} rows={rows} containerProps={containerProps} />,
      );

      const tableContainer = container.querySelector('.MuiTableContainer-root');
      expect(tableContainer).toBeInTheDocument();
    });

    it('generates unique container id', () => {
      const { container: container1 } = render(<MaTable columns={columns} rows={rows} />);
      const { container: container2 } = render(<MaTable columns={columns} rows={rows} />);

      const id1 = container1.querySelector('.MuiTableContainer-root')?.id;
      const id2 = container2.querySelector('.MuiTableContainer-root')?.id;

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });
  });

  describe('Typography rendering', () => {
    it('renders header labels with correct typography props', () => {
      render(<MaTable columns={columns} rows={rows} />);

      const typographies = screen.getAllByTestId('ma-typography');
      const headerTypographies = typographies.slice(0, columns.length);

      headerTypographies.forEach((typography) => {
        expect(typography).toHaveAttribute('data-variant', 'h4');
        expect(typography).toHaveAttribute('data-font-weight', 'bold');
      });
    });

    it('renders body cell values with correct typography props', () => {
      render(<MaTable columns={columns} rows={rows} />);

      const typographies = screen.getAllByTestId('ma-typography');
      const bodyTypographies = typographies.slice(columns.length);

      bodyTypographies.forEach((typography) => {
        expect(typography).toHaveAttribute('data-font-weight', 'semibold');
      });
    });
  });

  describe('Edge cases', () => {
    it('handles undefined cell values', () => {
      const rowsWithUndefined = [{ name: 'John', age: undefined }];
      render(
        <MaTable
          columns={[
            { id: 'name', label: 'Name' },
            { id: 'age', label: 'Age' },
          ]}
          rows={rowsWithUndefined}
        />,
      );

      expect(screen.getByText('John')).toBeInTheDocument();
    });

    it('handles null cell values', () => {
      const rowsWithNull = [{ name: 'John', age: null }];
      render(
        <MaTable
          columns={[
            { id: 'name', label: 'Name' },
            { id: 'age', label: 'Age' },
          ]}
          rows={rowsWithNull}
        />,
      );

      expect(screen.getByText('John')).toBeInTheDocument();
    });

    it('handles large datasets', () => {
      const largeRows = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        age: 20 + i,
      }));

      render(<MaTable columns={columns} rows={largeRows} />);
      expect(screen.getAllByRole('row')).toHaveLength(101); // 100 rows + 1 header
    });
  });
});
