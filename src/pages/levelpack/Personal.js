import React, { useState } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import styled from 'styled-components';

import Kuski from 'components/Kuski';
import Link from 'components/Link';
import Time from 'components/Time';
import ClickToEdit from 'components/ClickToEdit';
import Feedback from 'components/Feedback';
import LevelPopup from './LevelPopup';

// eslint-disable-next-line css-modules/no-unused-class
import s from './LevelPack.css';

const Personal = ({
  times,
  getTimes,
  highlight,
  highlightWeeks,
  timesError,
  setError,
  records,
}) => {
  const [level, selectLevel] = useState(-1);
  const levels = records.map(r => {
    const personal = times.filter(t => t.LevelIndex === r.LevelIndex);
    if (personal.length > 0) {
      return { ...r, LevelBesttime: personal[0].LevelBesttime };
    }
    return { ...r, LevelBesttime: [] };
  });

  return (
    <>
      <h2>Personal records</h2>
      <div className={s.levels}>
        <div className={s.tableHead}>
          <span>Filename</span>
          <span>Level name</span>
          <span>
            <ClickToEdit
              value={times.length > 0 ? times[0].LevelBesttime[0].Kuski : ''}
              update={newKuski => getTimes(newKuski)}
            >
              {times.length > 0 ? (
                <Kuski kuskiData={times[0].LevelBesttime[0].KuskiData} flag />
              ) : (
                <span>None</span>
              )}
            </ClickToEdit>
          </span>
          <span />
        </div>
        {levels.length !== 0 && (
          <>
            {levels.map(r => (
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
                  <TimeSpan
                    highlight={
                      r.LevelBesttime[0].TimeIndex >= highlight[highlightWeeks]
                    }
                  >
                    <Time time={r.LevelBesttime[0].Time} />
                  </TimeSpan>
                ) : (
                  <span />
                )}
                <span />
              </TimeRow>
            ))}
          </>
        )}
      </div>
      {level !== -1 && (
        <LevelPopup
          highlight={highlight[highlightWeeks]}
          levelId={level}
          close={() => {
            selectLevel(-1);
          }}
          KuskiIndex={times[0].LevelBesttime[0].KuskiIndex}
        />
      )}
      <Feedback
        open={timesError !== ''}
        close={() => setError('')}
        text={timesError}
        type="error"
      />
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

const TimeSpan = styled.span`
  background: ${p => (p.highlight ? '#dddddd' : 'transparent')};
  width: auto !important;
`;

export default withStyles(s)(Personal);
