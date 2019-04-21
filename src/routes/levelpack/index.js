import React from 'react';
import LevelPack from './LevelPack';
import Layout from '../../components/Layout';

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
