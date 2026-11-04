import styled from '@emotion/styled';
import { Badge } from '@mui/material';
import { Group } from '@mui/icons-material';
import Button from 'components/Buttons';
import Loading from 'components/Loading';
import type { ConversationData, ActiveConversation } from 'types/message';
import { OnlineDot } from './OnlineStatus';
import { conversationTitle, directKuski } from './useMessages';

type ConversationListProps = {
  conversations: ConversationData[];
  isLoading: boolean;
  active: ActiveConversation;
  userid: number;
  onSelect: (active: ActiveConversation) => void;
};

const preview = (conversation: ConversationData, userid: number) => {
  const last = conversation.LastMessage;
  if (!last) {
    return '';
  }
  const from = last.KuskiIndex === userid ? 'You' : last.KuskiData?.Kuski || '';
  if (last.Type === 'system') {
    return `${from} ${last.Text}`;
  }
  return conversation.IsGroup || last.KuskiIndex === userid
    ? `${from}: ${last.Text}`
    : last.Text;
};

const ConversationList = ({
  conversations,
  isLoading,
  active,
  userid,
  onSelect,
}: ConversationListProps) => (
  <Container>
    <NewButton>
      <Button icon="add" little onClick={() => onSelect('new')}>
        New message
      </Button>
    </NewButton>
    {isLoading && (
      <Empty>
        <Loading />
      </Empty>
    )}
    {!isLoading && conversations.length === 0 && (
      <Empty>No messages yet.</Empty>
    )}
    {conversations.map(c => (
      <Row
        key={c.ConversationIndex}
        selected={active === c.ConversationIndex}
        onClick={() => onSelect(c.ConversationIndex)}
      >
        <Title>
          {c.IsGroup ? (
            <GroupIcon fontSize="inherit" />
          ) : (
            <OnlineDot status={directKuski(c, userid)?.OnlineStatus} />
          )}
          <Name unread={c.Unread > 0}>{conversationTitle(c, userid)}</Name>
          {c.Unread > 0 && (
            <UnreadBadge badgeContent={c.Unread} color="error" />
          )}
        </Title>
        <Preview>{preview(c, userid)}</Preview>
      </Row>
    ))}
  </Container>
);

const Container = styled.div`
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
`;

const NewButton = styled.div`
  padding: ${p => p.theme.padSmall};
`;

const Empty = styled.div`
  padding: ${p => p.theme.padMedium};
  color: ${p => p.theme.lightTextColor};
  font-size: ${p => p.theme.smallFont};
  text-align: center;
`;

const Row = styled.div<{ selected: boolean }>`
  padding: ${p => p.theme.padSmall} ${p => p.theme.padMedium};
  cursor: pointer;
  border-bottom: 1px solid ${p => p.theme.borderColor};
  background: ${p => (p.selected ? p.theme.selectedColor : 'transparent')};
  &:hover {
    background: ${p => p.theme.hoverColor};
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
`;

const GroupIcon = styled(Group)`
  margin-right: 6px;
  color: ${p => p.theme.lightTextColor};
`;

const Name = styled.span<{ unread: boolean }>`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: ${p => (p.unread ? 600 : 400)};
`;

const UnreadBadge = styled(Badge)`
  margin: 0 10px 0 12px;
`;

const Preview = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${p => p.theme.smallFont};
  color: ${p => p.theme.lightTextColor};
`;

export default ConversationList;
