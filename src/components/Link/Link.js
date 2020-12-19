/* eslint-disable */
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
import history from 'utils/history';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

const Link = ({ to, children, onClick, download, ...props }) => {
  const handleClick = event => {
    if (onClick) {
      onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    if (download) {
      event.stopPropagation();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    history.push(to);
  };

  return (
    <a href={to} download={download} {...props} onClick={handleClick}>
      {children}
    </a>
  );
};

Link.defaultProps = {
  onClick: null,
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default Link;
