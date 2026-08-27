import React from 'react';
import PropTypes from 'prop-types';
import { toLocalTime } from 'utils/time';
import { format as dateFormat } from 'date-fns';

const formatDate = (date, format, parse) =>
  dateFormat(toLocalTime(date, parse), format);

const LocalTime = props => {
  const { date, format, parse } = props;
  if (date === 'Invalid date') return <></>;
  if (parseInt(date, 10) === 0) return <></>;
  const fixedParse = parse === 'X' ? 't' : parse;
  return <>{formatDate(date, format, fixedParse)}</>;
};

LocalTime.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  format: PropTypes.string.isRequired,
  parse: PropTypes.string.isRequired,
};

export default LocalTime;
