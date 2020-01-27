import React, { useState } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

import Link from 'components/Link';
import Kuski from 'components/Kuski';
import Time from 'components/Time';

import s from './LevelPack.css';

const GET_LEVELPACK = gql`
  query($name: String!) {
    getLevelPack(LevelPackName: $name) {
      LevelPackLongName
      LevelPackName
      LevelPackDesc
      KuskiData {
        Kuski
      }
      Levels {
        LevelIndex
        LevelPackLevelIndex
        Level {
          LevelName
          LongName
        }
      }
    }
  }
`;

const GET_LEVEL = gql`
  query($LevelIndex: Int!) {
    getBestTimes(LevelIndex: $LevelIndex, Limit: 10) {
      TimeIndex
      KuskiIndex
      Time
      KuskiData {
        Kuski
        Country
        TeamData {
          Team
        }
      }
    }
    getLevel(LevelIndex: $LevelIndex) {
      LevelName
      LongName
    }
  }
`;

const GET_BEST_TIME = gql`
  query($LevelIndex: Int!) {
    getBestTimes(LevelIndex: $LevelIndex, Limit: 1) {
      TimeIndex
      KuskiIndex
      Time
      KuskiData {
        Kuski
        Country
        TeamData {
          Team
        }
      }
    }
  }
`;

const LevelPopup = withStyles(s)(({ levelId, close }) => {
  return (
    <div className={s.levelPopup}>
      <Query query={GET_LEVEL} variables={{ LevelIndex: levelId }}>
        {({ data: { getBestTimes, getLevel }, loading }) => {
          if (loading) return null;

          return (
            <>
              <div className={s.levelTimesContainer}>
                <div className={s.title}>
                  {getLevel.LevelName}.lev
                  <br />
                  {getLevel.LongName}
                  <div
                    tabIndex="0"
                    role="button"
                    className={s.closePopup}
                    onClick={close}
                    onKeyPress={close}
                  >
                    &times;
                  </div>
                </div>
                <h2>Top-10 times</h2>
                <div className={s.levelTimes}>
                  <div className={s.tableHead}>
                    <span>#</span>
                    <span>Kuski</span>
                    <span>Time</span>
                  </div>
                  {getBestTimes.map((t, i) => {
                    return (
                      <div key={t.TimeIndex}>
                        <span>{i + 1}.</span>
                        <span>
                          <Kuski kuskiData={t.KuskiData} team flag />
                        </span>
                        <span>
                          <Time time={t.Time} />
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className={s.showMore}>
                  <Link to={`/levels/${levelId}`}>Go to level page</Link>
                </div>
              </div>
            </>
          );
        }}
      </Query>
    </div>
  );
});

const LevelPack = ({ name }) => {
  const [level, selectLevel] = useState(-1);
  return (
    <div className={s.root}>
      <Query query={GET_LEVELPACK} variables={{ name }}>
        {({ data: { getLevelPack }, loading, error }) => {
          if (loading) return null;
          if (error) return <div>something went wrong</div>;
          return (
            <>
              <div className={s.levelPackName}>
                <span className={s.shortName}>
                  {getLevelPack.LevelPackName}
                </span>{' '}
                <span className={s.longName}>
                  {getLevelPack.LevelPackLongName}
                </span>
              </div>
              <div className={s.description}>{getLevelPack.LevelPackDesc}</div>
              <h2>Levels</h2>
              <div className={s.levels}>
                <div className={s.tableHead}>
                  <span>Filename</span>
                  <span>Level name</span>
                  <span>Kuski</span>
                  <span>Time</span>
                </div>
                {getLevelPack.Levels.map(l => {
                  return (
                    <Link
                      to={`/levels/${l.LevelIndex}`}
                      key={l.LevelIndex}
                      onClick={e => {
                        e.preventDefault();
                        selectLevel(level === l.LevelIndex ? -1 : l.LevelIndex);
                      }}
                      className={level === l.LevelIndex ? s.selected : ''}
                    >
                      <span>{l.Level.LevelName}</span>
                      <span>{l.Level.LongName}</span>
                      <Query
                        query={GET_BEST_TIME}
                        variables={{ LevelIndex: l.LevelIndex }}
                      >
                        {({ data: { getBestTimes } }) => {
                          if (!getBestTimes || getBestTimes.length < 1)
                            return (
                              <>
                                <span />
                                <span />
                              </>
                            );

                          return getBestTimes.map(t => {
                            return (
                              <React.Fragment key={t.TimeIndex}>
                                <span>
                                  <Kuski kuskiData={t.KuskiData} team flag />
                                </span>
                                <span>
                                  <Time time={t.Time} />
                                </span>
                              </React.Fragment>
                            );
                          });
                        }}
                      </Query>
                    </Link>
                  );
                })}
              </div>
              {level !== -1 && (
                <LevelPopup
                  levelId={level}
                  close={() => {
                    selectLevel(-1);
                  }}
                />
              )}
            </>
          );
        }}
      </Query>
    </div>
  );
};

LevelPack.propTypes = {
  name: PropTypes.string.isRequired,
};

export default withStyles(s)(LevelPack);
