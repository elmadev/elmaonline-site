import React from 'react';
import PropTypes from 'prop-types';

const thousandsValues = [1000, 59999, 60000, 3];
const hundredsValues = [100, 5999, 6000, 2];

class Time extends React.Component {
  static propTypes = {
    time: PropTypes.number.isRequired,
    apples: PropTypes.number,
    thousands: PropTypes.bool,
  };

  static defaultProps = {
    thousands: false,
    apples: 0,
  };

  formatTime = time => {
    if (time === 0) {
      return `${this.props.apples} apple${this.props.apples !== 1 ? `s` : ``}`;
    }
    let values = hundredsValues;
    if (this.props.thousands) {
      values = thousandsValues;
    }
    const string = `${Math.floor((time / values[0]) % 60)
      .toString()
      .padStart(time > 999 ? 2 : 1, 0)},${(time % values[0])
      .toString()
      .padStart(values[3], 0)}`;

    if (time > values[1]) {
      return `${Math.floor(time / values[2])}:${string}`;
    }

    return string;
  };

  render() {
    return <span>{this.formatTime(this.props.time)}</span>;
  }
}

export default Time;
