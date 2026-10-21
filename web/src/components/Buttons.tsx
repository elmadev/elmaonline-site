import { Button as MuiButton } from '@mui/material';
import type { ButtonProps as MuiButtonProps } from '@mui/material';
import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import {
  Map,
  PlayArrow,
  Settings,
  FilterList,
  Close,
  Refresh,
} from '@mui/icons-material';

type StyledButtonProps = {
  margin?: string;
  little: boolean;
  right: boolean;
  isLink: boolean;
};

const styledProps = ['margin', 'little', 'right', 'isLink'];

const StyledButton = styled(MuiButton, {
  shouldForwardProp: prop => !styledProps.includes(prop),
})<StyledButtonProps>`
  && {
    ${p => p.margin && `margin: ${p.margin};`}
    ${p => p.little && 'font-size: 0.8125rem;'}
    ${p => p.right && `margin-right: ${p.theme.padXXSmall};`}
    padding: ${p =>
      p.little
        ? `${p.isLink ? 0 : p.theme.padXXSmall} ${p.isLink ? 0 : p.theme.padXXSmall}`
        : `${p.isLink ? 0 : p.theme.padXSmall} ${p.isLink ? 0 : p.theme.padMedium}`};
    a {
      display: block;
      padding: ${p =>
        p.little
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

type ButtonProps = {
  children: React.ReactNode;
  /** use this to execute some js function */
  onClick?: () => void;
  margin?: string;
  disabled?: boolean;
  secondary?: boolean;
  naked?: boolean;
  little?: boolean;
  /** use this to create a normal link */
  to?: string;
  right?: boolean;
  icon?: keyof typeof icons;
};

const Button = ({
  children,
  onClick,
  margin,
  disabled,
  secondary = false,
  naked = false,
  little = false,
  to,
  right = false,
  icon,
}: ButtonProps) => {
  let color: MuiButtonProps['color'] = secondary ? 'secondary' : 'primary';
  let variant: MuiButtonProps['variant'] = 'contained';
  if (naked) {
    color = 'inherit';
    variant = 'text';
  }
  const Icon = icon ? icons[icon] : null;
  return (
    <StyledButton
      right={right}
      disabled={disabled}
      margin={margin}
      variant={variant}
      color={color}
      little={little}
      onClick={() => onClick && onClick()}
      isLink={Boolean(to)}
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
