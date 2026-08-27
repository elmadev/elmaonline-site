import React from 'react';
import styled from '@emotion/styled';
import Header from 'components/Header';

const RegisterAndConnect = () => {
  return (
    <Text>
      <Header h2>Register and connect online</Header>
      To connect to the server online you need to create a user on this website
      and use the same user credentials to set up the game.
      <Header h3>Registering</Header>
      You register by clicking login in top right corner and then register on
      elma.online. After registering you need to confirm your email before your
      account is enabled. Click the link in the email you will get.
      <Header h3>Setting up EOL</Header>
      <List>
        <li>
          Once you have confirmed your account, open Elasto Mania through steam
        </li>
        <li>
          Enter the same nick and password as you used to register on the
          website
        </li>
        <li>Click save settings and EOL will open</li>
      </List>
      <Header h3>Connection issues</Header>
      <List>
        <li>
          When it opens go to any level and you can see system messages in the
          top of the screen, it should imediately connect and say
          &quot;connected to the server&quot;
        </li>
        <li>
          If this is not the case double check your info in config according to
          last paragraph
        </li>
        <li>
          Make sure Hostname is set to eol.elma.online, TCP port to 4460, and
          UDP port to 4461
        </li>
        <li>
          Check your account on the website to make sure you have playing rights
          (click your nick on the top of the page). If you have other issues you
          can ask someone in the{' '}
          <a href="https://discord.gg/j5WMFC6">discord</a>.
        </li>
      </List>
    </Text>
  );
};

const Text = styled.div`
  padding-left: 8px;
  max-width: 900px;
`;

const List = styled.ol`
  margin-top: 8px;
  margin-bottom: 8px;
`;

export default RegisterAndConnect;
