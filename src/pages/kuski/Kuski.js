import React from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Flag from 'components/Flag';
import ReplaysBy from 'components/ReplaysBy';

import PlayedBattles from './PlayedBattles';
import KuskiHeader from './KuskiHeader';
import kuskiQuery from './kuski.graphql';
import s from './Kuski.css';

class Kuski extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
  }

  render() {
    const {
      data: { getKuskiByName, loading },
    } = this.props;
    const { tab } = this.state;

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
        <Tabs value={tab} onChange={(e, t) => this.setState({ tab: t })}>
          <Tab label="Played Battles" />
          <Tab label="Replays Uploaded" />
          <Tab label="Replays Driven" />
        </Tabs>
        {tab === 0 && (
          <div style={{ maxWidth: '100%', overflow: 'auto' }}>
            <div className={s.recentBattles}>
              <PlayedBattles KuskiIndex={getKuskiByName.KuskiIndex} />
            </div>
          </div>
        )}
        {tab === 1 && (
          <div style={{ maxWidth: '100%', overflow: 'auto' }}>
            <div className={s.recentBattles}>
              <ReplaysBy
                type="uploaded"
                KuskiIndex={getKuskiByName.KuskiIndex}
              />
            </div>
          </div>
        )}
        {tab === 2 && (
          <div style={{ maxWidth: '100%', overflow: 'auto' }}>
            <div className={s.recentBattles}>
              <ReplaysBy type="driven" KuskiIndex={getKuskiByName.KuskiIndex} />
            </div>
          </div>
        )}
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
