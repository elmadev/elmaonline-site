import React from 'react';

import Layout from 'components/Layout';

import Mod from './Mod';

async function action(context) {
  return {
    title: `mod`,
    chunks: ['mod'],
    component: (
      <Layout>
        <Mod context={context} />
      </Layout>
    ),
  };
}

export default action;
