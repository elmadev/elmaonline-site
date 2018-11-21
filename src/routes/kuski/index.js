import React from 'react';
import Kuski from './Kuski';
import Layout from '../../components/Layout';

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
