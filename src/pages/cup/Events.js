import React, { useState } from 'react';
import styled from 'styled-components';
import { formatDistance, format } from 'date-fns';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import Link from 'components/Link';
import CupResults from 'components/CupResults';
import Kuski from 'components/Kuski';
import Today from '@material-ui/icons/Today';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import CheckBox from '@material-ui/icons/CheckBox';
import Timer from '@material-ui/icons/Timer';
import Recplayer from 'components/Recplayer';
import Interviews from './Interviews';

const GetWinner = times => {
  if (times.length > 0) {
    const ordered = times.sort((a, b) => a.Time - b.Time);
    return ordered[0];
  }
  return '';
};

const Cups = props => {
  const { events } = props;
  const [openEvent, setOpenEvent] = useState(-1);
  const [tab, setTab] = useState(0);

  if (!events) {
    return null;
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sm={6}>
        {events.map((e, i) => (
          <EventContainer
            highlight={i === openEvent}
            onClick={() => setOpenEvent(i)}
          >
            <EventNo>{i + 1}.</EventNo>
            <RightSide>
              <By>
                <Link to={`/dl/level/${e.LevelIndex}`}>
                  {e.Level.LevelName}
                </Link>{' '}
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
                {e.EndTime > format(new Date(), 't') ? (
                  <>
                    <Timer />{' '}
                    {formatDistance(new Date(e.EndTime * 1000), new Date(), {
                      addSuffix: true,
                    })}
                  </>
                ) : (
                  <>
                    <CheckBox />
                    <Time time={GetWinner(e.CupTimes).Time} /> by{' '}
                    {GetWinner(e.CupTimes).KuskiData.Kuski}
                  </>
                )}
              </div>
            </RightSide>
          </EventContainer>
        ))}
      </Grid>
      {openEvent > -1 && (
        <Grid item xs={12} sm={6}>
          <Tabs value={tab} onChange={(e, value) => setTab(value)}>
            <Tab label="Results" />
            {events[openEvent].StartTime < format(new Date(), 't') && (
              <Tab label="Map" />
            )}
            {events[openEvent].EndTime < format(new Date(), 't') && (
              <Tab label="Interviews" />
            )}
          </Tabs>
          {tab === 0 && <CupResults results={events[openEvent].CupTimes} />}
          {tab === 1 && events[openEvent].StartTime < format(new Date(), 't') && (
            <PlayerContainer>
              <Recplayer
                lev={`/dl/level/${events[openEvent].LevelIndex}`}
                controls
              />
            </PlayerContainer>
          )}
          {tab === 2 && events[openEvent].EndTime < format(new Date(), 't') && (
            <Interviews event={events[openEvent]} />
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
