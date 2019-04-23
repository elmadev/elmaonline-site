import React from 'react';

import Layout from 'components/Layout';

import Battles from './Battles';

async function action(context) {
  return {
    title: 'battles',
    chunks: ['battles'],
    component: (
      <Layout>
        <Battles context={context} />
      </Layout>
    ),
  };
}

export default action;
