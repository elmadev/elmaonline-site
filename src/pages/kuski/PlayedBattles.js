import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { TablePagination } from '@material-ui/core';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

import Time from 'components/Time';
import Link from 'components/Link';
import Kuski from 'components/Kuski';
import LocalTime from 'components/LocalTime';
import { BattleType } from 'components/Names';
import { sortResults } from 'utils/battle';

import s from './PlayedBattles.css';

const PlayedBattles = ({ KuskiIndex }) => {
  const { getPlayedBattles } = useStoreActions(state => state.Kuski);
  const { playedBattles, ranking } = useStoreState(state => state.Kuski);
  let battleCount = 0;
  if (ranking) if (ranking[0]) battleCount = ranking[0].PlayedAll;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    setPage(0);
  }, [KuskiIndex]);

  useEffect(() => {
    getPlayedBattles({
      KuskiIndex,
      page,
      pageSize,
    });
  }, [page, pageSize, KuskiIndex]);

  const handleChangeRowsPerPage = e => {
    setPage(0);
    setPageSize(e.target.value);
  };

  return (
    <>
      <div className={s.recentBattlesHead}>
        <span className={s.type}>Type</span>
        <span className={s.designer}>Designer</span>
        <span className={s.filename}>Level</span>
        <span className={s.winnerKuski}>Winner</span>
        <span className={s.winnerTime}>Time</span>
        <span className={s.placement}>#</span>
        <span className={s.started}>Started</span>
      </div>
      {playedBattles.rows.map((b, i) => {
        const sorted = playedBattles.Results[i].sort(sortResults(b.BattleType));
        return (
          <Link to={`/battles/${b.BattleIndex}`} key={b.BattleIndex}>
            <span className={s.type}>
              {b.Duration} min <BattleType type={b.BattleType} />
            </span>
            <span className={s.designer}>
              <Kuski kuskiData={b.KuskiData} flag team />
            </span>
            <span className={s.filename}>
              {b.LevelData && b.LevelData.LevelName}
            </span>
            <span className={s.winnerKuski}>
              {playedBattles.Results[i].length > 0 && (
                <Kuski kuskiData={sorted[0].KuskiData} flag team />
              )}
            </span>
            <span className={s.winnerTime}>
              {playedBattles.Results[i].length > 0 ? (
                <Time time={sorted[0].Time} apples={sorted[0].Apples} />
              ) : null}
            </span>
            <span className={s.placement}>
              {playedBattles.Results[i].findIndex(
                r => r.KuskiIndex === KuskiIndex,
              ) + 1}
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
        count={battleCount}
        rowsPerPage={pageSize}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onChangePage={(e, p) => setPage(p)}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

PlayedBattles.propTypes = {
  KuskiIndex: PropTypes.number.isRequired,
};

export default withStyles(s)(PlayedBattles);
