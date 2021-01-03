import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';

const values = [1, 2, 5, 10, 25, 50, 100];

class MinPlayed extends React.Component {
  updateMin(change) {
    const { isUpdated, min } = this.props;
    let newMin = values.indexOf(min) + change;
    if (newMin < 0) {
      newMin = values.length - 1;
    }
    if (newMin >= values.length) {
      newMin = 0;
    }
    isUpdated(values[newMin]);
  }

  render() {
    const { isUpdated, min } = this.props;

    return (
      <>
        <Icon
          onClick={() => this.updateMin(-1)}
          style={{
            fontSize: 36,
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
          }}
        >
          chevron_left
        </Icon>
        <FormControl>
          <InputLabel htmlFor="min-simple">Min. Played</InputLabel>
          <Select
            style={{ minWidth: '100px' }}
            value={min}
            onChange={e => {
              isUpdated(e.target.value);
            }}
            inputProps={{
              name: 'min',
              id: 'min-simple',
            }}
          >
            {values.map(y => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Icon
          onClick={() => this.updateMin(1)}
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

MinPlayed.propTypes = {
  isUpdated: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
};

export default MinPlayed;
