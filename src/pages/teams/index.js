import React from 'react';

import Layout from 'components/Layout';

import Teams from './Teams';

async function action(context) {
  return {
    title: 'teams',
    chunks: ['teams'],
    component: (
      <Layout>
        <Teams context={context} />
      </Layout>
    ),
  };
}

export default action;
