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
import querystring from 'querystring';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import RecListItem from 'components/RecListItem';
import history from 'utils/history';
import historyRefresh from 'utils/historyRefresh';

import recListQuery from './recList.graphql';

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
    currentUUID: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.string),
    horizontalMargin: PropTypes.number,
  };

  static defaultProps = {
    currentUUID: null,
    columns: ['Replay', 'Level', 'Time', 'By'],
    horizontalMargin: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      showTAS: false,
      showDNF: false,
      showBug: false,
      showNitro: false,
    };
  }

  componentDidMount() {
    const queryParams = querystring.parse(window.location.search.substring(1));
    this.setState({
      showTAS: queryParams.showTAS === 'true',
      showDNF: queryParams.showDNF === 'true',
      showBug: queryParams.showBug === 'true',
      showNitro: queryParams.showNitro === 'true',
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  onFilterChange(id) {
    const newState = { ...this.state };
    newState[id] = !newState[id];
    this.setState(() => newState);
    history.replace({
      search: `?${querystring.stringify(newState)}`,
    });
  }

  isSelected = uuid => {
    const { currentUUID } = this.props;
    return currentUUID === uuid;
  };

  handleOpenReplay(uuid) {
    historyRefresh.push({
      pathname: `/r/${uuid}`,
      search: `?${querystring.stringify(this.state)}`,
    });
  }

  render() {
    const {
      data: { loading, getReplaysByLevelIndex },
      columns,
      horizontalMargin,
    } = this.props;
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
      <>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={showTAS}
                onChange={() => this.onFilterChange('showTAS')}
                value="ShowTAS"
                color="primary"
              />
            }
            label="Show TAS"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showDNF}
                onChange={() => this.onFilterChange('showDNF')}
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
                checked={showBug}
                onChange={() => this.onFilterChange('showBug')}
                value="showBug"
                color="primary"
              />
            }
            label="Show Bugged"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showNitro}
                onChange={() => this.onFilterChange('showNitro')}
                value="showNitro"
                color="primary"
              />
            }
            label="Show Modded"
          />
        </div>
        <Table
          style={{
            marginLeft: `${horizontalMargin}px`,
            marginRight: `${horizontalMargin}px`,
            width: `calc(100% - ${horizontalMargin * 2}px)`,
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map(c => (
                <TableCell key={c}>{c}</TableCell>
              ))}
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
                  columns={columns}
                />
              ))
            )}
          </TableBody>
        </Table>
      </>
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
