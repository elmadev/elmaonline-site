import React from 'react';
import Home from './Home'; // import the secondary .js file here
import homeQuery from './home.graphql';
import Layout from '../../components/Layout';

async function action({ client }) {
  const data = await client.query({
    query: homeQuery,
  });
  return {
    title: 'Elma Online',
    component: (
      <Layout>
        <Home /> {/* place the secondary component here */}
      </Layout>
    ),
  };
}

export default action;
