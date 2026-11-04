import { useState } from 'react';
import styled from '@emotion/styled';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Send, TimerOutlined } from '@mui/icons-material';
import { TextField } from 'components/Inputs';
import { expireLabel, expireOptions, expireShortLabel } from './expire';

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  expireAfter: number;
  onExpireChange: (expireAfter: number) => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

export const maxMessageLength = 2000;

const ExpireSelector = ({
  expireAfter,
  onChange,
}: {
  expireAfter: number;
  onChange: (expireAfter: number) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <IconButton
        aria-label="disappearing message"
        title={
          expireAfter
            ? `Disappears after ${expireLabel(expireAfter)}`
            : 'Disappearing message'
        }
        color={expireAfter ? 'primary' : 'default'}
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        <TimerOutlined />
        {expireAfter > 0 && (
          <ExpireShort>{expireShortLabel(expireAfter)}</ExpireShort>
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuHeader>Disappear after</MenuHeader>
        {expireOptions.map(([value, label]) => (
          <MenuItem
            key={value}
            selected={value === expireAfter}
            onClick={() => {
              onChange(value);
              setAnchorEl(null);
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const MessageInput = ({
  value,
  onChange,
  onSend,
  expireAfter,
  onExpireChange,
  disabled = false,
  autoFocus = false,
}: MessageInputProps) => {
  const canSend = !disabled && value.trim().length > 0;

  return (
    <Container>
      <ExpireSelector expireAfter={expireAfter} onChange={onExpireChange} />
      <Input
        name="Message"
        value={value}
        onChange={onChange}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (canSend) {
              onSend();
            }
          }
        }}
        multiline
        maxRows={5}
        maxLength={maxMessageLength}
        margin="none"
        size="small"
        autoFocus={autoFocus}
      />
      <IconButton
        aria-label="send"
        color="primary"
        disabled={!canSend}
        onClick={onSend}
      >
        <Send />
      </IconButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${p => p.theme.padXSmall};
  padding: ${p => p.theme.padSmall};
  border-top: 1px solid ${p => p.theme.borderColor};
`;

const Input = styled(TextField)`
  flex: 1;
  margin: 0;
`;

const ExpireShort = styled.span`
  margin-left: 2px;
  font-size: 12px;
  font-weight: 600;
`;

const MenuHeader = styled.div`
  padding: 4px 16px 8px;
  font-size: 12px;
  color: ${p => p.theme.lightTextColor};
`;

export default MessageInput;
