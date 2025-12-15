import { type FC } from 'react';
import { TaTypography, TaBox, TaIconButton, TaSelect } from '@/components/atoms';
import styles from './TaPaginator.module.scss';
import clsx from 'clsx';
import { RenderPages } from './RenderPages/RenderPages';
import { TaIcon } from '@/core';
import { PAGE_SIZES } from '@/constants';

export interface TaPaginatorProps {
  pageSize: number;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  className?: string;
}

export const TaPaginator: FC<TaPaginatorProps> = ({
  pageSize,
  currentPage,
  setPageSize,
  totalPages,
  setPage,
  className = '',
}) => {
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <TaBox className={clsx(styles['ta-paginator'], className)} data-testid='ta-paginator'>
      <TaSelect
        id='ddPageSize'
        data-testid='paginatorPageSize'
        options={PAGE_SIZES.map((size) => ({ value: size, label: String(size) }))}
        defaultValue={pageSize}
        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        fullWidth={false}
        className={styles['ta-paginator__limit']}
      />

      <TaBox className={styles['ta-paginator__nav']}>
        <TaIconButton
          onClick={() => handlePageChange(validCurrentPage - 1)}
          aria-label='Previous page'
          data-testid='previous-page-button'
          size='large'
        >
          <TaIcon.PaginatorArrowLeft />
        </TaIconButton>

        <RenderPages
          totalPages={totalPages}
          validCurrentPage={validCurrentPage}
          handlePageChange={handlePageChange}
        />

        <TaIconButton
          onClick={() => handlePageChange(validCurrentPage + 1)}
          aria-label='Next page'
          data-testid='next-page-button'
          size='large'
        >
          <TaIcon.PaginatorArrowRight />
        </TaIconButton>
      </TaBox>

      <TaTypography className={styles['ta-paginator__info']}>
        {`Page  ${validCurrentPage} of  ${totalPages || 1}`}
      </TaTypography>
    </TaBox>
  );
};
