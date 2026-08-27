import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Paper } from 'components/Paper';
import { useInterval } from 'utils/useInterval';
import { estimateBattleStarts } from 'features/BattleList/estimateStarts';

const getLevelName = battle =>
  battle.BattleData ? battle.BattleData.LevelData?.LevelName : battle.LevelName;

const matchesLiveBattle = (leagueBattle, liveBattle) => {
  if (!leagueBattle || !liveBattle) {
    return false;
  }
  if (leagueBattle.BattleIndex) {
    return leagueBattle.BattleIndex === liveBattle.BattleIndex;
  }
  return (
    Boolean(leagueBattle.LevelName) &&
    leagueBattle.LevelName === liveBattle.LevelData?.LevelName
  );
};

const formatTimeLeft = seconds => {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = n => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

const DEFAULT_BREAK_MINUTES = 2;

const BattleStatus = ({
  battles,
  breakMinutes = DEFAULT_BREAK_MINUTES,
  onBattleEnd = null,
}) => {
  const { battles: liveBattles } = useStoreState(state => state.BattleList);
  const { getBattles } = useStoreActions(actions => actions.BattleList);

  useEffect(() => {
    getBattles({ limit: 30, latest: true });
  }, []);

  useInterval(() => {
    getBattles({ limit: 30, latest: true });
  }, 60000);

  const [, tick] = useState(0);
  useInterval(() => tick(t => t + 1), 1000);

  const breakSeconds =
    (Number(breakMinutes) > 0 ? Number(breakMinutes) : DEFAULT_BREAK_MINUTES) *
    60;

  const battlesWithStarts = useMemo(
    () =>
      Array.isArray(liveBattles)
        ? estimateBattleStarts(liveBattles, breakSeconds)
        : [],
    [liveBattles, breakSeconds],
  );

  const ongoing = battlesWithStarts.find(
    b => b.Aborted === 0 && b.InQueue === 0 && b.Finished === 0,
  );
  const ongoingMatch =
    ongoing && battles.find(b => matchesLiveBattle(b, ongoing));
  const ongoingSecondsLeft = ongoing
    ? parseInt(ongoing.Started) +
      (ongoing.Countdown || 0) +
      ongoing.Duration * 60 -
      Math.floor(Date.now() / 1000)
    : null;
  const isOngoingActive = Boolean(ongoingMatch) && ongoingSecondsLeft > 0;

  const nextQueued = battlesWithStarts
    .filter(b => b.Aborted === 0 && b.InQueue === 1 && b.Starts)
    .sort((a, b) => a.Starts - b.Starts)[0];
  const nextMatch =
    !isOngoingActive && nextQueued
      ? battles.find(b => matchesLiveBattle(b, nextQueued))
      : null;

  const status = isOngoingActive ? 'ongoing' : nextMatch ? 'break' : 'none';
  const prevStatusRef = useRef(status);
  useEffect(() => {
    if (prevStatusRef.current === 'ongoing' && status !== 'ongoing') {
      onBattleEnd?.();
    }
    prevStatusRef.current = status;
  }, [status]);

  if (isOngoingActive) {
    const secondsLeft = ongoingSecondsLeft;
    return (
      <Margin>
        <Paper padding highlight>
          <Container>
            <Header>Battle!</Header>
            <Level>{getLevelName(ongoingMatch)}.lev</Level>
            <TimeLeft>{formatTimeLeft(secondsLeft)}</TimeLeft>
          </Container>
        </Paper>
      </Margin>
    );
  }

  if (nextMatch) {
    const secondsLeft = nextQueued.Starts - Math.floor(Date.now() / 1000);
    return (
      <Margin>
        <Paper padding>
          <Container>
            <Header>Break!</Header>
            <Level>Next up: {getLevelName(nextMatch)}.lev</Level>
            <TimeLeft>{formatTimeLeft(secondsLeft)}</TimeLeft>
          </Container>
        </Paper>
      </Margin>
    );
  }

  return null;
};

const Margin = styled.div`
  margin: 12px;
`;

const Header = styled.div`
  font-size: 68px;
  font-weight: bold;
`;

const Level = styled.div`
  font-size: 40px;
`;

const TimeLeft = styled.div`
  font-size: 196px;
  font-weight: bold;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

BattleStatus.propTypes = {
  battles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  breakMinutes: PropTypes.number,
  onBattleEnd: PropTypes.func,
};

export default BattleStatus;
