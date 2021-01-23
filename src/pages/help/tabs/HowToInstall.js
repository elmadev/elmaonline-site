import React from 'react';
import styled from 'styled-components';
import Header from 'components/Header';

const HowToInstall = () => {
  return (
    <Text>
      <Header h2>How to install</Header>
      <Header h3>Buying Elasto Mania</Header>
      <List>
        <li>
          <a href="https://store.steampowered.com/about/">Install steam</a>
        </li>
        <li>
          <a href="https://store.steampowered.com/app/1290220/Elasto_Mania/">
            Buy Elasto Mania on steam
          </a>
        </li>
        <li>Install Elasto Mania through your steam client</li>
      </List>
      <Header h3>Upgrading to Elma Online</Header>
      <List>
        <li>
          <a href="https://steamcommunity.com/workshop/filedetails/?id=2094059600">
            Install the Elma Online mod on steam workshop by clicking subscribe
          </a>
        </li>
        <li>Let steam download the upgrade</li>
      </List>
      <Header h3>Issues</Header>
      If you run into issues you can ask someone in{' '}
      <a href="https://discord.gg/j5WMFC6">discord</a> who&apos;ll usually have
      a solution. Tag @eolmod for a faster response.
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

export default HowToInstall;
