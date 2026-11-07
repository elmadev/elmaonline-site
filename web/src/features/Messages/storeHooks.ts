import { createTypedHooks } from 'easy-peasy';
import type { Thunk } from 'easy-peasy';
import type { KuskiData } from 'types/kuski';
import type { MessagesModel } from './store';

// the global store isn't typed yet, these are the parts this feature uses
type StoreModel = {
  Login: {
    loggedIn: boolean;
    userid?: string;
    username?: string;
  };
  Kuskis: {
    playerList: KuskiData[];
    getPlayers: Thunk<StoreModel['Kuskis']>;
  };
  Messages: MessagesModel;
};

export const { useStoreState, useStoreActions } =
  createTypedHooks<StoreModel>();
