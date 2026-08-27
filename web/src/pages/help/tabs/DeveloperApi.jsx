import React from 'react';
import styled from '@emotion/styled';
import Header from 'components/Header';

const DeveloperApi = () => {
  return (
    <div>
      <Text>
        <Header h2>Developer API</Header>
        <p>
          There's no documentation for the API, but the API used by the site is
          open and the code is open source. So you can either inspect the
          website or check the source code.
        </p>
        <p>
          Source code can be found on{' '}
          <a href="https://github.com/elmadev/elmaonline-site">github</a>.
        </p>
      </Text>
    </div>
  );
};

const Text = styled.div`
  padding-left: 8px;
`;

export default DeveloperApi;
