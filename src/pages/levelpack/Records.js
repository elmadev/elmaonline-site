import React, { useState } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import styled from 'styled-components';

import Link from 'components/Link';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Loading from 'components/Loading';
import { recordsTT } from 'utils/calcs';
import LevelPopup from './LevelPopup';

// eslint-disable-next-line css-modules/no-unused-class
import s from './LevelPack.css';

const Records = ({ highlight, highlightWeeks, records, recordsLoading }) => {
  const [level, selectLevel] = useState(-1);

  return (
    <>
      <h2>Levels</h2>
      <div className={s.levels}>
        <div className={s.tableHead}>
          <span>Filename</span>
          <span>Level name</span>
          <span>Kuski</span>
          <span>Time</span>
        </div>
        {recordsLoading && <Loading />}
        {records.map(r => (
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
            {r.LevelBesttime.length > 0 ? (
              <>
                <span>
                  <Kuski kuskiData={r.LevelBesttime[0].KuskiData} team flag />
                </span>
                <TimeSpan
                  highlight={
                    r.LevelBesttime[0].TimeIndex >= highlight[highlightWeeks]
                  }
                >
                  <Time time={r.LevelBesttime[0].Time} />
                </TimeSpan>
              </>
            ) : (
              <>
                <span />
                <span />
              </>
            )}
          </TimeRow>
        ))}
        <TTRow>
          <span />
          <span />
          <span>Total Time</span>
          <span>
            <Time time={recordsTT(records, 'LevelBesttime')} />
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
