import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { TablePagination } from '@material-ui/core';

import Time from 'components/Time';
import Kuski from 'components/Kuski';
import LocalTime from 'components/LocalTime';
import { Level, BattleType } from 'components/Names';
import { sortResults } from 'utils/battle';
import { ListCell, ListHeader, ListContainer, ListRow } from 'components/List';

function DesignedBattles({ KuskiIndex }) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const { designedBattles } = useStoreState(state => state.Kuski);
  const { getDesignedBattles } = useStoreActions(actions => actions.Kuski);

  useEffect(() => {
    getDesignedBattles({ KuskiIndex, page, pageSize });
  }, [page, pageSize]);

  const handleChangeRowsPerPage = event => {
    setPage(0);
    setPageSize(event.target.value);
  };

  if (!designedBattles) {
    return null;
  }

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListCell width={130}>Type</ListCell>
          <ListCell width={130}>Level</ListCell>
          <ListCell width={150}>Winner</ListCell>
          <ListCell width={60}>Time</ListCell>
          <ListCell>Started</ListCell>
        </ListHeader>
        {designedBattles.map(b => {
          const sorted = [...b.Results].sort(sortResults(b.BattleType));
          return (
            <ListRow key={b.BattleIndex}>
              <ListCell to={`/battles/${b.BattleIndex}`} width={130}>
                {b.Duration} min <BattleType type={b.BattleType} />
              </ListCell>
              <ListCell width={130}>
                {b.LevelData && (
                  <Level LevelIndex={b.LevelIndex} LevelData={b.LevelData} />
                )}
              </ListCell>
              <ListCell width={150}>
                {b.Results.length > 0 && (
                  <Kuski kuskiData={sorted[0].KuskiData} flag team />
                )}
              </ListCell>
              <ListCell to={`/battles/${b.BattleIndex}`} width={60}>
                {b.Results.length > 0 ? (
                  <Time time={sorted[0].Time} apples={sorted[0].Apples} />
                ) : null}
              </ListCell>
              <ListCell to={`/battles/${b.BattleIndex}`}>
                <LocalTime
                  date={b.Started}
                  format="dd.MM.yyyy HH:mm"
                  parse="X"
                />
              </ListCell>
            </ListRow>
          );
        })}
      </ListContainer>
      <TablePagination
        style={{ width: '600px' }}
        component="div"
        count={
          designedBattles.length < pageSize
            ? page * pageSize + designedBattles.length
            : -1
        }
        rowsPerPage={pageSize}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default DesignedBattles;
