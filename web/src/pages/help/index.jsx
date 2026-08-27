import React from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import Header from 'components/Header';
import styled from '@emotion/styled';
import Layout from 'components/Layout';
import { Button } from '@material-ui/core';
import GettingStarted from './tabs/GettingStarted';
import HowToInstall from './tabs/HowToInstall';
import RegisterAndConnect from './tabs/RegisterAndConnect';
import KeyBindings from './tabs/KeyBindings';
import Rules from './tabs/Rules';
import Glossary from './tabs/Glossary';
import ConfiguringEol from './tabs/ConfiguringEol';
import PlayingBattles from './tabs/PlayingBattles';
import Etiquette from './tabs/Etiquette';
import Faq from './tabs/Faq';
import Donate from './tabs/Donate';
import DeveloperApi from './tabs/DeveloperApi';
import Links from './tabs/Links';
import Crew from './tabs/Crew';
import EolFolder from './tabs/EolFolder';
import GameUpdates from './tabs/GameUpdates';
import MoreLevels from './tabs/MoreLevels';
import Programs from './tabs/Programs';

const Help = () => {
  const { section, subsection } = useParams({ strict: false });
  const navigate = useNavigate();
  let highlightedButton = section || 'howtoinstall';
  if (highlightedButton.indexOf('/') !== -1) {
    highlightedButton = highlightedButton.substr(
      0,
      highlightedButton.indexOf('/'),
    );
  }

  const makeButtons = (infoText, description) => {
    return (
      <div>
        <StyledButton
          highlight={highlightedButton === infoText ? 'true' : null}
          onClick={() => {
            window.scrollTo(0, 0);
            navigate({ to: '/help/' + infoText });
          }}
          color="primary"
        >
          {description}
        </StyledButton>
      </div>
    );
  };

  return (
    <Layout t={`Help - ${highlightedButton}`}>
      <Header>Help</Header>
      <MainContainer>
        <LeftContainer>
          <Text>
            <Header h3>1. Getting Started</Header>
          </Text>
          <ButtonContainer>
            {makeButtons('howtoinstall', '1.1. How to install')}
            {makeButtons(
              'registerandconnect',
              '1.2. Register and connect online',
            )}
            {makeButtons('usefulinformation', '1.3. Useful information')}
            {makeButtons('faq', '1.4. FAQ')}
          </ButtonContainer>
          <Header h3>2. Setting up EOL</Header>
          <ButtonContainer>
            {makeButtons('eolkeybindings', '2.1. EOL key bindings')}
            {makeButtons('eolconfiguration', '2.2. EOL configuration')}
            {makeButtons('eolfiles', '2.3. EOL files')}
          </ButtonContainer>
          <Header h3>3. Playing online</Header>
          <ButtonContainer>
            {makeButtons('playingbattles', '3.1. Playing Battles')}
            {makeButtons('morelevels', '3.2. More Levels')}
            {makeButtons('rules', '3.3. Rules')}
            {makeButtons('etiquette', '3.4. Etiquette')}
            {makeButtons('glossary', '3.5. Glossary')}
            {makeButtons('updates', '3.6. Game updates')}
          </ButtonContainer>
          <Header h3>4. The community</Header>
          <ButtonContainer>
            {makeButtons('crew', '4.1. Crew')}
            {makeButtons('donate', '4.2. Donate')}
            {makeButtons('links', '4.3. Links')}
            {makeButtons('api', '4.4. Developer API')}
            {makeButtons('programs', '4.5. Programs')}
          </ButtonContainer>
        </LeftContainer>
        <RightContainer>
          {section === 'howtoinstall' || !section ? <HowToInstall /> : null}
          {section === 'usefulinformation' ? <GettingStarted /> : null}
          {section === 'registerandconnect' ? <RegisterAndConnect /> : null}
          {section === 'eolkeybindings' ? <KeyBindings /> : null}
          {section === 'rules' ? <Rules /> : null}
          {section === 'glossary' ? <Glossary /> : null}
          {section === 'eolconfiguration' ? <ConfiguringEol /> : null}
          {section === 'playingbattles' ? <PlayingBattles /> : null}
          {section === 'morelevels' ? <MoreLevels /> : null}
          {section === 'updates' ? <GameUpdates /> : null}
          {section === 'etiquette' ? <Etiquette /> : null}
          {section === 'faq' ? <Faq /> : null}
          {section === 'donate' ? <Donate /> : null}
          {section === 'api' ? <DeveloperApi /> : null}
          {section === 'programs' ? <Programs /> : null}
          {section === 'links' ? <Links /> : null}
          {section === 'crew' ? <Crew /> : null}
          {section === 'eolfiles' ? <EolFolder section={subsection} /> : null}
        </RightContainer>
      </MainContainer>
    </Layout>
  );
};

const StyledButton = styled(Button)`
  && {
    border: ${p =>
      p.highlight
        ? `2px solid ${p.theme.primaryAlpha3}`
        : '2px solid transparent'};
    text-transform: initial;
    font-weight: ${p => (p.highlight ? '550' : 'inherit')};
    background: ${p => (p.highlight ? p.theme.primaryAlpha : 'initial')};
  }
`;

const MainContainer = styled.div`
  width: 100%;
  display: flex;
`;
const LeftContainer = styled.div`
  float: left;
  width: 450px;
  min-width: 240px;
`;
const RightContainer = styled.div`
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
