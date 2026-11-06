import { useState } from 'react';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from './storeHooks';
import { useMediaQuery } from '@mui/material';
import type { KuskiData } from 'types/kuski';
import type { ActiveConversation } from 'types/message';
import ConversationList from './ConversationList';
import Thread from './Thread';
import NewConversation from './NewConversation';
import InfoPanel from './InfoPanel';
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
  const { infoOpen } = useStoreState(state => state.Messages);
  const { setInfoOpen } = useStoreActions(actions => actions.Messages);
  const [introClosed, setIntroClosed] = useState(false);
  const intro =
    !introClosed && !isLoading && !conversations.length && active === null;
  const showInfo = infoOpen || intro;
  const closeInfo = () => {
    setInfoOpen(false);
    setIntroClosed(true);
  };
  const select = (selected: ActiveConversation) => {
    setInfoOpen(false);
    onSelect(selected);
  };
  const narrow = useMediaQuery('(max-width: 600px)');
  const showList = !narrow || (active === null && !showInfo);
  const showMain = !narrow || active !== null || showInfo;
  const back = narrow ? () => onSelect(null) : undefined;

  return (
    <Container>
      {showList ? (
        <ListPane compact={compact} full={narrow}>
          <ConversationList
            conversations={conversations}
            isLoading={isLoading}
            active={active}
            userid={me}
            onSelect={select}
            onInfo={compact ? undefined : () => setInfoOpen(!infoOpen)}
          />
        </ListPane>
      ) : null}
      {showMain ? (
        <MainPane>
          {showInfo ? <InfoPanel onClose={closeInfo} /> : null}
          {active === 'new' ? (
            <NewConversation
              key={recipient?.KuskiIndex || 'new'}
              userid={me}
              recipient={recipient}
              onCreated={onSelect}
              onBack={back}
            />
          ) : null}
          {typeof active === 'number' ? (
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
          ) : null}
          {active === null ? (
            <Empty>Pick a conversation or start a new one.</Empty>
          ) : null}
        </MainPane>
      ) : null}
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
  flex: ${p => (p.full ? '1' : `0 0 ${p.compact ? '180px' : '300px'}`)};
  min-width: 0;
  border-right: 1px solid ${p => p.theme.borderColor};
`;

const MainPane = styled.div`
  position: relative;
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
