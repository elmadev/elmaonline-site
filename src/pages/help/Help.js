import React from 'react';
import Welcome from 'components/Welcome';
import styled from 'styled-components';
import Header from 'components/Header';

const Help = () => {
  return (
    <Container>
      <Header>Help</Header>
      <Welcome />
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

export default Help;
