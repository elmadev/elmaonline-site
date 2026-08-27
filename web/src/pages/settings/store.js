import { action, thunk, persist } from 'easy-peasy';
import {
  UserInfo,
  UpdateUserInfo,
  Ignored,
  Ignore,
  Unignore,
  DiscordAuthUrl,
  DiscordCode,
  NotificationSettings,
  DiscordRemove,
  ChangeSettings,
} from 'api';

export default {
  userInfo: '',
  error: '',
  message: '',
  setUserInfo: action((state, payload) => {
    state.userInfo = payload;
  }),
  setError: action((state, payload) => {
    state.error = payload;
  }),
  setMessage: action((state, payload) => {
    state.message = payload;
  }),
  getUserInfo: thunk(async (actions, payload) => {
    const get = await UserInfo(payload);
    if (get.ok) {
      actions.setUserInfo(get.data);
    }
  }),
  updateUserInfo: thunk(async (actions, payload) => {
    const update = await UpdateUserInfo(payload);
    if (update.ok) {
      if (update.data.success) {
        actions.setUserInfo(update.data.info);
        actions.setMessage(update.data.message);
      } else {
        actions.setError(update.data.message);
      }
    }
  }),
  ignored: [],
  setIgnored: action((state, payload) => {
    state.ignored = payload;
  }),
  getIgnored: thunk(async actions => {
    const get = await Ignored();
    if (get.ok) {
      actions.setIgnored(get.data);
    }
  }),
  ignore: thunk(async (actions, payload) => {
    const addIgnore = await Ignore(payload);
    if (addIgnore.ok) {
      actions.getIgnored();
    }
  }),
  unignore: thunk(async (actions, payload) => {
    const removeIgonre = await Unignore(payload);
    if (removeIgonre.ok) {
      actions.getIgnored();
    }
  }),
  settings: persist(
    {
      siteTheme: 0,
    },
    { storage: 'localStorage' },
  ),
  setSiteTheme: action((state, payload) => {
    state.settings.siteTheme = payload;
  }),
  url: '',
  notifSettings: null,
  setUrl: action((state, payload) => {
    state.url = payload;
  }),
  setSettings: action((state, payload) => {
    state.notifSettings = payload;
  }),
  getUrl: thunk(async (actions, payload) => {
    const get = await DiscordAuthUrl({ url: payload });
    if (get.ok) {
      actions.setUrl(get.data.url);
    }
  }),
  getSettings: thunk(async actions => {
    const get = await NotificationSettings();
    if (get.ok) {
      actions.setSettings(get.data);
    }
  }),
  sendCode: thunk(async (actions, payload) => {
    const post = await DiscordCode({ code: payload });
    if (post.ok) {
      actions.getSettings();
    }
  }),
  removeDiscord: thunk(async actions => {
    const post = await DiscordRemove();
    if (post.ok) {
      actions.getSettings();
    }
  }),
  changeNotifSetting: thunk(async (actions, payload) => {
    const post = await ChangeSettings(payload);
    if (post.ok) {
      actions.getSettings();
    }
  }),
  defaultZoom: persist(
    {
      scale: 100,
    },
    { storage: 'localStorage' },
  ),
  setDefaultZoom: action((state, scale) => {
    state.defaultZoom.scale = parseInt(scale, 10);
  }),
};
