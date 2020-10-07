import React, { useState, useEffect } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Link from 'components/Link';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Loading from 'components/Loading';
import { recordsTT } from 'utils/calcs';
import LevelPopup from './LevelPopup';

// eslint-disable-next-line css-modules/no-unused-class
import s from './LevelPack.css';

const Records = ({ highlight, highlightWeeks, name }) => {
  const [level, selectLevel] = useState(-1);
  const { multiRecords, multiRecordsLoading, lastMultiName } = useStoreState(
    state => state.LevelPack,
  );
  const { getMultiRecords } = useStoreActions(actions => actions.LevelPack);

  useEffect(() => {
    if (lastMultiName !== name) {
      getMultiRecords(name);
    }
  }, [name]);

  return (
    <>
      <h2>Levels</h2>
      <div className={s.multis}>
        <div className={s.tableHead}>
          <span>Filename</span>
          <span>Level name</span>
          <span>Kuski</span>
          <span>Kuski</span>
          <span>Time</span>
        </div>
        {multiRecordsLoading && <Loading />}
        {multiRecords.map(r => (
          <TimeRow
            to={`/levels/${r.LevelIndex}`}
            key={r.LevelIndex}
            onClick={e => {
              e.preventDefault();
              selectLevel(level === r.LevelIndex ? -1 : r.LevelIndex);
            }}
            selected={level === r.LevelIndex}
          >
            <span>{r.Level.LevelName}</span>
            <span>{r.Level.LongName}</span>
            {r.LevelMultiBesttime.length > 0 ? (
              <>
                <span>
                  <Kuski
                    kuskiData={r.LevelMultiBesttime[0].Kuski1Data}
                    team
                    flag
                  />
                </span>
                <span>
                  <Kuski
                    kuskiData={r.LevelMultiBesttime[0].Kuski2Data}
                    team
                    flag
                  />
                </span>
                <TimeSpan
                  highlight={
                    r.LevelMultiBesttime[0].TimeIndex >=
                    highlight[highlightWeeks]
                  }
                >
                  <Time time={r.LevelMultiBesttime[0].Time} />
                </TimeSpan>
              </>
            ) : (
              <>
                <span />
                <span />
                <span />
              </>
            )}
          </TimeRow>
        ))}
        <TTRow>
          <span />
          <span />
          <span />
          <span>Total Time</span>
          <span>
            <Time time={recordsTT(multiRecords, 'LevelMultiBesttime')} />
          </span>
        </TTRow>
      </div>
      {level !== -1 && (
        <LevelPopup
          highlight={highlight[highlightWeeks]}
          levelId={level}
          close={() => {
            selectLevel(-1);
          }}
          multi
        />
      )}
    </>
  );
};

const TimeRow = styled(Link)`
  background: ${p => (p.selected ? '#219653' : 'transparent')};
  color: ${p => (p.selected ? '#fff' : 'inherit')};
  :hover {
    background: ${p => (p.selected ? '#219653' : '#f9f9f9')};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

const TTRow = styled.div`
  background: ${p => (p.selected ? '#219653' : 'transparent')};
  color: ${p => (p.selected ? '#fff' : 'inherit')};
  :hover {
    background: ${p => (p.selected ? '#219653' : '#f9f9f9')};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

const TimeSpan = styled.span`
  background: ${p => (p.highlight ? '#dddddd' : 'transparent')};
`;

export default withStyles(s)(Records);
