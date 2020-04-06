import React from 'react';
import styled from 'styled-components';
import { formatDistance, format } from 'date-fns';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import Today from '@material-ui/icons/Today';
import CheckBox from '@material-ui/icons/CheckBox';

const GetWinner = times => {
  if (times.length > 0) {
    const ordered = times.sort((a, b) => a.Time - b.Time);
    return ordered[0];
  }
  return '';
};

const Cups = props => {
  const { events } = props;

  if (!events) {
    return null;
  }

  return (
    <>
      {events.map((e, i) => (
        <Container>
          <EventNo>{i + 1}.</EventNo>
          <RightSide>
            <By>
              {e.Level.LevelName} by {e.KuskiData.Kuski}
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
              {e.EndTime > format(new Date(), 't') && (
                <>
                  {' '}
                  (
                  {formatDistance(new Date(e.EndTime * 1000), new Date(), {
                    addSuffix: true,
                  })}
                  )
                </>
              )}
            </div>
            <div>
              <CheckBox />
              <Time time={GetWinner(e.CupTimes).Time} /> by{' '}
              {GetWinner(e.CupTimes).KuskiData.Kuski}
            </div>
          </RightSide>
        </Container>
      ))}
    </>
  );
};

const By = styled.div`
  font-weight: 500;
  color: #219653;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100px;
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
