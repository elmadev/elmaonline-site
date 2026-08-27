import React from 'react';
import styled from '@emotion/styled';
import { useStoreActions } from 'easy-peasy';
import { Divider } from '@material-ui/core';

const SideBarSubItem = ({ name, expanded, children }) => {
  const { setExpanded } = useStoreActions(actions => actions.Page);
  return (
    <Container>
      <Row onClick={() => setExpanded(name)}>
        <Header>{name}</Header>
        <Arrow>{expanded ? <>&or;</> : <>&and;</>}</Arrow>
      </Row>
      {expanded && <>{children}</>}
      <Hr />
    </Container>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  :hover {
    background: #333333;
  }
`;

const Hr = styled(Divider)`
  && {
    background-color: #333333;
  }
`;

const Header = styled.div`
  color: #c3c3c3;
  display: block;
  padding: 10px 15px;
`;

const Arrow = styled(Header)`
  font-size: 0.8em;
`;

const Container = styled.div`
  cursor: pointer;
  background-image: linear-gradient(#1a1a1a, #1f1f1f);
`;

export default SideBarSubItem;
