import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

const formatDate = (date, format) => {
  const dateObj = moment(date, 'X').utc();
  const arr = [
    dateObj.year(),
    dateObj.month(),
    dateObj.date(),
    dateObj.hour(),
    dateObj.minute(),
    dateObj.second(),
  ];
  const fixedDate = moment.tz(arr, 'America/Los_Angeles');
  return fixedDate.tz(moment.tz.guess()).format(format);
};

const LocalTime = props => {
  const { date, format } = props;
  return <React.Fragment>{formatDate(date, format)}</React.Fragment>;
};

LocalTime.propTypes = {
  date: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
};

export default LocalTime;
