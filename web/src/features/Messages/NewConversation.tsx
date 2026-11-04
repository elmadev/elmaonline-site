import { useState } from 'react';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import { TextField } from 'components/Inputs';
import { ArrowBack } from '@mui/icons-material';
import type { KuskiData } from 'types/kuski';
import KuskiPicker from './KuskiPicker';
import MessageInput from './MessageInput';
import { useStartConversation } from './useMessages';

type NewConversationProps = {
  userid: number;
  recipient?: KuskiData | null;
  onCreated: (ConversationIndex: number) => void;
  onBack?: () => void;
};

const maxGroupMembers = 19;

const NewConversation = ({
  userid,
  recipient = null,
  onCreated,
  onBack,
}: NewConversationProps) => {
  const [kuskis, setKuskis] = useState<KuskiData[]>(
    recipient ? [recipient] : [],
  );
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [expireAfter, setExpireAfter] = useState(0);
  const start = useStartConversation(userid);
  const isGroup = kuskis.length > 1;
  const tooMany = kuskis.length > maxGroupMembers;

  const onSend = () => {
    if (!kuskis.length || tooMany) {
      return;
    }
    const sent = text.trim();
    const expire = expireAfter;
    setText('');
    setExpireAfter(0);
    start.mutate(
      {
        KuskiIndexes: kuskis.map(k => Number(k.KuskiIndex)),
        Text: sent,
        Name: isGroup && name.trim() ? name.trim() : undefined,
        ExpireAfter: expire,
        kuskis,
      },
      {
        onSuccess: ({ ConversationIndex }) => onCreated(ConversationIndex),
        onError: () => {
          setText(sent);
          setExpireAfter(expire);
        },
      },
    );
  };

  return (
    <Container>
      <Header>
        {onBack && (
          <IconButton aria-label="back" size="small" onClick={onBack}>
            <ArrowBack fontSize="small" />
          </IconButton>
        )}
        <Title>{isGroup ? 'New group' : 'New message'}</Title>
      </Header>
      <Fields>
        <KuskiPicker
          selected={kuskis}
          onChange={setKuskis}
          exclude={[userid]}
        />
        {isGroup && (
          <GroupName
            name="Group name (optional)"
            value={name}
            onChange={setName}
            maxLength={50}
            size="small"
          />
        )}
        {tooMany && (
          <ErrorText>
            Groups can have at most {maxGroupMembers + 1} members.
          </ErrorText>
        )}
        {start.isPending && <Sending>Sending…</Sending>}
        {start.error && <ErrorText>{start.error.message}</ErrorText>}
      </Fields>
      <MessageInput
        value={text}
        onChange={setText}
        onSend={onSend}
        expireAfter={expireAfter}
        onExpireChange={setExpireAfter}
        disabled={!kuskis.length || tooMany || start.isPending}
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
  min-height: 34px;
`;

const Title = styled.div`
  font-weight: 500;
`;

const Fields = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${p => p.theme.padMedium};
`;

const GroupName = styled(TextField)`
  margin: 0;
`;

const Sending = styled.div`
  margin-top: ${p => p.theme.padSmall};
  font-size: ${p => p.theme.smallFont};
  color: ${p => p.theme.lightTextColor};
`;

const ErrorText = styled.div`
  margin-top: ${p => p.theme.padSmall};
  font-size: ${p => p.theme.smallFont};
  color: ${p => p.theme.errorColor};
`;

export default NewConversation;
