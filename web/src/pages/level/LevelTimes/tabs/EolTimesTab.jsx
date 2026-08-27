import TimeTable from '../../TimeTable';
import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

const EolTimesTab = ({ LevelIndex }) => {
  const { eolLoading, eoltimes, battlesForLevel } = useStoreState(
    state => state.Level,
  );

  const { getEoltimes } = useStoreActions(actions => actions.Level);

  useEffect(() => {
    if (eoltimes.length === 0 || eolLoading !== LevelIndex) {
      getEoltimes({ levelId: LevelIndex, limit: 10000, eolOnly: 1 });
    }
  }, []);

  return (
    <TimeTable
      loading={eolLoading !== LevelIndex}
      data={eoltimes}
      latestBattle={battlesForLevel[0]}
    />
  );
};

export default EolTimesTab;
