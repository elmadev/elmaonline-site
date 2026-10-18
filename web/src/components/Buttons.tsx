import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import {
  Map,
  PlayArrow,
  Settings,
  FilterList,
  Close,
  Refresh,
} from '@material-ui/icons';

const StyledButton = styled(MuiButton)`
  && {
    ${p => p.margin && `margin: ${p.margin};`}
    ${p => p.little === 1 && 'font-size: 0.8125rem;'}
    ${p => p.right === 1 && `margin-right: ${p.theme.padXXSmall};`}
    padding: ${p =>
      p.little === 1
        ? `${p.to ? 0 : p.theme.padXXSmall} ${p.to ? 0 : p.theme.padXXSmall}`
        : `${p.to ? 0 : p.theme.padXSmall} ${p.to ? 0 : p.theme.padMedium}`};
    a {
      display: block;
      padding: ${p =>
        p.little === 1
          ? `${p.theme.padXXSmall} ${p.theme.padXXSmall}`
          : `${p.theme.padXSmall} ${p.theme.padMedium}`};
    }
    svg {
      margin-right: 8px;
    }
  }
`;

const icons = {
  level: Map,
  replay: PlayArrow,
  settings: Settings,
  filter: FilterList,
  close: Close,
  refresh: Refresh,
};

const Button = ({
  children,
  onClick, // use this to execute some js function
  margin,
  disabled,
  secondary,
  naked,
  little,
  to, // use this to create a normal link
  right,
  icon,
}) => {
  let color = 'primary';
  let variant = 'contained';
  if (secondary) {
    color = 'secondary';
  }
  if (naked) {
    color = 'default';
    variant = 'text';
  }
  let Icon = null;
  if (icon) {
    if (icons[icon]) {
      Icon = icons[icon];
    }
  }
  return (
    <StyledButton
      right={right ? 1 : 0}
      disabled={disabled}
      margin={margin}
      variant={variant}
      color={color}
      little={little ? 1 : 0}
      onClick={() => onClick && onClick()}
      to={to}
    >
      {to ? (
        <Link to={to}>{children}</Link>
      ) : (
        <>
          {Icon && <Icon />}
          {children}
        </>
      )}
    </StyledButton>
  );
};

export default Button;
