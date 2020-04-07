import React, { useState } from 'react';
import styled from 'styled-components';
import { formatDistance, format } from 'date-fns';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import CupResults from 'components/CupResults';
import Today from '@material-ui/icons/Today';
import CheckBox from '@material-ui/icons/CheckBox';
import Timer from '@material-ui/icons/Timer';

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

  if (!events) {
    return null;
  }

  return (
    <Container>
      <HalfContainer>
        {events.map((e, i) => (
          <EventContainer
            highlight={i === openEvent}
            onClick={() => setOpenEvent(i)}
          >
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
      </HalfContainer>
      {openEvent > -1 && (
        <HalfContainerRight>
          <CupResults results={events[openEvent].CupTimes} />
        </HalfContainerRight>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const HalfContainer = styled.div`
  flex-grow: 1;
`;

const HalfContainerRight = styled(HalfContainer)`
  padding-right: 8px;
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
