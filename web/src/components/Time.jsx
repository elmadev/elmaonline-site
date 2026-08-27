import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import {
  parseTimeHundreds,
  parseTimeThousands,
  parsedTimeToString,
} from '../utils/recTime';

const SpecialResult = (time, type) => {
  if (type === 'SP') {
    return (time / 100).toFixed(2);
  }
  return time;
};

export const BattleTime = ({ time, apples, thousands, color, battleType }) => {
  if (['FC', 'SP'].indexOf(battleType) > -1) {
    return <>{SpecialResult(time, battleType)}</>;
  }
  return (
    <Time time={time} apples={apples} thousands={thousands} color={color} />
  );
};

export const formatTime = (time, apples, thousands) => {
  // for cup results
  if (apples === -1) {
    if (time === 9999100 || time === 10000000) {
      return '0 apples';
    }
    if (time >= 999900 && time <= 999999) {
      return `${1000000 - time} apple${1000000 - time !== 1 ? `s` : ``}`;
    }
    if (time >= 9999000 && time <= 9999999) {
      return `${10000000 - time} apple${10000000 - time !== 1 ? `s` : ``}`;
    }
  }
  if (time === 0) {
    return `${apples} apple${apples !== 1 ? `s` : ``}`;
  }

  if (thousands) {
    return parsedTimeToString(parseTimeThousands(time), true);
  } else {
    return parsedTimeToString(parseTimeHundreds(time), false);
  }
};

class Time extends React.Component {
  static propTypes = {
    time: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({})])
      .isRequired,
    apples: PropTypes.number,
    thousands: PropTypes.bool,
    color: PropTypes.string,
  };

  render() {
    const { time, apples = 0, thousands = false, color = '' } = this.props;
    if (!time && !Number.isInteger(apples)) {
      return <span />;
    }
    if (typeof time === 'object') {
      if (time.unfinished) {
        return (
          <span>
            {time.finished} / {time.levs}
          </span>
        );
      }
      return (
        <Span color={color}>{formatTime(time.tt, apples, thousands)}</Span>
      );
    }
    return (
      <Span color={color}>{formatTime(time || 0, apples, thousands)}</Span>
    );
  }
}

const Span = styled.span`
  && {
    ${p => p.color && `color: ${p.color};`}
  }
`;

export default Time;
