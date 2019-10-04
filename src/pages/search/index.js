import React from 'react';
import Layout from 'components/Layout';
import Search from './Search';

async function action(context) {
  return {
    title: 'search',
    chunks: ['search'],
    component: (
      <Layout>
        <Search context={context} />
      </Layout>
    ),
  };
}

export default action;
