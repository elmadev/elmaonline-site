import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';

import Comments from 'styles/Comments';

const ReplayComments = props => {
  const { ReplayIndex } = props;
  const { commentlist, lastReplayIndex } = useStoreState(
    state => state.ReplayComments,
  );
  const getComments = useStoreActions(
    actions => actions.ReplayComments.getComments,
  );
  useEffect(() => {
    if (lastReplayIndex !== ReplayIndex) {
      getComments(ReplayIndex);
    }
  }, []);

  return <Comments comments={commentlist} loading={false} />;
};

ReplayComments.propTypes = {
  ReplayIndex: PropTypes.number.isRequired,
};

export default ReplayComments;
