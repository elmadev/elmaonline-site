import React from 'react';

import Layout from 'components/Layout';

import TTBattle from './TTBattle';

async function action(context) {
  return {
    title: `ttbattle/${context.params.id}`,
    chunks: ['ttbattle'],
    component: (
      <Layout>
        <TTBattle TTBattleIndex={parseInt(context.params.id, 10)} />
      </Layout>
    ),
  };
}

export default action;
