import React from 'react';
import PropTypes from 'prop-types';
import { toLocalTime } from 'utils';

const formatDate = (date, format, parse) =>
  toLocalTime(date, parse).format(format);

const LocalTime = props => {
  const { date, format, parse } = props;
  if (parseInt(date, 10) === 0) return <React.Fragment />;
  return <React.Fragment>{formatDate(date, format, parse)}</React.Fragment>;
};

LocalTime.propTypes = {
  date: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  parse: PropTypes.string.isRequired,
};

export default LocalTime;
