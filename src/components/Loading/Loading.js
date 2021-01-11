import React from 'react';
import styled from 'styled-components';

const Loading = () => (
  <Container>
    Loading..
    {/* <Spinner>
      <Bounce1 />
      <Bounce2 />
      <Bounce />
    </Spinner> */}
  </Container>
);

/* const BounceDelay = keyframes`
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`; */

const Container = styled.div`
  padding: 20px;
`;

/* const Spinner = styled.div`
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
`; */

export default Loading;
