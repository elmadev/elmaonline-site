// 'online' is active in the last 3 minutes, 'away' in the last hour
export type OnlineStatus = 'online' | 'away' | null;

export type MessageKuski = {
  KuskiIndex: number;
  Kuski: string;
  Country?: string;
  OnlineStatus?: OnlineStatus;
};

export type MessageData = {
  MessageIndex: number;
  ConversationIndex: number;
  KuskiIndex: number;
  Text: string;
  CreatedAt: number;
  Type: 'text' | 'system';
  ExpiresAt: number | null;
  KuskiData?: { Kuski: string } | null;
  Pending?: boolean;
};

export type ConversationData = {
  ConversationIndex: number;
  Name: string | null;
  IsGroup: number;
  CreatedBy: number;
  CreatedAt: number;
  LastMessageAt: number;
  Members: { KuskiIndex: number; KuskiData: MessageKuski | null }[];
  Unread: number;
  LastMessage: MessageData | null;
};

export type ActiveConversation = number | 'new' | null;
