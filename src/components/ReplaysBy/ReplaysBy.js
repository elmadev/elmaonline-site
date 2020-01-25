import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import RecListItem from 'components/RecListItem';

const ReplaysBy = props => {
  const { KuskiIndex, type } = props;
  const {
    replaysDrivenBy,
    replaysUploadedBy,
    lastDrivenByKuskiId,
    lastUploadedByKuskiId,
  } = useStoreState(state => state.ReplaysBy);
  const { getDrivenBy, getUploadedBy } = useStoreActions(
    actions => actions.ReplaysBy,
  );
  useEffect(() => {
    if (type === 'driven') {
      if (lastDrivenByKuskiId !== KuskiIndex) {
        getDrivenBy(KuskiIndex);
      }
    }
    if (type === 'uploaded') {
      if (lastUploadedByKuskiId !== KuskiIndex) {
        getUploadedBy(KuskiIndex);
      }
    }
  }, [type, KuskiIndex]);

  let replays = [];
  if (type === 'driven') {
    replays = replaysDrivenBy;
  }
  if (type === 'uploaded') {
    replays = replaysUploadedBy;
  }

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
        {!replays ? (
          <TableRow>
            <TableCell style={{ padding: '4px 10px 4px 10px' }} />
          </TableRow>
        ) : (
          replays.map(i => <RecListItem key={i.ReplayIndex} replay={i} />)
        )}
      </TableBody>
    </Table>
  );
};

ReplaysBy.propTypes = {
  KuskiIndex: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

export default ReplaysBy;
