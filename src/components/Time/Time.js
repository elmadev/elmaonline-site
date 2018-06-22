import React from 'react';
import PropTypes from 'prop-types';

class Time extends React.Component {
  static propTypes = {
    time: PropTypes.number.isRequired,
  };
  formatTime = time => {
    const string = `${Math.floor((time / 100) % 60)
      .toString()
      .padStart(time > 999 ? 2 : 1, 0)},${(time % 100)
      .toString()
      .padStart(2, 0)}`;

    if (time > 5999) {
      return `${Math.floor(time / 6000)}:${string}`;
    }

    if (time === 0) {
      return '0 apples';
    }

    return string;
  };

  render() {
    return <span>{this.formatTime(this.props.time)}</span>;
  }
}

export default Time;
