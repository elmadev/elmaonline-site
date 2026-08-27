import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useStoreState } from 'easy-peasy';
import { Helmet } from 'react-helmet-async';

import TopBar from 'components/TopBar';
import SideBar from 'components/SideBar';
import GlobalStyle from 'globalStyle';

const Layout = ({ children, edge, t = '' }) => {
  const { sideBarVisible } = useStoreState(state => state.Page);
  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>Elma Online - {t}</title>
      </Helmet>
      <Container expanded={sideBarVisible}>
        <TopBar />
        <SideBar />
        <ChildrenCon edge={edge}>{children}</ChildrenCon>
      </Container>
    </>
  );
};

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChildrenCon = styled.div`
  min-height: 100%;
  margin-top: -54px;
  box-sizing: border-box;
  padding: ${p => (p.edge ? 0 : '24px')};
  padding-top: ${p => (p.edge ? '54px' : '74px')};
  @media (max-width: 1000px) {
    padding-left: ${p => (p.edge ? 0 : '12px')};
    padding-right: ${p => (p.edge ? 0 : '12px')};
  }
  ${Content} {
    margin: 24px;
  }
`;

const Container = styled.div`
  height: 100%;
  @media (min-width: 1000px) {
    margin-left: ${p => (p.expanded ? '250px' : 0)};
  }
`;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
