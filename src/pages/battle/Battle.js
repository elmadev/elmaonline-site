import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { groupBy, mapValues, sumBy, filter } from 'lodash';
import { battleStatus } from 'utils/battle';
import RecView from './RecView';
import RightBarContainer from './RightBarContainer';
import LevelStatsContainer from './LevelStatsContainer';

const runData = runs => {
  const a = groupBy(runs.rows, 'KuskiIndex');
  const kuskis = mapValues(a, (value, key) => {
    return {
      KuskiIndex: key,
      Apples: sumBy(value, 'Apples'),
      Finishes: filter(value, { Finished: 'F' }).length,
      PlayTime: sumBy(value, 'Time'),
    };
  });
  kuskis.BattleIndex = runs.rows[0].BattleIndex;
  return kuskis;
};

const Battle = props => {
  let runStats = null;
  const { BattleIndex } = props;
  const {
    allBattleTimes,
    battle,
    rankingHistory,
    allBattleRuns,
  } = useStoreState(state => state.Battle);
  const {
    getAllBattleTimes,
    getBattle,
    getRankingHistoryByBattle,
    getAllBattleRuns,
  } = useStoreActions(state => state.Battle);

  useEffect(() => {
    runStats = null;
    getAllBattleTimes(BattleIndex);
    getAllBattleRuns(BattleIndex);
    getBattle(BattleIndex);
    getRankingHistoryByBattle(BattleIndex);
  }, [BattleIndex]);

  if (allBattleRuns) runStats = runData(allBattleRuns);

  const isWindow = typeof window !== 'undefined';

  if (!battle) return <Root>Battle is unfinished</Root>;
  if (runStats)
    if (BattleIndex !== runStats.BattleIndex) return <Root>loading</Root>;

  return (
    <Root>
      <RecView
        isWindow={isWindow}
        BattleIndex={BattleIndex}
        levelIndex={battle.LevelIndex}
        battleStatus={battleStatus(battle)}
      />
      <RightBarContainer battle={battle} allBattleTimes={allBattleTimes} />
      <LevelStatsContainer
        battle={battle}
        rankingHistory={rankingHistory}
        runStats={runStats}
      />
    </Root>
  );
};

Battle.propTypes = {
  BattleIndex: PropTypes.number.isRequired,
};

const Root = styled.div`
  padding: 7px;
`;

export default Battle;
