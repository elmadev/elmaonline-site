import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Comments from 'components/Comments';

const LGRComments = ({ LGRIndex }) => {
  const { comments, lgrIndex } = useStoreState(state => state.LGRComments);
  const { getComments } = useStoreActions(actions => actions.LGRComments);

  useEffect(() => {
    getComments(LGRIndex);
  }, []);

  return <Comments comments={comments} loading={LGRIndex !== lgrIndex} />;
};

export default LGRComments;
