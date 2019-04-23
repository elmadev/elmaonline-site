/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import TopBar from '../TopBar';
import SideBar from '../SideBar';
import { toggleSidebar } from '../../actions/ui';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    sidebarVisible: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
  };

  toggleSideBar() {
    this.props.toggleSidebar();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  }

  render() {
    const className = this.props.sidebarVisible
      ? `${s.sideBarExpanded}`
      : `${s.layout}`;
    return (
      <div className={className}>
        <TopBar />
        <SideBar
          expanded={this.props.sidebarVisible}
          onToggle={() => this.toggleSideBar()}
        />
        <div
          style={{
            height: '100%',
            marginTop: -50,
            paddingTop: 50,
            boxSizing: 'border-box',
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { sidebarVisible } = state.ui;
  return { sidebarVisible };
};

export default withStyles(normalizeCss, s)(
  connect(
    mapStateToProps,
    { toggleSidebar },
  )(Layout),
);
