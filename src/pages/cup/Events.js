import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { formatDistance, format } from 'date-fns';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import CupResults from 'components/CupResults';
import Kuski from 'components/Kuski';
import { Today, CheckBox, Timer } from '@material-ui/icons';
import { Tabs, Tab, Grid } from '@material-ui/core';
import Recplayer from 'components/Recplayer';
import Interviews from './Interviews';
import Leaders from './Leaders';

const eventSort = (a, b) => a.CupIndex - b.CupIndex;

const GetWinner = times => {
  if (times.length > 0) {
    const ordered = times.sort((a, b) => a.Time - b.Time);
    return (
      <>
        <Time time={ordered[0].Time} /> by {ordered[0].KuskiData.Kuski}
      </>
    );
  }
  return '';
};

const Cups = props => {
  const { events, setEvent, cup } = props;
  const [openEvent, setOpenEvent] = useState(-1);
  const [tab, setTab] = useState(0);

  if (!events) {
    return null;
  }

  useEffect(() => {
    setOpenEvent(setEvent);
  }, [setEvent]);

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sm={6}>
        {events.sort(eventSort).map((e, i) => (
          <EventContainer
            key={e.CupIndex}
            highlight={i === openEvent}
            onClick={() => setOpenEvent(i)}
          >
            <EventNo>{i + 1}.</EventNo>
            <RightSide>
              <By>
                <a href={`/dl/level/${e.LevelIndex}`}>
                  {e.Level ? e.Level.LevelName : ''}
                </a>{' '}
                by <Kuski kuskiData={e.KuskiData} />
              </By>
              <div>
                <Today />{' '}
                <LocalTime
                  date={e.StartTime}
                  format="ddd D MMM HH:mm"
                  parse="X"
                />{' '}
                -{' '}
                <LocalTime
                  date={e.EndTime}
                  format="ddd D MMM YYYY HH:mm"
                  parse="X"
                />
              </div>
              <div>
                {e.EndTime > format(new Date(), 't') &&
                  e.StartTime < format(new Date(), 't') && (
                    <>
                      <Timer /> Deadline{' '}
                      {formatDistance(new Date(e.EndTime * 1000), new Date(), {
                        addSuffix: true,
                      })}
                    </>
                  )}
                {e.EndTime > format(new Date(), 't') &&
                  e.StartTime > format(new Date(), 't') && (
                    <>
                      <Timer /> Starts{' '}
                      {formatDistance(
                        new Date(e.StartTime * 1000),
                        new Date(),
                        {
                          addSuffix: true,
                        },
                      )}
                    </>
                  )}
                {e.EndTime < format(new Date(), 't') && (
                  <>
                    <CheckBox />
                    {GetWinner(e.CupTimes)}
                  </>
                )}
              </div>
            </RightSide>
          </EventContainer>
        ))}
      </Grid>
      {openEvent > -1 && (
        <Grid item xs={12} sm={6}>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={tab}
            onChange={(e, value) => setTab(value)}
          >
            <Tab label="Results" />
            {events[openEvent].StartTime < format(new Date(), 't') && (
              <Tab label="Map" />
            )}
            {events[openEvent].EndTime < format(new Date(), 't') && (
              <Tab label="Interviews" />
            )}
            {events[openEvent].EndTime < format(new Date(), 't') && (
              <Tab label="Leaders" />
            )}
          </Tabs>
          {tab === 0 && (
            <CupResults
              CupIndex={events[openEvent].CupIndex}
              ShortName={cup.ShortName}
              eventNo={openEvent + 1}
              results={events[openEvent].CupTimes}
            />
          )}
          {tab === 1 && events[openEvent].StartTime < format(new Date(), 't') && (
            <PlayerContainer>
              <Recplayer
                lev={`/dl/level/${events[openEvent].LevelIndex}`}
                controls
              />
            </PlayerContainer>
          )}
          {tab === 2 && events[openEvent].EndTime < format(new Date(), 't') && (
            <Interviews cup={cup} event={events[openEvent]} />
          )}
          {tab === 3 && events[openEvent].EndTime < format(new Date(), 't') && (
            <Leaders event={events[openEvent]} />
          )}
        </Grid>
      )}
    </Grid>
  );
};

const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
`;

const By = styled.div`
  font-weight: bold;
`;

const EventContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100px;
  cursor: pointer;
  background-color: ${props => (props.highlight ? '#219653' : 'transparent')};
  color: ${props => (props.highlight ? 'white' : 'black')};
  a {
    color: ${props => (props.highlight ? 'white' : '#219653')};
  }
`;

const EventNo = styled.div`
  width: 100px;
  font-size: 56px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const RightSide = styled.div`
  flex-grow: 1;
  flex-direction: column;
  padding: 8px;
`;

export default Cups;
