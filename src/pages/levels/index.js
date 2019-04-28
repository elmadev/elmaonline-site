import React from 'react';

import Layout from 'components/Layout';

import Levels from './Levels';

async function action(context) {
  return {
    title: `levels`,
    chunks: ['levels'],
    component: (
      <Layout>
        <Levels context={context} />
      </Layout>
    ),
  };
}

export default action;
