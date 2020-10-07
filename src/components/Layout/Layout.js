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
import withStyles from 'isomorphic-style-loader/withStyles';
import normalizeCss from 'normalize.css';
import { useStoreState } from 'easy-peasy';

import TopBar from 'components/TopBar';
import SideBar from 'components/SideBar';

import s from './Layout.css';

const Layout = ({ children }) => {
  const { sideBarVisible } = useStoreState(state => state.Page);
  const className = sideBarVisible ? `${s.sideBarExpanded}` : `${s.layout}`;
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
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withStyles(normalizeCss, s)(Layout);
