import React from 'react';
import PropTypes from 'prop-types';
import { useStoreState } from 'easy-peasy';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import RecPlayerReact from 'recplayer-react';
import config from 'config';

const Recplayer = props => {
  const {
    rec = null,
    lev,
    shirt,
    width = 'auto',
    height = 'auto',
    controls = true,
    autoPlay = 'if-visible',
    merge = false,
    forceRefresh = false,
    lgr,
    onEnd,
  } = props;
  const {
    settings: {
      grass,
      pictures,
      customSkyGround,
      zoomScale,
      arrows,
      autoPlay: autoPlaySetting,
      lgrOverride,
      lgrUrl: lgrOverrideUrl,
    },
  } = useStoreState(state => state.ReplaySettings);

  let defaultZoom = 1;

  if (useMediaQuery('(max-width: 900px)')) {
    defaultZoom = 0.9;
  }

  if (useMediaQuery('(max-width: 640px)')) {
    defaultZoom = 0.75;
  }

  if (useMediaQuery('(max-width: 500px)')) {
    defaultZoom = 0.58;
  }

  if (zoomScale && zoomScale > 0) {
    defaultZoom = defaultZoom * (zoomScale / 100);
  }

  const zoom = props.zoom || defaultZoom;

  let shouldAutoPlay = false;

  if (autoPlay === 'if-visible') {
    const { visibilityState } = document;

    if (visibilityState === 'visible' && autoPlaySetting) {
      shouldAutoPlay = true;
    }
  } else if (autoPlay === 'no') {
    shouldAutoPlay = false;
  } else if (autoPlay === 'yes') {
    shouldAutoPlay = true;
  }

  // If neither the page nor the settings specify an lgr, get the lgr from the level file
  let lgrUrl = `${config.url}api/lgr/get/`;
  let lgrFrom = 'level';
  // If the page specifically requests an lgr, load that lgr
  if (lgr) {
    lgrFrom = 'file';
    lgrUrl = lgr;
    // If the settings specifies an lgr, load that lgr (legacy)
  } else if (lgrOverride === 'legacy') {
    lgrFrom = 'legacy';
    // If the settings specifies an lgr, load that lgr (other)
  } else if (lgrOverride !== '') {
    lgrFrom = 'file';
    lgrUrl = `${config.s3Url}lgr/${lgrOverrideUrl}`;
  }

  return (
    <>
      {RecPlayerReact && lev ? (
        <RecPlayerReact
          recUrl={rec}
          levUrl={lev}
          shirtUrl={shirt}
          width={width}
          height={height}
          zoom={zoom}
          controls={controls}
          autoPlay={shouldAutoPlay}
          merge={merge}
          levelOptions={{
            grass,
            pictures,
            customBackgroundSky: customSkyGround,
            arrows,
          }}
          showStartPos
          fitLev={!rec}
          showZoomBtns
          showPlaybackBtns={Boolean(rec)}
          key={forceRefresh ? rec + shirt : undefined}
          lgrUrl={lgrUrl}
          lgrFrom={lgrFrom}
          defaultLgrUrl={`https://space.elma.online/lgr/cr6m27a3t1/default.lgr`}
          legacyLgrUrl={`${config.url}recplayer`}
          onEnd={onEnd}
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
  merge: PropTypes.bool,
  forceRefresh: PropTypes.bool,
  onEnd: PropTypes.func,
};

export default Recplayer;
