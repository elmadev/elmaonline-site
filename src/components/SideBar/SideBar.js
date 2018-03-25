import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './SideBar.css';

class SideBar extends React.Component {
  static propTypes = {
    expanded: PropTypes.isRequired,
    onToggle: PropTypes.isRequired,
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
            Toggle
          </div>
          <div className={s.content}>
            SideBar<br />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(SideBar);
