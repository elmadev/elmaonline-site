import React from 'react';
import { TextField } from '@material-ui/core';

export default function Field({ date, label, error, value, ...props }) {
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
        value={value}
        InputLabelProps={{ shrink: value === '' ? false : true }}
        type={date ? 'date' : 'text'}
      />
    </div>
  );
}
