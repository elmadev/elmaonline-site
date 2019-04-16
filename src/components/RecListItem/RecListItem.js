import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Kuski, Level } from '../Names';
import Time from '../Time';
import Link from '../Link';
import history from '../../history';

class RecListItem extends React.Component {
  static propTypes = {
    replay: PropTypes.shape({
      ReplayIndex: PropTypes.number.isRequired,
      LevelIndex: PropTypes.number.isRequired,
      UploadedBy: PropTypes.number.isRequired,
      ReplayTime: PropTypes.number,
      TAS: PropTypes.number,
      Bug: PropTypes.number,
      Nitro: PropTypes.number,
      Finished: PropTypes.number,
    }).isRequired,
    openReplay: PropTypes.func,
    selected: PropTypes.bool,
  };

  static defaultProps = {
    openReplay: null,
    selected: false,
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
    const { replay, selected } = this.props;
    return (
      <TableRow
        hover
        style={{ cursor: 'pointer' }}
        key={replay.ReplayIndex}
        onClick={() => this.handleOpenReplay(replay.UUID)}
        selected={selected}
      >
        <TableCell style={{ padding: '4px 10px 4px 10px' }}>
          <Link to={`/r/${replay.UUID}`}>{replay.RecFileName}</Link>
        </TableCell>
        <TableCell style={{ padding: '4px 10px 4px 10px' }}>
          <Level index={replay.LevelIndex} />
        </TableCell>
        <TableCell style={{ padding: '4px 10px 4px 10px', textAlign: 'right' }}>
          {replay.TAS === 1 && <span style={{ color: 'red' }}>(TAS) </span>}
          {replay.Finished === 0 && (
            <span style={{ color: 'gray' }}>(DNF) </span>
          )}
          {replay.Bug === 1 && <span style={{ color: 'brown' }}>(Bug) </span>}
          {replay.Nitro === 1 && <span style={{ color: 'blue' }}>(Mod) </span>}
          <Time thousands time={replay.ReplayTime} />
        </TableCell>
        <TableCell style={{ padding: '4px 10px 4px 10px' }}>
          <Kuski index={replay.DrivenBy} />
        </TableCell>
      </TableRow>
    );
  }
}

export default RecListItem;
