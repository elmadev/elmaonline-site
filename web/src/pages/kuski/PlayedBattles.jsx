import React, { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';
import { TablePagination } from '@material-ui/core';
import PropTypes from 'prop-types';

import Time from 'components/Time';
import Kuski from 'components/Kuski';
import LocalTime from 'components/LocalTime';
import { Level, BattleType } from 'components/Names';
import { sortResults } from 'utils/battle';
import { ListCell, ListHeader, ListContainer, ListRow } from 'components/List';
import { useQueryAlt, BattlesByPlayer, keepPreviousData } from 'api';

const PlayedBattles = ({ KuskiIndex }) => {
  const { ranking } = useStoreState(state => state.Kuski);
  let battleCount = 0;
  if (ranking) if (ranking[0]) battleCount = ranking[0].PlayedAll;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { data: playedBattles } = useQueryAlt(
    ['PlayedBattles', KuskiIndex, page, pageSize],
    async () =>
      BattlesByPlayer({
        KuskiIndex,
        page,
        pageSize,
      }),
    { placeholderData: keepPreviousData },
  );

  useEffect(() => {
    setPage(0);
  }, [KuskiIndex]);

  const handleChangeRowsPerPage = e => {
    setPage(0);
    setPageSize(e.target.value);
  };

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListCell width={130}>Type</ListCell>
          <ListCell width={150}>Designer</ListCell>
          <ListCell width={130}>Level</ListCell>
          <ListCell width={150}>Winner</ListCell>
          <ListCell width={60}>Time</ListCell>
          <ListCell width={60}>#</ListCell>
          <ListCell>Started</ListCell>
        </ListHeader>
        {playedBattles?.rows.map((b, i) => {
          const sorted = playedBattles.Results[i].sort(
            sortResults(b.BattleType),
          );
          return (
            <ListRow key={b.BattleIndex}>
              <ListCell to={`/battles/${b.BattleIndex}`} width={130}>
                {b.Duration} min <BattleType type={b.BattleType} />
              </ListCell>
              <ListCell width={150}>
                <Kuski kuskiData={b.KuskiData} flag team />
              </ListCell>
              <ListCell width={130}>
                {b.LevelData && (
                  <Level LevelIndex={b.LevelIndex} LevelData={b.LevelData} />
                )}
              </ListCell>
              <ListCell width={150}>
                {playedBattles.Results[i].length > 0 && (
                  <Kuski kuskiData={sorted[0].KuskiData} flag team />
                )}
              </ListCell>
              <ListCell to={`/battles/${b.BattleIndex}`} width={60}>
                {playedBattles.Results[i].length > 0 ? (
                  <Time time={sorted[0].Time} apples={sorted[0].Apples} />
                ) : null}
              </ListCell>
              <ListCell to={`/battles/${b.BattleIndex}`} width={60}>
                {playedBattles.Results[i].findIndex(
                  r => r.KuskiIndex === KuskiIndex,
                ) + 1}
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
        count={battleCount}
        rowsPerPage={pageSize}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={(e, pg) => setPage(pg)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

PlayedBattles.propTypes = {
  KuskiIndex: PropTypes.number.isRequired,
};

export default PlayedBattles;
