import { action, persist } from 'easy-peasy';
import type { Action } from 'easy-peasy';
import type { SkinTone } from 'frimousse';
import type { KuskiData } from 'types/kuski';
import type { ActiveConversation } from 'types/message';

type OpenChatPayload = {
  active?: ActiveConversation;
  recipient?: KuskiData | null;
} | void;

export type MessagesModel = {
  open: boolean;
  minimised: boolean;
  active: ActiveConversation;
  recipient: KuskiData | null;
  drafts: Record<number, string>;
  infoOpen: boolean;
  setInfoOpen: Action<MessagesModel, boolean>;
  openChat: Action<MessagesModel, OpenChatPayload>;
  closeChat: Action<MessagesModel>;
  setMinimised: Action<MessagesModel, boolean>;
  setActive: Action<MessagesModel, ActiveConversation>;
  setDraft: Action<MessagesModel, { key: number; text: string }>;
  settings: { corner: 'left' | 'right'; hideOnline: boolean };
  setCorner: Action<MessagesModel, 'left' | 'right'>;
  setHideOnline: Action<MessagesModel, boolean>;
  // recently used emojis first, and the picker's skin tone
  emoji: { recent: string[]; skinTone: SkinTone };
  addRecentEmoji: Action<MessagesModel, string>;
  setSkinTone: Action<MessagesModel, SkinTone>;
};

const maxRecentEmojis = 24;

const store: MessagesModel = {
  open: false,
  minimised: false,
  active: null,
  recipient: null,
  drafts: {},
  infoOpen: false,
  setInfoOpen: action((state, payload) => {
    state.infoOpen = payload;
  }),
  openChat: action((state, payload) => {
    state.open = true;
    state.minimised = false;
    if (payload?.active !== undefined) {
      state.active = payload.active;
    }
    state.recipient = payload?.recipient || null;
  }),
  closeChat: action(state => {
    state.open = false;
  }),
  setMinimised: action((state, payload) => {
    state.minimised = payload;
  }),
  setActive: action((state, payload) => {
    state.active = payload;
    state.recipient = null;
  }),
  setDraft: action((state, payload) => {
    state.drafts[payload.key] = payload.text;
  }),
  settings: persist(
    {
      corner: 'right',
      hideOnline: false,
    },
    { storage: 'localStorage' },
  ),
  setCorner: action((state, payload) => {
    state.settings.corner = payload;
  }),
  setHideOnline: action((state, payload) => {
    state.settings.hideOnline = payload;
  }),
  emoji: persist(
    {
      recent: [],
      skinTone: 'none',
    },
    { storage: 'localStorage' },
  ),
  addRecentEmoji: action((state, payload) => {
    state.emoji.recent = [
      payload,
      ...state.emoji.recent.filter(e => e !== payload),
    ].slice(0, maxRecentEmojis);
  }),
  setSkinTone: action((state, payload) => {
    state.emoji.skinTone = payload;
  }),
};

export default store;
