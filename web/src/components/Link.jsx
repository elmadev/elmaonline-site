import React from 'react';
import { Link as RouterLink } from '@tanstack/react-router';

const Link = ({ to, children, ...props }) => {
  if (to.substring(0, 4) === 'http') {
    return (
      <a href={to} {...props}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink to={to} {...props}>
      {children}
    </RouterLink>
  );
};

export default Link;
