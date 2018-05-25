import React from 'react';
import PropTypes from 'prop-types';

const RecPlayer =
  typeof document !== 'undefined' && require('recplayer-react').default; // eslint-disable-line global-require

class Recplayer extends React.Component {
  static propTypes = {
    rec: PropTypes.string.isRequired,
    lev: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    zoom: PropTypes.number,
    controls: PropTypes.bool,
  };

  static defaultProps = {
    width: 'auto',
    height: 'auto',
    zoom: 0.7,
    controls: true,
  };

  render() {
    const { rec, lev, width, height, zoom, controls } = this.props;
    console.info(this.props);
    return (
      <React.Fragment>
        {RecPlayer ? (
          <RecPlayer
            recUrl={rec ? `/dl/replay/${rec}` : ''}
            levUrl={lev ? `/dl/level/${lev}` : ''}
            width={width}
            height={height}
            zoom={zoom}
            controls={controls}
          />
        ) : (
          <span>Loading..</span>
        )}
      </React.Fragment>
    );
  }
}

export default Recplayer;
