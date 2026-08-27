import React, { useState } from 'react';
import styled from '@emotion/styled';
import Loading from 'components/Loading';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import { LevelPackRecordHistory, useQueryAlt } from '../../api';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import LocalTime from 'components/LocalTime';
import { Level } from '../../components/Names';
import { Dropdown } from '../../components/Inputs';
import Switch from 'components/Switch';
import { SportsMotorsports } from '@material-ui/icons';
import Link from 'components/Link';

const Date = ({ driven }) => {
  return <LocalTime date={driven} format="MMM d yyyy" parse="X" />;
};

const RecordHistory = ({ levelPackInfo }) => {
  const name = levelPackInfo && levelPackInfo.LevelPackName;

  const [limit, setLimit] = useState(50);
  const [sort, setSort] = useState('desc');

  const { data: recordsData, isLoading: recordsLoading } = useQueryAlt(
    ['LevelPackRecordHistory', name, limit, sort],
    async () => LevelPackRecordHistory(name, { limit, sort }),
    {
      enabled: !!name,
    },
  );

  const { countAll, minDriven, maxDriven, records } =
    recordsData !== undefined ? recordsData : {};

  const limitOptions = [
    [50, 50],
    [100, 100],
    [200, 200],
    [1000, '1000 (Slow!)'],
    [999999, 'All (Very Slow!)'],
  ];

  return (
    <Root>
      <div>
        {countAll !== undefined && (
          <TextDiv>
            {minDriven ? (
              <>
                {countAll} record(s) in total were driven between
                {` `}
                <Strong>
                  <Date driven={minDriven} />
                </Strong>
                {` and `}
                <Strong>
                  <Date driven={maxDriven} />
                </Strong>
                .
              </>
            ) : (
              '0 records in total.'
            )}
          </TextDiv>
        )}
        {!!levelPackInfo?.Legacy && (
          <TextDiv>
            This pack contains legacy times, but only EOL times are included
            here.
          </TextDiv>
        )}
      </div>
      <Controls>
        <Dropdown
          name="# Of Records Shown"
          options={limitOptions}
          update={setLimit}
          selected={limit}
        />
        <Switch
          checked={sort === 'desc'}
          onChange={checked => setSort(checked ? 'desc' : 'asc')}
        >
          Recent First
        </Switch>
      </Controls>
      <br />
      <ListContainer>
        <ListHeader>
          <ListCell width="100">Filename</ListCell>
          <ListCell width="270">Level Name</ListCell>
          <ListCell>Kuski</ListCell>
          <ListCell>Time / Improvement</ListCell>
          <ListCell>Record Diff</ListCell>
          <ListCell>Driven</ListCell>
        </ListHeader>
        {recordsLoading && <Loading />}
        {records !== undefined &&
          records.map(r => {
            return (
              <ListRow key={r.TimeIndex}>
                <ListCell>
                  <Level LevelIndex={r.LevelIndex} LevelData={r.LevelData} />
                </ListCell>
                <ListCell>{r.LevelData.LongName}</ListCell>
                <ListCell>
                  <Kuski kuskiData={r.KuskiData} team flag />
                </ListCell>
                <ListCell>
                  {!!r.BattleIndex && (
                    <Link
                      style={{ marginRight: '2px' }}
                      to={`/battles/${r.BattleIndex}`}
                      title={`Driven during battle (${r.BattleIndex})`}
                    >
                      <SportsMotorsports />
                    </Link>
                  )}
                  <Time time={r.Time} />
                  <ColorGood title="Improvement">
                    {r.TimeImprovement === null && ' (First Finish)'}
                    {r.TimeImprovement !== null && (
                      <>
                        {` `}
                        (-
                        <Time time={r.TimeImprovement} />)
                      </>
                    )}
                  </ColorGood>
                </ListCell>
                <ListCell>
                  {r.TimeDiff === 0 && <ColorGood>Current Record</ColorGood>}
                  <ColorBad>
                    {r.TimeDiff > 0 && (
                      <>
                        +<Time time={r.TimeDiff} />
                      </>
                    )}
                  </ColorBad>
                </ListCell>
                <ListCell>
                  <Date driven={r.Driven} />
                </ListCell>
              </ListRow>
            );
          })}
      </ListContainer>
    </Root>
  );
};

const Root = styled.div`
  padding-bottom: 70px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  > * {
    &:first-child {
      width: 200px;
    }
    margin-left: 20px;
  }
`;

const TextDiv = styled.div`
  font-size: 14px;
  margin: 0 0 10px 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Strong = styled.span`
  font-weight: 500;
`;

const ColorGood = styled.span`
  color: ${p => p.theme.primary};
`;

const ColorBad = styled.span`
  color: ${p => p.theme.errorColor};
`;

export default RecordHistory;
