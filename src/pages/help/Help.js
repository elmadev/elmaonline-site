import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Header from 'components/Header';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
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

const Help = () => {
  const [info, setInfo] = useState('install');

  const { crew, donations } = useStoreState(state => state.Help);
  const { getCrew, getDonations } = useStoreActions(actions => actions.Help);

  useEffect(() => {
    if (!crew) getCrew();
    if (!donations) getDonations();
  });

  const makeButtons = (infoText, description) => {
    return (
      <div>
        <StyledButton
          highlight={info === infoText}
          onClick={() => setInfo(infoText)}
          color="primary"
        >
          {description}
        </StyledButton>
      </div>
    );
  };

  return (
    <MainDiv>
      <Header>Help</Header>
      <MainContainer>
        <LeftContainer>
          <Text>
            <Header h3>1. Getting Started</Header>
          </Text>
          <ButtonContainer>
            {makeButtons('install', '1.1. How to install')}
            {makeButtons('connect', '1.2. Register and connect online')}
            {makeButtons('gettingStarted', '1.3. Useful information')}
            {makeButtons('faq', '1.4. FAQ')}
          </ButtonContainer>
          <Header h3>2. Setting up EOL</Header>
          <ButtonContainer>
            {makeButtons('keyBindings', '2.1. EOL key bindings')}
            {makeButtons('configuringEol', '2.2. EOL configuration')}
            {makeButtons('eolFolder', '2.3. EOL files')}
          </ButtonContainer>
          <Header h3>3. Playing online</Header>
          <ButtonContainer>
            {makeButtons('playingBattles', '3.1. Playing Battles')}
            {makeButtons('rules', '3.2. Rules')}
            {makeButtons('etiquette', '3.3. Etiquette')}
            {makeButtons('glossary', '3.4. Glossary')}
          </ButtonContainer>
          <Header h3>4. The community</Header>
          <ButtonContainer>
            {makeButtons('crew', '4.1. Crew')}
            {makeButtons('donate', '4.2. Donate')}
            {makeButtons('links', '4.3. Links')}
            {makeButtons('api', '4.4. Developer API')}
          </ButtonContainer>
        </LeftContainer>
        <RightContainer>
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
        </RightContainer>
      </MainContainer>
    </MainDiv>
  );
};

const StyledButton = styled(Button)`
  && {
    border: ${p =>
      p.highlight
        ? '2px solid rgba(33, 150, 83, 0.3)'
        : '2px solid transparent'};
    text-transform: initial;
    font-weight: ${p => (p.highlight ? '550' : 'inherit')};
    background: ${p => (p.highlight ? 'rgba(33, 150, 83, 0.1)' : 'initial')};
  }
`;

const MainDiv = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const MainContainer = styled.div`
  width: 100%;
  display: flex;
`;
const LeftContainer = styled.div`
  float: left;
  width: 450px;
`;
const RightContainer = styled.div`
  float: right;
  width: 100%;
  margin: 8px;
`;
const ButtonContainer = styled.div`
  button {
    margin: 2px;
  }
  padding-top: 3px;
`;

const Text = styled.div`
  padding-left: 8px;
`;

export default Help;
