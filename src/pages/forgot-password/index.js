import React from 'react';

import Layout from 'components/Layout';

import ForgotPassword from './ForgotPassword';

async function action(context) {
  return {
    title: 'forgot-password',
    chunks: ['forgot-password'],
    component: (
      <Layout>
        <ForgotPassword context={context} />
      </Layout>
    ),
  };
}

export default action;
