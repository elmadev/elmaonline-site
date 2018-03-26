import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Battle.css';

class Home extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div>
          <div className={s.playerContainer}>
            <div className={s.player}>player</div>
          </div>
          <div className={s.rightBarContainer}>whatever</div>
          <div className={s.levelStatsContainer}>
            <div>stats</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
