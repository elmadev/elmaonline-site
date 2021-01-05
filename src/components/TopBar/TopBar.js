import React from 'react';
import styled from 'styled-components';
import SearchBar from '../SearchBar';
import TopBarActions from './TopBarActions';

class TopBar extends React.Component {
  render() {
    return (
      <Root>
        <Container>
          <SearchBar />
          <TopBarActions />
        </Container>
      </Root>
    );
  }
}

const Root = styled.div`
  top: 0;
  left: 0;
  background: #219653;
  color: #f1f1f1;
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  line-height: 50px;
  padding-left: 250px;
  z-index: 10;
`;

const Container = styled.div`
  margin: 0 14px;
  display: flex;
  justify-content: space-between;
`;

export default TopBar;
