import React, { useState } from 'react';
import styled from 'styled-components';
import { Select, MenuItem } from '@material-ui/core';
import { Paper } from 'styles/Paper';
import { ListContainer, ListHeader, ListCell, ListRow } from 'styles/List';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import { sortResults, getBattleType } from 'utils/battle';

const getExtra = (KuskiIndex, extra, rankingHistory, battle) => {
  let typeFilter = '';
  let value = '';
  if (Object.keys(rankingHistory).length === 0) return 'unavailable';
  if (extra === '') {
    return '';
  }
  if (extra === 'RankingAll') {
    typeFilter = 'All';
    value = 'Ranking';
  }
  if (extra === 'RankingType') {
    typeFilter = getBattleType(battle);
    value = 'Ranking';
  }
  if (extra === 'RankingIncreaseAll') {
    typeFilter = 'All';
    value = 'Increase';
  }
  if (extra === 'RankingIncreaseType') {
    typeFilter = getBattleType(battle);
    value = 'Increase';
  }
  const filtered = rankingHistory.filter(
    r => r.KuskiIndex === KuskiIndex && r.BattleType === typeFilter,
  );
  if (filtered.length > 0) {
    return parseInt(filtered[0][value], 10).toFixed(2);
  }
  return '';
};

const SpecialResult = (time, type) => {
  if (type === 'SP') {
    return (time / 100).toFixed(2);
  }
  return time;
};

const LevelStatsContainer = props => {
  const [extra, setExtra] = useState('');
  const { battle, rankingHistory, runStats } = props;

  if (!battle) return <Root>loading</Root>;
  if (runStats)
    if (battle.BattleIndex !== runStats.BattleIndex)
      return <Root>loading</Root>;

  return (
    <Root>
      <Paper>
        {battle.Results && runStats && (
          <ListContainer>
            <ListHeader>
              <ListCell right width={30}>
                #
              </ListCell>
              <ListCell width={200}>Kuski</ListCell>
              <ListCell right width={150}>
                Result
              </ListCell>
              <ListCell right>Time played</ListCell>
              <ListCell right>Finishes</ListCell>
              <ListCell right>Apples Taken</ListCell>
              <ListCell right>
                <Select
                  value={extra}
                  onChange={e => setExtra(e.target.value)}
                  name="extra"
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Extra
                  </MenuItem>
                  <MenuItem value="RankingAll">Ranking (all)</MenuItem>
                  <MenuItem value="RankingType">Ranking (type)</MenuItem>
                  <MenuItem value="RankingIncreaseAll">
                    Ranking Increase (all)
                  </MenuItem>
                  <MenuItem value="RankingIncreaseType">
                    Ranking Increase (type)
                  </MenuItem>
                </Select>
              </ListCell>
            </ListHeader>
            {[...battle.Results]
              .sort(sortResults(battle.BattleType))
              .map((r, i) => {
                return (
                  <>
                    <ListRow key={r.KuskiIndex}>
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
                        {battle.BattleType !== 'SP' &&
                        battle.BattleType !== 'FC' ? (
                          <Time time={r.Time} apples={r.Apples} />
                        ) : (
                          SpecialResult(r.Time, battle.BattleType)
                        )}
                      </ListCell>
                      <ListCell right>
                        {runStats ? (
                          <Time
                            time={runStats[r.KuskiIndex].PlayTime}
                            apples={0}
                          />
                        ) : (
                          '0,00'
                        )}
                      </ListCell>
                      <ListCell right>
                        {runStats && runStats[r.KuskiIndex].Finishes
                          ? runStats[r.KuskiIndex].Finishes
                          : '0'}
                      </ListCell>
                      <ListCell right>
                        {runStats ? runStats[r.KuskiIndex].Apples : '0'}
                      </ListCell>
                      <ListCell right width={205}>
                        {getExtra(r.KuskiIndex, extra, rankingHistory, battle)}
                      </ListCell>
                    </ListRow>
                  </>
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
`;

export default LevelStatsContainer;
