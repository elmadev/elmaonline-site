import React from 'react';

import Layout from 'components/Layout';

import Kuski from './Kuski';

async function action(context) {
  return {
    title: `kuskis/${context.params.name}`,
    chunks: ['kuski'],
    component: (
      <Layout>
        <Kuski name={context.params.name} />
      </Layout>
    ),
  };
}

export default action;
