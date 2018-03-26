import React from 'react';
import Battle from './Battle';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: 'Elma Online',
    component: (
      <Layout>
        <Battle />
      </Layout>
    ),
  };
}

export default action;
