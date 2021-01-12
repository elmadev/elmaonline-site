import React, { useState } from 'react';
import Header from 'components/Header';
import styled from 'styled-components';
import { Grid as div, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from 'styles/Paper';
import HowToInstall from './tabs/HowToInstall';
import RegisterAndConnect from './tabs/RegisterAndConnect';
import KeyBindings from './tabs/KeyBindings';
import Rules from './tabs/Rules';
import ConfiguringEol from './tabs/ConfiguringEol';
import PlayingBattles from './tabs/PlayingBattles';
import Etiquette from './tabs/Etiquette';
import GettingStarted from './tabs/GettingStarted';

const useStyles = makeStyles(() => ({
  textButton: {
    textTransform: 'initial',
    fontWeight: 'inherit',
  },
}));

const Help = () => {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState('gettingStarted');

  const classes = useStyles();

  const expand = type => {
    if (type === info) {
      setOpen(!open);
    } else {
      setOpen(true);
    }
    setInfo(type);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <>
        <Header>Help</Header>
        <MainContainer>
          <LeftContainer>
            <Text>
              <Header h2>Getting Started</Header>
            </Text>
            <Buttons>
              <div>
                <Button
                  onClick={() => expand('gettingStarted')}
                  color="primary"
                  className={classes.textButton}
                >
                  Getting Started
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('install')}
                  color="primary"
                  className={classes.textButton}
                >
                  How to install
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('connect')}
                  color="primary"
                  className={classes.textButton}
                >
                  Register and connect online
                </Button>
              </div>
              <Header h2>Setting up EOL</Header>
              <div>
                <Button
                  onClick={() => expand('keyBindings')}
                  color="primary"
                  className={classes.textButton}
                >
                  EOL key bindings
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('configuringEol')}
                  color="primary"
                  className={classes.textButton}
                >
                  EOL Configuration
                </Button>
              </div>
              <Header h2>Playing online</Header>
              <div>
                <Button
                  onClick={() => expand('rules')}
                  color="primary"
                  className={classes.textButton}
                >
                  Rules
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('playingBattles')}
                  color="primary"
                  className={classes.textButton}
                >
                  Playing Battles
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('etiquette')}
                  color="primary"
                  className={classes.textButton}
                >
                  Etiquette
                </Button>
              </div>
            </Buttons>
          </LeftContainer>
          <RightContainer>
            <Paper>
              <ExpandContainer>
                {info === 'gettingStarted' && <GettingStarted />}
                {info === 'install' && <HowToInstall />}
                {info === 'connect' && <RegisterAndConnect />}
                {info === 'keyBindings' && <KeyBindings />}
                {info === 'rules' && <Rules />}
                {info === 'configuringEol' && <ConfiguringEol />}
                {info === 'playingBattles' && <PlayingBattles />}
                {info === 'etiquette' && <Etiquette />}
              </ExpandContainer>
            </Paper>
          </RightContainer>
        </MainContainer>
      </>
    </div>
  );
};

const MainContainer = styled.div`
  width: 100%;
  display: flex;
`;
const LeftContainer = styled.div`
  float: left;
  width: 35%;
`;
const RightContainer = styled.div`
  float: right;
  width: 100%;
`;
const Buttons = styled.div`
  button {
    margin: 2px;
  }
`;

const ExpandContainer = styled.div`
  margin: 8px;
`;

const Text = styled.div`
  padding-left: 8px;
`;

export default Help;
