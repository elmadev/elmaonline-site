import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Link from '../Link';
import s from './SideBar.css';

class SideBar extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
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
            <Link to="/">Home</Link>
            <Link to="/battles">Battles</Link>
            <Link to="/levels">Levels</Link>
            <Link to="/kuskis">Kuskis</Link>
            <Link to="/editor">Editor</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(SideBar);
