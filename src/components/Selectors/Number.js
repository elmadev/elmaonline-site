import React from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Icon,
} from '@material-ui/core';

class Day extends React.Component {
  update(number) {
    const { updated, numbers } = this.props;
    let newNumber = number;
    if (number < Math.min(...numbers)) {
      newNumber = 0;
    }
    if (number > Math.max(...numbers)) {
      newNumber = Math.max(...numbers);
    }
    updated(newNumber);
  }

  render() {
    const { numbers, name, number } = this.props;

    return (
      <>
        <Icon
          onClick={() => this.update(number - 1)}
          style={{
            fontSize: 36,
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
          }}
        >
          chevron_left
        </Icon>
        <FormControl>
          <InputLabel htmlFor="day-simple">{name}</InputLabel>
          <Select
            value={number}
            onChange={e => this.update(e.target.value)}
            inputProps={{
              name: 'day',
              id: 'day-simple',
            }}
          >
            {numbers.map(y => (
              <MenuItem key={y} value={y}>{`${y}`}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Icon
          onClick={() => this.update(number + 1)}
          style={{
            fontSize: 36,
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
          }}
        >
          chevron_right
        </Icon>
      </>
    );
  }
}

Day.propTypes = {
  updated: PropTypes.func.isRequired,
  numbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  name: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
};

export default Day;
