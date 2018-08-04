import React from 'react';
import PropTypes from 'prop-types';

class ReplayTime extends React.Component {
  static propTypes = {
    time: PropTypes.number,
  };

  static defaultProps = {
    time: null,
  };

  render() {
    let { time } = this.props;
    let mili;
    let secs;
    let mins;
    let readableTime;
    if (time) {
      time = time.toString();
      mili = time.substring(time.length - 3, time.length);
      secs = time.substring(0, time.length - 3);
      mins = Math.floor(secs / 60);
      if (mins) {
        secs -= mins * 60;
        readableTime = `${mins}:${secs},${mili}`;
      } else {
        readableTime = `${secs},${mili}`;
      }
    } else {
      time = '?';
    }
    return <span>{readableTime}</span>;
  }
}

export default ReplayTime;
