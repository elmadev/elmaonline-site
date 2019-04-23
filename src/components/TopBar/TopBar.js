import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './TopBar.css';

class TopBar extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>Elma Online</div>
      </div>
    );
  }
}

export default withStyles(s)(TopBar);
