import React from 'react';
import Header from 'components/Header';
import Welcome from 'components/Welcome';

class Help extends React.Component {
  render() {
    return (
      <div
        style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}
      >
        <Header>Help</Header>
        <Welcome />
      </div>
    );
  }
}

export default Help;
