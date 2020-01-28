import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';
import { nick, nickId } from 'utils/nick';

import Stars from 'styles/Stars';

const ReplayRating = props => {
  const { ReplayIndex } = props;
  const { ratings, lastReplayIndex } = useStoreState(
    state => state.ReplayRating,
  );
  const { getRatings, addRating } = useStoreActions(
    actions => actions.ReplayRating,
  );
  useEffect(() => {
    if (lastReplayIndex !== ReplayIndex) {
      getRatings(ReplayIndex);
    }
  }, []);

  const rate = rating => {
    if (nick()) {
      addRating({
        ReplayIndex,
        Vote: rating,
      });
    }
  };

  let avg = 0;
  let userRating = 0;
  if (ratings.length > 0) {
    avg =
      ratings.reduce((total, next) => total + next.Vote, 0) / ratings.length;
    const findUserRating = ratings.filter(r => r.KuskiIndex === nickId());
    if (findUserRating.length > 0) {
      userRating = findUserRating[0].Vote;
    }
  }

  return (
    <Stars
      clickable={nickId() > 0}
      voted={userRating}
      average={avg}
      vote={rating => rate(rating)}
    />
  );
};

ReplayRating.propTypes = {
  ReplayIndex: PropTypes.number.isRequired,
};

export default ReplayRating;
