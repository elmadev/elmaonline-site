import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Icon from '@material-ui/core/Icon';
import { BATTLETYPES, BATTLETYPES_LONG } from '../../constants/ranking';

const periodTypes = ['all', 'year', 'month', 'week', 'day'];

class BattleTypes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'All',
    };
  }

  updateType(selectedType) {
    const { typeUpdated, periodType } = this.props;
    const { type } = this.state;
    const types = BATTLETYPES[periodTypes[periodType]];
    let newType = selectedType;
    const current = types.indexOf(type);
    if (selectedType === -1) {
      if (current - 1 >= 0) {
        newType = types[current - 1];
      } else {
        newType = type;
      }
    }
    if (selectedType === 1) {
      if (current + 1 < types.length) {
        newType = types[current + 1];
      } else {
        newType = type;
      }
    }
    this.setState({ type: newType });
    typeUpdated(newType);
  }

  render() {
    const { type } = this.state;
    const { periodType } = this.props;
    const types = BATTLETYPES[periodTypes[periodType]];

    return (
      <>
        <Icon
          onClick={() => this.updateType(-1)}
          style={{
            fontSize: 36,
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
          }}
        >
          chevron_left
        </Icon>
        <FormControl>
          <InputLabel htmlFor="type-simple">Battle Type</InputLabel>
          <Select
            value={type}
            onChange={e => this.updateType(e.target.value)}
            inputProps={{
              name: 'type',
              id: 'type-simple',
            }}
            style={{ minWidth: '130px' }}
          >
            {types.map(y => (
              <MenuItem key={y} value={y}>
                {BATTLETYPES_LONG[y]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Icon
          onClick={() => this.updateType(1)}
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

BattleTypes.propTypes = {
  typeUpdated: PropTypes.func.isRequired,
  periodType: PropTypes.number.isRequired,
};

export default BattleTypes;
