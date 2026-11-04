import { useEffect } from 'react';
import styled from '@emotion/styled';
import { useStoreState, useStoreActions } from './storeHooks';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { ClickAwayListener, IconButton } from '@mui/material';
import { Close, ExpandLess, ExpandMore, OpenInFull } from '@mui/icons-material';
import MessagesView from './MessagesView';
import { useHeartbeat } from './useMessages';

const ChatOverlay = () => {
  const { loggedIn } = useStoreState(state => state.Login);
  const { open, minimised, active, recipient, settings } = useStoreState(
    state => state.Messages,
  );
  const { closeChat, setMinimised, setActive } = useStoreActions(
    actions => actions.Messages,
  );
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { unread } = useHeartbeat();
  const visible = loggedIn && open && !pathname.startsWith('/message');
  // esc and clicking outside close the box, but not when it's minimised
  const closable = visible && !minimised;

  useEffect(() => {
    if (!closable) {
      return undefined;
    }
    // menus, dialogs and autocompletes inside the chat handle esc themselves
    // and stop it, so it only closes the box when nothing else is open
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        closeChat();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closable]);

  if (!visible) {
    return null;
  }

  const expand = () => {
    closeChat();
    navigate({
      to: typeof active === 'number' ? `/message/${active}` : '/message',
    });
  };

  // clicks in the chat's own menus and dialogs count as inside, they're
  // portals but still part of the react tree. clicking the top bar icon
  // closes it through its own toggle first
  return (
    <ClickAwayListener onClickAway={() => closable && closeChat()}>
      <Box corner={settings.corner} minimised={minimised}>
        <Bar onClick={() => minimised && setMinimised(false)}>
          <BarTitle>
            Messages{unread > 0 && minimised ? ` (${unread})` : ''}
          </BarTitle>
          <IconButton
            aria-label={minimised ? 'restore' : 'minimise'}
            size="small"
            color="inherit"
            onClick={e => {
              e.stopPropagation();
              setMinimised(!minimised);
            }}
          >
            {minimised ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </IconButton>
          <IconButton
            aria-label="open full page"
            size="small"
            color="inherit"
            onClick={e => {
              e.stopPropagation();
              expand();
            }}
          >
            <OpenInFull fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="close"
            size="small"
            color="inherit"
            onClick={e => {
              e.stopPropagation();
              closeChat();
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Bar>
        {!minimised && (
          <Content>
            <MessagesView
              active={active}
              onSelect={setActive}
              recipient={recipient}
              compact
            />
          </Content>
        )}
      </Box>
    </ClickAwayListener>
  );
};

const Box = styled.div<{ corner: string; minimised: boolean }>`
  position: fixed;
  bottom: 0;
  ${p => (p.corner === 'left' ? 'left: 24px;' : 'right: 24px;')}
  z-index: 1250;
  display: flex;
  flex-direction: column;
  width: ${p => (p.minimised ? '280px' : '720px')};
  max-width: calc(100vw - 48px);
  height: ${p => (p.minimised ? 'auto' : '480px')};
  max-height: calc(100vh - 80px);
  overflow: hidden;
  background: ${p => p.theme.paperBackground};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  @media (max-width: 600px) {
    left: 0;
    right: 0;
    width: auto;
    max-width: none;
    height: ${p => (p.minimised ? 'auto' : '100%')};
    max-height: none;
    border-radius: 0;
  }
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 4px 4px 16px;
  background: ${p => p.theme.primary};
  color: #f1f1f1;
  cursor: default;
`;

const BarTitle = styled.div`
  flex: 1;
  font-weight: 500;
`;

const Content = styled.div`
  flex: 1;
  min-height: 0;
`;

export default ChatOverlay;
