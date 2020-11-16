import React, { useState } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import styled from 'styled-components';

import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Loading from 'components/Loading';
import { recordsTT } from 'utils/calcs';
import LegacyIcon from 'styles/LegacyIcon';
import LevelPopup from './LevelPopup';

// eslint-disable-next-line css-modules/no-unused-class
import s from './LevelPack.css';

const Records = ({
  highlight,
  highlightWeeks,
  records,
  recordsLoading,
  showLegacyIcon,
}) => {
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
          {records.length > 0 &&
            records[0].LevelBesttime[0].Source !== undefined && <span />}
        </div>
        {recordsLoading && <Loading />}
        {records.map(r => (
          <TimeRow
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
                {r.LevelBesttime[0].Source !== undefined && (
                  <LegacyIcon
                    source={r.LevelBesttime[0].Source}
                    show={showLegacyIcon}
                  />
                )}
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
          showLegacyIcon={showLegacyIcon}
        />
      )}
    </>
  );
};

const TimeRow = styled.span`
  background: ${p => (p.selected ? '#219653' : 'transparent')};
  cursor: pointer;
  a {
    color: ${p => (p.selected ? 'white' : '#219653')};
  }
  span {
    color: ${p => (p.selected ? 'white' : 'inherit')};
  }
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
