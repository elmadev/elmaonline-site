/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';

export default function FieldBoolean({ onChange, value, label }) {
  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox checked={value} onChange={() => onChange && onChange()} />
        }
        label={label}
      />
    </div>
  );
}
