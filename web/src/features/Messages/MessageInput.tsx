import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Send, TimerOutlined } from '@mui/icons-material';
import { TextField } from 'components/Inputs';
import { expireLabel, expireOptions, expireShortLabel } from './expire';
import EmojiButton from './EmojiButton';
import { useStoreState, useStoreActions } from './storeHooks';
import {
  findExactShortcode,
  findShortcodes,
  loadShortcodes,
  shortcodeAtCursor,
} from './emoji';
import type { ShortcodeMatch } from './emoji';

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

type Suggestions = {
  start: number;
  end: number;
  matches: ShortcodeMatch[];
  index: number;
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
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const latestText = useRef(value);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const { recent } = useStoreState(state => state.Messages.emoji);
  const { addRecentEmoji } = useStoreActions(actions => actions.Messages);

  // replaces text(start, end) with the emoji and puts the cursor after it
  const insert = (text: string, start: number, end: number, emoji: string) => {
    onChange(text.slice(0, start) + emoji + text.slice(end));
    addRecentEmoji(emoji);
    setSuggestions(null);
    const cursor = start + emoji.length;
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(cursor, cursor);
    });
  };

  const insertAtCursor = (emoji: string) => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    insert(value, start, end, emoji);
  };

  const onTextChange = (text: string) => {
    latestText.current = text;
    onChange(text);
    const cursor = inputRef.current?.selectionEnd ?? text.length;
    const shortcode = shortcodeAtCursor(text, cursor);
    if (!shortcode) {
      setSuggestions(null);
      return;
    }
    loadShortcodes().then(list => {
      if (latestText.current !== text) {
        return;
      }
      // typing the closing colon of a known name replaces it right away
      const exact = shortcode.closed
        ? findExactShortcode(list, shortcode.query)
        : undefined;
      if (exact) {
        insert(text, shortcode.start, cursor, exact);
        return;
      }
      const matches = shortcode.closed
        ? []
        : findShortcodes(list, shortcode.query, recent);
      setSuggestions(
        matches.length
          ? { start: shortcode.start, end: cursor, matches, index: 0 }
          : null,
      );
    });
  };

  // while suggestions are open they handle these keys
  const onSuggestionKey = (e: React.KeyboardEvent) => {
    if (!suggestions) {
      return false;
    }
    const { matches, index } = suggestions;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setSuggestions({
        ...suggestions,
        index: (index + step + matches.length) % matches.length,
      });
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      insert(value, suggestions.start, suggestions.end, matches[index].emoji);
    } else if (e.key === 'Escape') {
      setSuggestions(null);
    } else {
      return false;
    }
    e.preventDefault();
    return true;
  };

  return (
    <Container>
      {suggestions && (
        <SuggestionList role="listbox" aria-label="emoji suggestions">
          {suggestions.matches.map((match, i) => (
            <Suggestion
              key={match.name}
              role="option"
              aria-selected={i === suggestions.index}
              selected={i === suggestions.index}
              onMouseDown={e => {
                e.preventDefault();
                insert(value, suggestions.start, suggestions.end, match.emoji);
              }}
            >
              <SuggestionEmoji>{match.emoji}</SuggestionEmoji>:{match.name}:
            </Suggestion>
          ))}
        </SuggestionList>
      )}
      <ExpireSelector expireAfter={expireAfter} onChange={onExpireChange} />
      <EmojiButton onSelect={insertAtCursor} />
      <Input
        name="Message"
        value={value}
        onChange={onTextChange}
        inputRef={inputRef}
        onKeyDown={e => {
          if (onSuggestionKey(e)) {
            return;
          }
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
  position: relative;
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

const SuggestionList = styled.div`
  position: absolute;
  bottom: 100%;
  left: ${p => p.theme.padSmall};
  right: ${p => p.theme.padSmall};
  max-height: 260px;
  overflow-y: auto;
  padding: 4px 0;
  border: 1px solid ${p => p.theme.borderColor};
  border-radius: 4px;
  background: ${p => p.theme.paperBackground};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  z-index: 2;
`;

const Suggestion = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 4px ${p => p.theme.padSmall};
  cursor: pointer;
  font-size: ${p => p.theme.smallFont};
  background: ${p => (p.selected ? p.theme.hoverColor : 'transparent')};
  &:hover {
    background: ${p => p.theme.hoverColor};
  }
`;

const SuggestionEmoji = styled.span`
  width: 28px;
  font-size: 20px;
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
