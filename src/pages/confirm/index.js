import React from 'react';

import Layout from 'components/Layout';

import Confirm from './Confirm';

async function action(context) {
  return {
    title: `confirm/${context.params.confirmCode}`,
    chunks: ['confirm'],
    component: (
      <Layout>
        <Confirm confirmCode={context.params.confirmCode} />
      </Layout>
    ),
  };
}

export default action;
