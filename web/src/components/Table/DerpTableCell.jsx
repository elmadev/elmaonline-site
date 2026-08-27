import React from 'react';
import PropTypes from 'prop-types';
import { theme } from 'theme';
import { TableCell } from '@material-ui/core';

class DerpTableCell extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    right: PropTypes.bool,
    width: PropTypes.string,
    highlight: PropTypes.bool,
  };

  render() {
    const {
      children = null,
      right = false,
      width = 'auto',
      highlight = false,
    } = this.props;
    return (
      <TableCell
        style={{
          padding: '4px 10px 4px 10px',
          textAlign: right ? 'right' : 'left',
          width,
          background: highlight ? theme.highlightColor : 'transparent',
        }}
      >
        {children}
      </TableCell>
    );
  }
}

export default DerpTableCell;
