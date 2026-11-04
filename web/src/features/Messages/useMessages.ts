import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';
import { useStoreState } from './storeHooks';
import {
  apiData,
  GetConversations,
  GetMessages,
  StartConversation,
  SendMessage,
  DeleteMessage,
  MarkConversationRead,
  AddConversationMembers,
  LeaveConversation,
  RenameConversation,
  MessageHeartbeat,
} from 'api';
import type { ConversationData, MessageData } from 'types/message';
import type { KuskiData } from 'types/kuski';

const pageSize = 50;

// react-query only pauses polling when the tab is hidden, not when another
// window has focus, so the queries below are disabled while the window isn't
// focused. stale queries refetch as soon as it's focused again
const subscribeFocus = (onChange: () => void) => {
  window.addEventListener('focus', onChange);
  window.addEventListener('blur', onChange);
  document.addEventListener('visibilitychange', onChange);
  return () => {
    window.removeEventListener('focus', onChange);
    window.removeEventListener('blur', onChange);
    document.removeEventListener('visibilitychange', onChange);
  };
};

const useWindowFocused = () =>
  useSyncExternalStore(subscribeFocus, () => document.hasFocus());

const pollOptions = (interval: number, focused: boolean) => ({
  enabled: focused,
  refetchInterval: interval,
  refetchOnMount: true,
  staleTime: 10000,
});

const keys = {
  conversations: ['MessageConversations'],
  thread: (ConversationIndex: number) => ['MessageThread', ConversationIndex],
  heartbeat: ['MessageHeartbeat'],
};

// updates your online status and gets the unread count, every 60s while the window is
// focused. it's mounted by the top bar so it runs on every page
export const useHeartbeat = () => {
  const focused = useWindowFocused();
  const { loggedIn } = useStoreState(state => state.Login);
  const { hideOnline } = useStoreState(state => state.Messages.settings);
  const { data } = useQuery({
    queryKey: [...keys.heartbeat, hideOnline],
    queryFn: (): Promise<{ unread: number }> =>
      apiData(MessageHeartbeat({ hidden: hideOnline })),
    enabled: Boolean(loggedIn) && focused,
    refetchInterval: 60000,
    refetchOnMount: true,
    staleTime: 30000,
  });
  return { unread: data?.unread || 0 };
};

const fetchConversations = (): Promise<ConversationData[]> =>
  apiData(GetConversations());

export const useConversations = () => {
  const focused = useWindowFocused();
  const { data, isLoading } = useQuery({
    queryKey: keys.conversations,
    queryFn: fetchConversations,
    ...pollOptions(60000, focused),
  });
  return { conversations: data || [], isLoading };
};

export const useThread = (ConversationIndex: number) => {
  const focused = useWindowFocused();
  return useInfiniteQuery({
    queryKey: keys.thread(ConversationIndex),
    queryFn: ({ pageParam }): Promise<MessageData[]> =>
      apiData(
        GetMessages({
          ConversationIndex,
          before: pageParam || undefined,
          limit: pageSize,
        }),
      ),
    initialPageParam: 0,
    // pages are newest first, the next page is older than the last message
    getNextPageParam: lastPage =>
      lastPage.length === pageSize
        ? lastPage[lastPage.length - 1].MessageIndex
        : undefined,
    ...pollOptions(15000, focused),
  });
};

// refreshes the list and badge after something changed
const useRefresh = () => {
  const queryClient = useQueryClient();
  return (ConversationIndex?: number) => {
    queryClient.invalidateQueries({ queryKey: keys.conversations });
    queryClient.invalidateQueries({ queryKey: keys.heartbeat });
    if (ConversationIndex) {
      queryClient.invalidateQueries({
        queryKey: keys.thread(ConversationIndex),
      });
    }
  };
};

type ThreadData = InfiniteData<MessageData[], number>;

const addNewest = (
  old: ThreadData | undefined,
  message: MessageData,
): ThreadData =>
  old
    ? {
        ...old,
        pages: [[message, ...(old.pages[0] || [])], ...old.pages.slice(1)],
      }
    : { pages: [[message]], pageParams: [0] };

const mapMessages = (
  old: ThreadData | undefined,
  fn: (messages: MessageData[]) => MessageData[],
) => (old ? { ...old, pages: old.pages.map(fn) } : old);

type SendData = { Text: string; ExpireAfter: number };

// the message shows right away as pending and is swapped for the saved one
// when the api responds, or removed if sending failed
export const useSendMessage = (ConversationIndex: number, userid: number) => {
  const queryClient = useQueryClient();
  const refresh = useRefresh();
  const queryKey = keys.thread(ConversationIndex);
  return useMutation({
    mutationFn: (data: SendData): Promise<MessageData> =>
      apiData(SendMessage({ ConversationIndex, ...data })),
    onMutate: async data => {
      // a refetch in flight would overwrite the pending message
      await queryClient.cancelQueries({ queryKey });
      const CreatedAt = Math.floor(Date.now() / 1000);
      const pending: MessageData = {
        // negative so it never clashes with a real index
        MessageIndex: -Date.now(),
        ConversationIndex,
        KuskiIndex: userid,
        Text: data.Text,
        CreatedAt,
        Type: 'text',
        ExpiresAt: data.ExpireAfter ? CreatedAt + data.ExpireAfter : null,
        Pending: true,
      };
      queryClient.setQueryData<ThreadData>(queryKey, old =>
        addNewest(old, pending),
      );
      return { pendingIndex: pending.MessageIndex };
    },
    onError: (_error, _data, context) => {
      queryClient.setQueryData<ThreadData>(queryKey, old =>
        mapMessages(old, messages =>
          messages.filter(m => m.MessageIndex !== context?.pendingIndex),
        ),
      );
    },
    onSuccess: (message, _data, context) => {
      // a refetch may already have the saved message, don't show it twice
      queryClient.setQueryData<ThreadData>(queryKey, old =>
        mapMessages(old, messages =>
          messages
            .filter(m => m.MessageIndex !== message.MessageIndex)
            .map(m => (m.MessageIndex === context?.pendingIndex ? message : m)),
        ),
      );
    },
    onSettled: () => refresh(ConversationIndex),
  });
};

// removed from the thread right away, put back if deleting failed
export const useDeleteMessage = (ConversationIndex: number) => {
  const queryClient = useQueryClient();
  const refresh = useRefresh();
  const queryKey = keys.thread(ConversationIndex);
  return useMutation({
    mutationFn: (MessageIndex: number) =>
      apiData(DeleteMessage({ ConversationIndex, MessageIndex })),
    onMutate: async MessageIndex => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ThreadData>(queryKey);
      queryClient.setQueryData<ThreadData>(queryKey, old =>
        mapMessages(old, messages =>
          messages.filter(m => m.MessageIndex !== MessageIndex),
        ),
      );
      return { previous };
    },
    onError: (_error, _MessageIndex, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => refresh(ConversationIndex),
  });
};

type StartData = {
  KuskiIndexes: number[];
  Text: string;
  Name?: string;
  ExpireAfter: number;
  kuskis: KuskiData[];
};

type StartResponse = { ConversationIndex: number; message: MessageData };

export const useStartConversation = (userid: number) => {
  const queryClient = useQueryClient();
  const { username } = useStoreState(state => state.Login);
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({
      KuskiIndexes,
      Text,
      Name,
      ExpireAfter,
    }: StartData): Promise<StartResponse> =>
      apiData(StartConversation({ KuskiIndexes, Text, Name, ExpireAfter })),
    onSuccess: ({ ConversationIndex, message }, data) => {
      queryClient.setQueryData<ConversationData[]>(
        keys.conversations,
        (old = []) => {
          if (old.some(c => c.ConversationIndex === ConversationIndex)) {
            return old;
          }
          const me = { KuskiIndex: userid, Kuski: username || '' };
          const members = [
            me,
            ...data.kuskis.map(k => ({
              KuskiIndex: Number(k.KuskiIndex),
              Kuski: k.Kuski,
              Country: k.Country,
            })),
          ];
          const conversation: ConversationData = {
            ConversationIndex,
            Name: data.Name || null,
            IsGroup: data.KuskiIndexes.length > 1 ? 1 : 0,
            CreatedBy: userid,
            CreatedAt: message.CreatedAt,
            LastMessageAt: message.CreatedAt,
            Members: members.map(k => ({
              KuskiIndex: k.KuskiIndex,
              KuskiData: k,
            })),
            Unread: 0,
            LastMessage: message,
          };
          return [conversation, ...old];
        },
      );
      queryClient.setQueryData<ThreadData>(
        keys.thread(ConversationIndex),
        old => addNewest(old, message),
      );
      refresh(ConversationIndex);
    },
  });
};

export const useMarkRead = (ConversationIndex: number) => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (MessageIndex: number) =>
      apiData(MarkConversationRead({ ConversationIndex, MessageIndex })),
    onSuccess: () => refresh(),
  });
};

export const useAddMembers = (ConversationIndex: number) => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (KuskiIndexes: number[]) =>
      apiData(AddConversationMembers({ ConversationIndex, KuskiIndexes })),
    onSuccess: () => refresh(ConversationIndex),
  });
};

export const useRenameConversation = (ConversationIndex: number) => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (Name: string) =>
      apiData(RenameConversation({ ConversationIndex, Name })),
    onSuccess: () => refresh(ConversationIndex),
  });
};

export const useLeaveConversation = (ConversationIndex: number) => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: () => apiData(LeaveConversation(ConversationIndex)),
    onSuccess: () => refresh(),
  });
};

export const useFindDirectConversation = () => {
  const queryClient = useQueryClient();
  return async (KuskiIndex: number) => {
    const conversations = await queryClient.fetchQuery({
      queryKey: keys.conversations,
      queryFn: fetchConversations,
      staleTime: 10000,
    });
    const found = conversations.find(
      c => !c.IsGroup && c.Members.some(m => m.KuskiIndex === KuskiIndex),
    );
    return found ? found.ConversationIndex : null;
  };
};

export const conversationTitle = (
  conversation: ConversationData,
  userid: number,
) => {
  if (conversation.IsGroup && conversation.Name) {
    return conversation.Name;
  }
  const others = conversation.Members.filter(m => m.KuskiIndex !== userid)
    .map(m => m.KuskiData?.Kuski)
    .filter(Boolean);
  return others.join(', ') || 'Just you';
};

export const directKuski = (conversation: ConversationData, userid: number) =>
  conversation.IsGroup
    ? null
    : conversation.Members.find(m => m.KuskiIndex !== userid)?.KuskiData ||
      null;
