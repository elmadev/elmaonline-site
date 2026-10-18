import styled from '@emotion/styled';
import { Today, CheckBox, Timer } from '@mui/icons-material';
import { formatDistance, getUnixTime } from 'date-fns';

type EventItemProps = {
  i: number;
  selected: number;
  onClick?: () => void;
  level: React.ReactNode;
  by: React.ReactNode;
  eventTime: React.ReactNode;
  /** unix timestamp */
  start: number | string;
  /** unix timestamp, 0 if unknown */
  end: number | string;
  winner?: React.ReactNode;
};

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
}: EventItemProps) => {
  const now = getUnixTime(new Date());
  const startTime = Number(start);
  const endTime = Number(end);
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
            {endTime > now && startTime < now && (
              <>
                <Timer /> Deadline{' '}
                {formatDistance(new Date(endTime * 1000), new Date(), {
                  addSuffix: true,
                })}
              </>
            )}
            {endTime > now && startTime > now && (
              <>
                <Timer /> Starts{' '}
                {formatDistance(new Date(startTime * 1000), new Date(), {
                  addSuffix: true,
                })}
              </>
            )}
            {endTime < now && (
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

type SeasonItemProps = {
  name: string;
  selected: string;
  onClick?: (name: string) => void;
};

export const SeasonItem = ({ name, selected, onClick }: SeasonItemProps) => {
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

const EventContainer = styled.div<{ highlight: boolean }>`
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
