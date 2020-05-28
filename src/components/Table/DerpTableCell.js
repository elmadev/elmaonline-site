import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';

class DerpTableCell extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    right: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    right: false,
  };

  render() {
    const { children, right } = this.props;
    return (
      <TableCell
        style={{
          padding: '4px 10px 4px 10px',
          textAlign: right ? 'right' : 'left',
        }}
      >
        {children}
      </TableCell>
    );
  }
}

export default DerpTableCell;
