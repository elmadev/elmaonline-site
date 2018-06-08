import React from 'react';
import Battle from './Battle';
import Layout from '../../components/Layout';

async function action(context) {
  return {
    title: 'Elma Online',
    component: (
      <Layout>
        <Battle BattleIndex={parseInt(context.params.id, 10)} />
      </Layout>
    ),
  };
}

export default action;
