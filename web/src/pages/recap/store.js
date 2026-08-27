import {
  RecapOverall,
  RecapPlayer,
  RecapBestof,
  RecalPlayerAll,
  RecapOverAllAll,
} from 'api';
import { model } from 'utils/easy-peasy';

export default {
  overall: {
    ...model(RecapOverall),
  },
  player: {
    ...model(RecapPlayer),
  },
  bestof: {
    ...model(RecapBestof),
  },
  playerAll: {
    ...model(RecalPlayerAll),
  },
  overallAll: {
    ...model(RecapOverAllAll),
  },
};
