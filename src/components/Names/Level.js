import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import levelQuery from './level.graphql';

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
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getLevel: PropTypes.shape({
        LevelName: PropTypes.string,
        LongName: PropTypes.string,
      }),
    }).isRequired,
  };

  static defaultProps = {
    long: false,
  };

  render() {
    const {
      data: { getLevel, variables },
      long,
    } = this.props;
    return (
      <React.Fragment>
        {long && getLevel && getLevel.LongName}
        {!long && getLevel && formatLevel(getLevel.LevelName)}
        {!long && !getLevel && variables.LevelIndex}
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(levelQuery, {
    options: ownProps => ({
      variables: {
        LevelIndex: ownProps.index,
      },
    }),
  }),
)(Level);
