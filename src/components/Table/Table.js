import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

class Kuski extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getKuskiById: PropTypes.shape({
        Kuski: PropTypes.string,
        Country: PropTypes.string,
        TeamIndex: PropTypes.number,
      }),
    }).isRequired,
  };

  render() {
    const {
      data: { getKuskiById, variables },
    } = this.props;
    const id = variables.KuskiIndex === 0 ? 'Unknown' : variables.KuskiIndex;
    return <span>{getKuskiById ? getKuskiById.Kuski : id}</span>;
  }
}

export default compose()(Kuski);
