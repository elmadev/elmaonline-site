import React from 'react';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const Flag = ({ nationality }) => (
  <span className={`fi fi-${nationality.toLowerCase()}`} />
);

export default Flag;
