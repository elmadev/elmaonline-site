import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './TopBar.css';
import SearchBar from '../SearchBar';

class TopBar extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <SearchBar />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(TopBar);
