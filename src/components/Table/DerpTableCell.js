import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';

class DerpTableCell extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  render() {
    const { children } = this.props;
    return (
      <TableCell style={{ padding: '4px 10px 4px 10px' }}>{children}</TableCell>
    );
  }
}

export default DerpTableCell;
