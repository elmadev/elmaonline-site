import React from 'react';
import PropTypes from 'prop-types';
import { ListCell, ListRow } from 'styles/List';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Link from 'components/Link';
import history from 'utils/history';

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
      DrivenByText: PropTypes.string,
    }).isRequired,
    openReplay: PropTypes.func,
    selected: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    openReplay: null,
    selected: false,
    columns: ['Replay', 'Level', 'Time', 'By'],
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
    const { replay, selected, columns } = this.props;
    return (
      <ListRow
        key={replay.ReplayIndex}
        onClick={() => this.handleOpenReplay(replay.UUID)}
        selected={selected}
      >
        {columns.indexOf('Replay') !== -1 && (
          <ListCell width={200}>
            <Link to={`/r/${replay.UUID}`}>{replay.RecFileName}</Link>
          </ListCell>
        )}
        {columns.indexOf('Level') !== -1 && (
          <ListCell width={100}>
            <Level LevelData={replay.LevelData} />
          </ListCell>
        )}
        {columns.indexOf('Time') !== -1 && (
          <ListCell right>
            {replay.TAS === 1 && <span style={{ color: 'red' }}>(TAS) </span>}
            {replay.Finished === 0 && (
              <span style={{ color: 'gray' }}>(DNF) </span>
            )}
            {replay.Bug === 1 && <span style={{ color: 'brown' }}>(Bug) </span>}
            {replay.Nitro === 1 && (
              <span style={{ color: 'blue' }}>(Mod) </span>
            )}
            <Time thousands time={replay.ReplayTime} />
          </ListCell>
        )}
        {columns.indexOf('By') !== -1 && (
          <ListCell>
            {replay.DrivenByData ? (
              <Kuski kuskiData={replay.DrivenByData} />
            ) : (
              <div>{replay.DrivenByText}</div>
            )}
          </ListCell>
        )}
      </ListRow>
    );
  }
}

export default RecListItem;
