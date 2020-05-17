import React from 'react';

import Layout from 'components/Layout';

import Help from './Help';

async function action(context) {
  return {
    title: 'help',
    chunks: ['help'],
    component: (
      <Layout>
        <Help context={context} />
      </Layout>
    ),
  };
}

export default action;
