import React from 'react';
import Header from 'components/Header';
import styled from '@emotion/styled';

const GettingStarted = () => {
  return (
    <Text>
      <Header h2>Useful information</Header>
      <Header h3>Useful commands</Header>
      Here are a handful of useful commands to help get you going:
      <ul>
        <li>F1: hide/show other players in a level</li>
        <li>
          F2, shift + F2 and ctrl + F2: spectate other players in a level.
        </li>
        <li>F9: chat with other players</li>
        <li>F4: download battle level</li>
        <li>F11: download last battle replay</li>
      </ul>
      <Header h3>Saving replays</Header>
      After you make a record in any level (except battles, where they are
      automatically saved and uploaded) it is a good habit to save your personal
      best replays.
      <Header h3>More information</Header>
      For more details join the{' '}
      <a href="https://discord.gg/j5WMFC6">Elma discord</a> or visit the{' '}
      <a href="http://wiki.elmaonline.net/Main_Page">Elma Wiki.</a>
    </Text>
  );
};

const Text = styled.div`
  padding-left: 8px;
  max-width: 900px;
`;

export default GettingStarted;
