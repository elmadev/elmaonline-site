import React from 'react';
import styled from 'styled-components';
import { format, formatDistance } from 'date-fns';
import Link from 'components/Link';
import LocalTime from 'components/LocalTime';
import Kuski from 'components/Kuski';
import Paper from '@material-ui/core/Paper';
import Timer from '@material-ui/icons/Timer';

const CupResults = props => {
  const { events } = props;

  const currentEvents = events.filter(
    e =>
      e.EndTime > format(new Date(), 't') &&
      e.StartTime < format(new Date(), 't'),
  );

  return (
    <Container>
      {currentEvents.map((c, eventNo) => (
        <>
          {c.EndTime > format(new Date(), 't') &&
            c.StartTime < format(new Date(), 't') && (
              <Paper>
                <EventHeader>
                  Event {eventNo + 1} by <Kuski kuskiData={c.KuskiData} />
                </EventHeader>
                <EventInfo>
                  <Link to={`/dl/level/${c.LevelIndex}`}>
                    {c.Level.LevelName}
                  </Link>
                </EventInfo>
                <EventInfo>
                  Deadline:{' '}
                  <LocalTime
                    date={c.EndTime}
                    format="ddd D MMM YYYY HH:mm"
                    parse="X"
                  />
                </EventInfo>
                <EventInfo>
                  <Timer />{' '}
                  {formatDistance(new Date(c.EndTime * 1000), new Date(), {
                    addSuffix: true,
                  })}
                </EventInfo>
              </Paper>
            )}
        </>
      ))}
    </Container>
  );
};

const Container = styled.div``;

const EventHeader = styled.div`
  text-align: center;
  padding-top: 8px;
  font-weight: bold;
`;

const EventInfo = styled.div`
  text-align: center;
  padding-bottom: 8px;
`;

export default CupResults;
