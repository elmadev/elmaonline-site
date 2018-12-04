import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import kuskiQuery from './kuski.graphql';

class Kuski extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getKuskiById: PropTypes.shape({
        Kuski: PropTypes.string,
        Country: PropTypes.string,
        TeamIndex: PropTypes.integer,
      }),
    }).isRequired,
  };

  render() {
    const { data: { getKuskiById, variables } } = this.props;
    return (
      <span>{getKuskiById ? getKuskiById.Kuski : variables.KuskiIndex}</span>
    );
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
