import React, { Fragment } from 'react';
import styled from 'styled-components';
import { format, formatDistance } from 'date-fns';
import LocalTime from 'components/LocalTime';
import Kuski from 'components/Kuski';
import { Paper } from 'styles/Paper';
import { Timer } from '@material-ui/icons';

const eventSort = (a, b) => a.CupIndex - b.CupIndex;

const CupResults = props => {
  const { events } = props;

  const currentEvents = events.filter(
    e =>
      e.EndTime > format(new Date(), 't') &&
      e.StartTime < format(new Date(), 't'),
  );

  const getEventNumber = event => {
    const index = events
      .sort(eventSort)
      .findIndex(e => e.CupIndex === event.CupIndex);
    return index + 1;
  };

  return (
    <Container>
      {currentEvents.map(c => (
        <Fragment key={`${c.CupIndex}${c.StartTime}`}>
          {c.EndTime > format(new Date(), 't') &&
            c.StartTime < format(new Date(), 't') && (
              <Paper>
                <EventHeader>
                  Event {getEventNumber(c)} by <Kuski kuskiData={c.KuskiData} />
                </EventHeader>
                <EventInfo>
                  {c.Level && (
                    <a href={`/dl/level/${c.LevelIndex}`}>
                      {c.Level.LevelName}
                    </a>
                  )}
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
        </Fragment>
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
