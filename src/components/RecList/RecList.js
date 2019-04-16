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
          Bug: PropTypes.number.isRequired,
          Nitro: PropTypes.number.isRequired,
          Finished: PropTypes.number.isRequired,
        }),
      ),
    }).isRequired,
    openReplay: PropTypes.func,
    currentUUID: PropTypes.string,
  };

  static defaultProps = {
    openReplay: null,
    currentUUID: null,
  };

  state = {
    showTAS: false,
    showDNF: false,
    showBug: false,
    showNitro: false,
  };

  handleOpenReplay(uuid) {
    const { openReplay } = this.props;
    if (openReplay) {
      openReplay(uuid);
    } else {
      history.push(`/r/${uuid}`);
    }
  }

  isSelected = uuid => this.props.currentUUID === uuid;

  render() {
    const { data: { loading, getReplaysByLevelIndex } } = this.props;
    const { showTAS, showDNF, showBug, showNitro } = this.state;
    const filterFunction = o => {
      let show = true;
      if (!showTAS && o.TAS) {
        show = false;
      }
      if (!showDNF && !o.Finished) {
        show = false;
      }
      if (!showBug && o.Bug) {
        show = false;
      }
      if (!showNitro && o.Nitro) {
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
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.showBug}
                onChange={() => this.setState({ showBug: !showBug })}
                value="showBug"
                color="primary"
              />
            }
            label="Show Bugged"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.showNitro}
                onChange={() => this.setState({ showNitro: !showNitro })}
                value="showNitro"
                color="primary"
              />
            }
            label="Show Modded"
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
                  selected={this.isSelected(i.UUID)}
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
