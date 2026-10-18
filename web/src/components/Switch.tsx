import styled from '@emotion/styled';
import { FormControlLabel, Switch as MUISwitch } from '@mui/material';
import type { SwitchProps as MUISwitchProps } from '@mui/material';

type SwitchProps = {
  className?: string;
  children: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: MUISwitchProps['color'];
};

const Switch = ({
  className,
  children,
  checked,
  onChange,
  color = 'primary',
}: SwitchProps) => {
  return (
    <Root className={className}>
      <FormControlLabel
        control={
          <MUISwitch
            checked={checked}
            onChange={e => {
              onChange(e.target.checked);
            }}
            color={color}
          />
        }
        label={children}
      />
    </Root>
  );
};

const Root = styled.div``;

export default Switch;
