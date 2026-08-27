import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const Loading = () => (
  <Container>
    <Spinner>
      <Bounce1 />
      <Bounce2 />
      <Bounce />
    </Spinner>
  </Container>
);

const BounceDelay = keyframes`
  0% {
    transform: scale(0);
    background-color: #1b3a57;
  }
  40% {
    transform: scale(1);
    background-color: #639bcf;
  }
  80% {
    transform: scale(0);
    background-color: #30689c;
  }
  100% {
    transform: scale(0);
    background-color: #b1cde7;
  }
  
`;

const Container = styled.div`
  padding: 20px;
`;

const Spinner = styled.div`
  width: 100px;
  text-align: center;
  margin: auto;
`;

const Bounce = styled.div`
  width: 18px;
  height: 18px;
  background-color: #f1f1f1;
  margin: 5px;
  border-radius: 100%;
  display: inline-block;
  animation: ${BounceDelay} 1.4s infinite ease-in-out both;
`;

const Bounce1 = styled(Bounce)`
  animation-delay: -0.32s;
`;

const Bounce2 = styled(Bounce)`
  animation-delay: -0.16s;
`;

export default Loading;
