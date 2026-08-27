import { action, persist } from 'easy-peasy';

export default {
  settings: persist(
    {
      revealOnClick: false,
      autoPlay: false,
      grass: true,
      arrows: false,
      pictures: true,
      customSkyGround: true,
      theater: false,
      // scaling (%) for default zoom on page load
      zoomScale: 100,
      lgrOverride: '',
      lgrUrl: '',
    },
    { storage: 'localStorage' },
  ),
  toggleSetting: action((state, payload) => {
    state.settings[payload] = !state.settings[payload];
  }),
  setZoomScale: action((state, payload) => {
    state.settings.zoomScale = parseInt(payload, 10);
  }),
  setLgrOverride: action((state, payload) => {
    state.settings.lgrOverride = payload.name;
    state.settings.lgrUrl = payload.url;
  }),
};
