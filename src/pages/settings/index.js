import React from 'react';

import Layout from 'components/Layout';

import Settings from './Settings';

async function action(context) {
  return {
    title: `settings`,
    chunks: ['settings'],
    component: (
      <Layout>
        <Settings context={context} />
      </Layout>
    ),
  };
}

export default action;
