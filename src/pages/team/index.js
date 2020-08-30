import React from 'react';

import Layout from 'components/Layout';

import Team from './Team';

async function action(context) {
  return {
    title: 'team',
    chunks: ['team'],
    component: (
      <Layout>
        <Team context={context} TeamName={context.params.name} />
      </Layout>
    ),
  };
}

export default action;
