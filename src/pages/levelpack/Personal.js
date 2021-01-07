import React, { useState } from 'react';
import styled from 'styled-components';
import { Edit } from '@material-ui/icons';
import Time from 'components/Time';
import ClickToEdit from 'components/ClickToEdit';
import Feedback from 'components/Feedback';
import Loading from 'components/Loading';
import { recordsTT } from 'utils/calcs';
import LegacyIcon from 'styles/LegacyIcon';
import { ListCell, ListContainer, ListHeader, ListRow } from 'styles/List';
import LevelPopup from './LevelPopup';

const Personal = ({
  times,
  getTimes,
  highlight,
  highlightWeeks,
  timesError,
  setError,
  records,
  setPersonalTimesLoading,
  showLegacyIcon,
  kuski,
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
      <ListContainer>
        <ListHeader>
          <ListCell width={100}>Filename</ListCell>
          <ListCell width={320}>Level name</ListCell>
          <ListCell width={200}>
            <ClickToEdit value={kuski} update={newKuski => getTimes(newKuski)}>
              {kuski} <EditIcon />
            </ClickToEdit>
          </ListCell>
          <ListCell />
        </ListHeader>
        {setPersonalTimesLoading && <Loading />}
        {levels.length !== 0 && (
          <>
            {levels.map(r => (
              <TimeRow
                key={r.LevelIndex}
                onClick={e => {
                  e.preventDefault();
                  if (r.LevelBesttime.length > 0) {
                    selectLevel(level === r.LevelIndex ? -1 : r.LevelIndex);
                  }
                }}
                selected={level === r.LevelIndex}
              >
                <ListCell width={100}>{r.Level.LevelName}</ListCell>
                <ListCell width={320}>{r.Level.LongName}</ListCell>
                {r.LevelBesttime.length > 0 ? (
                  <>
                    <TimeSpan
                      width={200}
                      highlight={
                        r.LevelBesttime[0].TimeIndex >=
                        highlight[highlightWeeks]
                      }
                    >
                      <Time time={r.LevelBesttime[0].Time} />
                    </TimeSpan>
                    {r.LevelBesttime[0].Source !== undefined ? (
                      <ListCell right>
                        <LegacyIcon
                          source={r.LevelBesttime[0].Source}
                          show={showLegacyIcon}
                        />
                      </ListCell>
                    ) : (
                      <ListCell />
                    )}
                  </>
                ) : (
                  <>
                    <ListCell />
                    <ListCell />
                  </>
                )}
              </TimeRow>
            ))}
            <TTRow>
              <ListCell />
              <ListCell>Total Time</ListCell>
              <ListCell>
                <Time time={recordsTT(levels, 'LevelBesttime')} />
              </ListCell>
              <ListCell />
            </TTRow>
          </>
        )}
      </ListContainer>
      {level !== -1 && (
        <LevelPopup
          highlight={highlight[highlightWeeks]}
          levelId={level}
          close={() => {
            selectLevel(-1);
          }}
          KuskiIndex={times[0].LevelBesttime[0].KuskiIndex}
          showLegacyIcon={showLegacyIcon}
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

const EditIcon = styled(Edit)`
  margin-top: -4px;
  font-size: 18px !important;
`;

const TimeRow = styled(ListRow)`
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

const TTRow = styled(ListRow)`
  background: ${p => (p.selected ? '#219653' : 'transparent')};
  color: ${p => (p.selected ? '#fff' : 'inherit')};
  :hover {
    background: ${p => (p.selected ? '#219653' : '#f9f9f9')};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

const TimeSpan = styled(ListCell)`
  background: ${p => (p.highlight ? '#dddddd' : 'transparent')};
  width: auto !important;
`;

export default Personal;
