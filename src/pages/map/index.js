import React from 'react';

import Layout from 'components/Layout';

import Map from './Map';

async function action(context) {
  return {
    title: 'map',
    chunks: ['map'],
    component: (
      <Layout>
        <Map context={context} />
      </Layout>
    ),
  };
}

export default action;
