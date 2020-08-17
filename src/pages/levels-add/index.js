import React from 'react';

import Layout from 'components/Layout';

import LevelsAdd from './LevelsAdd';

async function action(context) {
  return {
    title: 'levels add',
    chunks: ['levels-add'],
    component: (
      <Layout>
        <LevelsAdd context={context} />
      </Layout>
    ),
  };
}

export default action;
