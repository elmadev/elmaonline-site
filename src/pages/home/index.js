import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

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
