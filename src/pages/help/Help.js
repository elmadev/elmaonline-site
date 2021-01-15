import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Header from 'components/Header';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HowToInstall from './tabs/HowToInstall';
import RegisterAndConnect from './tabs/RegisterAndConnect';
import KeyBindings from './tabs/KeyBindings';
import Rules from './tabs/Rules';
import ConfiguringEol from './tabs/ConfiguringEol';
import PlayingBattles from './tabs/PlayingBattles';
import Etiquette from './tabs/Etiquette';
import GettingStarted from './tabs/GettingStarted';
import Faq from './tabs/Faq';
import Glossary from './tabs/Glossary';
import Crew from './tabs/Crew';
import Links from './tabs/Links';

const useStyles = makeStyles(() => ({
  textButton: {
    textTransform: 'initial',
    fontWeight: 'inherit',
  },
}));

const Help = () => {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState('gettingStarted');

  const { crew } = useStoreState(state => state.Help);
  const { getCrew } = useStoreActions(actions => actions.Help);

  useEffect(() => {
    if (!crew) getCrew();
  });

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
        <a href="/dl/allshirts">dlshirt</a>
        <MainContainer>
          <LeftContainer>
            <Text>
              <Header h2>1. Getting Started</Header>
            </Text>
            <Buttons>
              <div>
                <Button
                  onClick={() => expand('gettingStarted')}
                  color="primary"
                  className={classes.textButton}
                >
                  1.1. Getting Started
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('install')}
                  color="primary"
                  className={classes.textButton}
                >
                  1.2. How to install
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('connect')}
                  color="primary"
                  className={classes.textButton}
                >
                  1.3. Register and connect online
                </Button>
              </div>
              <Header h2>2. Setting up EOL</Header>
              <div>
                <Button
                  onClick={() => expand('keyBindings')}
                  color="primary"
                  className={classes.textButton}
                >
                  2.1. EOL key bindings
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('configuringEol')}
                  color="primary"
                  className={classes.textButton}
                >
                  2.2. EOL Configuration
                </Button>
              </div>
              <Header h2>3. Playing online</Header>
              <div>
                <Button
                  onClick={() => expand('playingBattles')}
                  color="primary"
                  className={classes.textButton}
                >
                  3.1. Playing Battles
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('rules')}
                  color="primary"
                  className={classes.textButton}
                >
                  3.2. Rules
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('glossary')}
                  color="primary"
                  className={classes.textButton}
                >
                  3.3. Glossary
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('etiquette')}
                  color="primary"
                  className={classes.textButton}
                >
                  3.4. Etiquette
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('faq')}
                  color="primary"
                  className={classes.textButton}
                >
                  3.5. FAQ
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('links')}
                  color="primary"
                  className={classes.textButton}
                >
                  3.6. Links
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => expand('crew')}
                  color="primary"
                  className={classes.textButton}
                >
                  3.7. Crew
                </Button>
              </div>
            </Buttons>
          </LeftContainer>
          <RightContainer>
            <ExpandContainer>
              {info === 'gettingStarted' && <GettingStarted />}
              {info === 'install' && <HowToInstall />}
              {info === 'connect' && <RegisterAndConnect />}
              {info === 'keyBindings' && <KeyBindings />}
              {info === 'rules' && <Rules />}
              {info === 'glossary' && <Glossary />}
              {info === 'configuringEol' && <ConfiguringEol />}
              {info === 'playingBattles' && <PlayingBattles />}
              {info === 'etiquette' && <Etiquette />}
              {info === 'faq' && <Faq />}
              {info === 'links' && <Links />}
              {info === 'crew' && <Crew crew={crew} />}
            </ExpandContainer>
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
