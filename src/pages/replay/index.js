import React from 'react';
import Replay from './Replay';
import Layout from '../../components/Layout';

async function action(context) {
  return {
    title: `r/${context.params.uuid}`,
    chunks: ['replay'],
    component: (
      <Layout>
        <Replay ReplayUuid={context.params.uuid} />
      </Layout>
    ),
  };
}

export default action;
