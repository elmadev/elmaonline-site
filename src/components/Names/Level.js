import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import levelQuery from './level.graphql';

class Level extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getLevel: PropTypes.shape({
        LevelName: PropTypes.string,
      }),
    }).isRequired,
  };

  render() {
    const {
      data: { getLevel, variables },
    } = this.props;
    return <span>{getLevel ? getLevel.LevelName : variables.LevelIndex}</span>;
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
