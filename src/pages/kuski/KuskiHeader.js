import React from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

import rankingQuery from './ranking.graphql';
import s from './Ranking.css';

class KuskiHeader extends React.Component {
  render() {
    const {
      data: { getKinglistByKuski },
    } = this.props;
    return (
      <div style={{ alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
        <div className={s.statsContainer}>
          <div className={s.lineThrough}>_42:31:09</div>
          <div className={s.statsTitle}>total time</div>
        </div>
        <div className={s.statsContainer}>
          <div>
            _{getKinglistByKuski[0] ? getKinglistByKuski[0].PlayedAll : '0'}
          </div>
          <div className={s.statsTitle}>battles played</div>
        </div>
        <div className={s.statsContainer}>
          <div>
            _{getKinglistByKuski[0] ? getKinglistByKuski[0].WinsAll : '0'}
          </div>
          <div className={s.statsTitle}>battles won</div>
        </div>
      </div>
    );
  }
}

KuskiHeader.propTypes = {
  data: PropTypes.shape({
    getKinglistByKuski: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default compose(
  withStyles(s),
  graphql(rankingQuery, {
    options: ownProps => ({
      variables: {
        KuskiIndex: ownProps.KuskiIndex,
      },
    }),
  }),
)(KuskiHeader);
