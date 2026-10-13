import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreActions } from 'easy-peasy';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { RecPlayer } from '@elmadev/react-rec-viewer';
import config from 'config';

const DEFAULT_LGR = 'https://space.elma.online/lgr/cr6m27a3t1/default.lgr';

const size = value =>
  value === 'auto' || value === undefined ? '100%' : Number(value) || value;

const Recplayer = props => {
  const {
    rec = null,
    lev,
    shirt,
    names,
    width = 'auto',
    height = 'auto',
    controls = true,
    autoPlay = 'if-visible',
    forceRefresh = false,
    lgr,
    onEnd,
    onError,
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
      centeredCamera = true,
      picturesInBackground = true,
      autoZoom = false,
      translucentGhosts = false,
      timer = true,
      minimap = false,
      animatedObjects = true,
      stillObjects = false,
      fancyboost = true,
    },
  } = useStoreState(state => state.ReplaySettings);
  const { setSetting, toggleSetting, setLgrOverride } = useStoreActions(
    actions => actions.ReplaySettings,
  );
  const { lgrs } = useStoreState(state => state.LGRList);
  const { getLGRs } = useStoreActions(actions => actions.LGRList);
  const lgrChoices = useMemo(
    () => lgrs.map(l => ({ value: l.LGRName, label: l.LGRName })),
    [lgrs],
  );

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

  let lgrFileUrl;
  if (lgr) {
    lgrFileUrl = lgr;
  } else if (lgrOverride && lgrOverride !== 'legacy' && lgrOverrideUrl) {
    lgrFileUrl = `${config.s3Url}lgr/${lgrOverrideUrl}`;
  }

  const recUrls = rec ? rec.split(';').filter(Boolean) : [];
  const shirtUrls = recUrls.map((_, i) => (shirt && shirt[i]) || null);
  const recNames = recUrls.map((_, i) => (names && names[i]) || null);

  if (!lev) return <span>Loading..</span>;

  return (
    <RecPlayer
      key={forceRefresh ? `${rec}${shirt}` : undefined}
      recUrls={recUrls}
      levUrl={lev}
      shirtUrls={shirtUrls}
      recNames={recNames}
      lgrUrl={name => `${config.url}api/lgr/get/${encodeURIComponent(name)}`}
      lgrFileUrl={lgrFileUrl}
      defaultLgrUrl={DEFAULT_LGR}
      acrossPackUrl={`${config.s3Url}across/across.res`}
      defaultZoom={zoom}
      defaultPlaying={shouldAutoPlay}
      controls={controls}
      loop={!onEnd}
      onEnd={onEnd}
      onError={onError}
      levelOptions={{
        grass,
        pictures,
        customSky: customSkyGround,
        arrows,
        animatedObjects,
        stillObjects,
        fancyboost,
      }}
      onLevelOptionsChange={options => {
        setSetting({ name: 'grass', value: options.grass });
        setSetting({ name: 'pictures', value: options.pictures });
        setSetting({ name: 'customSkyGround', value: options.customSky });
        setSetting({ name: 'arrows', value: options.arrows });
        setSetting({ name: 'animatedObjects', value: options.animatedObjects });
        setSetting({ name: 'stillObjects', value: options.stillObjects });
        setSetting({ name: 'fancyboost', value: options.fancyboost });
      }}
      centeredCamera={centeredCamera}
      onCenteredCameraChange={value =>
        setSetting({ name: 'centeredCamera', value })
      }
      timer={timer}
      onTimerChange={value => setSetting({ name: 'timer', value })}
      minimap={minimap}
      onMinimapChange={value => setSetting({ name: 'minimap', value })}
      picturesInBackground={picturesInBackground}
      onPicturesInBackgroundChange={value =>
        setSetting({ name: 'picturesInBackground', value })
      }
      autoPlaySetting={autoPlaySetting}
      onAutoPlaySettingChange={() => toggleSetting('autoPlay')}
      lgrChoices={lgr ? undefined : lgrChoices}
      lgrChoice={lgrOverride && lgrOverride !== 'legacy' ? lgrOverride : null}
      onLgrChoiceChange={
        lgr
          ? undefined
          : name =>
              setLgrOverride({
                name: name || '',
                url: lgrs.find(l => l.LGRName === name)?.FileLink || '',
              })
      }
      onSettingsOpen={() => {
        if (!lgr && !lgrs.length) getLGRs();
      }}
      translucentGhosts={translucentGhosts}
      onTranslucentGhostsChange={value =>
        setSetting({ name: 'translucentGhosts', value })
      }
      autoZoom={autoZoom}
      onAutoZoomChange={value => setSetting({ name: 'autoZoom', value })}
      style={{ width: size(width), height: size(height) }}
    />
  );
};

Recplayer.propTypes = {
  rec: PropTypes.string,
  lev: PropTypes.string.isRequired,
  shirt: PropTypes.arrayOf(PropTypes.string),
  names: PropTypes.arrayOf(PropTypes.string),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  zoom: PropTypes.number,
  controls: PropTypes.bool,
  autoPlay: PropTypes.oneOf(['if-visible', 'yes', 'no']),
  merge: PropTypes.bool,
  forceRefresh: PropTypes.bool,
  lgr: PropTypes.string,
  onEnd: PropTypes.func,
  onError: PropTypes.func,
};

export default Recplayer;
