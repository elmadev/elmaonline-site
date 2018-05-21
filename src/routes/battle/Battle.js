import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Moment from 'react-moment';
import s from './Battle.css';
import battleQuery from './battle.graphql';
import Recplayer from '../../components/Recplayer';
import { Kuski, Level, BattleType } from '../../components/Names';

class Battle extends React.Component {
  static propTypes = {
    BattleIndex: PropTypes.number.isRequired,
    data: PropTypes.shape({
      Loading: PropTypes.bool.isRequired,
      getBattle: PropTypes.shape({
        LevelIndex: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    console.info(this.props);
    const { BattleIndex } = this.props;
    const {
      data: { getBattle },
    } = this.props;
    return (
      <div className={s.root}>
        <div className={s.playerContainer}>
          <div className={s.player}>
            <Recplayer
              rec={BattleIndex ? `${BattleIndex}` : ''}
              lev={getBattle ? `${getBattle.LevelIndex}` : ''}
              height="504"
              width="896"
              controls={getBattle ? !!getBattle.RecFileName : false}
            />
          </div>
        </div>
        <div className={s.rightBarContainer}>
          {getBattle && (
            <div>
              <div>
                Battle in <Level index={getBattle.LevelIndex} /> by{' '}
                <Kuski index={getBattle.KuskiIndex} />
              </div>
              <div>
                Started:{' '}
                <Moment format="DD MMM YYYY HH:mm:ss">
                  {getBattle.Started}
                </Moment>
              </div>
              <div>
                Battle type: <BattleType type={getBattle.BattleType} />
              </div>
              <div>Duration: {getBattle.Duration} minutes</div>
            </div>
          )}
        </div>
        <div className={s.levelStatsContainer}>
          <div>stats</div>
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(battleQuery, {
    options: ownProps => ({
      variables: {
        BattleIndex: ownProps.BattleIndex,
      },
    }),
  }),
)(Battle);
