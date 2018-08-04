import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Kuski, Level, ReplayTime } from '../Names';
import Recplayer from '../Recplayer';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class RecList extends React.Component {
  static propTypes = {
    replay: PropTypes.shape({
      ReplayIndex: PropTypes.number.isRequired,
      LevelIndex: PropTypes.number.isRequired,
      UploadedBy: PropTypes.number.isRequired,
      ReplayTime: PropTypes.number,
    }).isRequired,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleClickOpen = () => {
    if (!this.state.open) {
      this.setState({ open: true });
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { replay } = this.props;
    return (
      <TableRow
        hover
        style={{ cursor: 'pointer' }}
        key={replay.ReplayIndex}
        onClick={this.handleClickOpen}
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
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          {this.state.open && (
            <Recplayer
              rec={`/replays/${replay.UUID}/${replay.RecFileName}`}
              lev={`/dl/level/${replay.LevelIndex}`}
              controls
              autoPlay
            />
          )}
        </Dialog>
      </TableRow>
    );
  }
}

export default RecList;
