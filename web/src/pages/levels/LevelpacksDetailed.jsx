import React from 'react';
import styled from '@emotion/styled';
import { ListRow, ListCell, ListContainer, ListHeader } from 'components/List';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import { FixedSizeList as List } from 'react-window';
import useElementSize from 'utils/useWindowSize';
import FavStar from './FavStar';
import { formatTimeSpent, formatAttempts, formatPct } from 'utils/format';

const disableTT = true;

const LevelpacksDetailed = ({
  levelpacksSorted,
  stats,
  loggedIn,
  addFav,
  removeFav,
  levelpackStats = [],
}) => {
  const windowSize = useElementSize();
  const listHeight = windowSize.height - 264;

  // Create a map from LevelPackIndex to stats for quick lookup
  const statsMap = React.useMemo(() => {
    const map = {};
    if (disableTT) {
      return map;
    }
    if (Array.isArray(levelpackStats)) {
      levelpackStats.forEach(stat => {
        map[stat.LevelPackIndex] = stat;
      });
    }
    return map;
  }, [levelpackStats]);

  return (
    <Root>
      <Table flex direction="column">
        <StyledListHeader>
          <ListCell>
            <NewLineWrapper>Pack</NewLineWrapper>
            <NewLineWrapper>Long Name</NewLineWrapper>
          </ListCell>
          <ListCell>
            <NewLineWrapper>Favorite</NewLineWrapper>
          </ListCell>
          {loggedIn && !disableTT && (
            <ListCell>
              <NewLineWrapper>My total</NewLineWrapper>
            </ListCell>
          )}
          <ListCell>
            <NewLineWrapper># Attempts</NewLineWrapper>
            <NewLineWrapper>Total Time Played</NewLineWrapper>
          </ListCell>
          <ListCell>
            <NewLineWrapper>Attempts %</NewLineWrapper>
            <NewLineWrapper>Time %</NewLineWrapper>
            <NewLineWrapper>(Finished/Dead/Escaped)</NewLineWrapper>
          </ListCell>
          <ListCell>
            <NewLineWrapper># Levels (% Finished)</NewLineWrapper>
            <NewLineWrapper title="The average number of kuskis that played each level.">
              (Avg. Kuski Count)
            </NewLineWrapper>
            <NewLineWrapper>Top Record Holder(s)</NewLineWrapper>
          </ListCell>
          <ListCell>
            <NewLineWrapper title="The shortest and longest record time for levels in the pack.">
              Shortest - Longest Record
            </NewLineWrapper>
            <NewLineWrapper title="The average time of first place finished for all levels in the pack.">
              Avg. Record Time
            </NewLineWrapper>
          </ListCell>
        </StyledListHeader>
        <List
          height={listHeight}
          itemCount={levelpacksSorted.length}
          itemSize={63}
        >
          {({ index, style }) => {
            const p = levelpacksSorted[index];
            const st = (stats && stats[p.LevelPackIndex]) || null;

            const url = `/levels/packs/${p.LevelPackName}`;

            const countAll = st?.LevelCountAll || 0;
            const finished = statsMap[p.LevelPackIndex]?.LevelsFinished || 0;

            return (
              <div style={style} key={p.LevelPackIndex}>
                <Row style={style} key={p.LevelPackIndex}>
                  <ListCell to={url}>
                    <ShortName>{p.LevelPackName}</ShortName>
                    <LongName>{p.LevelPackLongName}</LongName>
                  </ListCell>
                  <ListCell>
                    <FavStar pack={p} {...{ loggedIn, addFav, removeFav }} />
                  </ListCell>
                  {loggedIn && !disableTT && (
                    <ListCell>
                      {statsMap[p.LevelPackIndex]?.TotalTime &&
                      finished === countAll ? (
                        <NewLineWrapper>
                          <Time time={statsMap[p.LevelPackIndex].TotalTime} />
                        </NewLineWrapper>
                      ) : null}
                      {finished !== countAll ? (
                        <NewLineWrapper>
                          {finished}/{countAll}
                        </NewLineWrapper>
                      ) : null}
                    </ListCell>
                  )}

                  {!st && (
                    <>
                      <ListCell />
                      <ListCell>
                        <NewLineWrapper>
                          Level stats not available.
                        </NewLineWrapper>
                      </ListCell>
                      <ListCell />
                      <ListCell />
                    </>
                  )}

                  {st &&
                    (() => {
                      const timesPct = [
                        ['F', formatPct(st.TimeF, st.TimeAll)],
                        ['D', formatPct(st.TimeD, st.TimeAll)],
                        ['E', formatPct(st.TimeE, st.TimeAll)],
                      ];

                      const attemptsPct = [
                        ['F', formatPct(st.AttemptsF, st.AttemptsAll)],
                        ['D', formatPct(st.AttemptsD, st.AttemptsAll)],
                        ['E', formatPct(st.AttemptsE, st.AttemptsAll)],
                      ];

                      return (
                        <>
                          <ListCell to={url}>
                            <NewLineWrapper>
                              <span title={st.AttemptsAll.toLocaleString()}>
                                {formatAttempts(st.AttemptsAll)}
                              </span>
                            </NewLineWrapper>
                            <NewLineWrapper>
                              {formatTimeSpent(st.TimeAll)}
                            </NewLineWrapper>
                          </ListCell>
                          <ListCell to={url}>
                            <NewLineWrapper>
                              {attemptsPct[0][1]}
                              {` / `}
                              {attemptsPct[1][1]}
                              {` / `}
                              {attemptsPct[2][1]}
                            </NewLineWrapper>
                            <NewLineWrapper>
                              {timesPct[0][1]}
                              {` / `}
                              {timesPct[1][1]}
                              {` / `}
                              {timesPct[2][1]}
                            </NewLineWrapper>
                          </ListCell>
                          <ListCell>
                            <NewLineWrapper>
                              {st.LevelCountAll || 0}
                              {` `}(
                              {formatPct(st.LevelCountF, st.LevelCountAll, 0)}%)
                              {` `}({Number(st.AvgKuskiPerLevel).toFixed(2)})
                            </NewLineWrapper>
                            {Array.isArray(st.TopRecordKuskis) && (
                              <>
                                {st.TopRecordKuskis.length > 2 && (
                                  <NewLineWrapper>
                                    3 or more kuskis
                                    {` (${st.TopRecordCount})`}
                                  </NewLineWrapper>
                                )}

                                {st.TopRecordKuskis.length <= 2 && (
                                  <NewLineWrapper>
                                    {st.TopRecordKuskis.map((k, index, arr) => (
                                      <>
                                        <Kuski
                                          key={k.KuskiIndex}
                                          kuskiData={k}
                                          flag={true}
                                        />
                                        {index < arr.length - 1 && (
                                          <span>, </span>
                                        )}
                                      </>
                                    ))}
                                    {` (${st.TopRecordCount})`}
                                  </NewLineWrapper>
                                )}
                              </>
                            )}
                          </ListCell>
                          <ListCell to={url}>
                            {st.MinRecordTime && (
                              <Time time={st.MinRecordTime} />
                            )}
                            {` - `}
                            {st.MaxRecordTime && (
                              <Time time={st.MaxRecordTime} />
                            )}
                            <NewLineWrapper>
                              {st.AvgRecordTime && (
                                <Time time={st.AvgRecordTime} />
                              )}
                            </NewLineWrapper>
                          </ListCell>
                        </>
                      );
                    })()}
                </Row>
              </div>
            );
          }}
        </List>
      </Table>
    </Root>
  );
};

const Root = styled.div`
  overflow: auto;
`;

const Table = styled(ListContainer)`
  margin-top: 10px;
  min-width: 1000px;
  background: ${p => p.theme.paperBackground};
`;

// because of scroll bar in table body
const StyledListHeader = styled(ListHeader)`
  padding-right: 17px;
`;

const Row = styled(ListRow)`
  height: 63px;
  overflow-y: hidden;
  :hover {
    height: auto;
    overflow-y: visible;
    z-index: 10;
    position: relative;
  }
`;

const NewLineWrapper = styled.div`
  margin-bottom: 3px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ShortName = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${p => p.theme.linkColor};
`;

const LongName = styled.div`
  font-size: 13px;
`;

export default LevelpacksDetailed;
