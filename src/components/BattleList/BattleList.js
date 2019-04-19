import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { toServerTime, sortResults } from 'utils';
import LocalTime from '../LocalTime';
import Link from '../Link';
import Time from '../Time';
import Kuski from '../Kuski';
import { BattleType } from '../Names';
import battlesQuery from './battles.graphql';
import s from './battlelist.css';

const BattleList = props => {
  const {
    data: { getBattlesBetween },
  } = props;
  return (
    <div className={s.battleList}>
      <div className={s.battles}>
        <div className={s.listHeader}>
          <span className={s.type}>Type</span>
          <span className={s.designerName}>Designer</span>
          <span className={s.levelFileName}>Level</span>
          <span className={s.winnerKuski}>Winner</span>
          <span className={s.winnerTime}>Time</span>
          <span className={s.battleStarted}>Started</span>
          <span>Players</span>
        </div>
        {getBattlesBetween &&
          getBattlesBetween.map(b => {
            const sorted = [...b.Results].sort(sortResults);
            let winnerKuski;
            if (b.InQueue === 0 && b.Aborted === 0 && b.Finished === 0) {
              winnerKuski = 'Ongoing';
            }
            if (b.Aborted === 1) {
              winnerKuski = 'Aborted';
            }
            if (b.Aborted === 0 && b.InQueue === 1) {
              winnerKuski = 'Queued';
            }
            if (b.Finished === 1 && b.Results.length > 0) {
              winnerKuski = <Kuski kuskiData={sorted[0].KuskiData} team flag />;
            }
            return (
              <Link key={b.BattleIndex} to={`battles/${b.BattleIndex}`}>
                <span className={s.type}>
                  {b.Duration} min <BattleType type={b.BattleType} />
                </span>
                <span className={s.designerName}>
                  <Kuski kuskiData={b.KuskiData} team flag />
                </span>
                <span className={s.levelFileName}>
                  {b.LevelData && b.LevelData.LevelName}
                </span>
                <span className={s.winnerKuski}> {winnerKuski} </span>
                <span className={s.winnerTime}>
                  {b.Results.length > 0 && (
                    <Time time={sorted[0].Time} apples={sorted[0].Apples} />
                  )}
                </span>
                <span className={s.battleStarted}>
                  <LocalTime date={b.Started} format="HH:mm" parse="X" />
                </span>
                <span>
                  <div className={s.popularity}>
                    <div
                      title={b.Results.length}
                      className={s.popularityBar}
                      style={{
                        width: `${(b.Results.length / 20) * 100}%`,
                        opacity: b.Results.length / 20 + 0.1,
                      }}
                    />
                  </div>
                </span>
              </Link>
            );
          })}
      </div>
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
