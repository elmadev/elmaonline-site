import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ttbattleQuery from './TTBattleResults.graphql';

class TTBattleResults extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getBestTimesIn: PropTypes.arrayOf(
        PropTypes.shape({
          TimeIndex: PropTypes.number.isRequired,
          KuskiIndex: PropTypes.number.isRequired,
          Time: PropTypes.number.isRequired,
        }),
      ),
    }).isRequired,
  };

  render() {
    return (
      <React.Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Replay</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>By</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(ttbattleQuery, {
    options: ownProps => ({
      variables: {
        LevelIndices: ownProps.levels,
      },
    }),
  }),
)(TTBattleResults);
