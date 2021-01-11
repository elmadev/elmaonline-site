import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import LocalTime from 'components/LocalTime';
import Link from 'components/Link';
import Kuski from 'components/Kuski';
import { Switch } from '@material-ui/core';
import { ListRow, ListCell, ListContainer, ListHeader } from 'styles/List';
import { mod } from 'utils/nick';
import { forEach } from 'lodash';

const Search = ({
  context: {
    query: { q, t },
  },
}) => {
  const [updated, setUpdated] = useState({});
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
    showLocked,
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
    changeLevel,
  } = useStoreActions(actions => actions.Search);
  useEffect(() => {
    if (t === 'level') {
      getLevels({ q: q.replace('?', '_'), offset: 0, showLocked: 0 });
    }
    if (t === 'battle') {
      getBattles({
        q: q.replace('?', '_'),
        offset: 0,
      });
    }
    if (t === 'replay') {
      getReplays({ q: q.replace('?', '_'), offset: 0 });
    }
    if (t === 'player') {
      getPlayers({ q: q.replace('?', '_'), offset: 0 });
    }
    if (t === 'team') {
      getTeams({ q: q.replace('?', '_'), offset: 0 });
    }
  }, [q]);
  useEffect(() => {
    if (mod() === 1 && showLocked) {
      const u = {};
      forEach(levels, l => {
        u[l.LevelIndex] = { Hidden: l.Hidden, Locked: l.Locked };
      });
      setUpdated(u);
    }
  }, [levels, showLocked]);

  const updateHidden = (data, oldValue) => {
    const newValue = 1 - oldValue;
    changeLevel({ LevelIndex: data.LevelIndex, update: { Hidden: newValue } });
    setUpdated({
      ...updated,
      [data.LevelIndex]: { ...updated[data.LevelIndex], Hidden: newValue },
    });
  };

  const updateLocked = (data, oldValue) => {
    const newValue = 1 - oldValue;
    changeLevel({ LevelIndex: data.LevelIndex, update: { Locked: newValue } });
    setUpdated({
      ...updated,
      [data.LevelIndex]: { ...updated[data.LevelIndex], Locked: newValue },
    });
  };

  return (
    <Container>
      <Results>
        {t === 'level' && (
          <Flex>
            <Flex2>
              <Flex>
                <ResultGroupTitle>
                  Levels ({levels.length}
                  {moreLevels && '+'})
                </ResultGroupTitle>
                {mod() === 1 && (
                  <ResultGroupTitle thin>
                    Show locked{' '}
                    <SwitchThin
                      checked={showLocked}
                      onChange={() =>
                        getLevels({
                          q: q.replace('?', '_'),
                          offset: 0,
                          showLocked: showLocked ? 0 : 1,
                        })
                      }
                      color="primary"
                    />
                  </ResultGroupTitle>
                )}
              </Flex>
              {levels.length !== 0 && (
                <>
                  <ListContainer>
                    <ListHeader>
                      <ListCell width={90}>Filename</ListCell>
                      <ListCell width={60}>Index</ListCell>
                      <ListCell>Level name</ListCell>
                      <ListCell width={90}>Battles</ListCell>
                      <ListCell width={150}>Added on</ListCell>
                      <ListCell width={90}>Added by</ListCell>
                      {mod() === 1 && showLocked && (
                        <>
                          <ListCell width={50}>Locked</ListCell>
                          <ListCell width={50}>Hidden</ListCell>
                        </>
                      )}
                    </ListHeader>
                    {levels.map(r => (
                      <ListRow key={r.LevelIndex}>
                        <ListCell width={90}>
                          <ResultLinkCell
                            to={`levels/${r.LevelIndex}`}
                            key={r.LevelIndex}
                          >
                            {r.LevelName}.lev
                          </ResultLinkCell>
                        </ListCell>
                        <ListCell width={60}>{r.LevelIndex}</ListCell>
                        <ListCell>{r.LongName || `Unnamed`}</ListCell>
                        <ListCell width={90}>
                          {r.Battles.map(b => (
                            <BattleIndex
                              aborted={b.Aborted}
                              key={b.BattleIndex}
                            >
                              <Link to={`/battles/${b.BattleIndex}`}>
                                {b.BattleIndex}
                              </Link>{' '}
                            </BattleIndex>
                          ))}
                        </ListCell>
                        <ListCell width={150}>
                          <LocalTime
                            date={r.Added}
                            format="ddd D MMM YYYY HH:mm"
                            parse="X"
                          />
                        </ListCell>
                        <ListCell width={90}>
                          {r.KuskiData && <Kuski kuskiData={r.KuskiData} />}
                        </ListCell>
                        {mod() === 1 && showLocked && (
                          <>
                            <ListCell width={50}>
                              <SwitchThin
                                checked={
                                  updated[r.LevelIndex]
                                    ? updated[r.LevelIndex].Locked === 1
                                    : false
                                }
                                onChange={() =>
                                  updateLocked(r, updated[r.LevelIndex].Locked)
                                }
                                color="primary"
                              />
                            </ListCell>
                            <ListCell width={50}>
                              <SwitchThin
                                checked={
                                  updated[r.LevelIndex]
                                    ? updated[r.LevelIndex].Hidden === 1
                                    : false
                                }
                                onChange={() =>
                                  updateHidden(r, updated[r.LevelIndex].Hidden)
                                }
                                color="primary"
                              />
                            </ListCell>
                          </>
                        )}
                      </ListRow>
                    ))}
                  </ListContainer>
                  <LoadMore
                    disabled={!moreLevels}
                    type="button"
                    onClick={() =>
                      fetchMoreLevels({
                        q,
                        offset: levels.length,
                        showLocked: showLocked ? 1 : 0,
                      })
                    }
                  >
                    {moreLevels ? 'Show more' : 'No more results'}
                  </LoadMore>
                  {moreLevels && (
                    <LoadMore
                      type="button"
                      onClick={() => {
                        fetchMoreLevels({
                          q,
                          offset: levels.length * -1,
                          showLocked: showLocked ? 1 : 0,
                        });
                      }}
                    >
                      Show all results
                    </LoadMore>
                  )}
                </>
              )}
            </Flex2>
            <Flex1>
              <ResultGroupTitle>
                Level packs ({levelPacks.length})
              </ResultGroupTitle>
              {levelPacks.length !== 0 && (
                <>
                  {levelPacks.map(l => (
                    <>
                      {l.LevelPack ? (
                        <ResultLink
                          to={`levels/packs/${l.LevelPack.LevelPackName}`}
                          key={l.LevelPack.LevelPackIndex}
                        >
                          <div>{l.LevelPack.LevelPackLongName}</div>
                          <ResultSecondaryData>
                            {l.LevelPack.LevelPackName || `Unnamed`} /{' '}
                            <Kuski kuskiData={l.LevelPack.KuskiData} />
                          </ResultSecondaryData>
                        </ResultLink>
                      ) : (
                        <ResultLink
                          to={`levels/packs/${l.LevelPackName}`}
                          key={l.LevelPackIndex}
                        >
                          <>{l.LevelPackLongName}</>
                          <ResultSecondaryData>
                            {l.LevelPackName || `Unnamed`} /{' '}
                            <Kuski kuskiData={l.KuskiData} />
                          </ResultSecondaryData>
                        </ResultLink>
                      )}
                    </>
                  ))}
                </>
              )}
            </Flex1>
          </Flex>
        )}
        {t === 'replay' && (
          <>
            <div>
              <ResultGroupTitle>
                Replays by filename ({replaysByFilename.length}
                {moreReplaysFile && '+'})
              </ResultGroupTitle>
              {replaysByFilename.length !== 0 && (
                <>
                  {replaysByFilename.map(r => (
                    <ResultLink to={`r/${r.UUID}`} key={r.UUID}>
                      <div>{r.RecFileName}</div>
                      <ResultSecondaryData>
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
                      </ResultSecondaryData>
                    </ResultLink>
                  ))}
                  <LoadMore
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
                  </LoadMore>
                  {moreReplaysFile && (
                    <LoadMore
                      type="button"
                      onClick={() => {
                        fetchmoreReplaysFile({
                          q,
                          offset: replaysByFilename.length * -1,
                        });
                      }}
                    >
                      Show all results
                    </LoadMore>
                  )}
                </>
              )}
            </div>
            <div>
              <ResultGroupTitle>
                Replays driven by ({replaysByDriven.length}
                {moreReplaysDriven && '+'})
              </ResultGroupTitle>
              {replaysByDriven.length !== 0 && (
                <>
                  {replaysByDriven.map(r => (
                    <ResultLink to={`r/${r.UUID}`} key={r.UUID}>
                      <div>{r.RecFileName}</div>
                      <ResultSecondaryData>
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
                      </ResultSecondaryData>
                    </ResultLink>
                  ))}
                  <LoadMore
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
                  </LoadMore>
                  {moreReplaysDriven && (
                    <LoadMore
                      type="button"
                      onClick={() => {
                        fetchMoreReplaysDriven({
                          q,
                          offset: replaysByDriven.length * -1,
                        });
                      }}
                    >
                      Show all results
                    </LoadMore>
                  )}
                </>
              )}
            </div>
            <div>
              <ResultGroupTitle>
                Replays by level ({replaysByLevel.length}
                {moreReplaysLevel && '+'})
              </ResultGroupTitle>
              {replaysByLevel.length !== 0 && (
                <>
                  {replaysByLevel.map(r => (
                    <ResultLink to={`r/${r.UUID}`} key={r.UUID}>
                      <div>{r.RecFileName}</div>
                      <ResultSecondaryData>
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
                      </ResultSecondaryData>
                    </ResultLink>
                  ))}
                  <LoadMore
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
                  </LoadMore>
                  {moreReplaysLevel && (
                    <LoadMore
                      type="button"
                      onClick={() => {
                        fetchMoreReplaysLevel({
                          q,
                          offset: replaysByLevel.length * -1,
                        });
                      }}
                    >
                      Show all results
                    </LoadMore>
                  )}
                </>
              )}
            </div>
          </>
        )}
        {t === 'battle' && (
          <>
            <div>
              <ResultGroupTitle>
                Battles by level name ({battlesByFilename.length}
                {moreBattleFile && '+'})
              </ResultGroupTitle>
              {battlesByFilename.length !== 0 && (
                <>
                  {battlesByFilename.map(b => (
                    <ResultLink
                      to={`battles/${b.BattleIndex}`}
                      key={b.BattleIndex}
                    >
                      <div>{b.LevelData.LevelName}.lev</div>
                      <ResultSecondaryData>
                        {b.BattleIndex} / <Kuski kuskiData={b.KuskiData} /> /{' '}
                        {b.LevelIndex} /{' '}
                        <LocalTime
                          date={b.Started}
                          format="DD.MM.YYYY HH:mm:ss"
                          parse="X"
                        />
                      </ResultSecondaryData>
                    </ResultLink>
                  ))}
                  <LoadMore
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
                  </LoadMore>
                  {moreBattleFile && (
                    <LoadMore
                      type="button"
                      onClick={() => {
                        fetchMoreBattlesFile({
                          q,
                          offset: battlesByFilename.length * -1,
                        });
                      }}
                    >
                      Show all results
                    </LoadMore>
                  )}
                </>
              )}
            </div>
            <div>
              <ResultGroupTitle>
                Battles by designer ({battlesByDesigner.length}
                {moreBattleDesigner && '+'})
              </ResultGroupTitle>
              {battlesByDesigner.length !== 0 && (
                <>
                  {battlesByDesigner.map(b => (
                    <ResultLink
                      to={`battles/${b.BattleIndex}`}
                      key={b.BattleIndex}
                    >
                      <div>{b.LevelData.LevelName}.lev</div>
                      <ResultSecondaryData>
                        {b.BattleIndex} / <Kuski kuskiData={b.KuskiData} /> /{' '}
                        {b.LevelIndex} /{' '}
                        <LocalTime
                          date={b.Started}
                          format="DD.MM.YYYY HH:mm:ss"
                          parse="X"
                        />
                      </ResultSecondaryData>
                    </ResultLink>
                  ))}
                  <LoadMore
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
                  </LoadMore>
                  {moreBattleDesigner && (
                    <LoadMore
                      type="button"
                      onClick={() => {
                        fetchMoreBattlesDesigner({
                          q,
                          offset: battlesByDesigner.length * -1,
                        });
                      }}
                    >
                      Show all results
                    </LoadMore>
                  )}
                </>
              )}
            </div>
          </>
        )}
        {t === 'player' && (
          <div>
            <ResultGroupTitle>
              Players ({players.length}
              {morePlayers && '+'})
            </ResultGroupTitle>
            {players.length !== 0 && (
              <>
                {players.map(p => (
                  <ResultLink to={`kuskis/${p.Kuski}`} key={p.Kuski}>
                    <div>
                      <Kuski team kuskiData={p} />
                    </div>
                    <ResultSecondaryData />
                  </ResultLink>
                ))}
                <LoadMore
                  disabled={!morePlayers}
                  type="button"
                  onClick={() => {
                    fetchMorePlayers({ q, offset: players.length });
                  }}
                >
                  {morePlayers ? 'Show more' : 'No more results'}
                </LoadMore>
                {morePlayers && (
                  <LoadMore
                    type="button"
                    onClick={() => {
                      fetchMorePlayers({ q, offset: players.length * -1 });
                    }}
                  >
                    Show all results
                  </LoadMore>
                )}
              </>
            )}
          </div>
        )}
        {t === 'team' && (
          <div>
            <ResultGroupTitle>
              Teams ({teams.length}
              {moreTeams && '+'})
            </ResultGroupTitle>
            {teams.length !== 0 && (
              <>
                {teams.map(v => (
                  <ResultLink key={v.Team} to={`team/${v.Team}`}>
                    <div>{v.Team}</div>
                    <ResultSecondaryData />
                  </ResultLink>
                ))}
                <LoadMore
                  disabled={!moreTeams}
                  type="button"
                  onClick={() => {
                    fetchMoreTeams({ q, offset: teams.length });
                  }}
                >
                  {moreTeams ? 'Show more' : 'No more results'}
                </LoadMore>
                {moreTeams && (
                  <LoadMore
                    type="button"
                    onClick={() => {
                      fetchMoreTeams({ q, offset: teams.length * -1 });
                    }}
                  >
                    Show all results
                  </LoadMore>
                )}
              </>
            )}
          </div>
        )}
      </Results>
    </Container>
  );
};

const SwitchThin = styled(Switch)`
  margin: -10px;
`;

const Container = styled.div`
  background: #fff;
  min-height: 100%;
`;

const Results = styled.div`
  display: flex;
  > div {
    flex: 1;
  }
  @media (max-width: 500px) {
    flex-direction: column;
    > div {
      margin-bottom: 20px;
    }
  }
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
`;

const Flex1 = styled.div`
  flex: 1;
`;

const Flex2 = styled.div`
  flex: 2;
`;

const ResultLink = styled(Link)`
  display: block;
  padding: 5px 10px;
  :hover {
    text-decoration: underline;
  }
`;

const ResultLinkCell = styled(ResultLink)`
  padding: 0;
`;

const ResultGroupTitle = styled.div`
  padding: 10px;
  font-weight: ${p => (p.thin ? 'normal' : 600)};
`;

const ResultSecondaryData = styled.div`
  color: #8c8c8c;
  font-size: 12px;
`;

const BattleIndex = styled.span`
  a {
    color: ${p => (p.aborted ? 'red' : '#219653')};
  }
`;

const LoadMore = styled.button`
  background: transparent;
  font-weight: 600;
  border: 0;
  display: inline-block;
  text-align: left;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #219653;
  :disabled {
    cursor: default;
    color: #8c8c8c;
  }
`;

export default Search;
