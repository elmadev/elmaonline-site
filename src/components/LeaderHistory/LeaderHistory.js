import React from 'react';
import Time from 'components/Time';
import LocalTime from 'components/LocalTime';
import styled from 'styled-components';

const TimelineLine = styled.span`
  position: absolute;
  width: 2px;
  background: #219653;
  height: 100%;
  top: 0;
  left: 50%;
  margin-left: -1px;
  z-index: 1;
`;

const TimeDevelopment = styled.div`
  font-size: 14px;
  display: table;
`;

const TimeDevelopmentRow = styled.div`
  display: table-row;
  vertical-align: middle;
  position: relative;

  &:first-child ${TimelineLine} {
    top: 50%;
  }

  &:last-child ${TimelineLine} {
    top: -50%;
  }

  &:first-child:last-child ${TimelineLine} {
    display: none;
  }
`;

const TimeDevelopmentTime = styled.span`
  text-align: right;
  padding-right: 5px;
  display: table-cell;
  vertical-align: middle;
`;

const TimeDevelopmentKuski = styled.span`
  vertical-align: middle;
  padding-right: 5px;
  display: table-cell;
  color: #7d7d7d;
`;

const TimeDevelopmentLocalTime = styled.span`
  vertical-align: middle;
  display: table-cell;
  color: #7d7d7d;
`;

const TimelineCell = styled.span`
  display: table-cell;
  position: relative;
`;

const TimeDiff = styled.span`
  vertical-align: middle;
  display: table-cell;
  color: #7d7d7d;
  text-align: right;
`;

const TimelineMarker = styled.span`
  width: 6px;
  height: 6px;
  display: block;
  background: #fff;
  border: 2px solid #219653;
  border-radius: 50%;
  margin: 6px;
  z-index: 2;
  position: relative;
`;

export default function LeaderHistory({ allFinished }) {
  return (
    <TimeDevelopment>
      {[...allFinished]
        .reduce((acc, cur) => {
          if (acc.length < 1 || acc[acc.length - 1].Time > cur.Time)
            acc.push(cur);
          return acc;
        }, [])
        .map((b, i, a) => (
          <TimeDevelopmentRow key={b.TimeIndex}>
            <TimeDiff>
              {a.length > 1 && !a[i + 1] && 'Winner'}
              {a[i - 1] && (
                <span>
                  {' '}
                  -<Time time={a[i - 1].Time - b.Time} />
                </span>
              )}
              {a.length > 1 && !a[i - 1] && 'First finish'}
              {a.length === 1 && allFinished.length !== 1 && 'First finish'}
              {a.length === 1 && allFinished.length === 1 && 'Only finish'}
            </TimeDiff>
            <TimelineCell>
              <TimelineMarker />
              <TimelineLine />
            </TimelineCell>
            <TimeDevelopmentTime>
              <Time time={b.Time} />
            </TimeDevelopmentTime>
            <TimeDevelopmentKuski>{b.KuskiData.Kuski}</TimeDevelopmentKuski>
            <TimeDevelopmentLocalTime>
              <LocalTime
                date={b.Driven}
                format="ddd D MMM YYYY HH:mm:ss"
                parse="X"
              />
            </TimeDevelopmentLocalTime>
          </TimeDevelopmentRow>
        ))}
    </TimeDevelopment>
  );
}
