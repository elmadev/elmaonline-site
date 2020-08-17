import React, { useEffect } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from 'styled-components';

import Time from 'components/Time';
import Loading from 'components/Loading';

// eslint-disable-next-line css-modules/no-unused-class
import s from './LevelPack.css';

const TotalTimes = ({ highlight, highlightWeeks, levelPackIndex }) => {
  const { totaltimes, totaltimesLoading, lastPack } = useStoreState(
    state => state.LevelPack,
  );
  const { getTotalTimes } = useStoreActions(actions => actions.LevelPack);

  useEffect(() => {
    if (lastPack !== levelPackIndex) {
      getTotalTimes(levelPackIndex);
    }
  }, [levelPackIndex]);

  return (
    <>
      <h2>Total Times</h2>
      <div className={s.levels}>
        <div className={s.tableHead}>
          <span>#</span>
          <span>Player</span>
          <span>Total Time</span>
          <span />
        </div>
        {totaltimesLoading && <Loading />}
        {totaltimes.length > 0 && (
          <>
            {totaltimes
              .sort((a, b) => a.tt - b.tt)
              .map((r, no) => (
                <TimeRow key={r.KuskiIndex}>
                  <span>{no + 1}</span>
                  <span>{r.KuskiData.Kuski}</span>
                  <TimeSpan
                    highlight={r.TimeIndex >= highlight[highlightWeeks]}
                  >
                    <Time time={r.tt} />
                  </TimeSpan>
                  <span />
                </TimeRow>
              ))}
          </>
        )}
      </div>
    </>
  );
};

const TimeSpan = styled.span`
  background: ${p => (p.highlight ? '#dddddd' : 'transparent')};
  width: auto !important;
`;

const TimeRow = styled.div`
  display: table-row;
  color: inherit;
  font-size: 14px;
  padding: 10px;
`;

export default withStyles(s)(TotalTimes);
