import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect } from 'react';
import LeaderHistory from 'components/LeaderHistory';

const LeaderHistoryTab = ({
  LevelIndex,
  cripple,
  crippleData,
  crippleLoading,
}) => {
  const { leaderHistory, leaderHistoryLoading } = useStoreState(
    state => state.Level,
  );

  const { getLeaderHistory } = useStoreActions(actions => actions.Level);

  useEffect(() => {
    if (cripple) {
      return;
    }

    if (leaderHistory.length === 0 || leaderHistoryLoading !== LevelIndex) {
      getLeaderHistory({ LevelIndex });
    }
  }, []);

  if (cripple) {
    return <LeaderHistory allFinished={crippleData} loading={crippleLoading} />;
  }

  return (
    <LeaderHistory
      allFinished={leaderHistory}
      loading={leaderHistoryLoading !== LevelIndex}
    />
  );
};

export default LeaderHistoryTab;
