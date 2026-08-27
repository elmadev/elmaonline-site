import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { groupBy, mapValues, sumBy, filter } from 'lodash';
import Layout from 'components/Layout';
import styled from '@emotion/styled';
import config from 'config';
import Time from '../../components/Time';
import Kuski from '../../components/Kuski';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { battleStatus } from 'utils/battle';
import RecView from './RecView';
import RightBarContainer from './RightBarContainer';
import LevelStatsContainer from './LevelStatsContainer';
import { downloadRec } from 'utils/misc';
import { useParams } from '@tanstack/react-router';

const runData = runs => {
  if (runs.count === 0) {
    return null;
  }
  if (runs.multi === 0) {
    const kuskiRuns = groupBy(runs.rows, 'KuskiIndex');
    const runStats = mapValues(kuskiRuns, (value, key) => {
      return {
        KuskiIndex: key,
        Apples: sumBy(value, 'Apples'),
        Finishes: filter(value, { Finished: 'F' }).length,
        PlayTime: sumBy(value, 'Time'),
      };
    });
    if (runs.rows[0]) runStats.BattleIndex = runs.rows[0].BattleIndex;
    return runStats;
  }
  const kuskiRuns = groupBy(runs.rows, 'KuskiIndex1');
  const runStats = mapValues(kuskiRuns, (value, key) => {
    return {
      KuskiIndex: key,
      Apples: sumBy(value, 'Apples'),
      Finishes: filter(value, { Finished: 'F' }).length,
      PlayTime: sumBy(value, 'Time'),
    };
  });
  if (runs.rows[0]) runStats.BattleIndex = runs.rows[0].BattleIndex;
  return runStats;
};

const getWinnerData = battle => {
  if (battle && battle.Results && battle.Results.length > 0) {
    const r = battle.Results[0];

    return {
      Kuski: r.KuskiData || {},
      Time: r.Time,
      Apples: r.Apples,
    };
  }

  return null;
};

const Battle = () => {
  const { BattleId } = useParams({ strict: false });
  const BattleIndex = parseInt(BattleId, 10);
  const [replayUrl, setReplayUrl] = useState('');
  const [winner, setWinner] = useState(null);
  let runStats = null;
  const { allBattleTimes, battle, rankingHistory, allBattleRuns, replays } =
    useStoreState(state => state.Battle);
  const {
    getAllBattleTimes,
    getBattle,
    getRankingHistoryByBattle,
    getAllBattleRuns,
    getReplays,
  } = useStoreActions(state => state.Battle);

  useEffect(() => {
    runStats = null;
    getAllBattleTimes(BattleIndex);
    getAllBattleRuns(BattleIndex);
    getBattle(BattleIndex);
    getRankingHistoryByBattle(BattleIndex);
    getReplays(BattleIndex);
    setReplayUrl('');
  }, [BattleIndex]);

  useEffect(() => {
    setWinner(getWinnerData(battle));
  }, [battle]);

  if (allBattleRuns !== null) runStats = runData(allBattleRuns);

  const isWindow = typeof window !== 'undefined';

  const isMobile = useMediaQuery('(max-width: 1000px)');

  const recUrl = TimeFileData => {
    return `${config.s3Url}time/${TimeFileData.UUID}-${TimeFileData.MD5}/${TimeFileData.TimeIndex}.rec`;
  };

  const openReplay = time => {
    const TimeFileData = replays.find(r => r.TimeIndex === time.TimeIndex);
    if (TimeFileData) {
      setReplayUrl(recUrl(TimeFileData));
    }
    setWinner({
      Kuski: time.KuskiData || {},
      Time: time.Time,
      Apples: time.Apples,
    });
  };

  const dlRec = time => {
    const TimeFileData = replays.find(r => r.TimeIndex === time.TimeIndex);
    if (TimeFileData) {
      downloadRec(
        recUrl(TimeFileData),
        battle.LevelData.LevelName,
        time.KuskiData.Kuski,
        time.Time,
      );
    }
  };

  return (
    <Layout
      t={`Battle - ${
        battle
          ? battle.LevelData
            ? battle.LevelData.LevelName
            : BattleIndex
          : BattleIndex
      }`}
    >
      <MainContainer>
        {battle && winner && isMobile && (
          <WinnerTitle>
            <Kuski kuskiData={winner.Kuski} flag={true} team={true} />
            <span>&nbsp;</span>
            <Time time={winner.Time} apples={winner.Apples} />
          </WinnerTitle>
        )}
        {battle && battle.LevelIndex ? (
          <RecView
            isWindow={isWindow}
            BattleIndex={BattleIndex}
            levelIndex={battle.LevelIndex}
            battleStatus={battleStatus(battle)}
            replayUrl={replayUrl}
            player={winner}
            levelName={battle.LevelData.LevelName}
            hasReplay={Boolean(battle.RecFileName)}
          />
        ) : (
          <div />
        )}
        {battle && allBattleTimes ? (
          <RightBarContainer
            battle={battle}
            allBattleTimes={allBattleTimes}
            aborted={battle.Aborted}
            openReplay={replays.length === 0 ? null : time => openReplay(time)}
          />
        ) : (
          <div />
        )}
        {battle && rankingHistory ? (
          <LevelStatsContainer
            openReplay={replays.length === 0 ? null : time => openReplay(time)}
            battle={battle}
            rankingHistory={rankingHistory}
            runStats={runStats}
            downloadRec={time => dlRec(time)}
          />
        ) : (
          <div>
            <span>loading...</span>
          </div>
        )}
      </MainContainer>
    </Layout>
  );
};

const MainContainer = styled.div`
  display: inline-block;
  width: 100%;
`;

const WinnerTitle = styled.div`
  padding-left: 7px;
  margin-bottom: 2px;
`;

export default Battle;
