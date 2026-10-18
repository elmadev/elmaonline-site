import { TextField } from '@mui/material';

type FieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> & {
  label: string;
  date?: boolean;
  error?: string;
  value?: string | number;
};

export default function Field({
  date,
  label,
  error,
  value,
  ...props
}: FieldProps) {
  return (
    <div>
      <TextField
        id={label.replace(' ', '')}
        label={label}
        margin="normal"
        variant="outlined"
        fullWidth
        inputProps={{ ...props }}
        error={Boolean(error)}
        helperText={error}
        value={value}
        InputLabelProps={{ shrink: value !== '' }}
        type={date ? 'date' : 'text'}
      />
    </div>
  );
}
