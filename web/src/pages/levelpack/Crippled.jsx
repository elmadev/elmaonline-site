import React from 'react';
import { useStoreState } from 'easy-peasy';
import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import { format } from 'date-fns';
import { Level } from 'components/Names';
import Loading from 'components/Loading';
import { parsedTimeToString, parseTimeHundreds } from 'utils/recTime';
import {
  CrippledLevelPackRecords,
  CrippledLevelPackPersonalRecords,
  useQueryAlt,
} from 'api';
import { toLocalTime } from 'utils/time';

const cripples = [
  'noVolt',
  'noTurn',
  'oneTurn',
  'noBrake',
  'noThrottle',
  'alwaysThrottle',
  'oneWheel',
  'drunk',
];

const NotFinished = () => {
  return <span title="Not finished">--</span>;
};

const shouldHighlight = (record, highlightUnix) => {
  return (
    highlightUnix &&
    highlightUnix > 0 &&
    record &&
    record.Driven >= highlightUnix
  );
};

const recordDate = record => {
  if (record && record.Driven) {
    return format(toLocalTime(record.Driven, 't'), 'eee d MMM yyyy HH:mm');
  }

  return '';
};

const PersonalTable = ({ levels, personalRecords, highlightUnix }) => {
  return (
    <ListContainer>
      <ListHeader>
        <ListCell width={100}>Filename</ListCell>
        <ListCell width={180}>Level Name</ListCell>
        <ListCell>No Volt</ListCell>
        <ListCell>No Turn</ListCell>
        <ListCell>One Turn</ListCell>
        <ListCell>No Brake</ListCell>
        <ListCell>No Throttle</ListCell>
        <ListCell>Always Throttle</ListCell>
        <ListCell>One Wheel</ListCell>
        <ListCell>Drunk</ListCell>
      </ListHeader>
      {levels.map(level => {
        return (
          <ListRow key={level.LevelIndex}>
            <ListCell>
              <Level LevelIndex={level.LevelIndex} LevelData={level} />
            </ListCell>
            <ListCell>
              <span>{level.LongName}</span>
            </ListCell>
            {cripples.map(cripple => {
              const personalRecord =
                personalRecords?.[level.LevelIndex]?.[cripple];

              return (
                <ListCell
                  highlight={shouldHighlight(personalRecord, highlightUnix)}
                  title={recordDate(personalRecord)}
                >
                  {personalRecord && <Time time={personalRecord.Time} />}
                  {!personalRecord && <NotFinished />}
                </ListCell>
              );
            })}
          </ListRow>
        );
      })}
    </ListContainer>
  );
};

const CrippledTypeTable = ({
  levels,
  records,
  personalRecords,
  crippleType,
  showPersonal,
  highlightUnix,
}) => {
  return (
    <ListContainer>
      <ListHeader>
        <ListCell width={100}>Filename</ListCell>
        <ListCell width={320}>Level Name</ListCell>
        <ListCell width={200}>Kuski</ListCell>
        <ListCell width={130}>Time</ListCell>
        <ListCell>{showPersonal && 'Personal'}</ListCell>
        <ListCell />
      </ListHeader>

      {levels.map(level => {
        const record = records?.[level.LevelIndex];

        const personalRecord =
          personalRecords?.[level.LevelIndex]?.[crippleType];

        const personalIsRecord =
          (record &&
            personalRecord &&
            record.TimeIndex === personalRecord.TimeIndex) ||
          false;

        const diff =
          (record && personalRecord && personalRecord.Time - record.Time) || 0;

        return (
          <ListRow key={level.LevelIndex}>
            <ListCell>
              <Level LevelIndex={level.LevelIndex} LevelData={level} />
            </ListCell>
            <ListCell>
              <span>{level.LongName}</span>
            </ListCell>
            <ListCell>
              {record !== undefined && (
                <Kuski kuskiData={record.KuskiData} flag={true} team={true} />
              )}
            </ListCell>
            <ListCell
              highlight={shouldHighlight(record, highlightUnix)}
              title={recordDate(record)}
            >
              {record && <Time time={record.Time} />}
              {!record && <NotFinished />}
            </ListCell>
            <ListCell
              highlight={shouldHighlight(personalRecord, highlightUnix)}
              title={personalIsRecord ? '' : recordDate(personalRecord)}
            >
              {showPersonal && personalRecord === undefined && <NotFinished />}
              {showPersonal && personalRecord && personalIsRecord && (
                <span>Record</span>
              )}
              {showPersonal && personalRecord && !personalIsRecord && (
                <>
                  <Time time={personalRecord.Time} />
                  {diff > 0 && (
                    <TimeDiff>
                      {' '}
                      (+{parsedTimeToString(parseTimeHundreds(diff))})
                    </TimeDiff>
                  )}
                </>
              )}
            </ListCell>
            <ListCell />
          </ListRow>
        );
      })}
    </ListContainer>
  );
};

const Crippled = ({ LevelPack, crippleType, highlightWeeks }) => {
  const navigate = useNavigate();

  const levels = Array.isArray(LevelPack.levels) ? LevelPack.levels : [];

  const highlightUnix =
    Math.floor(new Date().getTime() / 1000) - highlightWeeks * 3600 * 24 * 7;

  let { userid } = useStoreState(state => state.Login);
  userid = +userid;

  const { data: records = {}, ...recordsRequest } = useQueryAlt(
    ['CrippledLevelPackRecords', LevelPack.LevelPackName, crippleType],
    async () => CrippledLevelPackRecords(LevelPack.LevelPackName, crippleType),
    {
      enabled: !!(
        crippleType &&
        crippleType !== 'all-personal' &&
        LevelPack?.LevelPackName
      ),
    },
  );

  const { data: personalRecords = {} } = useQueryAlt(
    ['CrippledLevelPackPersonalRecords', LevelPack.LevelPackName, userid],
    async () =>
      CrippledLevelPackPersonalRecords(LevelPack.LevelPackName, userid),
    {
      enabled: !!(userid && LevelPack?.LevelPackName),
    },
  );

  return (
    <Root>
      <Controls>
        <CrippleSelect>
          <InputLabel id="cripple">Cripple</InputLabel>
          <Select
            id="cripple"
            value={crippleType}
            onChange={e => {
              navigate({
                to: [
                  '/levels/packs',
                  LevelPack.LevelPackName,
                  'crippled',
                  e.target.value,
                ]
                  .filter(Boolean)
                  .join('/'),
              });
            }}
          >
            <MenuItem value="noVolt">No Volt</MenuItem>
            <MenuItem value="noTurn">No Turn</MenuItem>
            <MenuItem value="oneTurn">One Turn</MenuItem>
            <MenuItem value="noBrake">No Brake</MenuItem>
            <MenuItem value="noThrottle">No Throttle</MenuItem>
            <MenuItem value="alwaysThrottle">Always Throttle</MenuItem>
            <MenuItem value="oneWheel">One Wheel</MenuItem>
            <MenuItem value="drunk">Drunk</MenuItem>
            {userid && (
              <MenuItem value="all-personal">All Types (Personal)</MenuItem>
            )}
          </Select>
        </CrippleSelect>
      </Controls>

      {!crippleType && 'Select a cripple type.'}

      {recordsRequest.isLoading && <Loading />}
      {recordsRequest.isError && <span>Error.</span>}

      {crippleType === 'all-personal' && (
        <PersonalTable
          levels={levels}
          records={records}
          personalRecords={personalRecords}
          highlightUnix={highlightUnix}
        />
      )}

      {crippleType && crippleType !== 'all-personal' && (
        <CrippledTypeTable
          levels={levels}
          records={records}
          personalRecords={personalRecords}
          crippleType={crippleType}
          showPersonal={userid > 0}
          highlightUnix={highlightUnix}
        />
      )}
    </Root>
  );
};

const Root = styled.div`
  padding-bottom: 50px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 16px;
  padding-bottom: 25px;
  && {
    > * {
      margin-right: 18px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

const CrippleSelect = styled(FormControl)`
  min-width: 175px !important;
`;

const TimeDiff = styled.span`
  color: ${p => p.theme.errorColor};
`;

export default Crippled;
