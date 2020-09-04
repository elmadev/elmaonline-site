import React, { useEffect } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { has } from 'lodash';
import LocalTime from 'components/LocalTime';
import Link from 'components/Link';
import Kuski from 'components/Kuski';

import s from './Search.css';

const Search = ({
  context: {
    query: { q, t },
  },
}) => {
  const {
    levelPacks,
    levels,
    moreLevels,
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
    replaysByFilename,
    moreReplaysDriven,
    moreReplaysLevel,
    moreReplaysFile,
  } = useStoreState(state => state.Search);
  const {
    getLevels,
    fetchMoreLevels,
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
    fetchmoreReplaysFile,
  } = useStoreActions(actions => actions.Search);
  useEffect(() => {
    if (t === 'level') {
      getLevels({ q, offset: 0 });
    }
    if (t === 'battle') {
      getBattles({
        q,
        offset: 0,
      });
    }
    if (t === 'replay') {
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
              <div className={s.resultGroupTitle}>
                Levels ({levels.length}
                {moreLevels && '+'})
              </div>
              {levels.length !== 0 && (
                <>
                  {levels.map(r => (
                    <Link
                      to={`levels/${r.LevelIndex}`}
                      key={r.LevelIndex}
                      className={s.resultLink}
                    >
                      <div className={s.resultMainData}>{r.LevelName}.lev</div>
                      <div className={s.resultSecondaryData}>
                        {r.LevelIndex} / {r.LongName || `Unnamed`}
                      </div>
                    </Link>
                  ))}
                  <button
                    className={s.loadMore}
                    disabled={!moreLevels}
                    type="button"
                    onClick={() =>
                      fetchMoreLevels({
                        q,
                        offset: levels.length,
                      })
                    }
                  >
                    {moreLevels ? 'Show more' : 'No more results'}
                  </button>
                  {moreLevels && (
                    <button
                      className={s.loadMore}
                      type="button"
                      onClick={() => {
                        fetchMoreLevels({
                          q,
                          offset: levels.length * -1,
                        });
                      }}
                    >
                      Show all results
                    </button>
                  )}
                </>
              )}
            </div>
            <div>
              <div className={s.resultGroupTitle}>
                Level packs ({levelPacks.length})
              </div>
              {levelPacks.length !== 0 && (
                <>
                  {levelPacks.map(l => (
                    <>
                      {has(l, 'LevelPack') ? (
                        <Link
                          to={`levels/packs/${l.LevelPack.LevelPackName}`}
                          key={l.LevelPack.LevelPackIndex}
                          className={s.resultLink}
                        >
                          <div className={s.resultMainData}>
                            {l.LevelPack.LevelPackLongName}
                          </div>
                          <div className={s.resultSecondaryData}>
                            {l.LevelPack.LevelPackName || `Unnamed`} /{' '}
                            <Kuski kuskiData={l.LevelPack.KuskiData} />
                          </div>
                        </Link>
                      ) : (
                        <Link
                          to={`levels/packs/${l.LevelPackName}`}
                          key={l.LevelPackIndex}
                          className={s.resultLink}
                        >
                          <div className={s.resultMainData}>
                            {l.LevelPackLongName}
                          </div>
                          <div className={s.resultSecondaryData}>
                            {l.LevelPackName || `Unnamed`} /{' '}
                            <Kuski kuskiData={l.KuskiData} />
                          </div>
                        </Link>
                      )}
                    </>
                  ))}
                </>
              )}
            </div>
          </>
        )}
        {t === 'replay' && (
          <>
            <div>
              <div className={s.resultGroupTitle}>
                Replays by filename ({replaysByFilename.length}
                {moreReplaysFile && '+'})
              </div>
              {replaysByFilename.length !== 0 && (
                <>
                  {replaysByFilename.map(r => (
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
                    disabled={!moreReplaysFile}
                    type="button"
                    onClick={() =>
                      fetchmoreReplaysFile({
                        q,
                        offset: replaysByFilename.length,
                      })
                    }
                  >
                    {moreReplaysFile ? 'Show more' : 'No more results'}
                  </button>
                  {moreReplaysFile && (
                    <button
                      className={s.loadMore}
                      type="button"
                      onClick={() => {
                        fetchmoreReplaysFile({
                          q,
                          offset: replaysByFilename.length * -1,
                        });
                      }}
                    >
                      Show all results
                    </button>
                  )}
                </>
              )}
            </div>
            <div>
              <div className={s.resultGroupTitle}>
                Replays driven by ({replaysByDriven.length}
                {moreReplaysDriven && '+'})
              </div>
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
                  {moreReplaysDriven && (
                    <button
                      className={s.loadMore}
                      type="button"
                      onClick={() => {
                        fetchMoreReplaysDriven({
                          q,
                          offset: replaysByDriven.length * -1,
                        });
                      }}
                    >
                      Show all results
                    </button>
                  )}
                </>
              )}
            </div>
            <div>
              <div className={s.resultGroupTitle}>
                Replays by level ({replaysByLevel.length}
                {moreReplaysLevel && '+'})
              </div>
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
                  {moreReplaysLevel && (
                    <button
                      className={s.loadMore}
                      type="button"
                      onClick={() => {
                        fetchMoreReplaysLevel({
                          q,
                          offset: replaysByLevel.length * -1,
                        });
                      }}
                    >
                      Show all results
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}
        {t === 'battle' && (
          <>
            <div>
              <div className={s.resultGroupTitle}>
                Battles by level name ({battlesByFilename.length}
                {moreBattleFile && '+'})
              </div>
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
                  {moreBattleFile && (
                    <button
                      className={s.loadMore}
                      type="button"
                      onClick={() => {
                        fetchMoreBattlesFile({
                          q,
                          offset: battlesByFilename.length * -1,
                        });
                      }}
                    >
                      Show all results
                    </button>
                  )}
                </>
              )}
            </div>
            <div>
              <div className={s.resultGroupTitle}>
                Battles by designer ({battlesByDesigner.length}
                {moreBattleDesigner && '+'})
              </div>
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
                  {moreBattleDesigner && (
                    <button
                      className={s.loadMore}
                      type="button"
                      onClick={() => {
                        fetchMoreBattlesDesigner({
                          q,
                          offset: battlesByDesigner.length * -1,
                        });
                      }}
                    >
                      Show all results
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}
        {t === 'player' && (
          <div>
            <div className={s.resultGroupTitle}>
              Players ({players.length}
              {morePlayers && '+'})
            </div>
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
                {morePlayers && (
                  <button
                    className={s.loadMore}
                    type="button"
                    onClick={() => {
                      fetchMorePlayers({ q, offset: players.length * -1 });
                    }}
                  >
                    Show all results
                  </button>
                )}
              </>
            )}
          </div>
        )}
        {t === 'team' && (
          <div>
            <div className={s.resultGroupTitle}>
              Teams ({teams.length}
              {moreTeams && '+'})
            </div>
            {teams.length !== 0 && (
              <>
                {teams.map(v => (
                  <Link
                    key={v.Team}
                    className={s.resultLink}
                    to={`team/${v.Team}`}
                  >
                    <div className={s.resultMainData}>{v.Team}</div>
                    <div className={s.resultSecondaryData} />
                  </Link>
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
                {moreTeams && (
                  <button
                    className={s.loadMore}
                    type="button"
                    onClick={() => {
                      fetchMoreTeams({ q, offset: teams.length * -1 });
                    }}
                  >
                    Show all results
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default withStyles(s)(Search);
