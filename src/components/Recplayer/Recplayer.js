import React from 'react';
import PropTypes from 'prop-types';

const RecPlayer =
  typeof document !== 'undefined' && require('recplayer-react').default; // eslint-disable-line global-require

const Recplayer = props => {
  const { rec, lev, width, height, zoom, controls, imageUrl, autoPlay } = props;

  let shouldAutoPlay = false;

  if (autoPlay === 'if-visible') {
    const { visibilityState } = document;

    if (visibilityState === 'visible') {
      shouldAutoPlay = true;
    }
  } else if (autoPlay === 'no') {
    shouldAutoPlay = false;
  } else if (autoPlay === 'yes') {
    shouldAutoPlay = true;
  }

  return (
    <>
      {RecPlayer && lev ? (
        <RecPlayer
          recUrl={rec}
          levUrl={lev}
          width={width}
          height={height}
          zoom={zoom}
          controls={controls}
          imageUrl={imageUrl}
          autoPlay={shouldAutoPlay}
        />
      ) : (
        <span>Loading..</span>
      )}
    </>
  );
};

Recplayer.propTypes = {
  rec: PropTypes.string,
  lev: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  zoom: PropTypes.number,
  controls: PropTypes.bool,
  imageUrl: PropTypes.string,
  autoPlay: PropTypes.oneOf(['if-visible', 'yes', 'no']),
};

Recplayer.defaultProps = {
  rec: null,
  width: 'auto',
  height: 'auto',
  zoom: 1,
  controls: true,
  imageUrl: 'https://elma.online/recplayer',
  autoPlay: 'if-visible',
};

export default Recplayer;
