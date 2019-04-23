import React from 'react';

import Layout from 'components/Layout';

import Kuskis from './Kuskis';

async function action(context) {
  return {
    title: 'kuskis',
    chunks: ['kuskis'],
    component: (
      <Layout>
        <Kuskis context={context} />
      </Layout>
    ),
  };
}

export default action;
