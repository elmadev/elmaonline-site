import React from 'react';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import PropTypes from 'prop-types';

const Flag = ({ nationality }) => (
  <span className={`fi fi-${nationality.toLowerCase()}`} />
);

Flag.propTypes = {
  nationality: PropTypes.string.isRequired,
};

export default Flag;
