import React from 'react';

import Layout from 'components/Layout';

import LevelPack from './LevelPack';

async function action(context) {
  return {
    title: `levels/packs/${context.params.name}`,
    chunks: ['levelpack'],
    component: (
      <Layout>
        <LevelPack name={context.params.name} />
      </Layout>
    ),
  };
}

export default action;
