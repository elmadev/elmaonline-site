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
import DeveloperApi from './tabs/DeveloperApi';
import Donate from './tabs/Donate';
import Links from './tabs/Links';
import EolFolder from './tabs/EolFolder';

const useStyles = makeStyles(() => ({
  textButton: {
    textTransform: 'initial',
    fontWeight: 'inherit',
  },
  selectedButton: {
    textTransform: 'initial',
    fontWeight: '550',
    border: '2px solid rgba(33, 150, 83, 0.3)',
    background: 'rgba(33, 150, 83, 0.1)',
  },
}));

const Help = () => {
  const [info, setInfo] = useState('gettingStarted');

  const { crew, donations } = useStoreState(state => state.Help);
  const { getCrew, getDonations } = useStoreActions(actions => actions.Help);

  useEffect(() => {
    if (!crew) getCrew();
    if (!donations) getDonations();
  });

  const classes = useStyles();

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <>
        <Header>Help</Header>
        <MainContainer>
          <LeftContainer>
            <Text>
              <Header h3>1. Getting Started</Header>
            </Text>
            <Buttons>
              <div>
                <Button
                  onClick={() => setInfo('install')}
                  color="primary"
                  className={
                    info === 'install'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  1.1. How to install
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setInfo('connect')}
                  color="primary"
                  disableElevation
                  disableFocusRipple
                  className={
                    info === 'connect'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  1.2. Register and connect online
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setInfo('gettingStarted')}
                  color="primary"
                  className={
                    info === 'gettingStarted'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  1.3. Useful information
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setInfo('faq')}
                  color="primary"
                  className={
                    info === 'faq' ? classes.selectedButton : classes.textButton
                  }
                >
                  1.4. FAQ
                </Button>
              </div>
            </Buttons>
            <Header h3>2. Setting up EOL</Header>
            <Buttons>
              <div>
                <Button
                  onClick={() => setInfo('keyBindings')}
                  color="primary"
                  className={
                    info === 'keyBindings'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  2.1. EOL key bindings
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setInfo('configuringEol')}
                  color="primary"
                  className={
                    info === 'configuringEol'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  2.2. EOL Configuration
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setInfo('eolFolder')}
                  color="primary"
                  className={
                    info === 'eolFolder'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  2.3. EOL files
                </Button>
              </div>
            </Buttons>
            <Header h3>3. Playing online</Header>
            <Buttons>
              <div>
                <Button
                  onClick={() => setInfo('playingBattles')}
                  color="primary"
                  className={
                    info === 'playingBattles'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  3.1. Playing Battles
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setInfo('rules')}
                  color="primary"
                  className={
                    info === 'rules'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  3.2. Rules
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setInfo('etiquette')}
                  color="primary"
                  className={
                    info === 'etiquette'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  3.3. Etiquette
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setInfo('glossary')}
                  color="primary"
                  className={
                    info === 'glossary'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  3.4. Glossary
                </Button>
              </div>
            </Buttons>
            <Header h3>4. The community</Header>
            <Buttons>
              <div>
                <Button
                  onClick={() => setInfo('crew')}
                  color="primary"
                  className={
                    info === 'crew'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  4.1. Crew
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setInfo('donate')}
                  color="primary"
                  className={
                    info === 'donate'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  4.2. Donate
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setInfo('links')}
                  color="primary"
                  className={
                    info === 'links'
                      ? classes.selectedButton
                      : classes.textButton
                  }
                >
                  4.3. Links
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => setInfo('api')}
                  color="primary"
                  className={
                    info === 'api' ? classes.selectedButton : classes.textButton
                  }
                >
                  4.4. Developer API
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
              {info === 'donate' && <Donate donations={donations} />}
              {info === 'api' && <DeveloperApi />}
              {info === 'links' && <Links />}
              {info === 'crew' && <Crew crew={crew} />}
              {info === 'eolFolder' && <EolFolder />}
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
