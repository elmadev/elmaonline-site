import { model } from 'utils/easy-peasy';
import { BattleLeagues, AddBattleLeague } from 'api';

export default {
  ...model(BattleLeagues, AddBattleLeague),
};
