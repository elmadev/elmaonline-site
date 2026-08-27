import React, { useState, Fragment } from 'react';
import styled from '@emotion/styled';
import { Select, MenuItem } from '@material-ui/core';
import { PlayArrow, GetApp } from '@material-ui/icons';
import { Paper } from 'components/Paper';
import { ListContainer, ListHeader, ListCell, ListRow } from 'components/List';
import { isEmpty } from 'lodash';
import Time, { BattleTime } from 'components/Time';
import Kuski from 'components/Kuski';
import RankingValue from 'components/RankingValue';
import { sortResults, getBattleType } from 'utils/battle';

// pulls 2 entries from ranking history for all kuskis
const getKuskiRankingHistory = (allRankingHistory, KuskiIndex, battle) => {
  if (isEmpty(allRankingHistory)) {
    return [null, null];
  }

  const rowsAll = allRankingHistory.filter(
    r => r.KuskiIndex === KuskiIndex && r.BattleType === 'All',
  );

  const rowsType = allRankingHistory.filter(
    r => r.KuskiIndex === KuskiIndex && r.BattleType === getBattleType(battle),
  );

  return [
    rowsAll.length > 0 ? rowsAll[0] : null,
    rowsType.length > 0 ? rowsType[0] : null,
  ];
};

const LevelStatsContainer = props => {
  const [rankingSelect, setRankingSelect] = useState('All');
  const { battle, rankingHistory, runStats, openReplay, downloadRec } = props;

  const hasNoReplay =
    ['SP', 'FC', 'AP', 'HT', 'FT'].indexOf(battle.BattleType) > -1;

  if (!battle) return <Root>loading</Root>;
  if (runStats)
    if (battle.BattleIndex !== runStats.BattleIndex)
      return <Root>loading</Root>;

  return (
    <Root>
      <Paper>
        {battle.Results && (
          <ListContainer>
            <ListHeader>
              <ListCell width={30}>#</ListCell>
              <ListCell width={200}>Kuski</ListCell>
              <ListCell right width={150}>
                Result
              </ListCell>
              <ListCell right>Time played</ListCell>
              <ListCell right>Finishes</ListCell>
              <ListCell right>Apples Taken</ListCell>
              <ListCell right>
                <Select
                  value={rankingSelect}
                  onChange={e => setRankingSelect(e.target.value)}
                  name="extra"
                  displayEmpty
                >
                  <MenuItem value="All">Ranking (all)</MenuItem>
                  <MenuItem value="Type">Ranking (type)</MenuItem>
                </Select>
              </ListCell>
            </ListHeader>
            {[...battle.Results]
              .sort(sortResults(battle.BattleType))
              .map((r, i) => {
                // note that battle.Results can contain more entries than runStats.
                // it appears this happens if kuski joins for countdown but not for battle.
                const runStatsForKuski = runStats && runStats[r.KuskiIndex];

                const [kuskiRankingAll, kuskiRankingType] =
                  getKuskiRankingHistory(rankingHistory, r.KuskiIndex, battle);

                return (
                  <Fragment key={r.KuskiIndex}>
                    <Row
                      showArrow={openReplay}
                      onClick={openReplay ? () => openReplay(r) : null}
                    >
                      <ListCell width={30}>{i + 1}.</ListCell>
                      <ListCell width={battle.Multi === 1 ? 300 : 200}>
                        <Kuski kuskiData={r.KuskiData} flag team />
                        {battle.Multi === 1 && (
                          <>
                            {' '}
                            & <Kuski kuskiData={r.KuskiData2} flag team />
                          </>
                        )}
                      </ListCell>
                      <ListCell right width={150}>
                        <BattleTime
                          time={r.Time}
                          apples={r.Apples}
                          battleType={battle.BattleType}
                        />
                        {hasNoReplay ? null : (
                          <>
                            <PlayArrow />
                            <GetApp
                              onClick={e => {
                                e.stopPropagation();
                                downloadRec(r);
                              }}
                            />
                          </>
                        )}
                      </ListCell>
                      <ListCell right>
                        {runStatsForKuski ? (
                          <Time time={runStatsForKuski.PlayTime} apples={0} />
                        ) : (
                          '0,00'
                        )}
                      </ListCell>
                      <ListCell right>
                        {runStatsForKuski ? runStatsForKuski.Finishes : '0'}
                      </ListCell>
                      <ListCell right>
                        {runStatsForKuski ? runStatsForKuski.Apples : '0'}
                      </ListCell>
                      <ListCell right width={205}>
                        {rankingSelect === 'All' && (
                          <RankingValue
                            rankingHistory={kuskiRankingAll}
                            fallback="unavailable"
                          />
                        )}
                        {rankingSelect === 'Type' && (
                          <RankingValue
                            rankingHistory={kuskiRankingType}
                            fallback="unavailable"
                          />
                        )}
                      </ListCell>
                    </Row>
                  </Fragment>
                );
              })}
          </ListContainer>
        )}
      </Paper>
    </Root>
  );
};

const Root = styled.div`
  width: 60%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
  overflow: auto;
  @media screen and (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const Row = styled(ListRow)`
  svg {
    font-size: 20px;
    display: ${p => (p.showArrow ? 'inline-block' : 'none')};
    visibility: hidden;
  }
  :hover {
    svg {
      visibility: visible;
    }
  }
`;

export default LevelStatsContainer;
