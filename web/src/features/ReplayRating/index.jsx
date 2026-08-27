import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';
import { nick, nickId } from 'utils/nick';

import Stars from 'components/Stars';

const ReplayRating = ({ ReplayIndex }) => {
  const { ratings, lastReplayIndex } = useStoreState(
    state => state.ReplayRating,
  );
  const { getRatings, addRating } = useStoreActions(
    actions => actions.ReplayRating,
  );
  const isCurrentReplay = lastReplayIndex === ReplayIndex;

  useEffect(() => {
    if (!isCurrentReplay) {
      getRatings(ReplayIndex);
    }
  }, [ReplayIndex, isCurrentReplay]);

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
  const amount = ratings.length;
  if (ratings.length > 0) {
    avg =
      ratings.reduce((total, next) => total + next.Vote, 0) / ratings.length;
    const findUserRating = ratings.find(r => r.KuskiIndex === nickId());
    userRating = findUserRating?.Vote ?? 0;
  }

  return (
    <Stars
      clickable={nickId() > 0 && isCurrentReplay}
      voted={isCurrentReplay && userRating}
      average={isCurrentReplay && avg}
      vote={rating => rate(rating)}
      amount={amount}
    />
  );
};

ReplayRating.propTypes = {
  ReplayIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default ReplayRating;
