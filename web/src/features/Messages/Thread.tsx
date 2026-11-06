import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from './storeHooks';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  DeleteOutline,
  MoreVert,
  TimerOutlined,
} from '@mui/icons-material';
import {
  format,
  formatDistanceToNowStrict,
  isThisYear,
  isToday,
} from 'date-fns';
import Alert from 'components/Alert';
import Button from 'components/Buttons';
import { TextField } from 'components/Inputs';
import Kuski from 'components/Kuski';
import Loading from 'components/Loading';
import type { ConversationData, MessageData } from 'types/message';
import type { KuskiData } from 'types/kuski';
import { OnlineDot } from './OnlineStatus';
import MessageInput from './MessageInput';
import KuskiPicker from './KuskiPicker';
import {
  conversationTitle,
  directKuski,
  useAddMembers,
  useLeaveConversation,
  useMarkRead,
  useRenameConversation,
  useDeleteMessage,
  useSendMessage,
  useThread,
} from './useMessages';

type ThreadProps = {
  ConversationIndex: number;
  conversation?: ConversationData;
  userid: number;
  onBack?: () => void;
  onLeft: () => void;
};

const formatTime = (CreatedAt: number) => {
  const date = new Date(CreatedAt * 1000);
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  return format(date, isThisYear(date) ? 'd MMM HH:mm' : 'd MMM yyyy HH:mm');
};

const bottomThreshold = 80;

const GroupMenu = ({
  conversation,
  onLeft,
}: {
  conversation: ConversationData;
  onLeft: () => void;
}) => {
  const { ConversationIndex } = conversation;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dialog, setDialog] = useState<'rename' | 'add' | 'leave' | null>(null);
  const [name, setName] = useState(conversation.Name || '');
  const [kuskis, setKuskis] = useState<KuskiData[]>([]);
  const rename = useRenameConversation(ConversationIndex);
  const addMembers = useAddMembers(ConversationIndex);
  const leave = useLeaveConversation(ConversationIndex);

  const openDialog = (type: typeof dialog) => {
    setAnchorEl(null);
    setName(conversation.Name || '');
    setKuskis([]);
    rename.reset();
    addMembers.reset();
    setDialog(type);
  };

  const close = () => setDialog(null);
  const error = rename.error?.message || addMembers.error?.message;

  return (
    <>
      <IconButton
        aria-label="group options"
        size="small"
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        <MoreVert fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => openDialog('rename')}>Rename group</MenuItem>
        <MenuItem onClick={() => openDialog('add')}>Add people</MenuItem>
        <MenuItem onClick={() => openDialog('leave')}>Leave group</MenuItem>
      </Menu>
      <Dialog
        open={dialog === 'rename' || dialog === 'add'}
        onClose={close}
        fullWidth
        maxWidth="xs"
      >
        {dialog === 'rename' ? (
          <>
            <DialogTitle>Rename group</DialogTitle>
            <DialogContent>
              <TextField
                name="Name"
                value={name}
                onChange={setName}
                maxLength={50}
                margin="dense"
                autoFocus
              />
              {error ? <ErrorText>{error}</ErrorText> : null}
            </DialogContent>
            <DialogActions>
              <Button naked onClick={close}>
                Cancel
              </Button>
              <Button
                disabled={!name.trim() || rename.isPending}
                onClick={() => rename.mutate(name, { onSuccess: close })}
              >
                Rename
              </Button>
            </DialogActions>
          </>
        ) : null}
        {dialog === 'add' ? (
          <>
            <DialogTitle>Add people</DialogTitle>
            <DialogContent>
              <PickerCon>
                <KuskiPicker
                  selected={kuskis}
                  onChange={setKuskis}
                  exclude={conversation.Members.map(m => m.KuskiIndex)}
                  label="Kuskis"
                />
              </PickerCon>
              {error ? <ErrorText>{error}</ErrorText> : null}
            </DialogContent>
            <DialogActions>
              <Button naked onClick={close}>
                Cancel
              </Button>
              <Button
                disabled={!kuskis.length || addMembers.isPending}
                onClick={() =>
                  addMembers.mutate(
                    kuskis.map(k => Number(k.KuskiIndex)),
                    { onSuccess: close },
                  )
                }
              >
                Add
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
      <Alert
        open={dialog === 'leave'}
        title="Leave group?"
        text="You won't get new messages from this group unless someone adds you again."
        options={['Cancel', 'Leave']}
        onClose={option => {
          close();
          if (option === 1) {
            leave.mutate(undefined, { onSuccess: onLeft });
          }
        }}
      />
    </>
  );
};

const Thread = ({
  ConversationIndex,
  conversation,
  userid,
  onBack,
  onLeft,
}: ThreadProps) => {
  const { drafts } = useStoreState(state => state.Messages);
  const { setDraft } = useStoreActions(actions => actions.Messages);
  const draft: string = drafts[ConversationIndex] || '';
  const [expireAfter, setExpireAfter] = useState(0);
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useThread(ConversationIndex);
  const send = useSendMessage(ConversationIndex, userid);
  const markRead = useMarkRead(ConversationIndex);
  const deleteMessage = useDeleteMessage(ConversationIndex);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const lastRead = useRef(0);

  const nowSeconds = Date.now() / 1000;
  const messages: MessageData[] = data
    ? [...data.pages.flat()]
        .reverse()
        .filter(m => !m.ExpiresAt || m.ExpiresAt > nowSeconds)
    : [];
  const newest = messages.length
    ? messages[messages.length - 1].MessageIndex
    : 0;

  // stay at the bottom when new messages arrive, unless scrolled up
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el && atBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [newest]);

  useEffect(() => {
    if (newest > lastRead.current) {
      lastRead.current = newest;
      markRead.mutate(newest);
    }
  }, [newest]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (el) {
      atBottom.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < bottomThreshold;
    }
  };

  const onSend = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    atBottom.current = true;
    const expire = expireAfter;
    // the message shows as pending right away
    setDraft({ key: ConversationIndex, text: '' });
    setExpireAfter(0);
    send.mutate(
      { Text: text, ExpireAfter: expire },
      {
        onError: () => {
          setDraft({ key: ConversationIndex, text });
          setExpireAfter(expire);
        },
      },
    );
  };

  const other = conversation ? directKuski(conversation, userid) : null;

  return (
    <Container>
      <Header>
        {onBack ? (
          <IconButton aria-label="back" size="small" onClick={onBack}>
            <ArrowBack fontSize="small" />
          </IconButton>
        ) : null}
        <HeaderText>
          <Title>
            {other ? (
              <>
                <OnlineDot status={other.OnlineStatus} />
                <Kuski kuskiData={other} />
              </>
            ) : (
              <>
                <TitleText>
                  {conversation ? conversationTitle(conversation, userid) : ''}
                </TitleText>
                {conversation?.IsGroup ? (
                  <Status>{conversation.Members.length} members</Status>
                ) : null}
              </>
            )}
          </Title>
          {conversation?.IsGroup ? (
            <MemberList>
              {conversation.Members.map(m =>
                m.KuskiData ? (
                  <Member key={m.KuskiIndex}>
                    <OnlineDot status={m.KuskiData.OnlineStatus} />
                    <Kuski kuskiData={m.KuskiData} />
                  </Member>
                ) : null,
              )}
            </MemberList>
          ) : null}
        </HeaderText>
        {conversation?.IsGroup ? (
          <GroupMenu conversation={conversation} onLeft={onLeft} />
        ) : null}
      </Header>
      <Messages ref={scrollRef} onScroll={onScroll}>
        {isLoading ? (
          <Center>
            <Loading />
          </Center>
        ) : null}
        {isError ? <Center>Conversation not found.</Center> : null}
        {hasNextPage ? (
          <Center>
            <Button
              naked
              little
              onClick={() => {
                atBottom.current = false;
                fetchNextPage();
              }}
            >
              Load older messages
            </Button>
          </Center>
        ) : null}
        {messages.map((message, i) => {
          const nick = message.KuskiData?.Kuski || '';
          if (message.Type === 'system') {
            return (
              <System key={message.MessageIndex}>
                {nick} {message.Text} · {formatTime(message.CreatedAt)}
              </System>
            );
          }
          // pending messages are always your own
          const own = Boolean(message.Pending) || message.KuskiIndex === userid;
          const prev = messages[i - 1];
          // group consecutive messages from the same kuski within 5 minutes
          const showMeta =
            !prev ||
            prev.Type === 'system' ||
            prev.KuskiIndex !== message.KuskiIndex ||
            message.CreatedAt - prev.CreatedAt > 300;
          return (
            <Bubble key={message.MessageIndex} own={own} spaced={showMeta}>
              {showMeta ? (
                <Meta>
                  {!own && conversation?.IsGroup ? <b>{nick} </b> : null}
                  {formatTime(message.CreatedAt)}
                </Meta>
              ) : null}
              <TextRow>
                {own && !message.Pending ? (
                  <DeleteButton
                    className="delete-message"
                    aria-label="delete message"
                    size="small"
                    onClick={() => setConfirmDelete(message.MessageIndex)}
                  >
                    <DeleteOutline fontSize="inherit" />
                  </DeleteButton>
                ) : null}
                <Text own={own} pending={Boolean(message.Pending)}>
                  {message.Text}
                  {message.ExpiresAt ? (
                    <ExpireMark
                      titleAccess={`Disappears ${formatDistanceToNowStrict(
                        new Date(message.ExpiresAt * 1000),
                        { addSuffix: true },
                      )}`}
                    />
                  ) : null}
                </Text>
              </TextRow>
              {message.Pending ? <Sending>Sending…</Sending> : null}
            </Bubble>
          );
        })}
      </Messages>
      {send.error ? <ErrorText>{send.error.message}</ErrorText> : null}
      <MessageInput
        value={draft}
        onChange={text => setDraft({ key: ConversationIndex, text })}
        onSend={onSend}
        expireAfter={expireAfter}
        onExpireChange={setExpireAfter}
        disabled={isError}
        autoFocus
      />
      <Alert
        open={confirmDelete !== null}
        title="Delete message?"
        text="It will be deleted for everyone in the conversation."
        options={['Cancel', 'Delete']}
        onClose={option => {
          if (option === 1 && confirmDelete !== null) {
            deleteMessage.mutate(confirmDelete);
          }
          setConfirmDelete(null);
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => p.theme.padXSmall};
  padding: ${p => p.theme.padSmall} ${p => p.theme.padMedium};
  border-bottom: 1px solid ${p => p.theme.borderColor};
`;

const HeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TitleText = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Status = styled.span`
  flex-shrink: 0;
  margin-left: ${p => p.theme.padXSmall};
  font-size: 12px;
  font-weight: 400;
  color: ${p => p.theme.lightTextColor};
`;

const MemberList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 ${p => p.theme.padSmall};
  font-size: 12px;
  line-height: 1.2;
`;

const Member = styled.span`
  display: inline-flex;
  align-items: center;
  > :first-child {
    margin-right: 2px;
  }
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${p => p.theme.padSmall} ${p => p.theme.padMedium};
  display: flex;
  flex-direction: column;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  padding: ${p => p.theme.padSmall};
  color: ${p => p.theme.lightTextColor};
`;

const System = styled.div`
  text-align: center;
  font-size: 12px;
  font-style: italic;
  color: ${p => p.theme.lightTextColor};
  margin: ${p => p.theme.padSmall} 0;
`;

const TextRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  max-width: 80%;
`;

const DeleteButton = styled(IconButton)`
  && {
    margin-right: 4px;
    font-size: 16px;
    color: ${p => p.theme.lightTextColor};
    opacity: 0;
    @media (hover: none) {
      opacity: 1;
    }
  }
`;

const Bubble = styled.div<{ own: boolean; spaced: boolean }>`
  &:hover .delete-message,
  .delete-message:focus-visible {
    opacity: 1;
  }
  display: flex;
  flex-direction: column;
  align-items: ${p => (p.own ? 'flex-end' : 'flex-start')};
  margin-top: ${p => (p.spaced ? p.theme.padSmall : '2px')};
`;

const Sending = styled.div`
  font-size: 11px;
  color: ${p => p.theme.lightTextColor};
  margin-top: 2px;
`;

const Meta = styled.div`
  font-size: 11px;
  color: ${p => p.theme.lightTextColor};
  margin-bottom: 2px;
`;

const Text = styled.div<{ own: boolean; pending: boolean }>`
  opacity: ${p => (p.pending ? 0.6 : 1)};
  min-width: 0;
  padding: 6px 10px;
  border-radius: 12px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  background: ${p => (p.own ? p.theme.primary : p.theme.hoverColor)};
  color: ${p => (p.own ? p.theme.buttonFontColor : p.theme.fontColor)};
`;

const ErrorText = styled.div`
  padding: 0 ${p => p.theme.padMedium};
  font-size: ${p => p.theme.smallFont};
  color: ${p => p.theme.errorColor};
`;

const ExpireMark = styled(TimerOutlined)`
  && {
    font-size: 13px;
    margin-left: 4px;
    vertical-align: -2px;
    opacity: 0.7;
  }
`;

const PickerCon = styled.div`
  padding-top: ${p => p.theme.padSmall};
`;

export default Thread;
