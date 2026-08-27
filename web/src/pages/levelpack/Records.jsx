import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import { Level } from 'components/Names';
import Header from 'components/Header';
import Loading from 'components/Loading';
import { recordsTT } from 'utils/calcs';
import LegacyIcon from 'components/LegacyIcon';
import LevelPopup from './LevelPopup';
import Popularity from 'components/Popularity';
import { formatPct, formatTimeSpent } from '../../utils/format';
import formatDistance from 'date-fns/formatDistance';
import Switch from 'components/Switch';
import { Row } from 'components/Containers';
import { isEmpty } from 'lodash';

const TableRow = ({
  record: r,
  levelStats,
  highlight,
  highlightWeeks,
  MaxRelativeTimeAll,
  level,
  selectedLevel,
  selectLevel,
  setLongName,
  setLevelName,
  showMoreStats,
  showLegacyIcon,
  showLogos,
}) => {
  // levels not played will not have stats objects.
  const stats = levelStats?.[level.LevelIndex] || {};

  // level could be unfinished, or records haven't loaded yet.
  const hasRecord = !isEmpty(r);

  const isLegacy = hasRecord && r.Source !== undefined;

  const isHighlight = hasRecord && r.TimeIndex >= highlight[highlightWeeks];

  // ie. width of popularity bar
  const timePct = formatPct(stats.RelativeTimeAll || 0, MaxRelativeTimeAll);

  const finishPct = formatPct(stats.KuskiCountF, stats.KuskiCountAll, 0);

  const lastDriven = stats.LastDrivenAll
    ? formatDistance(new Date((stats.LastDrivenAll || 0) * 1000), new Date(), {
        addSuffix: true,
      })
    : 'Never';

  return (
    <TimeRow
      key={level.LevelIndex}
      onClick={e => {
        e.preventDefault();
        selectLevel(selectedLevel === level.LevelIndex ? -1 : level.LevelIndex);
        setLongName(level.LongName);
        setLevelName(level.LevelName);
      }}
      selected={selectedLevel === level.LevelIndex}
    >
      <ListCell>
        <Level LevelIndex={level.LevelIndex} LevelData={level} />
      </ListCell>

      <ListCell>{level.LongName}</ListCell>

      {hasRecord && (
        <>
          <KuskiCell>
            <Kuski
              kuskiData={r.KuskiData}
              logo={showLogos}
              team={!showLogos}
              flag
            />
          </KuskiCell>

          <ListCell highlight={isHighlight}>
            {level.ExcludeFromTotal ? <span>-</span> : <Time time={r.Time} />}
            {isLegacy && (
              <span style={{ marginLeft: 10 }}>
                <LegacyIcon source={r.Source} show={showLegacyIcon} />
              </span>
            )}
          </ListCell>
        </>
      )}

      {!hasRecord && (
        <>
          <ListCell />
          <ListCell>{level.ExcludeFromTotal ? <span>-</span> : null}</ListCell>
        </>
      )}

      {showMoreStats && <ListCell>{lastDriven}</ListCell>}

      {showMoreStats && (
        <ListCell>
          {stats.KuskiCountAll || 0}
          {` (${finishPct}%)`}
        </ListCell>
      )}

      {showMoreStats && (
        <ListCell>
          {stats.TimeAll ? formatTimeSpent(stats.TimeAll) : ''}
        </ListCell>
      )}

      <ListCell>
        <div style={{ minWidth: 100 }}>
          <Popularity
            widthPct={timePct}
            title={stats.TimeAll ? formatTimeSpent(stats.TimeAll) : ''}
          />
        </div>
      </ListCell>

      {!showMoreStats && <ListCell />}
    </TimeRow>
  );
};

const Records = ({ levelStats }) => {
  const [selectedLevel, selectLevel] = useState(-1);
  const [longName, setLongName] = useState('');
  const [levelName, setLevelName] = useState('');

  const {
    levelPackInfo,
    highlight,
    recordsOnly: records,
    recordsOnlyLoading: loading,
    settings: { highlightWeeks, showLegacyIcon, showMoreStats, showLogos },
  } = useStoreState(state => state.LevelPack);

  const { setShowMoreStats } = useStoreActions(state => state.LevelPack);

  if (loading) {
    return <Loading />;
  }

  const totalTimeArgs = isEmpty(levelPackInfo.levels)
    ? { tt: 0 }
    : recordsTT(
        levelPackInfo.levels.map(l => ({
          Level: l,
          record: isEmpty(records?.[l.LevelIndex])
            ? null
            : [records[l.LevelIndex]],
        })),
        'record',
      );

  const MaxRelativeTimeAll = Math.max(
    ...Object.values(levelStats || {}).map(v => v.RelativeTimeAll),
  );

  return (
    <>
      <Row ai="center" jc="space-between" width="100%">
        <Header h2 mLeft>
          Levels
        </Header>
        <Switch checked={showMoreStats} onChange={setShowMoreStats}>
          Level Stats
        </Switch>
      </Row>

      <ListContainer>
        <ListHeader>
          <ListCell width={90}>Filename</ListCell>
          <ListCell width={showMoreStats ? 260 : 320}>Level Name</ListCell>
          <ListCell width={150}>Kuski</ListCell>
          <ListCell width={150}>Time</ListCell>

          {showMoreStats && <ListCell width={170}>Last Driven</ListCell>}

          {showMoreStats && (
            <ListCell width={140}>
              Kuskis Played <br />
              <span title="Percentage of kuskis that finished the level at least once.">
                (% Finished)
              </span>
            </ListCell>
          )}

          {showMoreStats && (
            <ListCell
              width={50}
              title="Total time played by all kuskis combined."
            >
              Time Played
            </ListCell>
          )}

          <ListCell
            width={150}
            title="Time played on level (by all kuskis), relative to other levels in this pack."
          >
            Popularity
          </ListCell>

          {!showMoreStats && <ListCell />}
        </ListHeader>

        {levelPackInfo?.levels?.map(level => {
          const record = isEmpty(records) ? null : records[level.LevelIndex];
          return (
            <TableRow
              {...{
                key: level.LevelIndex,
                record,
                levelStats,
                highlight,
                highlightWeeks,
                MaxRelativeTimeAll,
                level,
                selectedLevel,
                selectLevel,
                setLongName,
                setLevelName,
                showMoreStats,
                showLegacyIcon,
                showLogos,
              }}
            />
          );
        })}

        <TTRow>
          <ListCell />
          <ListCell />
          <ListCell>Total Time</ListCell>
          <ListCell>
            <Time time={totalTimeArgs} />
          </ListCell>
          <ListCell />
          <ListCell />
          {showMoreStats && (
            <>
              <ListCell />
              <ListCell />
            </>
          )}
        </TTRow>
      </ListContainer>
      {selectedLevel !== -1 && (
        <LevelPopup
          highlight={highlight[highlightWeeks]}
          levelId={selectedLevel}
          longName={longName}
          levelName={levelName}
          close={() => {
            selectLevel(-1);
          }}
          showLegacyIcon={showLegacyIcon}
        />
      )}
    </>
  );
};

const KuskiCell = styled(ListCell)`
  height: 20px;
  padding-top: 8px;
  padding-bottom: 8px;
`;

const TimeRow = styled(ListRow)`
  background: ${p => (p.selected ? p.theme.primary : 'transparent')};
  cursor: pointer;
  a {
    color: ${p => (p.selected ? 'white' : p.theme.linkColor)};
  }
  span {
    color: ${p => (p.selected ? 'white' : 'inherit')};
  }
  :hover {
    background: ${p => (p.selected ? p.theme.primary : p.theme.hoverColor)};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
  > span:hover {
    .pop-bar-1 {
      background: ${p => p.theme.paperBackground};
    }
  }
`;

const TTRow = styled(ListRow)`
  background: ${p => (p.selected ? p.theme.primary : 'transparent')};
  color: ${p => (p.selected ? '#fff' : 'inherit')};
  :hover {
    background: ${p => (p.selected ? p.theme.primary : p.theme.hoverColor)};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

export default Records;
