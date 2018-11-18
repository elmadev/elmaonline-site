import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { toServerTime } from 'utils';
import LocalTime from '../../components/LocalTime';
import Link from '../../components/Link';
import Time from '../../components/Time';
import Loading from '../../components/Loading';
import battlesQuery from './battles.graphql';
import s from './battlelist.css';

const BattleList = props => {
  const { data: { loading, getBattlesBetween } } = props;
  return (
    <div className={s.battleList}>
      <div className={s.battles}>
        <div className={s.listHeader}>
          <span className={s.levelFileName}>Level</span>
          <span className={s.designerName}>Designer</span>
          <span className={s.winnerKuski}>Winner</span>
          <span className={s.winnerTime}>Time</span>
          <span className={s.battleStarted}>Started</span>
          <span>&nbsp;</span>
        </div>
        {!loading &&
          getBattlesBetween.map(b => (
            <Link key={b.BattleIndex} to={`battles/${b.BattleIndex}`}>
              <span className={s.levelFileName}>
                {b.LevelData && b.LevelData.LevelName}
              </span>
              <span className={s.designerName}>{b.KuskiData.Kuski}</span>
              <span className={s.winnerKuski}>
                {b.Results.length > 0 ? b.Results[0].KuskiData.Kuski : null}
              </span>
              <span className={s.winnerTime}>
                {b.Results.length > 0 ? (
                  <Time time={b.Results[0].Time} />
                ) : null}
              </span>
              <span className={s.battleStarted}>
                <LocalTime date={b.Started} format="HH:mm:ss" parse="X" />
              </span>
              <span>&nbsp;</span>
            </Link>
          ))}
      </div>
      {loading && <Loading />}
    </div>
  );
};

BattleList.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    getBattlesBetween: PropTypes.array,
  }).isRequired,
};

export default compose(
  withStyles(s),
  graphql(battlesQuery, {
    options: ownProps => ({
      variables: {
        start: toServerTime(ownProps.start).format(),
        end: toServerTime(ownProps.end).format(),
      },
    }),
  }),
)(BattleList);
