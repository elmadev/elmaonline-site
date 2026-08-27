import React from 'react';
import styled from '@emotion/styled';
import { ListContainer, ListHeader, ListRow, ListCell } from 'components/List';
import Link from 'components/Link';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import formatDistance from 'date-fns/formatDistance';
import { formatTimeSpent, formatAttempts } from 'utils/format';

const RecentRecords = ({ records }) => {
  return (
    <Root>
      <ListContainer>
        <ListHeader>
          <ListCell>Kuski</ListCell>
          <ListCell>Level</ListCell>
          <ListCell>Time</ListCell>
          <ListCell title="The current standing of the time driven. 1 means record.">
            Standing
          </ListCell>
          <ListCell>Driven</ListCell>
          <ListCell>Kuskis Played</ListCell>
          <ListCell>Playtime (All Kuskis)</ListCell>
          <ListCell>Attempts (All Kuskis)</ListCell>
        </ListHeader>
        {Array.isArray(records) &&
          records.map(r => {
            const level = r.LevelData || {};
            const kuski = r.KuskiData || {};
            const levUrl = `/levels/${level.LevelIndex}`;
            const driven2 = formatDistance(
              new Date(r.Driven * 1000),
              new Date(),
              { addSuffix: true, addPrefix: false },
            );

            return (
              <ListRow key={[r.KuskiIndex, r.Driven].join('-')}>
                <ListCell>
                  <Kuski kuskiData={kuski} flag={true} team={true} />
                </ListCell>
                <ListCell>
                  <Link to={levUrl} title={level.LongName}>
                    {level.LevelName}
                  </Link>
                </ListCell>
                <ListCell>
                  <Time time={r.Time} />
                </ListCell>
                <ListCell>{r.CurrentStanding}</ListCell>
                <ListCell>{driven2}</ListCell>
                <ListCell>{r.KuskiCountAll}</ListCell>
                <ListCell>{formatTimeSpent(r.TimeAll)}</ListCell>
                <ListCell>{formatAttempts(r.AttemptsAll)}</ListCell>
              </ListRow>
            );
          })}
      </ListContainer>
    </Root>
  );
};

// for mobile
const Root = styled.div`
  overflow-x: scroll;
`;

export default RecentRecords;
