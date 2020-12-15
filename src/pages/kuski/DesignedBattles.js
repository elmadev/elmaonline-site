import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { TablePagination } from '@material-ui/core';
import withStyles from 'isomorphic-style-loader/withStyles';

import Time from 'components/Time';
import Link from 'components/Link';
import Kuski from 'components/Kuski';
import LocalTime from 'components/LocalTime';
import { BattleType } from 'components/Names';
import { sortResults } from 'utils/battle';

// eslint-disable-next-line css-modules/no-unused-class
import s from './PlayedBattles.css';

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
      <div className={s.recentBattlesHead}>
        <span className={s.type}>Type</span>
        <span className={s.filename}>Level</span>
        <span className={s.winnerKuski}>Winner</span>
        <span className={s.winnerTime}>Time</span>
        <span className={s.started}>Started</span>
      </div>
      {designedBattles.rows.map(b => {
        const sorted = [...b.Results].sort(sortResults(b.BattleType));
        return (
          <Link to={`/battles/${b.BattleIndex}`} key={b.BattleIndex}>
            <span className={s.type}>
              {b.Duration} min <BattleType type={b.BattleType} />
            </span>
            <span className={s.filename}>
              {b.LevelData && b.LevelData.LevelName}
            </span>
            <span className={s.winnerKuski}>
              {b.Results.length > 0 && (
                <Kuski kuskiData={sorted[0].KuskiData} flag team />
              )}
            </span>
            <span className={s.winnerTime}>
              {b.Results.length > 0 ? (
                <Time time={sorted[0].Time} apples={sorted[0].Apples} />
              ) : null}
            </span>
            <span className={s.started}>
              <LocalTime date={b.Started} format="DD.MM.YYYY HH:mm" parse="X" />
            </span>
          </Link>
        );
      })}
      <TablePagination
        style={{ width: '600px' }}
        component="div"
        count={designedBattles.count}
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
    </>
  );
}

export default withStyles(s)(DesignedBattles);
