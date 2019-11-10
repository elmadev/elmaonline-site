import React from 'react';
import history from 'utils/history';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './SearchBar.css';

const SearchBar = () => {
  return (
    <div className={s.container}>
      <input
        type="text"
        className={s.searchInput}
        placeholder="Search"
        onKeyUp={e => {
          if (e.keyCode === 13) history.push(`/search?q=${e.target.value}`);
        }}
      />
    </div>
  );
};

export default withStyles(s)(SearchBar);
