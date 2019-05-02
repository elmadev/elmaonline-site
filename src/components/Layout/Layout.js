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
import normalizeCss from 'normalize.css';

import TopBar from 'components/TopBar';
import SideBar from 'components/SideBar';

import s from './Layout.css';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    sidebarVisible: PropTypes.bool.isRequired,
  };

  render() {
    const className = this.props.sidebarVisible
      ? `${s.sideBarExpanded}`
      : `${s.layout}`;
    return (
      <div className={className}>
        <TopBar />
        <SideBar />
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

export default withStyles(normalizeCss, s)(connect(mapStateToProps)(Layout));
