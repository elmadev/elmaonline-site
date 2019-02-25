import React from 'react';
import f from 'flag-icon-css/css/flag-icon.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';

const Flag = ({ nationality }) => (
  <span className={`flag-icon flag-icon-${nationality.toLowerCase()}`} />
);

Flag.propTypes = {
  nationality: PropTypes.string.isRequired,
};

export default withStyles(f)(Flag);
