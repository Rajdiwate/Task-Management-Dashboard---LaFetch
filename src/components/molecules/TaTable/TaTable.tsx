import React, { type ReactNode, useId } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import styles from './TaTable.module.scss';
import { TaStack, TaTypography } from '@/components/atoms';
import clsx from 'clsx';

import type { TableContainerProps } from '@mui/material';
import type { TableProps as MuiTableProps } from '@mui/material';
import { TaPaginator } from '../TaPaginator';
import InfiniteScroll from 'react-infinite-scroll-component';

export interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center' | 'justify' | 'inherit';
}

export interface TaTableProps extends MuiTableProps {
  columns: Column[];
  rows: Record<string, string | number | ReactNode>[];
  totalPages?: number;
  containerProps?: Omit<TableContainerProps, 'id'>;
  stickyHeader?: boolean;
  page?: number;
  pageSize?: number;
  setPage?: (page: number) => void;
  setPageSize?: (pageSize: number) => void;
  noBackground?: boolean;
  className?: string;
  maxHeight?: string | number;
  infiniteScroll?: boolean;
}

const cellStyle = {
  wordWrap: 'break-word',
  verticalAlign: 'center',
  borderBottom: 'none',
};

export const TaTable: React.FC<TaTableProps> = ({
  columns,
  rows,
  containerProps = {},
  stickyHeader = false,
  page,
  pageSize,
  totalPages,
  setPage,
  setPageSize,
  noBackground = false,
  maxHeight,
  className = '',
  infiniteScroll = false,
  ...rest
}) => {
  const TableComponent = () => {
    return (
      <Table stickyHeader={stickyHeader} {...rest}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={index}
                align={column.align || 'center'}
                sx={cellStyle}
                className={styles['ta-table__header']}
              >
                <TaTypography variant='h4' fontWeight='bold'>
                  {column.label}
                </TaTypography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow tabIndex={-1} key={`row-${rowIndex}`}>
              {columns.map((column, index) => {
                const value = row[column.id];
                return (
                  <TableCell key={index} align={column.align || 'center'} sx={cellStyle}>
                    {typeof value === 'string' || typeof value === 'number' ? (
                      <TaTypography fontWeight='semibold'>{value}</TaTypography>
                    ) : (
                      value
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const generatedId = useId();
  // to fix infinite scroll in case of multiple tables on the same page
  const tableContainerId = `ta-table-container-${generatedId.replace(/:/g, '')}`;

  return (
    <TaStack spacing={4} maxHeight={maxHeight}>
      <TableContainer
        id={tableContainerId}
        component={Paper}
        className={clsx(
          styles['ta-table'],
          noBackground ? styles['ta-table--no-background'] : '',
          className,
        )}
        {...containerProps}
      >
        {infiniteScroll && page && pageSize && totalPages && setPage ? (
          <InfiniteScroll
            dataLength={rows.length}
            next={() => {
              setPage(page + 1);
            }}
            hasMore={page * pageSize < totalPages}
            loader={<span>Loading...</span>}
            scrollableTarget={tableContainerId}
          >
            <TableComponent />
          </InfiniteScroll>
        ) : (
          <TableComponent />
        )}
      </TableContainer>

      {setPage && setPageSize && page && pageSize && !infiniteScroll && (
        <TaPaginator
          currentPage={page}
          pageSize={pageSize}
          totalPages={Math.ceil((totalPages || 0) / pageSize) || 1}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      )}
    </TaStack>
  );
};
