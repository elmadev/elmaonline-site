import React from 'react';
import Battles from './Battles';
import Layout from '../../components/Layout';

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
