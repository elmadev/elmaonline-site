import React, { useState, useEffect } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { has } from 'lodash';
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
      LevelData {
        LevelName
      }
      DrivenByData {
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
  const { levelPacks } = useStoreState(state => state.Search);
  const { getLevelPacks } = useStoreActions(actions => actions.Search);
  useEffect(() => {
    setMoreLevels(true);
    setMoreReplays(true);
    if (t === 'level') {
      getLevelPacks(q);
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
          <div>
            <div className={s.resultGroupTitle}>Replays</div>
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
                                'unknown'}
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
        )}
      </div>
    </div>
  );
};

export default withStyles(s)(Search);
