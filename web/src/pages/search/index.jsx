import React, { useEffect, useState, Fragment } from 'react';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useMediaQuery, Grid, Switch } from '@material-ui/core';
import LocalTime from 'components/LocalTime';
import Link from 'components/Link';
import SearchBar from 'components/SearchBar';
import Kuski from 'components/Kuski';
import { useLocation } from '@tanstack/react-router';
import { ListRow, ListCell, ListContainer, ListHeader } from 'components/List';
import { mod } from 'utils/nick';
import { forEach } from 'lodash';
import Layout from 'components/Layout';
import { Paper } from 'components/Paper';
import { Row } from 'components/Containers';
import Header from 'components/Header';
import { BattleType } from 'components/Names';

const Search = () => {
  const location = useLocation();
  const { q, t } = location.search;
  const query = q == null ? '' : q.toString();
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
      getLevels({
        q: encodeURIComponent(query.replace('?', '_')),
        offset: 0,
        showLocked: 0,
      });
    }
    if (t === 'battle') {
      getBattles({
        q: encodeURIComponent(query.replace('?', '_')),
        offset: 0,
      });
    }
    if (t === 'replay') {
      getReplays({ q: encodeURIComponent(query.replace('?', '_')), offset: 0 });
    }
    if (t === 'player') {
      getPlayers({ q: encodeURIComponent(query.replace('?', '_')), offset: 0 });
    }
    if (t === 'team') {
      getTeams({ q: encodeURIComponent(query.replace('?', '_')), offset: 0 });
    }
  }, [q]);
  useEffect(() => {
    if (mod() === 1 && showLocked) {
      const u = {};
      forEach(levels, l => {
        u[l.LevelIndex] = {
          Hidden: l.Hidden,
          Locked: l.Locked,
          HardLocked: l.HardLocked,
        };
      });
      setUpdated(u);
    }
  }, [levels, showLocked]);

  const smallSearchBar = useMediaQuery('(max-width: 460px');

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

  const updateHardLocked = (data, oldValue) => {
    const newValue = 1 - oldValue;
    changeLevel({
      LevelIndex: data.LevelIndex,
      update: { HardLocked: newValue },
    });
    setUpdated({
      ...updated,
      [data.LevelIndex]: { ...updated[data.LevelIndex], HardLocked: newValue },
    });
  };

  return (
    <Layout t={`Search - ${t} - ${query}`}>
      <Grid container spacing={2}>
        {!t && (
          <SearchBarWrapper>
            {smallSearchBar && (
              <p className="mobile-search-title">Search for: </p>
            )}
            <SearchBar hidePlaceholder={smallSearchBar} />
          </SearchBarWrapper>
        )}
        {t === 'level' && (
          <>
            <Grid item xs={12} sm={8}>
              <Paper padding>
                <Row>
                  <Header h2>
                    Levels ({levels.length}
                    {moreLevels && '+'})
                  </Header>
                  {mod() === 1 && (
                    <div>
                      Show locked{' '}
                      <SwitchThin
                        checked={showLocked}
                        onChange={() =>
                          getLevels({
                            q: query.replace('?', '_'),
                            offset: 0,
                            showLocked: showLocked ? 0 : 1,
                          })
                        }
                        color="primary"
                      />
                    </div>
                  )}
                </Row>
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
                            <ListCell width={50}>Hard Locked</ListCell>
                            <ListCell width={50}>Hidden</ListCell>
                          </>
                        )}
                      </ListHeader>
                      {levels.map(r => (
                        <ListRow key={r.LevelIndex}>
                          <ListCell width={90}>
                            <ResultLinkCell
                              to={`/levels/${r.LevelIndex}`}
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
                              format="eee d MMM yyyy HH:mm"
                              parse="X"
                            />
                          </ListCell>
                          {r.KuskiData ? (
                            <ListCell
                              width={90}
                              to={`/kuskis/${r.KuskiData.Kuski}`}
                            >
                              <Kuski noLink kuskiData={r.KuskiData} />
                            </ListCell>
                          ) : (
                            <ListCell width={90}>{'Unknown'}</ListCell>
                          )}
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
                                    updateLocked(
                                      r,
                                      updated[r.LevelIndex].Locked,
                                    )
                                  }
                                  color="primary"
                                />
                              </ListCell>
                              <ListCell width={50}>
                                <SwitchThin
                                  checked={
                                    updated[r.LevelIndex]
                                      ? updated[r.LevelIndex].HardLocked === 1
                                      : false
                                  }
                                  onChange={() =>
                                    updateHardLocked(
                                      r,
                                      updated[r.LevelIndex].HardLocked,
                                    )
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
                                    updateHidden(
                                      r,
                                      updated[r.LevelIndex].Hidden,
                                    )
                                  }
                                  color="primary"
                                />
                              </ListCell>
                            </>
                          )}
                        </ListRow>
                      ))}
                    </ListContainer>
                    <Row>
                      <LoadMore
                        disabled={!moreLevels}
                        type="button"
                        onClick={() =>
                          fetchMoreLevels({
                            q: query,
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
                              q: query,
                              offset: levels.length * -1,
                              showLocked: showLocked ? 1 : 0,
                            });
                          }}
                        >
                          Show all results
                        </LoadMore>
                      )}
                    </Row>
                  </>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper padding>
                <Header h2>Level packs ({levelPacks.length})</Header>
                {levelPacks.length !== 0 && (
                  <>
                    {levelPacks.map(l => (
                      <Fragment
                        key={
                          l.LevelPack
                            ? l.LevelPack.LevelPackName
                            : l.LevelPackName
                        }
                      >
                        {l.LevelPack ? (
                          <ResultLink
                            to={`/levels/packs/${l.LevelPack.LevelPackName}`}
                          >
                            <div>{l.LevelPack.LevelPackLongName}</div>
                            <ResultSecondaryData>
                              {l.LevelPack.LevelPackName || `Unnamed`} /{' '}
                              <Kuski noLink kuskiData={l.LevelPack.KuskiData} />
                            </ResultSecondaryData>
                          </ResultLink>
                        ) : (
                          <ResultLink to={`/levels/packs/${l.LevelPackName}`}>
                            <>{l.LevelPackLongName}</>
                            <ResultSecondaryData>
                              {l.LevelPackName || `Unnamed`} /{' '}
                              <Kuski noLink kuskiData={l.KuskiData} />
                            </ResultSecondaryData>
                          </ResultLink>
                        )}
                      </Fragment>
                    ))}
                  </>
                )}
              </Paper>
            </Grid>
          </>
        )}
        {t === 'replay' && (
          <>
            <Grid item xs={12} sm={4}>
              <Paper padding>
                <Header h2>
                  Replays by filename ({replaysByFilename.length}
                  {moreReplaysFile && '+'})
                </Header>
                {replaysByFilename.length !== 0 && (
                  <>
                    {replaysByFilename.map(r => (
                      <ResultLink to={`/r/${r.UUID}`} key={r.UUID}>
                        <div>{r.RecFileName}</div>
                        <ResultSecondaryData>
                          {(r.LevelData && `${r.LevelData.LevelName}.lev`) ||
                            'unknown'}{' '}
                          /{' '}
                          {r.DrivenByData ? (
                            <Kuski noLink kuskiData={r.DrivenByData} />
                          ) : (
                            r.DrivenByText || 'Unknown'
                          )}{' '}
                          /{' '}
                          <LocalTime
                            date={r.Uploaded}
                            format="dd.MM.yyyy HH:mm:ss"
                            parse="X"
                          />{' '}
                          / <Kuski noLink kuskiData={r.UploadedByData} />
                        </ResultSecondaryData>
                      </ResultLink>
                    ))}
                    <LoadMore
                      disabled={!moreReplaysFile}
                      type="button"
                      onClick={() =>
                        fetchmoreReplaysFile({
                          q: query,
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
                            q: query,
                            offset: replaysByFilename.length * -1,
                          });
                        }}
                      >
                        Show all results
                      </LoadMore>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper padding>
                <Header h2>
                  Replays driven by ({replaysByDriven.length}
                  {moreReplaysDriven && '+'})
                </Header>
                {replaysByDriven.length !== 0 && (
                  <>
                    {replaysByDriven.map(r => (
                      <ResultLink to={`/r/${r.UUID}`} key={r.UUID}>
                        <div>{r.RecFileName}</div>
                        <ResultSecondaryData>
                          {(r.LevelData && `${r.LevelData.LevelName}.lev`) ||
                            'unknown'}{' '}
                          /{' '}
                          {r.DrivenByData ? (
                            <Kuski noLink kuskiData={r.DrivenByData} />
                          ) : (
                            r.DrivenByText || 'Unknown'
                          )}{' '}
                          /{' '}
                          <LocalTime
                            date={r.Uploaded}
                            format="dd.MM.yyyy HH:mm:ss"
                            parse="X"
                          />{' '}
                          / <Kuski noLink kuskiData={r.UploadedByData} />
                        </ResultSecondaryData>
                      </ResultLink>
                    ))}
                    <LoadMore
                      disabled={!moreReplaysDriven}
                      type="button"
                      onClick={() =>
                        fetchMoreReplaysDriven({
                          q: query,
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
                            q: query,
                            offset: replaysByDriven.length * -1,
                          });
                        }}
                      >
                        Show all results
                      </LoadMore>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper padding>
                <Header h2>
                  Replays by level ({replaysByLevel.length}
                  {moreReplaysLevel && '+'})
                </Header>
                {replaysByLevel.length !== 0 && (
                  <>
                    {replaysByLevel.map(r => (
                      <ResultLink to={`/r/${r.UUID}`} key={r.UUID}>
                        <div>{r.RecFileName}</div>
                        <ResultSecondaryData>
                          {(r.LevelData && `${r.LevelData.LevelName}.lev`) ||
                            'unknown'}{' '}
                          /{' '}
                          {r.DrivenByData ? (
                            <Kuski noLink kuskiData={r.DrivenByData} />
                          ) : (
                            r.DrivenByText || 'Unknown'
                          )}{' '}
                          /{' '}
                          <LocalTime
                            date={r.Uploaded}
                            format="dd.MM.yyyy HH:mm:ss"
                            parse="X"
                          />{' '}
                          / <Kuski noLink kuskiData={r.UploadedByData} />
                        </ResultSecondaryData>
                      </ResultLink>
                    ))}
                    <LoadMore
                      disabled={!moreReplaysLevel}
                      type="button"
                      onClick={() =>
                        fetchMoreReplaysLevel({
                          q: query,
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
                            q: query,
                            offset: replaysByLevel.length * -1,
                          });
                        }}
                      >
                        Show all results
                      </LoadMore>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
          </>
        )}
        {t === 'battle' && (
          <>
            <Grid item xs={12} sm={6}>
              <Paper padding>
                <Header h2>
                  Battles by level name ({battlesByFilename.length}
                  {moreBattleFile && '+'})
                </Header>
                {battlesByFilename.length !== 0 && (
                  <>
                    {battlesByFilename.map(b => (
                      <ResultLink
                        to={`/battles/${b.BattleIndex}`}
                        key={b.BattleIndex}
                      >
                        <div>{b.LevelData.LevelName}.lev</div>
                        <ResultSecondaryData>
                          {b.BattleIndex} /{' '}
                          <Kuski noLink kuskiData={b.KuskiData} /> /{' '}
                          {b.LevelIndex} /{' '}
                          <LocalTime
                            date={b.Started}
                            format="dd.MM.yyyy HH:mm:ss"
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
                          q: query,
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
                            q: query,
                            offset: battlesByFilename.length * -1,
                          });
                        }}
                      >
                        Show all results
                      </LoadMore>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper padding>
                <Header h2>
                  Battles by designer ({battlesByDesigner.length}
                  {moreBattleDesigner && '+'})
                </Header>
                {battlesByDesigner.length !== 0 && (
                  <>
                    {battlesByDesigner.map(b => (
                      <ResultLink
                        to={`/battles/${b.BattleIndex}`}
                        key={b.BattleIndex}
                      >
                        {b.BattleType === 'HT' ? (
                          <div className="battleType">
                            <BattleType type={b.BattleType} />
                          </div>
                        ) : (
                          <div>
                            {b.LevelData ? b.LevelData.LevelName : '?'}.lev
                          </div>
                        )}
                        <ResultSecondaryData>
                          {b.BattleIndex} /{' '}
                          <Kuski noLink kuskiData={b.KuskiData} /> /{' '}
                          {b.LevelIndex} /{' '}
                          <LocalTime
                            date={b.Started}
                            format="dd.MM.yyyy HH:mm:ss"
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
                          q: query,
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
                            q: query,
                            offset: battlesByDesigner.length * -1,
                          });
                        }}
                      >
                        Show all results
                      </LoadMore>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
          </>
        )}
        {t === 'player' && (
          <Grid item xs={12} sm={6}>
            <Paper padding>
              <Header h2>
                Players ({players.length}
                {morePlayers && '+'})
              </Header>
              {players.length !== 0 && (
                <>
                  {players.map(p => (
                    <ResultLink to={`/kuskis/${p.Kuski}`} key={p.Kuski}>
                      <div>
                        <Kuski noLink team kuskiData={p} />
                      </div>
                      <ResultSecondaryData />
                    </ResultLink>
                  ))}
                  <LoadMore
                    disabled={!morePlayers}
                    type="button"
                    onClick={() => {
                      fetchMorePlayers({ q: query, offset: players.length });
                    }}
                  >
                    {morePlayers ? 'Show more' : 'No more results'}
                  </LoadMore>
                  {morePlayers && (
                    <LoadMore
                      type="button"
                      onClick={() => {
                        fetchMorePlayers({
                          q: query,
                          offset: players.length * -1,
                        });
                      }}
                    >
                      Show all results
                    </LoadMore>
                  )}
                </>
              )}
            </Paper>
          </Grid>
        )}
        {t === 'team' && (
          <Grid item xs={12} sm={6}>
            <Paper padding>
              <Header h2>
                Teams ({teams.length}
                {moreTeams && '+'})
              </Header>
              {teams.length !== 0 && (
                <>
                  {teams.map(v => (
                    <ResultLink key={v.Team} to={`/team/${v.Team}`}>
                      <div>{v.Team}</div>
                      <ResultSecondaryData />
                    </ResultLink>
                  ))}
                  <LoadMore
                    disabled={!moreTeams}
                    type="button"
                    onClick={() => {
                      fetchMoreTeams({ q: query, offset: teams.length });
                    }}
                  >
                    {moreTeams ? 'Show more' : 'No more results'}
                  </LoadMore>
                  {moreTeams && (
                    <LoadMore
                      type="button"
                      onClick={() => {
                        fetchMoreTeams({ q: query, offset: teams.length * -1 });
                      }}
                    >
                      Show all results
                    </LoadMore>
                  )}
                </>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

const SwitchThin = styled(Switch)`
  margin: -10px;
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
  color: ${p => p.theme.linkColor};
  :disabled {
    cursor: default;
    color: ${p => p.theme.lightTextColor};
  }
`;

const SearchBarWrapper = styled.div`
  padding: 30px 20px;
`;

export default Search;
