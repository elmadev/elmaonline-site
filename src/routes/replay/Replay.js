import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import Moment from 'react-moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import s from './Replay.css';
import replayQuery from './replay.graphql';
import Recplayer from '../../components/Recplayer';
import { Level, ReplayTime } from '../../components/Names';
import RecList from '../../components/RecList';
import historyRefresh from '../../historyRefresh';

class Replay extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      Loading: PropTypes.bool,
      getReplayByUuid: PropTypes.shape({
        LevelIndex: PropTypes.number,
        UUID: PropTypes.string,
        RecFileName: PropTypes.string,
        ReplayTime: PropTypes.number,
        TAS: PropTypes.number,
        Bug: PropTypes.number,
        Nitro: PropTypes.number,
        Unlisted: PropTypes.number,
        Finished: PropTypes.number,
      }),
    }).isRequired,
  };

  render() {
    const { data: { getReplayByUuid } } = this.props;
    const isWindow = typeof window !== 'undefined';

    if (!getReplayByUuid) return null;

    return (
      <div className={s.root}>
        <div className={s.playerContainer}>
          <div className={s.player}>
            {isWindow && (
              <Recplayer
                rec={`https://eol.ams3.digitaloceanspaces.com/${
                  window.App.s3SubFolder
                }replays/${getReplayByUuid.UUID}/${
                  getReplayByUuid.RecFileName
                }`}
                lev={`/dl/level/${getReplayByUuid.LevelIndex}`}
                controls
              />
            )}
          </div>
        </div>
        <div className={s.rightBarContainer}>
          <div className={s.chatContainer}>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">
                  <React.Fragment>{getReplayByUuid.RecFileName}</React.Fragment>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                <div>
                  <ReplayTime time={getReplayByUuid.ReplayTime} /> by{' '}
                  {getReplayByUuid.DrivenByData
                    ? getReplayByUuid.DrivenByData.Kuski
                    : 'Unknown'}{' '}
                  in <Level index={getReplayByUuid.LevelIndex} />
                </div>
                <div>
                  {getReplayByUuid.TAS === 1 && (
                    <span style={{ color: 'red' }}>(TAS)</span>
                  )}
                  {getReplayByUuid.Unlisted === 1 && (
                    <span style={{ color: 'gray' }}>(Unlisted)</span>
                  )}
                  {getReplayByUuid.Finished === 0 && (
                    <span style={{ color: 'gray' }}>(DNF)</span>
                  )}
                  {getReplayByUuid.Bug === 1 && (
                    <span style={{ color: 'brown' }}>(Bug)</span>
                  )}
                  {getReplayByUuid.Nitro === 1 && (
                    <span style={{ color: 'blue' }}>(Mod)</span>
                  )}
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">
                  <React.Fragment>
                    <Level index={getReplayByUuid.LevelIndex} />.lev
                  </React.Fragment>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                <div>1. Zweq 01:22,49</div>
                <div>2. Zero 01:30,33</div>
                <div>3. talli 01:32,95</div>
                <div>etc.</div>
              </ExpansionPanelDetails>
            </ExpansionPanel> */}
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">Other replays in level</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                <RecList
                  LevelIndex={getReplayByUuid.LevelIndex}
                  openReplay={uuid => historyRefresh.push(`/r/${uuid}`)}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </div>
        <div className={s.levelStatsContainer}>
          <Paper className={s.battleDescription}>
            <div>{getReplayByUuid.Comment}</div>
            <div className={s.battleTimestamp}>
              Uploaded by{' '}
              {getReplayByUuid.UploadedByData
                ? getReplayByUuid.UploadedByData.Kuski
                : 'Unknown'}{' '}
              <Moment parse="X" format="YYYY-MM-DD HH:mm:ss">
                {getReplayByUuid.Uploaded}
              </Moment>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(replayQuery, {
    options: ownProps => ({
      variables: {
        UUID: ownProps.ReplayUuid,
      },
    }),
  }),
)(Replay);
