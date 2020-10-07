import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';
import { ListContainer, ListHeader, ListCell, ListRow } from 'styles/List';
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
    <ListContainer>
      <ListHeader>
        <ListCell>Replay</ListCell>
        <ListCell>Level</ListCell>
        <ListCell right>Time</ListCell>
        <ListCell>By</ListCell>
      </ListHeader>
      {!replays ? (
        <ListRow>
          <ListCell />
        </ListRow>
      ) : (
        replays.map(i => <RecListItem key={i.ReplayIndex} replay={i} />)
      )}
    </ListContainer>
  );
};

ReplaysBy.propTypes = {
  KuskiIndex: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

export default ReplaysBy;
