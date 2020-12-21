/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { TextField, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function FieldAutoComplete({
  label,
  error,
  list,
  getOptions,
  valueSelected,
  margin,
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  let isError = false;
  if (error) {
    isError = true;
  }

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    if (list.length > 0) {
      setOptions(list);
    }
  }, [list]);

  const onEnter = async v => {
    if (v === '') {
      setOptions([]);
    } else {
      getOptions(v);
    }
  };

  return (
    <div>
      <Autocomplete
        id={label.replace(' ', '')}
        style={{ width: 300 }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        getOptionSelected={(option, v) => option.name === v.name}
        getOptionLabel={option => option.name}
        options={options}
        loading={loading}
        onChange={(e, v, r) => {
          if (r === 'select-option') {
            valueSelected(v.value);
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            onKeyPress={ev => {
              if (ev.key === 'Enter') {
                onEnter(ev.target.value);
              }
            }}
            variant="outlined"
            margin={margin || 'normal'}
            fullWidth
            error={isError}
            helperText={error}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  );
}
