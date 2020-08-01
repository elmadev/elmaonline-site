import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import PaginationActions from 'components/Table/PaginationActions';

class DerpTable extends React.Component {
  static propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    loading: PropTypes.bool,
    children: PropTypes.node.isRequired,
    length: PropTypes.number,
    pagination: PropTypes.bool,
    onChangePage: PropTypes.func,
    onChangeRowsPerPage: PropTypes.func,
    width: PropTypes.string,
  };

  static defaultProps = {
    loading: false,
    length: 0,
    pagination: false,
    onChangePage: null,
    onChangeRowsPerPage: null,
    width: 'auto',
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
    };
  }

  render() {
    const {
      headers,
      loading,
      children,
      length,
      pagination,
      onChangePage,
      onChangeRowsPerPage,
      width,
    } = this.props;
    const { page, rowsPerPage } = this.state;
    return (
      <Paper style={{ width }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map(h => (
                <TableCell key={h}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <CircularProgress />}
            {!loading && children}
          </TableBody>
          <TableFooter>
            <TableRow>
              {pagination && (
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  colSpan={headers.length}
                  count={pagination ? length : 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={(e, nextPage) => {
                    this.setState({ page: nextPage });
                    onChangePage(nextPage);
                  }}
                  onChangeRowsPerPage={e => {
                    this.setState({
                      page: 0,
                      rowsPerPage: e.target.value,
                    });
                    onChangeRowsPerPage(e.target.value);
                  }}
                  ActionsComponent={PaginationActions}
                />
              )}
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    );
  }
}

export default DerpTable;
