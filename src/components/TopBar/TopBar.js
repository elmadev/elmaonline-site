import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TopBar.css';

class TopBar extends React.Component {
  render() {
    return <div className={s.root}>TopBar</div>;
  }
}

export default withStyles(s)(TopBar);
