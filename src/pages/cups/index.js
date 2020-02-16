import React from 'react';

import Layout from 'components/Layout';

import Cups from './Cups';

async function action(context) {
  return {
    title: 'cups',
    chunks: ['cups'],
    component: (
      <Layout>
        <Cups context={context} />
      </Layout>
    ),
  };
}

export default action;
