import React from 'react';
import styled from 'styled-components';
import Header from 'components/Header';

const Faq = () => {
  return (
    <div>
      <Text>
        <Header h2>Frequently asked questions</Header>
        <Header h3>In-game errors</Header>
        <QuestionText>
          Q: I get &quot;tcp: can&#39;t connect to the server&quot; when I
          launch the game
        </QuestionText>
        <AnswerText>
          A: Usually this error occurs when something is wrong in your
          connection settings. Make sure your nick, password, server IP and
          ports are correct. If you get both &quot;Connected to the server&quot;
          and &quot;Error: lost tcp connection to server (F12 to
          Reconnect)&quot; your IP and TCP ports should be correct.
        </AnswerText>
        <QuestionText>
          Q: I get &quot;Error: udp bind&quot;. What does it mean?
        </QuestionText>
        <AnswerText>
          Usually this error occurs when you have multiple instances of the game
          running simultaneously. Close the extra executables and you should be
          good to go.
        </AnswerText>
        <QuestionText>Q: How do I know the time of a replay?</QuestionText>
        <Header h3>General</Header>
        <AnswerText>
          A: In the replay menu, press ctrl + alt + enter. This will show the
          time of the replay within small error margin.
        </AnswerText>
      </Text>
    </div>
  );
};

const QuestionText = styled.span`
  font-weight: 550;
`;

const AnswerText = styled.div`
  border: 1px solid #eee;
`;

const Text = styled.div`
  padding-left: 8px;
`;

export default Faq;
