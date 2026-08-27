import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import CupResults from 'components/CupResults';
import Kuski from 'components/Kuski';
import { Tabs, Tab, Grid } from '@material-ui/core';
import Recplayer from 'components/Recplayer';
import Download from 'components/Download';
import EventItem from 'components/EventItem';
import config from 'config';
import { Paper } from 'components/Paper';
import { Level } from 'components/Names';
import { admins } from 'utils/cups';
import { nickId } from 'utils/nick';
import Interviews from './Interviews';
import Leaders from './Leaders';
import EventStandings from './EventStandings';

const eventSort = (a, b) => a.CupIndex - b.CupIndex;

const GetWinner = times => {
  if (times.length > 0) {
    const ordered = times.sort((a, b) => a.Time - b.Time);
    return (
      <>
        <Time time={ordered[0].Time} apples={-1} /> by{' '}
        {ordered[0].KuskiData.Kuski}
      </>
    );
  }
  return '';
};

const Cups = props => {
  const { cup, events, eventNumber, eventTab } = props;
  const eventIndex = eventNumber - 1;
  const navigate = useNavigate();

  if (!events) {
    return <div>No events found.</div>;
  }

  const event = events[eventIndex];

  if (event === undefined) {
    return <div>Event does not exist.</div>;
  }

  const isCupAdmin =
    admins(cup).length > 0 && admins(cup).indexOf(nickId()) > -1;

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sm={6}>
        {events.sort(eventSort).map((e, i) => (
          <EventItem
            key={e.CupIndex}
            i={i}
            selected={eventIndex}
            onClick={() =>
              // persist selected eventTab when changing events.
              navigate({
                to: ['/cup', cup.ShortName, 'events', i + 1, eventTab]
                  .filter(Boolean)
                  .join('/'),
              })
            }
            level={
              e.Level ? (
                <>
                  <Download href={`level/${e.LevelIndex}`}>
                    {`${e.Level.LevelName}.lev`}
                  </Download>
                  <> - </>
                  <Level LevelIndex={e.LevelIndex} LevelData={e.Level} />
                </>
              ) : null
            }
            by={<Kuski kuskiData={e.KuskiData} />}
            eventTime={
              <>
                <LocalTime
                  date={e.StartTime}
                  format="eee d MMM HH:mm"
                  parse="X"
                />{' '}
                -{' '}
                <LocalTime
                  date={e.EndTime}
                  format="eee d MMM yyyy HH:mm"
                  parse="X"
                />
              </>
            }
            start={e.StartTime}
            end={e.EndTime}
            winner={GetWinner(e.CupTimes)}
          />
        ))}
      </Grid>
      {(() => {
        const hasEnded = event.StartTime < format(new Date(), 't');

        return (
          <Grid item xs={12} sm={6}>
            <Tabs
              variant="scrollable"
              scrollButtons="auto"
              value={eventTab}
              onChange={(e, value) => {
                navigate({
                  to: ['/cup', cup.ShortName, 'events', eventNumber, value]
                    .filter(Boolean)
                    .join('/'),
                });
              }}
            >
              <Tab label="Results" value="results" />
              {hasEnded && <Tab label="Map" value="map" />}
              {hasEnded && <Tab label="Interviews" value="interviews" />}
              {hasEnded && <Tab label="Leaders" value="leaders" />}
              {hasEnded && <Tab label="Standings" value="standings" />}
              {hasEnded && isCupAdmin && (
                <Tab label="Paste friendly" value="paste" />
              )}
            </Tabs>
            <Paper>
              {eventTab === 'results' && (
                <CupResults
                  CupIndex={event.CupIndex}
                  cup={cup}
                  eventNo={eventIndex + 1}
                  results={event.CupTimes}
                />
              )}
              {eventTab === 'map' && hasEnded && (
                <PlayerContainer>
                  <Recplayer
                    lev={`${config.dlUrl}level/${events[eventIndex].LevelIndex}`}
                    controls
                  />
                </PlayerContainer>
              )}
              {eventTab === 'interviews' && hasEnded && (
                <Interviews cup={cup} event={events[eventIndex]} />
              )}
              {eventTab === 'leaders' && hasEnded && (
                <Leaders event={events[eventIndex]} />
              )}
              {eventTab === 'standings' && hasEnded && (
                <EventStandings
                  events={events.slice(0, eventIndex + 1)}
                  cup={cup}
                />
              )}
              {eventTab === 'paste' && hasEnded && (
                <CupResults
                  CupIndex={event.CupIndex}
                  cup={cup}
                  eventNo={eventIndex + 1}
                  results={event.CupTimes}
                  pasteFriendly
                />
              )}
            </Paper>
          </Grid>
        );
      })()}
    </Grid>
  );
};

const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
`;

export default Cups;
