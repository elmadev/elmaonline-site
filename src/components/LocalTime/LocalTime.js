import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

const formatDate = (date, format, parse) => {
  const fixedDate = moment.tz(
    moment(date, parse)
      .utc()
      .toObject(),
    'America/Los_Angeles',
  );
  return fixedDate.tz(moment.tz.guess()).format(format);
};

const LocalTime = props => {
  const { date, format, parse } = props;
  return <React.Fragment>{formatDate(date, format, parse)}</React.Fragment>;
};

LocalTime.propTypes = {
  date: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  parse: PropTypes.string.isRequired,
};

export default LocalTime;
