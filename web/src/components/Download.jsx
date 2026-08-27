import React from 'react';
import config from 'config';

const Download = ({ href, children }) => {
  return <a href={`${config.dlUrl}${href}`}>{children}</a>;
};

export default Download;
