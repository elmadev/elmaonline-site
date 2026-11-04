import styled from '@emotion/styled';
import { useStoreState } from './storeHooks';
import { useMediaQuery } from '@mui/material';
import type { KuskiData } from 'types/kuski';
import type { ActiveConversation } from 'types/message';
import ConversationList from './ConversationList';
import Thread from './Thread';
import NewConversation from './NewConversation';
import { useConversations } from './useMessages';

type MessagesViewProps = {
  active: ActiveConversation;
  onSelect: (active: ActiveConversation) => void;
  recipient?: KuskiData | null;
  compact?: boolean;
};

const MessagesView = ({
  active,
  onSelect,
  recipient = null,
  compact = false,
}: MessagesViewProps) => {
  const { userid } = useStoreState(state => state.Login);
  const me = Number(userid);
  const { conversations, isLoading } = useConversations();
  const narrow = useMediaQuery('(max-width: 600px)');
  const showList = !narrow || active === null;
  const showMain = !narrow || active !== null;
  const back = narrow ? () => onSelect(null) : undefined;

  return (
    <Container>
      {showList && (
        <ListPane compact={compact} full={narrow}>
          <ConversationList
            conversations={conversations}
            isLoading={isLoading}
            active={active}
            userid={me}
            onSelect={onSelect}
          />
        </ListPane>
      )}
      {showMain && (
        <MainPane>
          {active === 'new' && (
            <NewConversation
              key={recipient?.KuskiIndex || 'new'}
              userid={me}
              recipient={recipient}
              onCreated={onSelect}
              onBack={back}
            />
          )}
          {typeof active === 'number' && (
            <Thread
              key={active}
              ConversationIndex={active}
              conversation={conversations.find(
                c => c.ConversationIndex === active,
              )}
              userid={me}
              onBack={back}
              onLeft={() => onSelect(null)}
            />
          )}
          {active === null && (
            <Empty>Pick a conversation or start a new one.</Empty>
          )}
        </MainPane>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100%;
  min-height: 0;
  background: ${p => p.theme.paperBackground};
`;

const ListPane = styled.div<{ compact: boolean; full: boolean }>`
  flex: ${p => (p.full ? '1' : `0 0 ${p.compact ? '220px' : '300px'}`)};
  min-width: 0;
  border-right: 1px solid ${p => p.theme.borderColor};
`;

const MainPane = styled.div`
  flex: 1;
  min-width: 0;
`;

const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: ${p => p.theme.padMedium};
  color: ${p => p.theme.lightTextColor};
  text-align: center;
`;

export default MessagesView;
