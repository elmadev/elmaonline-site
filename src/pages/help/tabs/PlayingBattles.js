import React from 'react';
import styled from 'styled-components';
import Header from 'components/Header';

const PlayingBattles = () => {
  return (
    <Text>
      <Header h2>Playing Battles</Header>
      Battles are one of the primary features of Elma Online. In a battle a new
      level is released and everyone plays it at the same time. You are given a
      certain timeframe, typically 10 to 30 minutes, and the one with the best
      time at the end wins.
      <Header h3>Participating</Header>
      To participate in a battle you need to download the level and play it.
      <List>
        <li>
          Open any level so you can see the battle information in the bottom of
          the screen. If a battle is on it will say &quot;Battle in ...&quot;
        </li>
        <li>Press F4 to download the level</li>
        <li>Exit current level and go back to external levels screen</li>
        <li>Find the level you just downloaded and open it</li>
        <li>
          Play the level untill the timer runs out and attempt to get as good a
          time as possible
        </li>
        <li>
          After the battle is over you can press F6 to see results and F11 to
          download the winning replay
        </li>
        Some battles have special rules, the type of battle will be written in
        the battle information. You can see the{' '}
        <a href="http://wiki.elmaonline.net/Battle_types">
          {' '}
          types and rules here
        </a>
      </List>
      <Header h3>Starting a battle</Header>
      You can start a battle yourself on your own levels. Remember the level
      must follow the <a href="http://wiki.elmaonline.net/Rules">rules</a>, most
      importantly it must be a new level never played before
      <List>
        <li>
          Get battle starting rights by asking a mod, you need to have played at
          least five battles before asking
        </li>
        <li>Open startballe.exe in the elma folder</li>
        <li>
          Click the browse icon and find the level you made in the lev folder of
          the elma folder
        </li>
        <li>
          Change the duration to fit your level. If in doubt pick something
          around 10 to 20 minutes
        </li>
        <li>For your first battle let the rest of the options stay the same</li>
        <li>Click the start button</li>
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

export default PlayingBattles;
