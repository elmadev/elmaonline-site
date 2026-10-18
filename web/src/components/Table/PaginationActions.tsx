import { IconButton } from '@mui/material';
import type { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  FirstPage,
} from '@mui/icons-material';

const PaginationActions = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: TablePaginationActionsProps) => {
  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
  return (
    <div style={{ flexShrink: 0, marginLeft: '20px' }}>
      <IconButton
        onClick={e => onPageChange(e, 0)}
        disabled={page === 0}
        aria-label="First Page"
        size="large"
      >
        <FirstPage />
      </IconButton>
      <IconButton
        onClick={e => onPageChange(e, page - 1)}
        disabled={page === 0}
        aria-label="Previous Page"
        size="large"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={e => onPageChange(e, page + 1)}
        disabled={page >= lastPage}
        aria-label="Next Page"
        size="large"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={e => onPageChange(e, lastPage)}
        disabled={page >= lastPage}
        aria-label="Last Page"
        size="large"
      >
        <LastPage />
      </IconButton>
    </div>
  );
};

export default PaginationActions;
