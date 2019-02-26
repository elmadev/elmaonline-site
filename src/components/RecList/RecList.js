import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { sortBy } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import recListQuery from './recList.graphql';
import RecListItem from '../RecListItem';
import history from '../../history';

class RecList extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      getReplaysByLevelIndex: PropTypes.arrayOf(
        PropTypes.shape({
          ReplayIndex: PropTypes.number.isRequired,
          RecFileName: PropTypes.string.isRequired,
          LevelIndex: PropTypes.number.isRequired,
          ReplayTime: PropTypes.number.isRequired,
          DrivenBy: PropTypes.number.isRequired,
          UUID: PropTypes.string.isRequired,
        }),
      ),
    }).isRequired,
    openReplay: PropTypes.func,
  };

  static defaultProps = {
    openReplay: null,
  };

  handleOpenReplay(uuid) {
    const { openReplay } = this.props;
    if (openReplay) {
      openReplay(uuid);
    } else {
      history.push(`/r/${uuid}`);
    }
  }

  render() {
    const { data: { loading, getReplaysByLevelIndex } } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Replay</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? 'Loading...'
            : sortBy(getReplaysByLevelIndex, ['ReplayTime']).map(i => (
                <RecListItem
                  key={i.ReplayIndex}
                  replay={i}
                  openReplay={uuid => this.handleOpenReplay(uuid)}
                />
              ))}
        </TableBody>
      </Table>
    );
  }
}

export default compose(
  graphql(recListQuery, {
    options: ownProps => ({
      variables: {
        LevelIndex: ownProps.LevelIndex,
      },
    }),
  }),
)(RecList);
