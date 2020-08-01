/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
