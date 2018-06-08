import React from 'react';
import PropTypes from 'prop-types';

class BattleType extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
  };

  render() {
    const types = {
      NM: 'Normal',
      FF: 'First Finish',
      OL: 'One Life',
      SL: 'Slowness',
      SR: 'Survivor',
      FT: 'Flag Tag',
      AP: 'Apple',
      SP: 'Speed',
      LC: 'Last Counts',
      FC: 'Finish Count',
      HT: '1 Hour TT',
    };

    let { type } = this.props;
    type = types[type];
    return <span>{type}</span>;
  }
}

export default BattleType;
