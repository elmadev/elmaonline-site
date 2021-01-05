import React from 'react';

import Layout from 'components/Layout';

import Replays from './Replays';

async function action(context) {
  return {
    title: `replays`,
    chunks: ['replays'],
    component: (
      <Layout>
        <Replays context={context} />
      </Layout>
    ),
  };
}

export default action;
