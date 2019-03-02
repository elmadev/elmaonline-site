import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { sortBy, filter } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
          TAS: PropTypes.number.isRequired,
          Finished: PropTypes.number.isRequired,
        }),
      ),
    }).isRequired,
    openReplay: PropTypes.func,
  };

  static defaultProps = {
    openReplay: null,
  };

  state = {
    showTAS: false,
    showDNF: false,
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
    const { showTAS, showDNF } = this.state;
    const filterFunction = o => {
      let show = true;
      if (!showTAS && o.TAS) {
        show = false;
      }
      if (!showDNF && !o.Finished) {
        show = false;
      }
      return show;
    };
    return (
      <React.Fragment>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.showTAS}
                onChange={() => this.setState({ showTAS: !showTAS })}
                value="ShowTAS"
                color="primary"
              />
            }
            label="Show TAS"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.showDNF}
                onChange={() => this.setState({ showDNF: !showDNF })}
                value="ShowDNF"
                color="primary"
              />
            }
            label="Show Unfinished"
          />
        </div>
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
            {loading ? (
              <TableRow>
                <TableCell>Loading...</TableCell>
              </TableRow>
            ) : (
              sortBy(filter(getReplaysByLevelIndex, filterFunction), [
                'ReplayTime',
              ]).map(i => (
                <RecListItem
                  key={i.ReplayIndex}
                  replay={i}
                  openReplay={uuid => this.handleOpenReplay(uuid)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </React.Fragment>
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
