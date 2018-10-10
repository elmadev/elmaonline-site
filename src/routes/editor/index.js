import React from 'react';
import Editor from './Editor';
import Layout from '../../components/Layout';

function action() {
  return {
    title: 'Elma Online',
    component: (
      <Layout>
        <Editor />
      </Layout>
    ),
  };
}

export default action;
