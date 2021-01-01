import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ListRow, ListCell } from 'styles/List';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Kuski from 'components/Kuski';
import DerpTable from 'components/Table/DerpTable';

const RankingTable = ({ battleType, minPlayed, period, index, periodType }) => {
  const { rankingData } = useStoreState(state => state.RankingTable);
  const { getRankingData } = useStoreActions(actions => actions.RankingTable);
  useEffect(() => {
    getRankingData({ period, periodType });
  }, [period, periodType]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const Points = `Points${battleType}`;
  const Ranking = `Ranking${battleType}`;
  const Wins = `Wins${battleType}`;
  const Designed = `Designed${battleType}`;
  const Played = `Played${battleType}`;
  const FilteredRanking =
    rankingData.length > 0
      ? rankingData.filter(r => r[Played] > minPlayed)
      : null;
  return (
    <>
      {FilteredRanking && (
        <DerpTable
          headers={[
            '#',
            'Player',
            'Ranking',
            'Points',
            'Wins',
            'Designed',
            'Played',
          ]}
          length={FilteredRanking.length}
          pagination
          onChangePage={nextPage => setPage(nextPage)}
          onChangeRowsPerPage={rows => {
            setPage(0);
            setRowsPerPage(rows);
          }}
        >
          {FilteredRanking.sort((a, b) => {
            return b[Ranking] - a[Ranking];
          })
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((i, no) => {
              return (
                <ListRow key={i[index]}>
                  <ListCell>{no + 1 + page * rowsPerPage}.</ListCell>
                  <ListCell>
                    <Kuski kuskiData={i.KuskiData} team flag />
                  </ListCell>
                  <ListCell>{parseFloat(i[Ranking]).toFixed(2)}</ListCell>
                  <ListCell>{i[Points]}</ListCell>
                  <ListCell>{i[Wins]}</ListCell>
                  <ListCell>{i[Designed]}</ListCell>
                  <ListCell>{i[Played]}</ListCell>
                </ListRow>
              );
            })}
        </DerpTable>
      )}
    </>
  );
};

RankingTable.propTypes = {
  battleType: PropTypes.string.isRequired,
  minPlayed: PropTypes.number,
  period: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  index: PropTypes.string.isRequired,
  periodType: PropTypes.string.isRequired,
};

RankingTable.defaultProps = {
  minPlayed: 10,
};

export default RankingTable;
