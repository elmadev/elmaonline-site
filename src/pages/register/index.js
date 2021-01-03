import React from 'react';

import Layout from 'components/Layout';

import Register from './Register';

async function action(context) {
  return {
    title: 'register',
    chunks: ['register'],
    component: (
      <Layout>
        <Register context={context} />
      </Layout>
    ),
  };
}

export default action;
