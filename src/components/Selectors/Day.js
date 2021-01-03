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

class Day extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: m().format('D'),
    };
  }

  updateDay(day) {
    const { dayUpdated } = this.props;
    this.setState({ day });
    dayUpdated(day);
  }

  render() {
    const days = [];
    for (let y = 1; y <= 31; y += 1) {
      days.push(y);
    }
    const { day } = this.state;

    return (
      <>
        <Icon
          onClick={() => this.updateDay(day - 1)}
          style={{
            fontSize: 36,
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
          }}
        >
          chevron_left
        </Icon>
        <FormControl>
          <InputLabel htmlFor="day-simple">Day</InputLabel>
          <Select
            value={day}
            onChange={e => this.updateDay(e.target.value)}
            inputProps={{
              name: 'day',
              id: 'day-simple',
            }}
          >
            {days.map(y => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Icon
          onClick={() => this.updateDay(day + 1)}
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
  dayUpdated: PropTypes.func.isRequired,
};

export default Day;
