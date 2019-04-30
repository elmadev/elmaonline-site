import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleSidebar } from 'actions/ui';

import Link from 'components/Link';

import s from './SideBar.css';

class SideBar extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
  };

  onNavigation = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1000) {
      this.props.toggleSidebar();
    }
  };

  render() {
    const className = this.props.expanded ? ` ${s.expanded}` : '';
    return (
      <div className={s.root + className}>
        <div className={s.container}>
          <div
            role="button"
            tabIndex="0"
            className={s.title}
            onKeyUp={() => this.props.onToggle()}
            onClick={() => this.props.onToggle()}
          >
            &#9776; <span className={s.text}>Sidebar</span>
          </div>
          <div className={s.content}>
            <Link to="/" onClick={this.onNavigation}>
              Home
            </Link>
            <Link to="/battles" onClick={this.onNavigation}>
              Battles
            </Link>
            <Link to="/levels" onClick={this.onNavigation}>
              Levels
            </Link>
            <Link to="/kuskis" onClick={this.onNavigation}>
              Kuskis
            </Link>
            <Link to="/editor" onClick={this.onNavigation}>
              Editor
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { sidebarVisible } = state.ui;
  return { sidebarVisible };
};

export default withStyles(s)(
  connect(
    mapStateToProps,
    { toggleSidebar },
  )(SideBar),
);
