import React from 'react';

import Layout from 'components/Layout';

import CupReplay from './CupReplay';

async function action(context) {
  return {
    title: `r/cup/${context.params.filename}`,
    chunks: ['cupreplay'],
    component: (
      <Layout>
        <CupReplay
          ReplayType="cup"
          ReplayIndex={context.params.index}
          Filename={context.params.filename}
          context={context}
        />
      </Layout>
    ),
  };
}

export default action;
