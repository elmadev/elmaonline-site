import React from 'react';
import Layout from 'components/Layout';

class ErrorPage extends React.Component {
  render() {
    const { error = null } = this.props;
    if (error) {
      return (
        <div>
          <h1>{error.name}</h1>
          <pre>{error.stack}</pre>
        </div>
      );
    }

    return (
      <Layout t="Error">
        <h1>Error</h1>
        <p>Sorry, a critical error occurred on this page.</p>
      </Layout>
    );
  }
}

export { ErrorPage as ErrorPageWithoutStyle };
export default ErrorPage;
