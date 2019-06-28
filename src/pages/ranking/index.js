import React from 'react';

import Layout from 'components/Layout';

import Ranking from './Ranking';

async function action(context) {
  return {
    title: 'ranking',
    chunks: ['ranking'],
    component: (
      <Layout>
        <Ranking context={context} />
      </Layout>
    ),
  };
}

export default action;
