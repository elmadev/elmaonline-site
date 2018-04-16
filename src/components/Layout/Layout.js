/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import TopBar from '../TopBar';
import SideBar from '../SideBar';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      sideBarExpanded: true,
    };
  }
  toggleSideBar() {
    this.setState(prevState => ({
      sideBarExpanded: !prevState.sideBarExpanded,
    }));
  }
  render() {
    const className = this.state.sideBarExpanded ? `${s.sideBarExpanded}` : '';
    return (
      <div className={className}>
        <TopBar />
        <SideBar
          expanded={this.state.sideBarExpanded}
          onToggle={() => this.toggleSideBar()}
        />
        {this.props.children}
      </div>
    );
  }
}

export default withStyles(normalizeCss, s)(Layout);
