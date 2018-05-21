import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import kuskiQuery from './kuski.graphql';

class Kuski extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getKuski: PropTypes.shape({
        Kuski: PropTypes.string,
        Country: PropTypes.string,
        TeamIndex: PropTypes.integer,
      }),
    }).isRequired,
  };

  render() {
    const {
      data: { getKuski, variables },
    } = this.props;
    return <span>{getKuski ? getKuski.Kuski : variables.KuskiIndex}</span>;
  }
}

export default compose(
  graphql(kuskiQuery, {
    options: ownProps => ({
      variables: {
        KuskiIndex: ownProps.index,
      },
    }),
  }),
)(Kuski);
