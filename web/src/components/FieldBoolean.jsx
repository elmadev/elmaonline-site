import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import styled from '@emotion/styled';

export default function FieldBoolean({
  onChange,
  value,
  label,
  size = 'medium',
}) {
  return (
    <div>
      <StyledFormControlLabel
        size={size}
        control={
          <Checkbox
            size={size}
            checked={value}
            onChange={() => onChange && onChange()}
          />
        }
        label={label}
      />
    </div>
  );
}

const StyledFormControlLabel = styled(FormControlLabel)`
  span {
    font-size: ${p => (p.size === 'small' ? '14px' : 'initial')};
  }
`;
