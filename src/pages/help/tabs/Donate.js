import React from 'react';
import styled from 'styled-components';
import Header from 'components/Header';

const Donate = () => {
  return (
    <div>
      <Text>
        <Header h2>Donate</Header>
        <Header h3>Dollars</Header>
        <Header h3>or Kronor</Header>
      </Text>
    </div>
  );
};

const Text = styled.div`
  padding-left: 8px;
`;

export default Donate;
