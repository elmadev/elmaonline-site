import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { mod } from 'utils/nick';

import Link from 'components/Link';

const SideBar = () => {
  const { sideBarVisible } = useStoreState(state => state.Page);
  const { hideSideBar, toggleSideBar } = useStoreActions(
    actions => actions.Page,
  );
  const onNavigation = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1000) {
      hideSideBar();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1000) {
      hideSideBar();
    }
  }, []);

  const onToggle = () => {
    toggleSideBar();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  };
  return (
    <Root sideBarVisible={sideBarVisible}>
      <Container>
        <Title
          role="button"
          tabIndex="0"
          onKeyUp={e => {
            if (e.keyCode === 13) onToggle();
          }}
          onClick={onToggle}
        >
          &#9776; <Header sideBarVisible={sideBarVisible}>Sidebar</Header>
        </Title>
        <Content sideBarVisible={sideBarVisible}>
          <Link to="/" onClick={onNavigation}>
            Home
          </Link>
          <Link to="/battles" onClick={onNavigation}>
            Battles
          </Link>
          <Link to="/battles/ranking" onClick={onNavigation}>
            Ranking
          </Link>
          <Link to="/levels" onClick={onNavigation}>
            Levels
          </Link>
          <Link to="/replays" onClick={onNavigation}>
            Replays
          </Link>
          <Link to="/kuskis" onClick={onNavigation}>
            Kuskis
          </Link>
          <Link to="/teams" onClick={onNavigation}>
            Teams
          </Link>
          <Link to="/cups" onClick={onNavigation}>
            Cups
          </Link>
          <Link to="/editor" onClick={onNavigation}>
            Editor
          </Link>
          <Link to="/map" onClick={onNavigation}>
            Map
          </Link>
          <Link to="/chatlog" onClick={onNavigation}>
            Chat Log
          </Link>
          <Link to="/help" onClick={onNavigation}>
            Help
          </Link>
          {mod() === 1 && (
            <Link to="/mod" onClick={onNavigation}>
              Mod
            </Link>
          )}
        </Content>
      </Container>
    </Root>
  );
};

const Root = styled.div`
  color: black;
  position: fixed;
  width: 250px;
  top: 0;
  left: 0;
  z-index: 11;
  height: ${p => (p.sideBarVisible ? '100%' : 'auto')};
  @media (max-width: 768px) {
    width: ${p => (p.sideBarVisible ? '250px' : '50px')};
  }
`;

const Header = styled.span`
  display: ${p => (p.sideBarVisible ? 'inline' : 'initial')};
  @media (max-width: 768px) {
    display: none;
  }
`;

const Container = styled.div`
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
`;

const Content = styled.div`
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  display: ${p => (p.sideBarVisible ? 'block' : 'none')};
  background: #1f1f1f;
  a {
    color: #c3c3c3;
    display: block;
    padding: 10px 15px;
    text-decoration: none;
    :hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
`;

const Title = styled.div`
  background: #383838;
  line-height: 50px;
  color: #fff;
  text-transform: uppercase;
  padding: 0 17px;
  outline: 0;
  cursor: pointer;
`;

export default SideBar;
