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
    let playedAll = 0;
    let winsAll = 0;
    if (getKinglistByKuski) {
      if (getKinglistByKuski[0]) {
        playedAll = getKinglistByKuski[0].PlayedAll;
        winsAll = getKinglistByKuski[0].WinsAll;
      }
    }
    return (
      <div style={{ alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
        <div className={s.statsContainer}>
          <div className={s.lineThrough}>_42:31:09</div>
          <div className={s.statsTitle}>total time</div>
        </div>
        <div className={s.statsContainer}>
          <div>_{playedAll}</div>
          <div className={s.statsTitle}>battles played</div>
        </div>
        <div className={s.statsContainer}>
          <div>_{winsAll}</div>
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
