import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';

import Comments from 'components/Comments';

const ReplayComments = props => {
  const { ReplayIndex } = props;
  const { commentlist, lastReplayIndex } = useStoreState(
    state => state.ReplayComments,
  );
  const getComments = useStoreActions(
    actions => actions.ReplayComments.getComments,
  );

  // note that replay/index.js sometimes passes us old replay ID,
  // which has to do with it accepting replayUUID in props (which is not the ID),
  // and then having to fetch the replay before knowing the ID.
  // therefore, the 2nd param below is necessary.
  useEffect(() => {
    if (lastReplayIndex !== ReplayIndex) {
      getComments(ReplayIndex);
    }
  }, [ReplayIndex, lastReplayIndex]);

  return <Comments comments={commentlist} loading={false} />;
};

ReplayComments.propTypes = {
  ReplayIndex: PropTypes.number.isRequired,
};

export default ReplayComments;
