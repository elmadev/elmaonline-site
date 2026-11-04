import { useState } from 'react';
import { useStoreState, useStoreActions } from './storeHooks';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import { Chat } from '@mui/icons-material';
import type { KuskiData } from 'types/kuski';
import type { OnlineStatus } from 'types/message';
import { useFindDirectConversation } from './useMessages';
import { OnlineDot } from './OnlineStatus';

type SendMessageButtonProps = {
  kuski: KuskiData;
  onlineStatus?: OnlineStatus;
};

const SendMessageButton = ({ kuski, onlineStatus }: SendMessageButtonProps) => {
  const { loggedIn, userid } = useStoreState(state => state.Login);
  const { openChat } = useStoreActions(actions => actions.Messages);
  const findDirect = useFindDirectConversation();
  const [loading, setLoading] = useState(false);

  if (!loggedIn || Number(userid) === kuski.KuskiIndex) {
    return null;
  }

  const onClick = async () => {
    setLoading(true);
    try {
      const ConversationIndex = await findDirect(Number(kuski.KuskiIndex));
      openChat(
        ConversationIndex
          ? { active: ConversationIndex }
          : { active: 'new', recipient: kuski },
      );
    } catch {
      openChat({ active: 'new', recipient: kuski });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <IconButton
        aria-label="send message"
        title="Send message"
        color="primary"
        size="small"
        disabled={loading}
        onClick={onClick}
      >
        <Chat fontSize="small" />
      </IconButton>
      <Dot status={onlineStatus} />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-flex;
`;

const Dot = styled(OnlineDot)`
  position: absolute;
  top: 2px;
  right: 2px;
  margin: 0;
  box-shadow: 0 0 0 2px ${p => p.theme.paperBackground};
  pointer-events: none;
`;

export default SendMessageButton;
