import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useStoreState } from 'easy-peasy';

import TopBar from 'components/TopBar';
import SideBar from 'components/SideBar';
import GlobalStyle from '../../globalStyle';

const Layout = ({ children }) => {
  const { sideBarVisible } = useStoreState(state => state.Page);
  return (
    <>
      <GlobalStyle />
      <Container expanded={sideBarVisible}>
        <TopBar />
        <SideBar />
        <ChildrenCon>{children}</ChildrenCon>
      </Container>
    </>
  );
};

const ChildrenCon = styled.div`
  min-height: 100%;
  margin-top: -50px;
  padding-top: 50px;
  box-sizing: border-box;
  background: #f1f1f1;
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
