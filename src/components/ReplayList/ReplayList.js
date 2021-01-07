import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { TablePagination } from '@material-ui/core';
import RecListItem from 'components/RecListItem';
import { ListContainer, ListHeader, ListCell, ListRow } from 'styles/List';

export default function Replays({
  defaultPage = 0,
  defaultPageSize = 25,
  showPagination,
}) {
  const [page, setPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const { replays } = useStoreState(state => state.ReplayList);
  const { getReplays } = useStoreActions(actions => actions.ReplayList);

  useEffect(() => {
    getReplays({ page, pageSize });
  }, [page, pageSize]);

  const handleChangeRowsPerPage = event => {
    setPage(0);
    setPageSize(event.target.value);
  };

  if (!replays) {
    return null;
  }

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListCell>Replay</ListCell>
          <ListCell>Level</ListCell>
          <ListCell right>Time</ListCell>
          <ListCell>By</ListCell>
        </ListHeader>
        {!replays ? (
          <ListRow>
            <ListCell />
          </ListRow>
        ) : (
          replays.rows.map(i => <RecListItem key={i.ReplayIndex} replay={i} />)
        )}
      </ListContainer>
      {showPagination && (
        <TablePagination
          style={{ width: '600px' }}
          component="div"
          count={replays.count}
          rowsPerPage={pageSize}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={(e, newPage) => setPage(newPage)}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </>
  );
}
