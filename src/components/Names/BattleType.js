import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class BattleType extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    lower: PropTypes.bool,
  };

  static defaultProps = {
    lower: false,
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

    const { type, lower } = this.props;
    return <TypeSpan lower={lower}>{types[type]}</TypeSpan>;
  }
}

const TypeSpan = styled.span`
  text-transform: ${p => (p.lower ? 'lowercase' : 'none')};
`;

export default BattleType;
