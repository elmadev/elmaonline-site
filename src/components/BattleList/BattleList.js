import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import moment from 'moment';
import LocalTime from 'components/LocalTime';
import Link from 'components/Link';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import { BattleType } from 'components/Names';
import { sortResults, battleStatus, battleStatusBgColor } from 'utils/battle';
import { toServerTime } from 'utils/time';

import battlesQuery from './battles.graphql';
import s from './battlelist.css';

const BattleList = ({ start, end }) => {
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
        <Query
          query={battlesQuery}
          variables={{
            start: toServerTime(start).format(),
            end: toServerTime(end).format(),
          }}
          fetchPolicy={end.isBefore(moment()) ? 'cache-first' : 'no-cache'}
          ssr={false}
        >
          {({ data: { getBattlesBetween } }) => {
            if (!getBattlesBetween) return null;

            return getBattlesBetween.map(b => {
              const sorted = [...b.Results].sort(sortResults);
              return (
                <Link
                  key={b.BattleIndex}
                  to={`battles/${b.BattleIndex}`}
                  style={{ backgroundColor: battleStatusBgColor(b) }}
                >
                  <span className={s.type}>
                    {b.Duration} min <BattleType type={b.BattleType} />
                  </span>
                  <span className={s.designerName}>
                    <Kuski kuskiData={b.KuskiData} team flag />
                  </span>
                  <span className={s.levelFileName}>
                    {b.LevelData && b.LevelData.LevelName}
                  </span>
                  <span className={s.winnerKuski}>
                    {b.Finished === 1 && b.Results.length > 0 ? (
                      <Kuski kuskiData={sorted[0].KuskiData} team flag />
                    ) : (
                      battleStatus(b)
                    )}
                  </span>
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
            });
          }}
        </Query>
      </div>
    </div>
  );
};

BattleList.propTypes = {
  start: PropTypes.shape({}).isRequired,
  end: PropTypes.shape({}).isRequired,
};

export default withStyles(s)(BattleList);
