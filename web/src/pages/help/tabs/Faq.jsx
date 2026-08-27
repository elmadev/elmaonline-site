import React from 'react';
import styled from '@emotion/styled';
import Header from 'components/Header';

const Faq = () => {
  return (
    <div>
      <Text>
        <Header h2>Frequently asked questions</Header>
        <Header h3>Registration</Header>
        <QuestionText>
          Q: I did not receive an email after registration. What do I do?
        </QuestionText>
        <AnswerText>A: Contact @eolmod in the Elma discord</AnswerText>
        <Header h3>General</Header>
        <QuestionText>
          Q: Why should I use EOL instead of the Steam version?
        </QuestionText>
        <AnswerText>
          A: EOL (Elma Online) enhances the game with online capabilities, such
          as the ability to see other players playing the same level, saving all
          stats in a database and playing live battles in-game, along with the
          chat.
        </AnswerText>
        <QuestionText>
          Q: I have a feature suggestion. Who should I tell about it?
        </QuestionText>
        <AnswerText>
          A: The Elma discord in general is a good place to discuss just about
          anything related to this game. Keep in mind the eol patch itself is
          hard and a lot of work to update which might make even good ideas not
          easy to implement.
        </AnswerText>
        <QuestionText>Q: How do I know the time of a replay?</QuestionText>
        <AnswerText>
          A: In the replay menu, press ctrl + alt + enter. This will show the
          time of the replay within small error margin.
        </AnswerText>
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
        <Header h3>Still lost?</Header>
        Don&#39;t hesitate to ask for help on the{' '}
        <a href="https://discord.gg/j5WMFC6">Elma discord</a>.
      </Text>
    </div>
  );
};

const QuestionText = styled.span`
  font-weight: 550;
  font-size: 0.95em;
`;

const AnswerText = styled.div`
  font-size: 0.93em;
`;

const Text = styled.div`
  max-width: 900px;
  padding-left: 8px;
  & h3 {
    margin-bottom: 5px;
    margin-top: 5px;
  }
`;

export default Faq;
