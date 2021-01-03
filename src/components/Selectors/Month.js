import React from 'react';
import PropTypes from 'prop-types';
import m from 'moment';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Icon,
} from '@material-ui/core';

const monthsVisual = {
  '1': 'January',
  '2': 'February',
  '3': 'March',
  '4': 'April',
  '5': 'May',
  '6': 'June',
  '7': 'July',
  '8': 'August',
  '9': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
};

class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      month: m().format('M'),
    };
  }

  updateMonth(month) {
    const { monthUpdated } = this.props;
    this.setState({ month });
    monthUpdated(month);
  }

  render() {
    const months = [];
    for (let y = 1; y <= 12; y += 1) {
      months.push(y);
    }
    const { month } = this.state;

    return (
      <>
        <Icon
          onClick={() => this.updateMonth(month - 1)}
          style={{
            fontSize: 36,
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
          }}
        >
          chevron_left
        </Icon>
        <FormControl>
          <InputLabel htmlFor="month-simple">Month</InputLabel>
          <Select
            value={month}
            onChange={e => this.updateMonth(e.target.value)}
            inputProps={{
              name: 'month',
              id: 'month-simple',
            }}
          >
            {months.map(y => (
              <MenuItem key={y} value={y}>
                {monthsVisual[y]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Icon
          onClick={() => this.updateMonth(month + 1)}
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

Month.propTypes = {
  monthUpdated: PropTypes.func.isRequired,
};

export default Month;
