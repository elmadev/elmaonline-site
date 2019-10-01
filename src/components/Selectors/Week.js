import React from 'react';
import PropTypes from 'prop-types';
import m from 'moment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';

class Week extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      week: m().format('w'),
    };
  }

  updateWeek(week) {
    const { weekUpdated } = this.props;
    this.setState({ week });
    weekUpdated(week);
  }

  render() {
    const weeks = [];
    for (let y = 1; y <= 54; y += 1) {
      weeks.push(y);
    }
    const { week } = this.state;

    return (
      <>
        <Icon
          onClick={() => this.updateWeek(week - 1)}
          style={{
            fontSize: 36,
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
          }}
        >
          chevron_left
        </Icon>
        <FormControl>
          <InputLabel htmlFor="week-simple">Week</InputLabel>
          <Select
            value={week}
            onChange={e => this.updateWeek(e.target.value)}
            inputProps={{
              name: 'week',
              id: 'week-simple',
            }}
          >
            {weeks.map(y => (
              <MenuItem value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Icon
          onClick={() => this.updateWeek(week + 1)}
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

Week.propTypes = {
  weekUpdated: PropTypes.func.isRequired,
};

export default Week;
