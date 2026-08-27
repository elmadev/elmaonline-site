import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import styled from '@emotion/styled';

const CrippledSelect = ({ level, cripple, setCripple, tab, setTab }) => {
  return (
    <CrippledSelectWrapper topMargin={level.Locked}>
      <FormControl>
        <InputLabel id="cripple">Crippled Condition</InputLabel>
        <Select
          id="cripple"
          value={cripple || 'none'}
          onChange={e => {
            setCripple(e.target.value === 'none' ? '' : e.target.value);

            if (tab === 'eol-times' && e.target.value) {
              setTab('best-times');
            }
          }}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="noVolt">No Volt</MenuItem>
          <MenuItem value="noTurn">No Turn</MenuItem>
          <MenuItem value="oneTurn">One Turn</MenuItem>
          <MenuItem value="noBrake">No Brake</MenuItem>
          <MenuItem value="noThrottle">No Throttle</MenuItem>
          <MenuItem value="alwaysThrottle">Always Throttle</MenuItem>
          <MenuItem value="oneWheel">One Wheel</MenuItem>
          <MenuItem value="drunk">Drunk</MenuItem>
        </Select>
      </FormControl>
    </CrippledSelectWrapper>
  );
};

const CrippledSelectWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${p => (p.topMargin ? '-12px' : '-22px')};
  margin-bottom: 12px;
  .MuiFormControl-root {
    min-width: 180px;
  }
  @media screen and (max-width: 1100px) {
    margin-top: 0;
  }
`;

export default CrippledSelect;
