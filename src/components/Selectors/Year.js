import React from 'react';
import PropTypes from 'prop-types';
import m from 'moment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';

const minYear = 2010;
const maxYear = parseInt(m().format('YYYY'), 10);

class Year extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: 2010,
    };
  }

  updateYear(yearUpdate) {
    const { yearUpdated } = this.props;
    const { year } = this.state;
    let newYear = yearUpdate;
    if (yearUpdate < minYear) {
      newYear = minYear;
    }
    if (yearUpdate > maxYear) {
      newYear = maxYear;
    }
    if (newYear !== year) {
      this.setState({ year: newYear });
      yearUpdated(newYear);
    }
  }

  render() {
    const years = [];
    for (let y = 2010; y <= maxYear; y += 1) {
      years.push(y);
    }
    const { year } = this.state;

    return (
      <React.Fragment>
        <Icon
          onClick={() => this.updateYear(year - 1)}
          style={{
            fontSize: 36,
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
          }}
        >
          chevron_left
        </Icon>
        <FormControl>
          <InputLabel htmlFor="year-simple">Year</InputLabel>
          <Select
            value={year}
            onChange={e => this.updateYear(e.target.value)}
            inputProps={{
              name: 'year',
              id: 'year-simple',
            }}
          >
            {years.map(y => (
              <MenuItem value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Icon
          onClick={() => this.updateYear(year + 1)}
          style={{
            fontSize: 36,
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
          }}
        >
          chevron_right
        </Icon>
      </React.Fragment>
    );
  }
}

Year.propTypes = {
  yearUpdated: PropTypes.func.isRequired,
};

export default Year;
