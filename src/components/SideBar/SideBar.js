import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Link from 'components/Link';

import s from './SideBar.css';

const SideBar = () => {
  const { sideBarVisible } = useStoreState(state => state.Page);
  const { hideSideBar, toggleSideBar } = useStoreActions(
    actions => actions.Page,
  );
  const onNavigation = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1000) {
      hideSideBar(); // eslint-disable-line
    }
  };

  const onToggle = () => {
    toggleSideBar(); // eslint-disable-line
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  };
  const className = sideBarVisible ? ` ${s.expanded}` : '';
  return (
    <div className={s.root + className}>
      <div className={s.container}>
        <div
          role="button"
          tabIndex="0"
          className={s.title}
          onKeyUp={e => {
            if (e.keyCode === 13) onToggle();
          }}
          onClick={onToggle}
        >
          &#9776; <span className={s.text}>Sidebar</span>
        </div>
        <div className={s.content}>
          <Link to="/" onClick={onNavigation}>
            Home
          </Link>
          <Link to="/battles" onClick={onNavigation}>
            Battles
          </Link>
          <Link to="/battles/ranking" onClick={onNavigation}>
            Ranking
          </Link>
          <Link to="/levels" onClick={onNavigation}>
            Levels
          </Link>
          <Link to="/kuskis" onClick={onNavigation}>
            Kuskis
          </Link>
          <Link to="/cups" onClick={onNavigation}>
            Cups
          </Link>
          <Link to="/editor" onClick={onNavigation}>
            Editor
          </Link>
          <Link to="/map" onClick={onNavigation}>
            Map
          </Link>
          <Link to="/settings" onClick={onNavigation}>
            Settings
          </Link>
          <Link to="/help" onClick={onNavigation}>
            Help
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withStyles(s)(SideBar);
