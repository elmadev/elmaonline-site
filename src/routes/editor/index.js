import React from 'react';
import Editor from './Editor';
import Layout from '../../components/Layout';

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
