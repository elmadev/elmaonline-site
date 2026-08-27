import TimeTable from '../../TimeTable';
import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

const BestTimesTab = ({ LevelIndex, cripple, crippleData, crippleLoading }) => {
  const { besttimes, besttimesLoading, battlesForLevel } = useStoreState(
    state => state.Level,
  );

  const { getBesttimes } = useStoreActions(actions => actions.Level);

  useEffect(() => {
    if (cripple) {
      return;
    }

    if (besttimes.length === 0 || besttimesLoading !== LevelIndex) {
      getBesttimes({ levelId: LevelIndex, limit: 10000, eolOnly: 0 });
    }
  }, [cripple]);

  if (cripple) {
    return <TimeTable data={crippleData} loading={crippleLoading} />;
  }

  return (
    <TimeTable
      loading={besttimesLoading !== LevelIndex}
      data={besttimes}
      latestBattle={battlesForLevel[0]}
    />
  );
};

export default BestTimesTab;
