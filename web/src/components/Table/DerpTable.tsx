import { Fragment, useState } from 'react';
import {
  TableRow,
  TableFooter,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import { ListContainer, ListHeader, ListCell } from 'components/List';
import PaginationActions from 'components/Table/PaginationActions';
import styled from '@emotion/styled';

type DerpTableHeader = string | { t: string; r?: boolean; w?: number };

type DerpTableProps = {
  headers: DerpTableHeader[];
  loading?: boolean;
  children: React.ReactNode;
  length?: number;
  pagination?: boolean;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (rowsPerPage: number) => void;
  width?: string;
};

const DerpTable = ({
  headers,
  loading = false,
  children,
  length = 0,
  pagination = false,
  onChangePage,
  onChangeRowsPerPage,
  width = 'auto',
}: DerpTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  return (
    <Container width={width}>
      <ListContainer>
        <ListHeader>
          {headers.map(h => (
            <Fragment key={typeof h === 'string' ? h : h.t}>
              {typeof h === 'string' ? (
                <ListCell>{h}</ListCell>
              ) : (
                <ListCell right={h.r} width={h.w}>
                  {h.t}
                </ListCell>
              )}
            </Fragment>
          ))}
        </ListHeader>
        {loading && <CircularProgress />}
        {!loading && children}
      </ListContainer>
      {pagination && (
        <table>
          <TableFooter>
            <TableRow>
              <BareTablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                colSpan={headers.length}
                count={length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_e, nextPage) => {
                  setPage(nextPage);
                  if (onChangePage) {
                    onChangePage(nextPage);
                  }
                }}
                onRowsPerPageChange={e => {
                  const rows = Number(e.target.value);
                  setPage(0);
                  setRowsPerPage(rows);
                  if (onChangeRowsPerPage) {
                    onChangeRowsPerPage(rows);
                  }
                }}
                ActionsComponent={PaginationActions}
              />
            </TableRow>
          </TableFooter>
        </table>
      )}
    </Container>
  );
};

const Container = styled.div<{ width: string }>`
  width: ${p => (p.width ? p.width : 'auto')};
`;

const BareTablePagination = styled(TablePagination)`
  && {
    border-bottom: medium none;
    .MuiTablePagination-spacer {
      display: none;
    }
  }
`;

export default DerpTable;
