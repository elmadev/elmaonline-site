import React from 'react';

import Layout from 'components/Layout';

import Login from './Login';

async function action(context) {
  return {
    title: 'login',
    chunks: ['login'],
    component: (
      <Layout>
        <Login context={context} />
      </Layout>
    ),
  };
}

export default action;
