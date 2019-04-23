import React from 'react';

import Layout from 'components/Layout';

import Level from './Level';

async function action(context) {
  return {
    title: `levels/${context.params.id}`,
    chunks: ['level'],
    component: (
      <Layout>
        <Level LevelIndex={parseInt(context.params.id, 10)} />
      </Layout>
    ),
  };
}

export default action;
