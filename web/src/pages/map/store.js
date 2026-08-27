import { action, thunk } from 'easy-peasy';
import { KuskiMap, AddKuskiMap } from 'api';

export default {
  markerList: [],
  setMarkerList: action((state, payload) => {
    state.markerList = payload;
  }),
  getMarkers: thunk(async actions => {
    const markers = await KuskiMap();
    if (markers.ok) {
      actions.setMarkerList(markers.data);
    }
  }),
  addMarker: thunk(async (actions, payload) => {
    const add = await AddKuskiMap(payload);
    if (add.ok) {
      actions.getMarkers();
    }
  }),
};
