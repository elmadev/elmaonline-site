import React from 'react';

import Layout from 'components/Layout';

import Editor from './Editor';

async function action(context) {
  return {
    title: 'editor',
    chunks: ['editor'],
    component: (
      <Layout>
        <Editor context={context} />
      </Layout>
    ),
  };
}

export default action;
