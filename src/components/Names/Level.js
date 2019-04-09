import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import levelQuery from './level.graphql';

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
    const { data: { getLevel, variables }, long } = this.props;
    return (
      <React.Fragment>
        {long && getLevel && getLevel.LongName}
        {!long && getLevel ? getLevel.LevelName : variables.LevelIndex}
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
