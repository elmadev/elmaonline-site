import React from 'react';

import Layout from 'components/Layout';

import Chat from './Chat';

async function action(context) {
  return {
    title: 'chat',
    chunks: ['chat'],
    component: (
      <Layout>
        <Chat context={context} />
      </Layout>
    ),
  };
}

export default action;
