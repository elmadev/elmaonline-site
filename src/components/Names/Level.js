import React from 'react';
import PropTypes from 'prop-types';

const formatLevel = level => {
  if (
    level.substring(0, 6) === 'QWQUU0' &&
    parseInt(level.substring(6, 8), 10) <= 55
  ) {
    return `Internal ${level.substring(6, 8)}`;
  }
  return level;
};

class Level extends React.Component {
  static propTypes = {
    long: PropTypes.bool,
    LevelData: PropTypes.shape({
      LevelName: PropTypes.string,
      LongName: PropTypes.string,
    }),
  };

  static defaultProps = {
    long: false,
    LevelData: null,
  };

  render() {
    const { LevelData, long } = this.props;
    return (
      <>
        {long && LevelData && LevelData.LongName}
        {!long && LevelData && formatLevel(LevelData.LevelName)}
        {!LevelData && 'Unknown'}
      </>
    );
  }
}

export default Level;
