import React from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';

import Flag from 'components/Flag';

import PlayedBattles from './PlayedBattles';
import KuskiHeader from './KuskiHeader';
import kuskiQuery from './kuski.graphql';
import s from './Kuski.css';

class Kuski extends React.Component {
  render() {
    const {
      data: { getKuskiByName, loading },
    } = this.props;

    if (loading) return null;
    if (!getKuskiByName) return <div>not found</div>;

    return (
      <div className={s.kuski}>
        <div className={s.head}>
          <div className={s.picture}>
            <img
              src={`http://elmaonline.net/images/shirt/${
                getKuskiByName.KuskiIndex
              }`}
              alt="shirt"
            />
          </div>
          <div className={s.profile}>
            <div className={s.name}>
              <Flag nationality={getKuskiByName.Country} />
              {getKuskiByName.Kuski}
            </div>
            <div className={s.teamNat}>
              {getKuskiByName.TeamData &&
                `Team: ${getKuskiByName.TeamData.Team}`}
            </div>
          </div>
          <KuskiHeader KuskiIndex={getKuskiByName.KuskiIndex} />
        </div>
        <h2>Played battles</h2>
        <div style={{ maxWidth: '100%', overflow: 'auto' }}>
          <div className={s.recentBattles}>
            <PlayedBattles KuskiIndex={getKuskiByName.KuskiIndex} />
          </div>
        </div>
      </div>
    );
  }
}
Kuski.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    getKuskiByName: PropTypes.shape.isRequired,
  }).isRequired,
};
export default compose(
  withStyles(s),
  graphql(kuskiQuery, {
    options: ownProps => ({
      variables: {
        Name: ownProps.name,
      },
    }),
  }),
)(Kuski);
