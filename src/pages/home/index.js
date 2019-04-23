import React from 'react';

import Layout from 'components/Layout';

import Home from './Home';

async function action(context) {
  return {
    title: 'home',
    chunks: ['home'],
    component: (
      <Layout>
        <Home context={context} />
      </Layout>
    ),
  };
}

export default action;
