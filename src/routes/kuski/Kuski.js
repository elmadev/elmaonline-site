import React from 'react';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import kuskiQuery from './kuski.graphql';
import battlesQuery from './battles.graphql';
import Link from '../../components/Link';
import Time from '../../components/Time';
import Loading from '../../components/Loading';
import Flag from '../../components/Flag';
import LocalTime from '../../components/LocalTime';
import s from './Kuski.css';

const RecentBattles = compose(
  withStyles(s),
  graphql(battlesQuery, {
    options: ownProps => ({
      variables: {
        KuskiIndex: ownProps.KuskiIndex,
      },
    }),
  }),
)(props => {
  if (!props.data.getBattlesByKuski) return <Loading />;

  return props.data.getBattlesByKuski.map(b => (
    <Link to={`/battles/${b.BattleIndex}`} key={b.BattleIndex}>
      <span>{b.LevelData && b.LevelData.LevelName}</span>
      <span>{b.KuskiData.Kuski}</span>
      <span>{b.Results.length > 0 ? b.Results[0].KuskiData.Kuski : null}</span>
      <span>
        {b.Results.length > 0 ? <Time time={b.Results[0].Time} /> : null}
      </span>
      <span>
        {b.Results.findIndex(r => r.KuskiIndex === props.KuskiIndex) + 1}
      </span>
      <span>
        <LocalTime date={b.Started} format="DD.MM.YYYY HH:mm:ss" parse="X" />
      </span>
    </Link>
  ));
});

class Kuski extends React.Component {
  render() {
    const { data: { getKuskiByName, loading } } = this.props;

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
          <div style={{ alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
            <div className={s.statsContainer}>
              <div>_42:31:09</div>
              <div className={s.statsTitle}>total time</div>
            </div>
            <div className={s.statsContainer}>
              <div>_2874</div>
              <div className={s.statsTitle}>battles played</div>
            </div>
            <div className={s.statsContainer}>
              <div>_345</div>
              <div className={s.statsTitle}>battles won</div>
            </div>
          </div>
        </div>
        <h2>Latest battles</h2>
        <div style={{ maxWidth: '100%', overflow: 'auto' }}>
          <div className={s.recentBattles}>
            <div className={s.recentBattlesHead}>
              <span>Level</span>
              <span>Designer</span>
              <span>Winner</span>
              <span>Time</span>
              <span>Placement</span>
              <span>Started</span>
            </div>
            <RecentBattles KuskiIndex={getKuskiByName.KuskiIndex} />
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
