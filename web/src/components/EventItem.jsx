import React from 'react';
import styled from '@emotion/styled';
import { Today, CheckBox, Timer } from '@material-ui/icons';
import { formatDistance, format } from 'date-fns';

const EventItem = ({
  i,
  selected,
  onClick,
  level,
  by,
  eventTime,
  start,
  end,
  winner = '',
}) => {
  return (
    <EventContainer
      highlight={i === selected}
      onClick={() => onClick && onClick()}
    >
      <EventNo>{i + 1}.</EventNo>
      <RightSide>
        <By>
          {level} by {by}
        </By>
        <div>
          <Today /> {eventTime}
        </div>
        {end !== 0 && (
          <div>
            {end > format(new Date(), 't') &&
              start < format(new Date(), 't') && (
                <>
                  <Timer /> Deadline{' '}
                  {formatDistance(new Date(end * 1000), new Date(), {
                    addSuffix: true,
                  })}
                </>
              )}
            {end > format(new Date(), 't') &&
              start > format(new Date(), 't') && (
                <>
                  <Timer /> Starts{' '}
                  {formatDistance(new Date(start * 1000), new Date(), {
                    addSuffix: true,
                  })}
                </>
              )}
            {end < format(new Date(), 't') && (
              <>
                <CheckBox />
                {winner}
              </>
            )}
          </div>
        )}
      </RightSide>
    </EventContainer>
  );
};

export const SeasonItem = ({ name, selected, onClick }) => {
  return (
    <EventContainer
      highlight={selected === name}
      onClick={() => onClick && onClick(name)}
    >
      <SeasonName>{name}</SeasonName>
    </EventContainer>
  );
};

const By = styled.div`
  font-weight: bold;
`;

const EventContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100px;
  cursor: pointer;
  background-color: ${props =>
    props.highlight ? props.theme.primary : 'transparent'};
  color: ${p => (p.highlight ? p.theme.buttonFontColor : p.theme.fontColor)};
  a {
    color: ${props => (props.highlight ? 'white' : props.theme.linkColor)};
  }
`;

const EventNo = styled.div`
  width: 100px;
  font-size: 56px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const SeasonName = styled.div`
  font-size: 56px;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-left: 24px;
`;

const RightSide = styled.div`
  flex-grow: 1;
  flex-direction: column;
  padding: 8px;
`;

export default EventItem;
