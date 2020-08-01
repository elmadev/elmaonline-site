import React, { useState, useEffect } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { has } from 'lodash';
import LocalTime from 'components/LocalTime';
import Link from 'components/Link';
import Kuski from 'components/Kuski';

import s from './Search.css';

const SEARCH_LEVEL = gql`
  query($Search: String!, $Offset: Int) {
    searchLevel(Search: $Search, Offset: $Offset) {
      LevelIndex
      LevelName
      LongName
    }
  }
`;

const SEARCH_REPLAY = gql`
  query($Search: String!, $Offset: Int) {
    searchReplay(Search: $Search, Offset: $Offset) {
      RecFileName
      UUID
      Uploaded
      LevelData {
        LevelName
      }
      DrivenByData {
        Kuski
      }
      UploadedByData {
        Kuski
      }
    }
  }
`;

const Search = ({
  context: {
    query: { q, t },
  },
}) => {
  const [moreLevels, setMoreLevels] = useState(true);
  const [moreReplays, setMoreReplays] = useState(true);
  const {
    levelPacks,
    battlesByFilename,
    battlesByDesigner,
    moreBattleFile,
    moreBattleDesigner,
    players,
    morePlayers,
    teams,
    moreTeams,
    replaysByDriven,
    replaysByLevel,
    moreReplaysDriven,
    moreReplaysLevel,
  } = useStoreState(state => state.Search);
  const {
    getLevelPacks,
    getBattles,
    fetchMoreBattlesFile,
    fetchMoreBattlesDesigner,
    getPlayers,
    fetchMorePlayers,
    getTeams,
    fetchMoreTeams,
    getReplays,
    fetchMoreReplaysDriven,
    fetchMoreReplaysLevel,
  } = useStoreActions(actions => actions.Search);
  useEffect(() => {
    if (t === 'level') {
      getLevelPacks(q);
      setMoreLevels(true);
    }
    if (t === 'battle') {
      getBattles({
        q,
        offset: 0,
      });
    }
    if (t === 'replay') {
      setMoreReplays(true);
      getReplays({ q, offset: 0 });
    }
    if (t === 'player') {
      getPlayers({ q, offset: 0 });
    }
    if (t === 'team') {
      getTeams({ q, offset: 0 });
    }
  }, [q]);

  return (
    <div className={s.container}>
      <div className={s.results}>
        {t === 'level' && (
          <>
            <div>
              <div className={s.resultGroupTitle}>Levels</div>
              {q.length > 2 && (
                <Query query={SEARCH_LEVEL} variables={{ Search: q }}>
                  {({ data: { searchLevel }, loading, fetchMore }) => {
                    if (loading) return null;
                    return (
                      <>
                        {searchLevel.map(l => {
                          return (
                            <Link
                              to={`levels/${l.LevelIndex}`}
                              key={l.LevelIndex}
                              className={s.resultLink}
                            >
                              <div className={s.resultMainData}>
                                {l.LevelName}.lev
                              </div>
                              <div className={s.resultSecondaryData}>
                                {l.LevelIndex} / {l.LongName || `Unnamed`}
                              </div>
                            </Link>
                          );
                        })}
                        <button
                          className={s.loadMore}
                          disabled={!moreLevels}
                          type="button"
                          onClick={() => {
                            fetchMore({
                              variables: {
                                Offset: searchLevel.length,
                              },
                              updateQuery: (prev, { fetchMoreResult }) => {
                                if (!fetchMoreResult) return prev;
                                if (fetchMoreResult.searchLevel.length < 1) {
                                  setMoreLevels(false);
                                }
                                return {
                                  ...prev,
                                  ...{
                                    searchLevel: [
                                      ...prev.searchLevel,
                                      ...fetchMoreResult.searchLevel,
                                    ],
                                  },
                                };
                              },
                            });
                          }}
                        >
                          {moreLevels ? 'Show more' : 'No more results'}
                        </button>
                      </>
                    );
                  }}
                </Query>
              )}
            </div>
            <div>
              <div className={s.resultGroupTitle}>Level packs</div>
              {levelPacks.length !== 0 && (
                <>
                  {levelPacks.map(l => (
                    <Link
                      to={`levels/packs/${l.LevelPack.LevelPackName}`}
                      key={l.LevelPack.LevelPackIndex}
                      className={s.resultLink}
                    >
                      {has(l, 'LevelPack') ? (
                        <>
                          <div className={s.resultMainData}>
                            {l.LevelPack.LevelPackLongName}
                          </div>
                          <div className={s.resultSecondaryData}>
                            {l.LevelPack.LevelPackName || `Unnamed`} /{' '}
                            <Kuski kuskiData={l.LevelPack.KuskiData} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={s.resultMainData}>
                            {l.LevelPackLongName}
                          </div>
                          <div className={s.resultSecondaryData}>
                            {l.LevelPackName || `Unnamed`} /{' '}
                            <Kuski kuskiData={l.KuskiData} />
                          </div>
                        </>
                      )}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </>
        )}
        {t === 'replay' && (
          <>
            <div>
              <div className={s.resultGroupTitle}>Replays by filename</div>
              {q.length > 2 && (
                <Query query={SEARCH_REPLAY} variables={{ Search: q }}>
                  {({ data: { searchReplay }, loading, fetchMore }) => {
                    if (loading) return null;
                    return (
                      <>
                        {searchReplay.map(r => {
                          return (
                            <Link
                              to={`r/${r.UUID}`}
                              key={r.UUID}
                              className={s.resultLink}
                            >
                              <div className={s.resultMainData}>
                                {r.RecFileName}
                              </div>
                              <div className={s.resultSecondaryData}>
                                {(r.LevelData &&
                                  `${r.LevelData.LevelName}.lev`) ||
                                  'unknown'}{' '}
                                /{' '}
                                {(r.DrivenByData && r.DrivenByData.Kuski) ||
                                  'unknown'}{' '}
                                /{' '}
                                <LocalTime
                                  date={r.Uploaded}
                                  format="DD.MM.YYYY HH:mm:ss"
                                  parse="X"
                                />{' '}
                                / <Kuski kuskiData={r.UploadedByData} />
                              </div>
                            </Link>
                          );
                        })}

                        <button
                          className={s.loadMore}
                          disabled={!moreReplays}
                          type="button"
                          onClick={() => {
                            fetchMore({
                              variables: {
                                Offset: searchReplay.length,
                              },
                              updateQuery: (prev, { fetchMoreResult }) => {
                                if (!fetchMoreResult) return prev;
                                if (fetchMoreResult.searchReplay.length < 1) {
                                  setMoreReplays(false);
                                }
                                return {
                                  ...prev,
                                  ...{
                                    searchReplay: [
                                      ...prev.searchReplay,
                                      ...fetchMoreResult.searchReplay,
                                    ],
                                  },
                                };
                              },
                            });
                          }}
                        >
                          {moreReplays ? 'Show more' : 'No more results'}
                        </button>
                      </>
                    );
                  }}
                </Query>
              )}
            </div>
            <div>
              <div className={s.resultGroupTitle}>Replays by driven by</div>
              {replaysByDriven.length !== 0 && (
                <>
                  {replaysByDriven.map(r => (
                    <Link
                      to={`r/${r.UUID}`}
                      key={r.UUID}
                      className={s.resultLink}
                    >
                      <div className={s.resultMainData}>{r.RecFileName}</div>
                      <div className={s.resultSecondaryData}>
                        {(r.LevelData && `${r.LevelData.LevelName}.lev`) ||
                          'unknown'}{' '}
                        /{' '}
                        {(r.DrivenByData && r.DrivenByData.Kuski) || 'unknown'}{' '}
                        /{' '}
                        <LocalTime
                          date={r.Uploaded}
                          format="DD.MM.YYYY HH:mm:ss"
                          parse="X"
                        />{' '}
                        / <Kuski kuskiData={r.UploadedByData} />
                      </div>
                    </Link>
                  ))}
                  <button
                    className={s.loadMore}
                    disabled={!moreReplaysDriven}
                    type="button"
                    onClick={() =>
                      fetchMoreReplaysDriven({
                        q,
                        offset: replaysByDriven.length,
                      })
                    }
                  >
                    {moreReplaysDriven ? 'Show more' : 'No more results'}
                  </button>
                </>
              )}
            </div>
            <div>
              <div className={s.resultGroupTitle}>Replays by level</div>
              {replaysByLevel.length !== 0 && (
                <>
                  {replaysByLevel.map(r => (
                    <Link
                      to={`r/${r.UUID}`}
                      key={r.UUID}
                      className={s.resultLink}
                    >
                      <div className={s.resultMainData}>{r.RecFileName}</div>
                      <div className={s.resultSecondaryData}>
                        {(r.LevelData && `${r.LevelData.LevelName}.lev`) ||
                          'unknown'}{' '}
                        /{' '}
                        {(r.DrivenByData && r.DrivenByData.Kuski) || 'unknown'}{' '}
                        /{' '}
                        <LocalTime
                          date={r.Uploaded}
                          format="DD.MM.YYYY HH:mm:ss"
                          parse="X"
                        />{' '}
                        / <Kuski kuskiData={r.UploadedByData} />
                      </div>
                    </Link>
                  ))}
                  <button
                    className={s.loadMore}
                    disabled={!moreReplaysLevel}
                    type="button"
                    onClick={() =>
                      fetchMoreReplaysLevel({
                        q,
                        offset: replaysByLevel.length,
                      })
                    }
                  >
                    {moreReplaysLevel ? 'Show more' : 'No more results'}
                  </button>
                </>
              )}
            </div>
          </>
        )}
        {t === 'battle' && (
          <>
            <div>
              <div className={s.resultGroupTitle}>Battles by level name</div>
              {battlesByFilename.length !== 0 && (
                <>
                  {battlesByFilename.map(b => (
                    <Link
                      to={`battles/${b.BattleIndex}`}
                      key={b.BattleIndex}
                      className={s.resultLink}
                    >
                      <div className={s.resultMainData}>
                        {b.LevelData.LevelName}.lev
                      </div>
                      <div className={s.resultSecondaryData}>
                        {b.BattleIndex} / <Kuski kuskiData={b.KuskiData} /> /{' '}
                        {b.LevelIndex} /{' '}
                        <LocalTime
                          date={b.Started}
                          format="DD.MM.YYYY HH:mm:ss"
                          parse="X"
                        />
                      </div>
                    </Link>
                  ))}
                  <button
                    className={s.loadMore}
                    disabled={!moreBattleFile}
                    type="button"
                    onClick={() => {
                      fetchMoreBattlesFile({
                        offset: battlesByFilename.length,
                        q,
                      });
                    }}
                  >
                    {moreBattleFile ? 'Show more' : 'No more results'}
                  </button>
                </>
              )}
            </div>
            <div>
              <div className={s.resultGroupTitle}>Battles by designer</div>
              {battlesByDesigner.length !== 0 && (
                <>
                  {battlesByDesigner.map(b => (
                    <Link
                      to={`battles/${b.BattleIndex}`}
                      key={b.BattleIndex}
                      className={s.resultLink}
                    >
                      <div className={s.resultMainData}>
                        {b.LevelData.LevelName}.lev
                      </div>
                      <div className={s.resultSecondaryData}>
                        {b.BattleIndex} / <Kuski kuskiData={b.KuskiData} /> /{' '}
                        {b.LevelIndex} /{' '}
                        <LocalTime
                          date={b.Started}
                          format="DD.MM.YYYY HH:mm:ss"
                          parse="X"
                        />
                      </div>
                    </Link>
                  ))}
                  <button
                    className={s.loadMore}
                    disabled={!moreBattleDesigner}
                    type="button"
                    onClick={() => {
                      fetchMoreBattlesDesigner({
                        offset: battlesByDesigner.length,
                        q,
                      });
                    }}
                  >
                    {moreBattleDesigner ? 'Show more' : 'No more results'}
                  </button>
                </>
              )}
            </div>
          </>
        )}
        {t === 'player' && (
          <div>
            <div className={s.resultGroupTitle}>Players</div>
            {players.length !== 0 && (
              <>
                {players.map(p => (
                  <Link
                    to={`kuskis/${p.Kuski}`}
                    key={p.Kuski}
                    className={s.resultLink}
                  >
                    <div className={s.resultMainData}>
                      <Kuski team kuskiData={p} />
                    </div>
                    <div className={s.resultSecondaryData} />
                  </Link>
                ))}
                <button
                  className={s.loadMore}
                  disabled={!morePlayers}
                  type="button"
                  onClick={() => {
                    fetchMorePlayers({ q, offset: players.length });
                  }}
                >
                  {morePlayers ? 'Show more' : 'No more results'}
                </button>
              </>
            )}
          </div>
        )}
        {t === 'team' && (
          <div>
            <div className={s.resultGroupTitle}>Teams</div>
            {teams.length !== 0 && (
              <>
                {teams.map(v => (
                  <div key={v.Team} className={s.resultLink}>
                    <div className={s.resultMainData}>{v.Team}</div>
                    <div className={s.resultSecondaryData} />
                  </div>
                ))}
                <button
                  className={s.loadMore}
                  disabled={!moreTeams}
                  type="button"
                  onClick={() => {
                    fetchMoreTeams({ q, offset: teams.length });
                  }}
                >
                  {moreTeams ? 'Show more' : 'No more results'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default withStyles(s)(Search);
