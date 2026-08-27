import TimeTable from '../../TimeTable';
import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

const AllTimesTab = ({ LevelIndex, cripple, crippleData, crippleLoading }) => {
  const { allLoading, allfinished, battlesForLevel } = useStoreState(
    state => state.Level,
  );

  const { getAllfinished } = useStoreActions(actions => actions.Level);

  useEffect(() => {
    if (cripple) {
      return;
    }

    if (allfinished.length === 0 || allLoading !== LevelIndex) {
      getAllfinished(LevelIndex);
    }
  }, []);

  if (cripple) {
    return <TimeTable data={crippleData} loading={crippleLoading} />;
  }

  return (
    <TimeTable
      loading={allLoading !== LevelIndex}
      data={allfinished}
      latestBattle={battlesForLevel[0]}
    />
  );
};

export default AllTimesTab;
