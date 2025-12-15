import { TaButton, TaTypography } from '@/components/atoms';
import styles from './RenderPages.module.scss';

export const RenderPages = ({
  totalPages,
  validCurrentPage,
  handlePageChange,
}: {
  totalPages: number;
  validCurrentPage: number;
  handlePageChange: (newPage: number) => void;
}) => {
  const pages = [];

  if (validCurrentPage > totalPages) {
    const correctedPage = totalPages;
    handlePageChange(correctedPage);
    validCurrentPage = correctedPage;
  }

  // Calculate the range of page numbers to show around the current page
  // Shows 1 page before and after the current page, but keeps within bounds
  const rangeStart = validCurrentPage > 1 ? Math.max(1, validCurrentPage - 1) : 1;
  const rangeEnd =
    validCurrentPage < totalPages ? Math.min(totalPages, validCurrentPage + 1) : totalPages;

  // Generate page numbers with smart ellipsis
  for (let i = 1; i <= totalPages; i++) {
    // Always show first page, last page, and pages within the calculated range

    if (i === 1 || i === totalPages || (i >= rangeStart && i <= rangeEnd)) {
      pages.push(
        <TaButton
          key={i}
          onClick={() => handlePageChange(i)}
          variant='text'
          className={styles['ta-page-button']}
        >
          <TaTypography
            variant='h6'
            color={validCurrentPage === i ? 'primary' : 'textPrimary'} // for text color
          >
            {i}
          </TaTypography>
        </TaButton>,
      );
      // Add ellipsis when there's a gap between consecutive pages
    } else if (
      (i === rangeStart - 1 && rangeStart > 2) || // Ellipsis before range
      (i === rangeEnd + 1 && rangeEnd < totalPages - 1) // Ellipsis after range
    ) {
      pages.push(
        <TaTypography key={`ellipsis-${i}`} variant='h4' alignSelf='center'>
          ...
        </TaTypography>,
      );
    }
  }
  return pages;
};
