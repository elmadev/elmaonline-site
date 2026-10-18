import { useTheme } from '@emotion/react';
import { Select, MenuItem, InputLabel, FormControl, Icon } from '@mui/material';
import { stripSpace } from 'utils/misc';

type SelectorValue = string | number;

type SelectorProps = {
  label: string;
  options: { id: SelectorValue; name: React.ReactNode }[];
  selected: SelectorValue;
  onChange: (value: SelectorValue) => void;
};

const Selector = ({ label, options, selected, onChange }: SelectorProps) => {
  const theme = useTheme();

  const update = (s: SelectorValue) => {
    let newSelected = s;
    const currentIndex = options.findIndex(o => o.id === selected);
    if (s === 'prev') {
      if (currentIndex - 1 >= 0) {
        newSelected = options[currentIndex - 1].id;
      } else {
        newSelected = selected;
      }
    }
    if (s === 'next') {
      if (currentIndex + 1 < options.length) {
        newSelected = options[currentIndex + 1].id;
      } else {
        newSelected = selected;
      }
    }
    onChange(newSelected);
  };

  return (
    <>
      <Icon
        onClick={() => update('prev')}
        style={{
          fontSize: 36,
          cursor: 'pointer',
          color: theme.lightTextColor,
        }}
      >
        chevron_left
      </Icon>
      <FormControl variant="standard">
        <InputLabel htmlFor="type-simple">{label}</InputLabel>
        <Select
          variant="standard"
          value={selected}
          onChange={e => update(e.target.value)}
          inputProps={{
            name: stripSpace(label),
            id: 'type-simple',
          }}
          style={{ minWidth: '130px' }}
        >
          {options.map(y => (
            <MenuItem key={y.id} value={y.id}>
              {y.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Icon
        onClick={() => update('next')}
        style={{
          fontSize: 36,
          cursor: 'pointer',
          color: theme.lightTextColor,
        }}
      >
        chevron_right
      </Icon>
    </>
  );
};

export default Selector;
