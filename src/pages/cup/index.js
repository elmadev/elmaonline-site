import React from 'react';

import Layout from 'components/Layout';

import Cup from './Cup';

async function action(context) {
  return {
    title: 'cups',
    chunks: ['cups'],
    component: (
      <Layout>
        <Cup ShortName={context.params.id} context={context} />
      </Layout>
    ),
  };
}

export default action;
