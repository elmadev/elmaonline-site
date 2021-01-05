import React from 'react';
import BattleCard from 'components/BattleCard';
import { useStoreState } from 'easy-peasy';

export default function CurrentBattleCard() {
  const { currentBattle } = useStoreState(state => state.BattleList);

  return <BattleCard battle={currentBattle} />;
}
