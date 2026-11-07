import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useStoreState } from 'easy-peasy';
import { useNavigate, useParams } from '@tanstack/react-router';
import Layout from 'components/Layout';
import MessagesView from 'features/Messages/MessagesView';

const Message = () => {
  const { ConversationIndex } = useParams({ strict: false });
  const { loggedIn } = useStoreState(state => state.Login);
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState(false);

  const fromUrl = parseInt(ConversationIndex, 10) || null;
  const active = newMessage ? 'new' : fromUrl;

  const onSelect = selected => {
    if (selected === 'new') {
      setNewMessage(true);
      return;
    }
    setNewMessage(false);
    navigate({ to: selected ? `/message/${selected}` : '/message' });
  };

  return (
    <Layout edge t="Messages">
      {loggedIn ? (
        <Container>
          <MessagesView active={active} onSelect={onSelect} />
        </Container>
      ) : (
        <LoggedOut>Log in to see your messages.</LoggedOut>
      )}
    </Layout>
  );
};

const Container = styled.div`
  height: calc(100vh - 54px);
`;

const LoggedOut = styled.div`
  padding: ${p => p.theme.padLarge};
`;

export default Message;
