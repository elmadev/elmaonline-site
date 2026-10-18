import { useState, useEffect } from 'react';
import { TextField, CircularProgress } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

type OptionValue = string | number;

export type FieldAutoCompleteOption = {
  name: string;
  value: OptionValue;
};

type FieldAutoCompleteProps = {
  label: string;
  error?: string;
  list: FieldAutoCompleteOption[];
  getOptions: (search: string) => void;
  valueSelected: (value: OptionValue) => void;
  margin?: TextFieldProps['margin'];
};

export default function FieldAutoComplete({
  label,
  error,
  list,
  getOptions,
  valueSelected,
  margin = 'normal',
}: FieldAutoCompleteProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<FieldAutoCompleteOption[]>([]);
  const loading = open && options.length === 0;

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

  const onEnter = (v: string) => {
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
        isOptionEqualToValue={(option, v) => option.name === v.name}
        getOptionLabel={option => option.name}
        options={options}
        loading={loading}
        onChange={(_e, v, r) => {
          if (r === 'selectOption' && v) {
            valueSelected(v.value);
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            onKeyPress={ev => {
              if (ev.key === 'Enter' && ev.target instanceof HTMLInputElement) {
                onEnter(ev.target.value);
              }
            }}
            variant="outlined"
            margin={margin}
            fullWidth
            error={Boolean(error)}
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
