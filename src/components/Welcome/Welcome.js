import React, { useState } from 'react';
import styled from 'styled-components';
import { Grid, Button } from '@material-ui/core';
import Header from 'components/Header';

const Welcome = () => {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState('');

  const expand = type => {
    if (type === info) {
      setOpen(!open);
    } else {
      setOpen(true);
    }
    setInfo(type);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <Text>
            Welcome to the Elasto Mania online website. Elma online is a patch
            for the game Elasto Mania which enables online play, such as
            battles, multiplay and watching others. To get started:
            <List>
              <li>
                <a href="https://store.steampowered.com/app/1290220/Elasto_Mania/">
                  Buy Elasto Mania on steam
                </a>
              </li>
              <li>
                <a href="https://steamcommunity.com/workshop/filedetails/?id=2094059600">
                  Install the Elma Online mod on steam workshop
                </a>
              </li>
              <li>Register on this site</li>
              <RedLi>New IP May 2020: 161.35.35.82</RedLi>
            </List>
          </Text>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Trailer>
            <iframe
              title="trailer"
              width="358"
              height="201"
              src="https://www.youtube.com/embed/yvy1gGcywC0"
              frameBorder="0"
              allowFullScreen
            />
          </Trailer>
        </Grid>
      </Grid>
      <Buttons>
        <Button onClick={() => expand('install')} variant="contained">
          How to install
        </Button>
        <Button onClick={() => expand('connect')} variant="contained">
          Register and connect online
        </Button>
        <Button onClick={() => expand('battles')} variant="contained">
          Playing battles
        </Button>
      </Buttons>
      {open && (
        <ExpandContainer>
          {info === 'install' && (
            <Text>
              <Header h2>How to install</Header>
              <Header h3>Buying Elasto Mania</Header>
              <List>
                <li>
                  <a href="https://store.steampowered.com/about/">
                    Install steam
                  </a>
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
                    Install the Elma Online mod on steam workshop by clicking
                    subscribe
                  </a>
                </li>
                <li>Let steam download the upgrade</li>
              </List>
              <Header h3>Issues</Header>
              If you run into issues you can ask someone in{' '}
              <a href="https://discord.gg/j5WMFC6">discord</a> who&apos;ll
              usually have a solution
            </Text>
          )}
          {info === 'connect' && (
            <Text>
              <Header h2>Register and connect online</Header>
              To connect to the server online you need to create a user on this
              website and use the same user credentials to set up the game.
              <Header h3>Registering</Header>
              You register by using the form on the right side of the frontpage
              of elma.online. After registering you need to confirm your email
              before your account is enabled. Click the link in the email you
              will get.
              <Header h3>Setting up EOL</Header>
              <List>
                <li>
                  Once you have confirmed your account, open Elasto Mania
                  through steam
                </li>
                <li>
                  Enter the same nick and password as you used to register on
                  the website
                </li>
                <li>Click save settings and EOL will open</li>
              </List>
              <Header h3>Connection issues</Header>
              <List>
                <li>
                  When it opens go to any level and you can see system messages
                  in the top of the screen, it should imediately connect and say
                  &quot;connected to the server&quot;
                </li>
                <li>
                  If this is not the case double check your info in config
                  according to last paragraph
                </li>
                <li>
                  Make sure IP is set to 161.35.35.82, TCP port to 4460, UDP
                  port to 4461, and that 2nd nick box is unticked
                </li>
                <li>
                  Check your account on the website to make sure you have
                  playing rights (click your nick on the top of the page). If
                  you have other issues you can ask someone in the{' '}
                  <a href="https://discord.gg/j5WMFC6">discord</a>.
                </li>
              </List>
            </Text>
          )}
          {info === 'battles' && (
            <Text>
              <Header h2>Playing Battles</Header>
              Battles are one of the primary features of Elma Online. In a
              battle a new level is released and everyone plays it at the same
              time. You are given a certain timeframe, typically 10 to 30
              minutes, and the one with the best time at the end wins.
              <Header h3>Participating</Header>
              To participate in a battle you need to download the level and play
              it.
              <List>
                <li>
                  Open any level so you can see the battle information in the
                  bottom of the screen. If a battle is on it will say
                  &quot;Battle in ...&quot;
                </li>
                <li>Press F4 to download the level</li>
                <li>
                  Exit current level and go back to external levels screen
                </li>
                <li>Find the level you just downloaded and open it</li>
                <li>
                  Play the level untill the timer runs out and attempt to get as
                  good a time as possible
                </li>
                <li>
                  After the battle is over you can press F6 to see results and
                  F11 to download the winning replay
                </li>
                Some battles have special rules, the type of battle will be
                written in the battle information. You can see the{' '}
                <a href="http://wiki.elmaonline.net/Battle_types">
                  {' '}
                  types and rules here
                </a>
              </List>
              <Header h3>Starting a battle</Header>
              You can start a battle yourself on your own levels. Remember the
              level must follow the{' '}
              <a href="http://wiki.elmaonline.net/Rules">rules</a>, most
              importantly it must be a new level never played before
              <List>
                <li>
                  Get battle starting rights by asking a mod, you need to have
                  played at least five battles before asking
                </li>
                <li>Open startballe.exe in the elma folder</li>
                <li>
                  Click the browse icon and find the level you made in the lev
                  folder of the elma folder
                </li>
                <li>
                  Change the duration to fit your level. If in doubt pick
                  something around 10 to 20 minutes
                </li>
                <li>
                  For your first battle let the rest of the options stay the
                  same
                </li>
                <li>Click the start button</li>
              </List>
            </Text>
          )}
        </ExpandContainer>
      )}
    </>
  );
};

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  button {
    margin: 8px;
  }
`;

const RedLi = styled.li`
  color: red;
`;

const ExpandContainer = styled.div``;

const Text = styled.div`
  padding-left: 8px;
`;

const List = styled.ol`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const Trailer = styled.div`
  justify-content: flex-end;
  display: flex;
  padding-right: 4px;
`;

export default Welcome;
