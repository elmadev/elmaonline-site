import React from 'react';
import styled from '@emotion/styled';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField as MuiTextField,
} from '@material-ui/core';

const Container = styled.div`
  min-width: 100px;
  margin-left: 10px;
  margin-right: 10px;
  ${p => p.width && `width: ${p.width}px;`}
`;

export const Dropdown = ({
  name,
  options,
  selected,
  update,
  className,
  multiple,
  width,
}) => {
  const id = name.replace(/\s/g, '');
  return (
    <Container width={width} className={className}>
      <FormControl fullWidth>
        <InputLabel htmlFor={id}>{name}</InputLabel>
        <Select
          value={selected}
          onChange={e => update(e.target.value)}
          inputProps={{
            name: id,
            id,
          }}
          multiple={!!multiple}
        >
          {options.map(y => {
            let val = y;
            let text = y;
            if (Array.isArray(y)) {
              return (
                <MenuItem key={y[0]} value={y[0]}>
                  {y[1]}
                </MenuItem>
              );
            }
            if (typeof y === 'string') {
              return <MenuItem key={val} value={val}>{`${text}`}</MenuItem>;
            }
            return (
              <MenuItem key={val.id} value={val.id}>
                {text.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Container>
  );
};

export const TextField = ({
  name,
  error,
  date,
  value,
  onChange,
  multiline = false,
  className,
}) => {
  const id = name.replace(/\s/g, '');
  let isError = false;
  if (error) {
    isError = true;
  }

  return (
    <Container className={className}>
      <MuiTextField
        id={id}
        label={name}
        margin="normal"
        variant="outlined"
        fullWidth
        error={isError}
        helperText={error}
        type={date ? 'date' : 'text'}
        onChange={e => onChange(e.target.value)}
        value={value}
        multiline={multiline}
      />
    </Container>
  );
};
