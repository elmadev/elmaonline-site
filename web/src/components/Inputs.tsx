import styled from '@emotion/styled';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField as MuiTextField,
} from '@mui/material';

const Container = styled.div<{ width?: number }>`
  min-width: 100px;
  margin-left: 10px;
  margin-right: 10px;
  ${p => p.width && `width: ${p.width}px;`}
`;

type OptionValue = string | number;

type DropdownOption =
  | string
  | [OptionValue, React.ReactNode]
  | { id: OptionValue; name: React.ReactNode };

type DropdownProps = {
  name: string;
  options: DropdownOption[];
  selected: OptionValue | OptionValue[];
  update: (value: OptionValue | OptionValue[]) => void;
  className?: string;
  multiple?: boolean;
  width?: number;
};

export const Dropdown = ({
  name,
  options,
  selected,
  update,
  className,
  multiple,
  width,
}: DropdownProps) => {
  const id = name.replace(/\s/g, '');
  return (
    <Container width={width} className={className}>
      <FormControl variant="standard" fullWidth>
        <InputLabel htmlFor={id}>{name}</InputLabel>
        <Select
          variant="standard"
          value={selected}
          onChange={e => update(e.target.value)}
          inputProps={{
            name: id,
            id,
          }}
          multiple={!!multiple}
        >
          {options.map(y => {
            if (Array.isArray(y)) {
              return (
                <MenuItem key={y[0]} value={y[0]}>
                  {y[1]}
                </MenuItem>
              );
            }
            if (typeof y === 'string') {
              return (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              );
            }
            return (
              <MenuItem key={y.id} value={y.id}>
                {y.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Container>
  );
};

type TextFieldProps = {
  name: string;
  error?: string;
  date?: boolean;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
};

export const TextField = ({
  name,
  error,
  date,
  value,
  onChange,
  multiline = false,
  className,
}: TextFieldProps) => {
  const id = name.replace(/\s/g, '');

  return (
    <Container className={className}>
      <MuiTextField
        id={id}
        label={name}
        margin="normal"
        variant="outlined"
        fullWidth
        error={Boolean(error)}
        helperText={error}
        type={date ? 'date' : 'text'}
        onChange={e => onChange(e.target.value)}
        value={value}
        multiline={multiline}
      />
    </Container>
  );
};
