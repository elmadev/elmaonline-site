/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { TextField } from '@material-ui/core';

export default function Field({ date, id, label, error, value, ...props }) {
  let isError = false;
  if (error) {
    isError = true;
  }
  return (
    <div>
      <TextField
        id={label.replace(' ', '')}
        label={label}
        margin="normal"
        variant="outlined"
        fullWidth
        inputProps={{ ...props }}
        error={isError}
        helperText={error}
        InputLabelProps={{ shrink: value }}
        type={date ? 'date' : 'text'}
      />
    </div>
  );
}
