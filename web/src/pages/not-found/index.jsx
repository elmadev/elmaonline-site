/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import styled from '@emotion/styled';
import Header from 'components/Header';
import Layout from 'components/Layout';
import FourOFour0 from '../../images/404_0.png';
import FourOFour1 from '../../images/404_1.png';
import FourOFour2 from '../../images/404_2.png';

const images = [FourOFour0, FourOFour1, FourOFour2];

class NotFound extends React.Component {
  render() {
    return (
      <Layout t="Not Found">
        <Container>
          <Header>Not Found</Header>
          <div>Sorry, the page you were trying to view does not exist.</div>
          <Image>
            <img
              src={images[Math.floor(Math.random() * images.length)]}
              alt="Not found.."
            />
          </Image>
        </Container>
      </Layout>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.div`
  padding: 16px;
`;

export default NotFound;
