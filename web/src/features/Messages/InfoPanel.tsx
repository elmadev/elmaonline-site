import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import {
  Close,
  TimerOutlined,
  DeleteOutline,
  SentimentSatisfiedAltOutlined,
} from '@mui/icons-material';
import Header from 'components/Header';
import Link from 'components/Link';
import { OnlineDot } from './OnlineStatus';

const InfoPanel = ({ onClose }: { onClose: () => void }) => (
  <Container>
    <PanelHeader>
      <Title>
        <Header h2>About messages</Header>
      </Title>
      <IconButton aria-label="close info" size="small" onClick={onClose}>
        <Close fontSize="small" />
      </IconButton>
    </PanelHeader>
    <Content>
      <Section>
        <Header h3 nomargin>
          Messages are not encrypted
        </Header>
        <p>
          Messages are stored as plain text on the Elma Online server, so the
          site admins could read them. Don&apos;t send passwords or anything you
          wouldn&apos;t want others to see.
        </p>
      </Section>
      <Section>
        <Header h3 nomargin>
          Online status
        </Header>
        <StatusRow>
          <OnlineDot status="online" /> Active on the site in the last 3 minutes
        </StatusRow>
        <StatusRow>
          <OnlineDot status="away" /> Active in the last hour
        </StatusRow>
        <StatusRow>
          <NoDot /> Not active in the last hour, or hiding their status
        </StatusRow>
        <p>
          Only this status is shared, never the exact time you were last online.
          You can hide yours in{' '}
          <Link to="/settings/device">device settings</Link>, it applies to the
          devices where you turn it on.
        </p>
      </Section>
      <Section>
        <Header h3 nomargin>
          <TimerIcon /> Disappearing messages
        </Header>
        <p>
          Use the timer next to the message box to make the next message
          disappear after a while. It goes back to never after each message.
        </p>
      </Section>
      <Section>
        <Header h3 nomargin>
          <EmojiIcon /> Emojis
        </Header>
        <p>
          Pick one with the smiley button next to the message box, or type a
          colon and a name, like <Code>:thumbsup:</Code>, to get suggestions.
          Press Enter or Tab to insert the selected one. Your recently used
          emojis show up first.
        </p>
      </Section>
      <Section>
        <Header h3 nomargin>
          <DeleteIcon /> Deleting messages
        </Header>
        <p>
          You can delete your own messages, they&apos;re deleted for everyone.
          Deleted and expired messages are removed from the server for good, but
          whoever you sent them to may already have read or copied them.
        </p>
      </Section>
      <Section>
        <Header h3 nomargin>
          Groups
        </Header>
        <p>
          Pick more than one kuski to start a group, up to 20 members. Anyone in
          the group can rename it or add people, and anyone can leave.
        </p>
      </Section>
      <Section>
        <Header h3 nomargin>
          Ignored kuskis
        </Header>
        <p>
          Kuskis you ignore can&apos;t send you messages, and their messages in
          groups are hidden for you.
        </p>
      </Section>
      <Section>
        <Header h3 nomargin>
          Chat box
        </Header>
        <p>
          Choose whether the chat box opens in the bottom left or bottom right
          corner in <Link to="/settings/device">device settings</Link>. Press
          Enter to send and Shift+Enter for a new line. Esc or clicking outside
          closes the chat box.
        </p>
      </Section>
    </Content>
  </Container>
);

const Container = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  background: ${p => p.theme.paperBackground};
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${p => p.theme.padSmall} ${p => p.theme.padMedium};
  border-bottom: 1px solid ${p => p.theme.borderColor};
`;

const Title = styled.div`
  flex: 1;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${p => p.theme.padMedium};
  font-size: ${p => p.theme.smallFont};
`;

const Section = styled.div`
  margin-bottom: ${p => p.theme.padMedium};
  p {
    margin: ${p => p.theme.padXSmall} 0 0;
  }
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
`;

// keeps the text lined up with the rows that have a dot
const NoDot = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-right: 6px;
  border-radius: 50%;
  border: 1px solid ${p => p.theme.lightTextColor};
  box-sizing: border-box;
`;

const iconStyle = `
  && {
    font-size: 18px;
    margin-right: 4px;
    vertical-align: -3px;
  }
`;

const TimerIcon = styled(TimerOutlined)`
  ${iconStyle}
`;

const DeleteIcon = styled(DeleteOutline)`
  ${iconStyle}
`;

const EmojiIcon = styled(SentimentSatisfiedAltOutlined)`
  ${iconStyle}
`;

const Code = styled.code`
  padding: 0 4px;
  border-radius: 3px;
  background: ${p => p.theme.hoverColor};
`;

export default InfoPanel;
