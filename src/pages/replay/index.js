import React from 'react';

import Layout from 'components/Layout';

import Replay from './Replay';

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
