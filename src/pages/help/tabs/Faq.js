import React from 'react';
import styled from 'styled-components';
import Header from 'components/Header';

const Faq = () => {
  return (
    <div>
      <Text>
        <Header h2>Frequently asked questions</Header>
        <Header h3>Installing EOL</Header>
        <Header h3>etc</Header>
      </Text>
    </div>
  );
};

const Text = styled.div`
  padding-left: 8px;
`;

export default Faq;
