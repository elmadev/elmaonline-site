import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Kuski, Level, ReplayTime } from '../Names';
import history from '../../history';

class RecListItem extends React.Component {
  static propTypes = {
    replay: PropTypes.shape({
      ReplayIndex: PropTypes.number.isRequired,
      LevelIndex: PropTypes.number.isRequired,
      UploadedBy: PropTypes.number.isRequired,
      ReplayTime: PropTypes.number,
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
    const { replay } = this.props;
    return (
      <TableRow
        hover
        style={{ cursor: 'pointer' }}
        key={replay.ReplayIndex}
        onClick={() => this.handleOpenReplay(replay.UUID)}
      >
        <TableCell style={{ padding: '4px 10px 4px 10px' }}>
          {replay.RecFileName}
        </TableCell>
        <TableCell style={{ padding: '4px 10px 4px 10px' }}>
          <Level index={replay.LevelIndex} />
        </TableCell>
        <TableCell style={{ padding: '4px 10px 4px 10px' }}>
          <ReplayTime time={replay.ReplayTime} />
        </TableCell>
        <TableCell style={{ padding: '4px 10px 4px 10px' }}>
          <Kuski index={replay.DrivenBy} />
        </TableCell>
      </TableRow>
    );
  }
}

export default RecListItem;
