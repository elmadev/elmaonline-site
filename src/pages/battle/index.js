import React from 'react';

import Layout from 'components/Layout';

import Battle from './Battle';

async function action(context) {
  return {
    title: `battles/${context.params.id}`,
    chunks: ['battle'],
    component: (
      <Layout>
        <Battle BattleIndex={parseInt(context.params.id, 10)} />
      </Layout>
    ),
  };
}

export default action;
